"""
TALON TYRES — Blender 5.2 headless model generator
Run: blender --background --python generate_models.py

Exports two GLB files to public/models/:
  wheel.glb  — alloy wheel + tyre (RTX twin-spoke style)
  car.glb    — Range Rover Evoque-style SUV body
"""

import bpy, bmesh, math, os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_DIR    = os.path.normpath(os.path.join(SCRIPT_DIR, "..", "public", "models"))
os.makedirs(OUT_DIR, exist_ok=True)

# ── Blender 5.2 Principled BSDF input names ──────────────────────────────────
# 5.x renamed several inputs; we use a safe getter
def _bsdf_set(bsdf, key_candidates, value):
    for k in key_candidates:
        if k in bsdf.inputs:
            bsdf.inputs[k].default_value = value
            return

def new_mat(name, color=(0.8,0.8,0.8,1), roughness=0.5, metallic=0.0,
            clearcoat=0.0, transmission=0.0, ior=1.45, emission=None):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True  # noqa: deprecated in 6.0, still required in 5.x
    nt = mat.node_tree
    bsdf = nt.nodes.get("Principled BSDF")
    if not bsdf:
        return mat
    bsdf.inputs["Base Color"].default_value   = color
    bsdf.inputs["Roughness"].default_value    = roughness
    _bsdf_set(bsdf, ["Metallic", "Metallness"], metallic)
    _bsdf_set(bsdf, ["Coat Weight", "Clearcoat"], clearcoat)
    _bsdf_set(bsdf, ["Coat Roughness", "Clearcoat Roughness"], 0.08 if clearcoat else 0.5)
    _bsdf_set(bsdf, ["Transmission Weight", "Transmission"], transmission)
    bsdf.inputs["IOR"].default_value = ior
    if emission:
        _bsdf_set(bsdf, ["Emission Color", "Emission"], (*emission, 1.0))
        _bsdf_set(bsdf, ["Emission Strength"], 4.0)
    if transmission > 0:
        mat.blend_method = 'BLEND'
    return mat

def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for blk in [bpy.data.meshes, bpy.data.materials, bpy.data.curves]:
        for item in blk:
            blk.remove(item)

def link(obj):
    bpy.context.collection.objects.link(obj)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    return obj

def smooth_shade(obj):
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.shade_smooth()

def add_subsurf(obj, levels=2):
    mod = obj.modifiers.new("Sub", "SUBSURF")
    mod.levels = levels
    mod.render_levels = levels + 1

def apply_all_mods(obj):
    bpy.context.view_layer.objects.active = obj
    for mod in obj.modifiers:
        bpy.ops.object.modifier_apply(modifier=mod.name)

def export_glb(filepath, objects):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objects:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        use_selection=True,
        export_format='GLB',
        export_apply=True,
        export_materials='EXPORT',
    )
    print(f"  → Saved {filepath}")


# ════════════════════════════════════════════════════════════════════════════════
#  WHEEL
# ════════════════════════════════════════════════════════════════════════════════

def revolution_mesh(name, profile_2d, segments=64):
    """Revolve a list of (r, z) points around the Z axis."""
    bm = bmesh.new()
    rings = []
    for r, z in profile_2d:
        ring = []
        for i in range(segments):
            a = 2 * math.pi * i / segments
            ring.append(bm.verts.new((r * math.cos(a), r * math.sin(a), z)))
        rings.append(ring)
    for ri in range(len(rings) - 1):
        a, b = rings[ri], rings[ri+1]
        for i in range(segments):
            n = (i + 1) % segments
            bm.faces.new([a[i], b[i], b[n], a[n]])
    # Close top and bottom with fan
    for sign, row in [(-1, rings[0]), (1, rings[-1])]:
        cz = row[0].co.z + sign * 0.005
        cv = bm.verts.new((0, 0, cz))
        for i in range(segments):
            n = (i + 1) % segments
            bm.faces.new([row[i], row[n], cv] if sign > 0 else [row[n], row[i], cv])
    mesh = bpy.data.meshes.new(name)
    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    link(obj)
    return obj


def make_tyre():
    # Tyre cross-section profile (r, z) — viewed from side
    profile = [
        (0.308, -0.162), (0.314, -0.147), (0.328, -0.143),
        (0.350, -0.151), (0.386, -0.154), (0.430, -0.153),
        (0.458, -0.142), (0.471, -0.118), (0.477, -0.085),
        (0.480, -0.045), (0.481, -0.014), (0.481,  0.000),
        (0.481,  0.014), (0.480,  0.045), (0.477,  0.085),
        (0.471,  0.118), (0.458,  0.142), (0.430,  0.153),
        (0.386,  0.154), (0.350,  0.151), (0.328,  0.143),
        (0.314,  0.147), (0.308,  0.162),
    ]
    obj = revolution_mesh("Tyre", profile, segments=80)
    smooth_shade(obj)
    obj.data.materials.append(new_mat(
        "Rubber", color=(0.018, 0.018, 0.020, 1.0), roughness=0.94))

    # Tread grooves — torus booleans
    for gz in [-0.115, -0.058, 0.0, 0.058, 0.115]:
        bpy.ops.mesh.primitive_torus_add(
            major_radius=0.474, minor_radius=0.014,
            major_segments=60, minor_segments=10,
            location=(0, 0, gz))
        groove = bpy.context.active_object
        mod = obj.modifiers.new("Groove", "BOOLEAN")
        mod.operation = 'DIFFERENCE'
        mod.object = groove
        mod.solver = 'FLOAT'
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=mod.name)
        bpy.data.objects.remove(groove, do_unlink=True)

    return obj


def make_rim_barrel():
    # Open cylinder for the barrel
    bm = bmesh.new()
    segs = 72
    r_out, r_in, h = 0.306, 0.294, 0.308
    for r in [r_out, r_in]:
        verts = []
        for i in range(segs):
            a = 2*math.pi*i/segs
            for z in [-h/2, h/2]:
                verts.append(bm.verts.new((r*math.cos(a), r*math.sin(a), z)))
        # Connect barrel wall
        n = len(verts) // 2
        for i in range(0, n, 2):
            ni = (i + 2) % n
            bot, top = verts[i], verts[i+1]
            nbot, ntop = verts[ni], verts[ni+1]
            bm.faces.new([bot, nbot, ntop, top])
    # End caps (annular rings)
    out_ring = [bm.verts.new((r_out*math.cos(2*math.pi*i/segs),
                               r_out*math.sin(2*math.pi*i/segs), h/2)) for i in range(segs)]
    in_ring  = [bm.verts.new((r_in *math.cos(2*math.pi*i/segs),
                               r_in *math.sin(2*math.pi*i/segs), h/2)) for i in range(segs)]
    for i in range(segs):
        n = (i+1)%segs
        bm.faces.new([out_ring[i], in_ring[i], in_ring[n], out_ring[n]])
    out_ring2 = [bm.verts.new((r_out*math.cos(2*math.pi*i/segs),
                                r_out*math.sin(2*math.pi*i/segs), -h/2)) for i in range(segs)]
    in_ring2  = [bm.verts.new((r_in *math.cos(2*math.pi*i/segs),
                                r_in *math.sin(2*math.pi*i/segs), -h/2)) for i in range(segs)]
    for i in range(segs):
        n = (i+1)%segs
        bm.faces.new([out_ring2[n], in_ring2[n], in_ring2[i], out_ring2[i]])

    mesh = bpy.data.meshes.new("Barrel_Mesh")
    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new("Rim_Barrel", mesh)
    link(obj)
    smooth_shade(obj)
    obj.data.materials.append(new_mat(
        "Barrel_Dark", color=(0.05,0.05,0.06,1), roughness=0.20, metallic=0.92))
    return obj


def make_lip_ring(z, r=0.313, thickness=0.016, tube_r=0.008):
    bpy.ops.mesh.primitive_torus_add(
        major_radius=r, minor_radius=tube_r,
        major_segments=72, minor_segments=14,
        location=(0, 0, z))
    obj = bpy.context.active_object
    obj.name = f"Lip_{z}"
    smooth_shade(obj)
    obj.data.materials.append(new_mat(
        "Lip_Chrome", color=(0.84,0.87,0.92,1), roughness=0.05,
        metallic=0.98, clearcoat=1.0))
    return obj


def spoke_arm_mesh(name, base_angle, arm_side_offset):
    """
    One curved arm of a twin-spoke pair.
    arm_side_offset: +1 = left arm, -1 = right arm
    """
    bm = bmesh.new()
    SEGS = 8   # segments along the arm length
    WSEGS = 4  # segments across the arm width

    # Arm path: points (r, angle_offset) going from hub to rim
    # at each point we also define arm half-width and half-thickness
    path = [
        # (radius, angular_offset, half_width, half_thickness)
        (0.068, 0.00,  0.016, 0.020),
        (0.100, 0.04,  0.022, 0.020),
        (0.140, 0.07,  0.026, 0.019),
        (0.185, 0.09,  0.028, 0.018),
        (0.225, 0.10,  0.028, 0.017),
        (0.265, 0.10,  0.027, 0.016),
        (0.290, 0.09,  0.025, 0.015),
        (0.308, 0.07,  0.022, 0.014),
        (0.313, 0.04,  0.018, 0.012),
    ]

    side = arm_side_offset  # +1 left, -1 right
    all_loops = []
    for r, aoff, hw, ht in path:
        angle = base_angle + side * aoff
        cx = math.cos(angle) * r
        cy = math.sin(angle) * r
        # tangent (perpendicular to radial direction)
        tx = -math.sin(angle)
        ty =  math.cos(angle)
        # normal (radial inward for thickness)
        nx = math.cos(angle)
        ny = math.sin(angle)

        # 4 corners: front+left, front+right, back+left, back+right
        loop = [
            bm.verts.new((cx + tx*hw + 0, cy + ty*hw, ht)),
            bm.verts.new((cx - tx*hw + 0, cy - ty*hw, ht)),
            bm.verts.new((cx - tx*hw + 0, cy - ty*hw, -ht)),
            bm.verts.new((cx + tx*hw + 0, cy + ty*hw, -ht)),
        ]
        all_loops.append(loop)

    # Faces between consecutive loops
    for i in range(len(all_loops)-1):
        a, b = all_loops[i], all_loops[i+1]
        # front face
        bm.faces.new([a[0], a[1], b[1], b[0]])
        # back face
        bm.faces.new([b[2], b[3], a[3], a[2]])
        # side faces
        bm.faces.new([a[1], a[2], b[2], b[1]])
        bm.faces.new([a[3], a[0], b[0], b[3]])

    # End caps
    bm.faces.new(all_loops[0])
    bm.faces.new(list(reversed(all_loops[-1])))

    mesh = bpy.data.meshes.new(name + "_mesh")
    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    link(obj)
    add_subsurf(obj, levels=2)
    smooth_shade(obj)
    return obj


def make_spokes(rim_color=(0.82,0.84,0.88,1.0), roughness=0.10):
    spoke_mat = new_mat(
        "Spoke_Polished", color=rim_color, roughness=roughness,
        metallic=0.94, clearcoat=1.0)
    side_mat = new_mat(
        "Spoke_Dark", color=(0.08,0.08,0.10,1.0), roughness=0.28, metallic=0.88)

    all_spokes = []
    for g in range(5):
        base = (g / 5) * 2 * math.pi
        for side in [+1, -1]:
            obj = spoke_arm_mesh(f"Spoke_{g}_{'+' if side>0 else '-'}", base, side)
            # Assign materials — face 0 = polished front, rest = dark
            for i, poly in enumerate(obj.data.polygons):
                # front face is the one most facing +Z
                nz = obj.data.polygons[i].normal.z
                obj.data.polygons[i].material_index = 0 if nz > 0.5 else 1
            obj.data.materials.append(spoke_mat)
            obj.data.materials.append(side_mat)
            all_spokes.append(obj)
    return all_spokes


def make_hub():
    # Hub cylinder
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=32, radius=0.062, depth=0.320, location=(0,0,0))
    hub = bpy.context.active_object
    hub.name = "Hub"
    smooth_shade(hub)
    hub.data.materials.append(new_mat(
        "Hub_Dark", color=(0.05,0.05,0.06,1), roughness=0.22, metallic=0.90))

    # Chrome cap front
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=32, radius=0.056, depth=0.008, location=(0,0,0.160))
    cap = bpy.context.active_object
    cap.name = "HubCap"
    smooth_shade(cap)
    cap.data.materials.append(new_mat(
        "Cap_Chrome", color=(0.86,0.89,0.94,1), roughness=0.05,
        metallic=0.98, clearcoat=1.0))
    return [hub, cap]


def make_lug_bolts():
    bolts = []
    bolt_mat = new_mat(
        "Bolt_Chrome", color=(0.82,0.85,0.90,1), roughness=0.10,
        metallic=0.96, clearcoat=0.9)
    for i in range(5):
        angle = (i/5) * 2 * math.pi
        bx = math.cos(angle) * 0.215
        by = math.sin(angle) * 0.215
        for z in [0.158, -0.158]:
            bpy.ops.mesh.primitive_cylinder_add(
                vertices=14, radius=0.016, depth=0.024, location=(bx, by, z))
            bolt = bpy.context.active_object
            bolt.name = f"Bolt_{i}"
            smooth_shade(bolt)
            bolt.data.materials.append(bolt_mat)
            bolts.append(bolt)
    return bolts


def build_wheel_glb():
    clear_scene()
    objs = []

    print("  Building tyre...")
    objs.append(make_tyre())

    print("  Building rim barrel...")
    objs.append(make_rim_barrel())

    print("  Building lip rings...")
    objs.append(make_lip_ring( 0.150))
    objs.append(make_lip_ring(-0.150))

    print("  Building spokes...")
    objs.extend(make_spokes())

    print("  Building hub...")
    objs.extend(make_hub())

    print("  Building lug bolts...")
    objs.extend(make_lug_bolts())

    out = os.path.join(OUT_DIR, "wheel.glb")
    export_glb(out, objs)


# ════════════════════════════════════════════════════════════════════════════════
#  CAR BODY (Range Rover Evoque style SUV)
# ════════════════════════════════════════════════════════════════════════════════

def make_suv_body():
    """Build SUV body shell using bmesh vertex-by-vertex."""
    bm = bmesh.new()

    # We build the side profile (XZ plane) then extrude in Y for the body width
    # Profile points: (x=length, z=height)
    # X: nose at +2.52, tail at -2.52
    # Z: bottom at 0.08, roof at 1.68
    # Half-width Y: 0.91

    profile_side = [
        # (x,    z)     # description
        (-2.38,  0.08), # rear bottom
        (-2.50,  0.30), # rear lower
        (-2.52,  0.52), # rear mid
        (-2.46,  0.80), # rear upper
        (-2.10,  0.96), # rear screen bottom
        (-1.78,  1.38), # C-pillar
        (-1.14,  1.68), # rear roof edge
        ( 0.64,  1.68), # front roof edge
        ( 0.68,  1.60), # A-pillar top
        ( 0.74,  1.38), # A-pillar
        ( 0.82,  1.18), # windscreen base
        ( 1.10,  0.82), # hood/screen junction
        ( 2.10,  0.80), # hood
        ( 2.50,  0.60), # front upper
        ( 2.52,  0.36), # front mid
        ( 2.38,  0.08), # front bottom
    ]

    W = 0.91  # half body width
    verts_outer = {}
    # Create profile at each Y position and a flattened bottom
    for yi, yw in enumerate([-W, W]):
        ring = []
        for xi, (x, z) in enumerate(profile_side):
            # Taper body sides slightly at roof
            taper = 1.0 - (max(z - 0.80, 0) / 1.68) * 0.12
            v = bm.verts.new((x, yw * taper, z))
            ring.append(v)
        verts_outer[yi] = ring

    # Side faces
    n = len(profile_side)
    for yi in range(2):
        ring = verts_outer[yi]
        for i in range(n - 1):
            if yi == 0:  # left side — reversed normal
                bm.faces.new([ring[i], ring[i+1], ring[i+1], ring[i]])
            else:        # right side
                bm.faces.new([ring[i], ring[i+1], ring[i+1], ring[i]])
    # Actually let's do proper side faces
    for yi in range(2):
        ring = verts_outer[yi]
        for i in range(n - 1):
            if yi == 1:
                bm.faces.new([ring[i], ring[i+1], ring[i+1], ring[i]])

    # Front / rear end faces
    L, R = verts_outer[0], verts_outer[1]
    for i in range(n - 1):
        bm.faces.new([L[i+1], L[i], R[i], R[i+1]])

    # Top/bottom strips connecting both sides
    # Bottom strip
    n = len(profile_side)
    for i in range(n - 1):
        bm.faces.new([L[i], L[i+1], R[i+1], R[i]])

    mesh = bpy.data.meshes.new("SUV_Body_Mesh")
    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new("SUV_Body", mesh)
    link(obj)
    return obj


def build_car_glb():
    clear_scene()
    objs = []

    # Materials
    paint   = new_mat("Paint",    color=(0.96,0.96,0.97,1), roughness=0.28, metallic=0.08, clearcoat=1.0)
    dark    = new_mat("DarkTrim", color=(0.05,0.05,0.06,1), roughness=0.72, metallic=0.12)
    glass   = new_mat("Glass",    color=(0.04,0.06,0.10,1), roughness=0.04, metallic=0.0,
                      transmission=0.82, ior=1.52)
    chrome  = new_mat("Chrome",   color=(0.88,0.90,0.94,1), roughness=0.06, metallic=0.98, clearcoat=1.0)
    hl_emit = new_mat("Headlight",color=(0.90,0.95,1.0, 1), roughness=0.02, metallic=0,
                      emission=(0.88,0.94,1.0))
    tl_emit = new_mat("Taillight",color=(0.8, 0.04,0.02,1), roughness=0.04, metallic=0,
                      emission=(0.8,0.02,0.01))

    # ── Main body shell ──
    print("  Building body shell...")

    # Use a simple box-based approach and reshape with bmesh
    bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0.88))
    body = bpy.context.active_object
    body.name = "Body"
    body.scale = (2.52, 0.91, 0.80)
    bpy.ops.object.transform_apply(scale=True)

    # Add loop cuts and reshape in edit mode
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.subdivide(number_cuts=3)
    bpy.ops.object.mode_set(mode='OBJECT')

    bm = bmesh.new()
    bm.from_mesh(body.data)
    bm.verts.ensure_lookup_table()

    # Shape the front/rear profile by moving vertices
    for v in bm.verts:
        x, y, z = v.co
        z_norm = z / 0.80  # -1 to +1

        # Front slope (nose)
        if x > 1.5:
            drop = (x - 1.5) / 1.0 * 0.25
            v.co.z -= drop * (0.5 + 0.5 * z_norm)
            v.co.x += drop * 0.05

        # Rear slope (C-pillar / hatch)
        if x < -1.2:
            drop = (-x - 1.2) / 1.3 * 0.38
            v.co.z -= drop * (0.5 + 0.5 * z_norm)

        # Roof: narrow the body slightly at the top
        if z > 0.50:
            taper = (z - 0.50) / 0.30 * 0.06
            v.co.y *= (1.0 - taper)

        # Wheel arch clearance (indent bottom corners near axle positions)
        for ax in [1.24, -1.18]:
            dist = abs(x - ax)
            if dist < 0.52 and z < -0.30:
                depth = max(0, 0.52 - dist) / 0.52
                arch_drop = max(0, (-0.30 - z) / 0.50) * depth
                v.co.z += arch_drop * 0.18

    bm.to_mesh(body.data)
    bm.free()

    add_subsurf(body, levels=2)
    smooth_shade(body)
    body.data.materials.append(paint)
    objs.append(body)

    # ── Roof panel (slightly inset — floating roof) ──
    bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.26, 0, 1.70))
    roof = bpy.context.active_object
    roof.name = "Roof"
    roof.scale = (1.82, 0.87, 0.045)
    bpy.ops.object.transform_apply(scale=True)
    add_subsurf(roof, levels=1)
    smooth_shade(roof)
    roof.data.materials.append(paint)
    objs.append(roof)

    # ── Black A-pillars ──
    for yz in [0.88, -0.88]:
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0.68, yz*0.93, 1.36))
        ap = bpy.context.active_object
        ap.name = "A_Pillar"
        ap.scale = (0.10, 0.04, 0.36)
        ap.rotation_euler.x = math.radians(-15)
        bpy.ops.object.transform_apply(scale=True, rotation=True)
        smooth_shade(ap)
        ap.data.materials.append(dark)
        objs.append(ap)

    # ── Black C-pillars ──
    for yz in [0.88, -0.88]:
        bpy.ops.mesh.primitive_cube_add(size=1, location=(-1.36, yz*0.92, 1.52))
        cp = bpy.context.active_object
        cp.name = "C_Pillar"
        cp.scale = (0.14, 0.04, 0.22)
        cp.rotation_euler.x = math.radians(8)
        bpy.ops.object.transform_apply(scale=True, rotation=True)
        smooth_shade(cp)
        cp.data.materials.append(dark)
        objs.append(cp)

    # ── Windshield ──
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0.70, 0, 1.30))
    ws = bpy.context.active_object
    ws.name = "Windshield"
    ws.scale = (0.44, 0.87, 0.44)
    ws.rotation_euler = (math.radians(20), 0, 0)
    bpy.ops.object.transform_apply(scale=True, rotation=True)
    ws.data.materials.append(glass)
    objs.append(ws)

    # ── Side glass windows ──
    for yz in [0.92, -0.92]:
        bpy.ops.mesh.primitive_plane_add(size=1, location=(-0.12, yz, 1.28))
        sg = bpy.context.active_object
        sg.name = "SideGlass"
        sg.scale = (1.60, 0.01, 0.38)
        bpy.ops.object.transform_apply(scale=True)
        sg.data.materials.append(glass)
        objs.append(sg)

    # ── Rear glass ──
    bpy.ops.mesh.primitive_plane_add(size=1, location=(-1.80, 0, 1.18))
    rg = bpy.context.active_object
    rg.name = "RearGlass"
    rg.scale = (0.38, 0.85, 0.30)
    rg.rotation_euler = (math.radians(-24), 0, 0)
    bpy.ops.object.transform_apply(scale=True, rotation=True)
    rg.data.materials.append(glass)
    objs.append(rg)

    # ── Lower body cladding ──
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.20))
    clad = bpy.context.active_object
    clad.name = "Cladding"
    clad.scale = (2.38, 0.94, 0.09)
    bpy.ops.object.transform_apply(scale=True)
    smooth_shade(clad)
    clad.data.materials.append(dark)
    objs.append(clad)

    # ── Wheel arch liners ──
    for ax in [1.24, -1.18]:
        bpy.ops.mesh.primitive_torus_add(
            major_radius=0.445, minor_radius=0.030,
            major_segments=36, minor_segments=10,
            location=(ax, 0, 0.50))
        liner = bpy.context.active_object
        liner.name = "ArchLiner"
        liner.rotation_euler = (math.radians(90), 0, 0)
        bpy.ops.object.transform_apply(rotation=True)
        smooth_shade(liner)
        liner.data.materials.append(dark)
        objs.append(liner)

    # ── Front grille ──
    bpy.ops.mesh.primitive_cube_add(size=1, location=(2.51, 0, 0.54))
    grille = bpy.context.active_object
    grille.name = "Grille"
    grille.scale = (0.04, 0.80, 0.17)
    bpy.ops.object.transform_apply(scale=True)
    grille.data.materials.append(dark)
    objs.append(grille)
    # Grille bars
    for y in [-0.08, -0.03, 0.02, 0.07]:
        bpy.ops.mesh.primitive_cube_add(size=1, location=(2.50, 0, 0.54 + y*2.0))
        sl = bpy.context.active_object
        sl.scale = (0.02, 0.76, 0.007)
        bpy.ops.object.transform_apply(scale=True)
        sl.data.materials.append(chrome)
        objs.append(sl)

    # ── Headlights ──
    for yz in [0.72, -0.72]:
        bpy.ops.mesh.primitive_cube_add(size=1, location=(2.50, yz, 0.76))
        hl = bpy.context.active_object
        hl.scale = (0.02, 0.18, 0.05)
        bpy.ops.object.transform_apply(scale=True)
        hl.data.materials.append(hl_emit)
        objs.append(hl)
        # DRL
        bpy.ops.mesh.primitive_cube_add(size=1, location=(2.50, yz, 0.70))
        drl = bpy.context.active_object
        drl.scale = (0.015, 0.15, 0.010)
        bpy.ops.object.transform_apply(scale=True)
        drl.data.materials.append(new_mat("DRL",
            color=(1.0,0.97,0.88,1), roughness=0.01, emission=(1.0,0.97,0.88)))
        objs.append(drl)

    # ── Tail lights (L-shape) ──
    for yz in [0.72, -0.72]:
        bpy.ops.mesh.primitive_cube_add(size=1, location=(-2.50, yz, 0.78))
        tl = bpy.context.active_object
        tl.scale = (0.02, 0.06, 0.22)
        bpy.ops.object.transform_apply(scale=True)
        tl.data.materials.append(tl_emit)
        objs.append(tl)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(-2.50, yz, 0.60))
        tlh = bpy.context.active_object
        tlh.scale = (0.02, 0.20, 0.025)
        bpy.ops.object.transform_apply(scale=True)
        tlh.data.materials.append(tl_emit)
        objs.append(tlh)

    # ── Side mirrors ──
    for yz in [0.92, -0.92]:
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0.88, yz, 1.05))
        mir = bpy.context.active_object
        mir.scale = (0.09, 0.06, 0.045)
        bpy.ops.object.transform_apply(scale=True)
        add_subsurf(mir, levels=1)
        smooth_shade(mir)
        mir.data.materials.append(paint)
        objs.append(mir)

    # ── Roof rails ──
    for yz in [0.83, -0.83]:
        bpy.ops.mesh.primitive_cylinder_add(
            vertices=10, radius=0.012, depth=1.70,
            location=(-0.26, yz, 1.74))
        rail = bpy.context.active_object
        rail.rotation_euler = (0, math.radians(90), 0)
        bpy.ops.object.transform_apply(rotation=True)
        smooth_shade(rail)
        rail.data.materials.append(chrome)
        objs.append(rail)

    # ── Underbody ──
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.07))
    under = bpy.context.active_object
    under.scale = (2.40, 0.91, 0.04)
    bpy.ops.object.transform_apply(scale=True)
    under.data.materials.append(dark)
    objs.append(under)

    # ── Front skid accent strip ──
    bpy.ops.mesh.primitive_cube_add(size=1, location=(2.50, 0, 0.14))
    skid = bpy.context.active_object
    skid.scale = (0.04, 0.80, 0.022)
    bpy.ops.object.transform_apply(scale=True)
    skid.data.materials.append(chrome)
    objs.append(skid)

    out = os.path.join(OUT_DIR, "car.glb")
    export_glb(out, objs)


# ════════════════════════════════════════════════════════════════════════════════
print("\n=== TALON TYRES model generator (Blender 5.2) ===")
print("=== Building wheel.glb ===")
build_wheel_glb()
print("=== Building car.glb ===")
build_car_glb()
print("=== Done! Check public/models/ ===")
