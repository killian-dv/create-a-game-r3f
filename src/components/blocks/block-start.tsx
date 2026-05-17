import type { ComponentProps } from "react";
import {
  boxGeometry,
  floorBandZ,
  floorLineBandMaterial,
  floorNeutralMaterial,
  FLOOR_BAND_DEPTH,
} from "./shared";

export const BlockStart = ({ ...props }: ComponentProps<"group">) => {
  return (
    <group {...props}>
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
        position={[0, -0.099, floorBandZ.towardCourse]}
        scale={[4, 0.201, FLOOR_BAND_DEPTH]}
      />
    </group>
  );
};
