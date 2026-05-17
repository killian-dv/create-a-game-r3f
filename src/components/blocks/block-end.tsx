import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import type { ComponentProps } from "react";
import { Mesh } from "three";
import { boxGeometry, floor1Material } from "./shared";

export const BlockEnd = ({ ...props }: ComponentProps<"group">) => {
  const hamburger = useGLTF("./hamburger.glb");
  hamburger.scene.traverse((child) => {
    if (child instanceof Mesh) {
      child.castShadow = true;
    }
  });
  return (
    <group {...props}>
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={floor1Material}
        scale={[4, 0.2, 4]}
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
