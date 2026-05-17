import { useFrame } from "@react-three/fiber";
import { RigidBody, type RapierRigidBody } from "@react-three/rapier";
import type { ComponentProps } from "react";
import { useRef, useState } from "react";
import { Euler, Quaternion } from "three";
import { boxGeometry, floor2Material, obstacleMaterial } from "./shared";

export const BlockSpinner = ({ ...props }: ComponentProps<"group">) => {
  const obstacle = useRef<RapierRigidBody>(null);
  const [speed] = useState(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1),
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const rotation = new Quaternion().setFromEuler(
      new Euler(0, time * speed, 0),
    );
    if (obstacle.current) {
      obstacle.current.setNextKinematicRotation(rotation);
    }
  });

  return (
    <group {...props}>
      <mesh
        position-y={-0.1}
        receiveShadow
        geometry={boxGeometry}
        material={floor2Material}
        scale={[4, 0.2, 4]}
      />
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          receiveShadow
          castShadow
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
        />
      </RigidBody>
    </group>
  );
};
