import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  RigidBody,
  useRapier,
  type RapierRigidBody,
} from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";

export const Player = () => {
  const [subscribeKeys, getKeys] = useKeyboardControls();

  const ball = useRef<RapierRigidBody>(null);

  const { rapier, world } = useRapier();

  console.log("world", world);

  useEffect(() => {
    const jump = () => {
      if (!ball.current) return;
      const origin = ball.current.translation();
      if (!origin) return;
      origin.y -= 0.31;
      const direction = new Vector3(0, -1, 0);
      const ray = new rapier.Ray(origin, direction);
      const hit = world.castRay(ray, 10, true);
      if (hit?.timeOfImpact && hit.timeOfImpact < 0.15) {
        ball.current.applyImpulse(new Vector3(0, 0.5, 0), true);
      }
    };

    const unsubscribe = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) {
          jump();
        }
      },
    );
    return () => unsubscribe();
  }, [subscribeKeys, rapier, world]);

  useFrame((_, delta) => {
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
