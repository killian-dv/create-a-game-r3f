import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  RigidBody,
  useRapier,
  type RapierRigidBody,
} from "@react-three/rapier";
import { useCallback, useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { useGame } from "../stores/use-game";
import { FLOOR_SIZE } from "./blocks/shared";

export const Player = () => {
  const [subscribeKeys, getKeys] = useKeyboardControls();

  const ball = useRef<RapierRigidBody>(null);

  const { rapier, world } = useRapier();

  const start = useGame((state) => state.start);
  const restart = useGame((state) => state.restart);
  const end = useGame((state) => state.end);
  const blocksCount = useGame((state) => state.blocksCount);

  const [smoothedCameraPosition] = useState(() => new Vector3(10, 10, 10));
  const [smoothedCameraTarget] = useState(() => new Vector3());

  const jump = useCallback(() => {
    if (!ball.current) return;

    const bodyPosition = ball.current.translation();
    const rayOrigin = {
      x: bodyPosition.x,
      y: bodyPosition.y - 0.31,
      z: bodyPosition.z,
    };
    const ray = new rapier.Ray(rayOrigin, { x: 0, y: -1, z: 0 });
    const hit = world.castRay(ray, 10, true);

    if (hit && hit.timeOfImpact < 0.15) {
      ball.current.applyImpulse({ x: 0, y: 0.5, z: 0 }, true);
    }
  }, [rapier, world]);

  const reset = useCallback(() => {
    if (!ball.current) return;
    ball.current.setTranslation({ x: 0, y: 1, z: 0 }, true);
    ball.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    ball.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }, [ball]);

  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (phase) => {
        if (phase === "ready") {
          reset();
        }
      },
    );
    const unsubscribe = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) jump();
      },
    );

    const unsubscribeAnyKeys = subscribeKeys(
      (state) =>
        state.forward ||
        state.backward ||
        state.left ||
        state.right ||
        state.jump,
      (value) => {
        if (value) start();
      },
    );
    return () => {
      unsubscribe();
      unsubscribeAnyKeys();
      unsubscribeReset();
    };
  }, [subscribeKeys, jump, start, reset]);

  useFrame((state, delta) => {
    // Controls
    const { forward, backward, left, right } = getKeys();
    const impulse = new Vector3(0, 0, 0);
    const torque = new Vector3(0, 0, 0);

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;
    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (left) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }
    if (right) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }
    if (ball.current) {
      ball.current.applyImpulse(impulse, true);
      ball.current.applyTorqueImpulse(torque, true);
    }

    // camera
    const ballPosition = ball.current?.translation();
    if (!ballPosition) return;
    const cameraPosition = new Vector3();
    cameraPosition.copy(ballPosition);
    cameraPosition.y += 0.65;
    cameraPosition.z += 2.25;

    const cameraTarget = new Vector3();
    cameraTarget.copy(ballPosition);
    cameraTarget.y += 0.25;

    smoothedCameraPosition.lerp(cameraPosition, delta * 5);
    smoothedCameraTarget.lerp(cameraTarget, delta * 5);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);

    // phases — align with BlockEnd at z = -(blocksCount + 1) * FLOOR_SIZE
    const endBlockEntranceZ = -(blocksCount + 1) * FLOOR_SIZE + FLOOR_SIZE / 2;
    if (ballPosition.z < endBlockEntranceZ) {
      end();
    }
    if (ballPosition.y < -4) {
      restart();
    }
  });
  return (
    <RigidBody
      ref={ball}
      canSleep={false}
      colliders="ball"
      position={[0, 1, 0]}
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color="mediumpurple" />
      </mesh>
    </RigidBody>
  );
};
