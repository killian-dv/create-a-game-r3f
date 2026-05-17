import { useFrame } from "@react-three/fiber";
import { RigidBody, type RapierRigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import {
  boxGeometry,
  floor2Material,
  obstacleMaterial,
  type BlockGroupProps,
} from "./shared";

export const BlockAxe = ({
  position = [0, 0, 0],
  ...props
}: BlockGroupProps) => {
  const [baseX, baseY, baseZ] = position;
  const obstacle = useRef<RapierRigidBody>(null);
  const [timeOffset] = useState(() => Math.random() * 2 * Math.PI);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const x = Math.sin(time + timeOffset) * 1.25;
    if (obstacle.current) {
      obstacle.current.setNextKinematicTranslation({
        x: baseX + x,
        y: baseY + 0.75,
        z: baseZ,
      });
    }
  });

  return (
    <group position={position} {...props}>
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
          scale={[1.5, 1.5, 0.3]}
        />
      </RigidBody>
    </group>
  );
};
