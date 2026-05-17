import { Text, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import type { ComponentProps } from "react";
import { Mesh } from "three";
import {
  boxGeometry,
  FLOOR_BAND_DEPTH,
  floorBandZ,
  floorLineBandMaterial,
  floorNeutralMaterial,
} from "./shared";

export const BlockEnd = ({ ...props }: ComponentProps<"group">) => {
  const hamburger = useGLTF("./hamburger.glb");
  hamburger.scene.traverse((child) => {
    if (child instanceof Mesh) {
      child.castShadow = true;
    }
  });
  return (
    <group {...props}>
      <Text
        font="./bebas-neue-v9-latin-regular.woff"
        scale={1}
        position={[0, 2.25, 2]}
      >
        FINISH
        <meshBasicMaterial toneMapped={false} />
      </Text>
      <mesh
        position-y={-0.1}
        receiveShadow
        geometry={boxGeometry}
        material={floorNeutralMaterial}
        scale={[4, 0.2, 4]}
      />
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={floorLineBandMaterial}
        position={[0, -0.099, floorBandZ.fromCourse]}
        scale={[4, 0.201, FLOOR_BAND_DEPTH]}
      />
      <RigidBody
        type="fixed"
        colliders="hull"
        restitution={0.2}
        friction={0}
        position={[0, 0.25, 0]}
      >
        <primitive object={hamburger.scene} scale={0.2} />
      </RigidBody>
    </group>
  );
};
