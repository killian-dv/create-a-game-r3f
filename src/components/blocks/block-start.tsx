import type { ComponentProps } from "react";
import { boxGeometry, floor1Material } from "./shared";

export const BlockStart = ({ ...props }: ComponentProps<"group">) => {
  return (
    <group {...props}>
      <mesh
        position-y={-0.1}
        receiveShadow
        geometry={boxGeometry}
        material={floor1Material}
        scale={[4, 0.2, 4]}
      />
    </group>
  );
};
