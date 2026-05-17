import { useFrame } from "@react-three/fiber";
import { RigidBody, type RapierRigidBody } from "@react-three/rapier";
import { useRef, useState, type ComponentProps } from "react";
import { boxGeometry, floor2Material, obstacleMaterial } from "./shared";

export const BlockLimbo = ({ ...props }: ComponentProps<"group">) => {
  const obstacle = useRef<RapierRigidBody>(null);
  const [timeOffset] = useState(() => Math.random() * 2 * Math.PI);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const y = Math.sin(time + timeOffset) + 1.15;
    if (obstacle.current) {
      obstacle.current.setNextKinematicTranslation({
        x: props.position?.[0] ?? 0,
        y: (props.position?.[1] ?? 0) + y,
        z: props.position?.[2] ?? 0,
      });
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
