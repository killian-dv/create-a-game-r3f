# Create a Game with R3F — Three.js Journey

Quick recap of what I learned in the **Create a Game** lesson from [Three.js Journey](https://threejsjourney.com/) by Bruno Simon, implemented with **React Three Fiber**, **Rapier** (`@react-three/rapier`), **Zustand**, and **Drei**.

## What this project covers

This project is a small **Marble Race** game: roll a physics-driven ball through a procedurally generated course, dodge moving obstacles, reach the finish, and beat your time.

- **Game loop** with phases (`ready` → `playing` → `ended`) managed outside the 3D scene.
- **Keyboard controls** mapped once and shared between the player and the HTML UI.
- **Player movement** via impulses and torque, scaled by `delta` for frame-rate independence.
- **Ground detection** with a Rapier raycast before allowing a jump.
- **Follow camera** smoothed with `lerp` each frame.
- **Procedural level** built from reusable block components and a seeded random picker.
- **Kinematic obstacles** animated in `useFrame` (translation and rotation).
- **Win / lose conditions** tied to world position and a death zone collider.
- **HTML overlay** synced to the render loop for a live timer and control hints.

## What I built

- A full-screen **R3F `Canvas`** with shadows and a perspective camera.
- **`KeyboardControls`** (WASD / arrows + Space) wrapping both the scene and the UI.
- A **`<Physics>`** world containing:
  - A **player ball** (`RigidBody`, `colliders="ball"`) rolled with impulses and torque.
  - A **`<Level>`** that places a start block, random obstacle blocks, an end block, and arena bounds.
  - Three obstacle types — **Axe** (side-to-side), **Limbo** (up and down), **Spinner** (rotating bar).
  - **Invisible floor collider** under the course (fall through → restart).
  - **Side and back walls** to keep the ball in the lane.
  - A **finish platform** with a **hamburger GLTF** (`colliders="hull"`).
- **Directional light** that follows the camera so shadows stay consistent as you move.
- **Zustand store** for phase, timer, level length, and random seed.
- **React HTML interface** — timer, restart button, and on-screen key indicators.

## What I learned

### 1) From physics demo to actual game

- Physics alone is not a game; you need **rules**, **state**, and **feedback** (start, win, lose, restart).
- Split responsibilities: **3D scene** (meshes, bodies, `useFrame`) vs **game logic** (phases, timer, level config) vs **UI** (DOM overlay).
- A global store (**Zustand**) keeps the 3D components and the HTML UI in sync without prop drilling.

### 2) Game phases and timing

| Phase | What happens |
|-------|----------------|
| **`ready`** | Ball at spawn; timer at 0; waiting for first input. |
| **`playing`** | Timer runs from `startTime`; win/lose checks active. |
| **`ended`** | Timer frozen at `endTime`; restart available. |

- **`subscribeWithSelector`** lets components react to specific state slices (e.g. reset the ball when `phase` returns to `ready`).
- Store **timestamps** (`Date.now()`) instead of accumulating `delta` in the store — simpler and accurate enough for a display timer.
- **`addEffect`** from R3F runs a callback on every frame **outside** the Canvas — ideal to refresh the DOM timer in sync with the game loop.

### 3) Keyboard controls across React trees

- **`KeyboardControls`** from Drei defines named actions (`forward`, `backward`, `left`, `right`, `jump`) and key bindings in one place.
- Inside the Canvas: **`useKeyboardControls()`** returns `getKeys()` and `subscribeKeys()` for per-frame movement and one-shot actions (jump).
- Outside the Canvas: **`useKeyboardControls((state) => state.forward)`** drives the HTML key highlights.
- **`subscribeKeys`** can watch a **derived** selector (e.g. any movement key) to call `start()` on first input — a natural “press any key to begin” flow.

### 4) Player body and movement

- The ball is a **dynamic** `RigidBody` with `canSleep={false}` so it never freezes mid-run.
- Movement uses **`applyImpulse`** and **`applyTorqueImpulse`** each frame, multiplied by **`delta`** so speed feels the same at 30 or 144 FPS.
- **`linearDamping`** / **`angularDamping`** add arcade-style control without disabling physics entirely.
- **`restitution`** and **`friction`** tune how the ball bounces and grips surfaces.

### 5) Jumping with a raycast

- A jump should only fire when the ball is **on the ground**, not in mid-air.
- Cast a **`Ray`** downward from just below the ball with `world.castRay()`.
- If `hit.timeOfImpact` is below a small threshold, apply an upward **impulse**.
- This pattern is more reliable than counting contacts or using collision events for platformers.

### 6) Camera follow

- Read the ball position each frame with **`translation()`** on the rigid body ref.
- Offset the desired camera position (above and behind the ball) and **`lerp`** the real camera toward it for smooth motion.
- **`lookAt`** a separate target slightly above the ball so the horizon stays readable.
- Reuse **`Vector3`** instances in `useState` to avoid allocating every frame.

### 7) Win, lose, and reset

- **Win**: compare ball `z` to the end block entrance (computed from `blocksCount` and floor size).
- **Lose**: if `y` falls below a threshold (fell off the course), call **`restart()`**.
- **Restart** resets phase and timer, picks a **new `blocksSeed`**, and respawns the ball when phase returns to `ready`.
- **`setTranslation`**, **`setLinvel`**, and **`setAngvel`** reset the physics state cleanly.

### 8) Procedural level design

- Levels are **arrays of block components** placed at fixed `z` intervals (`-(index + 1) * FLOOR_SIZE`).
- A **seeded pseudo-random** function picks obstacle types deterministically from `blocksSeed` — same seed → same layout; new seed → new run.
- **`useMemo`** rebuilds the plan only when `count`, `seed`, or `types` change.
- Each block is a **self-contained React component** (floor mesh + kinematic obstacle) so adding a new obstacle type is mostly copy-paste-adjust.

### 9) Obstacle blocks and kinematic bodies

- Obstacles use **`type="kinematicPosition"`** — the mesh moves under script but still collides with the dynamic ball.
- **Axe / Limbo**: `setNextKinematicTranslation` driven by `Math.sin(time + offset)` for varied motion per instance.
- **Spinner**: `setNextKinematicRotation` from a `Quaternion` built with `Euler` and a random signed speed.
- Floors are plain **meshes** (no `RigidBody`); only the moving part needs physics when it interacts with the player.

### 10) Bounds and the death zone

- Arena walls are **fixed** `RigidBody` meshes with auto colliders from child geometry.
- The **pit** under the course uses a **`CuboidCollider`** without a visible mesh — the player falls through visually empty space and triggers restart via position check.
- Collider **`args`** use half-extents; position and scale must match the level length.

### 11) Shared resources and visuals

- **Reuse** one `BoxGeometry` and shared `MeshStandardMaterial` instances across blocks to reduce GPU state changes.
- **Procedural checkerboard** via `CanvasTexture` for start/end line markings without external image assets.
- **`Float`** and **`Text`** from Drei for the title; **`useGLTF`** for the finish prop with `traverse` to enable shadows on loaded meshes.

### 12) Lighting that follows the action

- A **directional light** with shadow camera bounds is tied to the player camera in `useFrame` (light and target move with `camera.position.z`).
- Shadows stay centered on the visible course instead of staying fixed in world space.

### 13) HTML interface on top of WebGL

- The UI lives in a **sibling** of `<Canvas>`, not inside it — standard DOM, CSS, and buttons.
- Control indicators mirror keyboard state with CSS classes (`active` when a key is pressed).
- The timer and restart button read the same **Zustand** store as the 3D scene — single source of truth.

### 14) Mental model

- **Game state** lives in the store; **presentation** lives in React (3D + DOM); **simulation** lives in Rapier.
- **Blocks** are data-driven tiles; **Level** is the composer; **Player** is the only dynamic actor you control.
- Tune **impulse strength**, **damping**, and **camera lerp** together — they define how the game *feels* more than any single number.

## Run the project

```bash
npm install
npm run dev
```

Use **WASD** or **arrow keys** to roll, **Space** to jump. Reach the **FINISH** platform before falling off the course. Press **Restart** after completing a run to try a new random layout.

## Credits

Part of the **Three.js Journey** course by Bruno Simon.
