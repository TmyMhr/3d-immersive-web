# Debugging and Fixing Physics Mismatch

## 1. Enable Physics Debugging
To clearly see the disconnect between the visual terrain and the physics mesh, we will enable the debug view.
- **Action**: Add the `<Debug>` component from `@react-three/cannon` to `Scene.tsx`.
- **Outcome**: You will see wireframes representing the actual physics bodies (currently flat boxes) overlaid on your visual terrain (hills and valleys).

## 2. Fix Terrain Physics (Island.tsx)
The current `Island` component uses `useBox` (a flat rectangle) but renders a custom uneven terrain. We need to align them.
- **Action**: Replace `useBox` with `useTrimesh` in `Island.tsx`.
- **Implementation**:
    - Extract the vertices and indices from the generated `terrainGeometry`.
    - Pass these directly to `useTrimesh`.
    - This creates a physics mesh that perfectly matches every hill and valley of your visual terrain.

## 3. Create Extensible Model Loader
To support "adding in different models later" with correct physics:
- **Action**: Create a new reusable component `PhysicsModel.tsx` (or similar).
- **Features**:
    - Accepts a GLTF model path.
    - Automatically traverses the model's meshes.
    - Generates `useTrimesh` colliders for complex static geometry (like buildings or large props).
    - Can be configured to use `useBox` or `useSphere` for simpler objects to improve performance.

## 4. Verification
- **Test**: Walk the player character over the terrain.
- **Expectation**: The player should ascend hills and descend into valleys naturally, instead of clipping through or floating above them.
