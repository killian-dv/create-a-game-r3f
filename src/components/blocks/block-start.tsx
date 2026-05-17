import { Float, Text } from "@react-three/drei";
import type { ComponentProps } from "react";
import {
  boxGeometry,
  FLOOR_BAND_DEPTH,
  floorBandZ,
  floorLineBandMaterial,
  floorNeutralMaterial,
} from "./shared";

export const BlockStart = ({ ...props }: ComponentProps<"group">) => {
  return (
    <group {...props}>
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text
          font="./bebas-neue-v9-latin-regular.woff"
          scale={0.5}
          maxWidth={0.25}
          lineHeight={0.75}
          textAlign="right"
          position={[0.75, 0.65, 0]}
          rotation-y={-0.25}
        >
          Marble Race
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
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
