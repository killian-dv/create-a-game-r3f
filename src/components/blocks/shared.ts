import type { ComponentProps } from "react";
import {
  BoxGeometry,
  CanvasTexture,
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
} from "three";

export type BlockGroupProps = Omit<ComponentProps<"group">, "position"> & {
  position?: [number, number, number];
};

export const boxGeometry = new BoxGeometry(1, 1, 1);

const createCheckerboardTexture = (cols: number, rows: number) => {
  const width = 320;
  const height = Math.round((width / cols) * rows);
  const cellWidth = width / cols;
  const cellHeight = height / rows;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get 2D context for checkerboard texture");
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? "#ffffff" : "#1a1a1a";
      ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
};

export const FLOOR_SIZE = 4;
export const FLOOR_BAND_DEPTH = 1.2;
export const floorBandZ = {
  towardCourse: -(FLOOR_SIZE / 2 - FLOOR_BAND_DEPTH / 2),
  fromCourse: FLOOR_SIZE / 2 - FLOOR_BAND_DEPTH / 2,
};

export const floorNeutralMaterial = new MeshStandardMaterial({
  color: "#e8e8e8",
  roughness: 0.4,
});

export const floorLineBandMaterial = new MeshStandardMaterial({
  map: createCheckerboardTexture(8, 3),
  roughness: 0.35,
});

export const floor1Material = new MeshStandardMaterial({ color: "limegreen" });
export const floor2Material = new MeshStandardMaterial({
  color: "greenyellow",
});
export const obstacleMaterial = new MeshStandardMaterial({
  color: "orangered",
});
export const wallMaterial = new MeshStandardMaterial({ color: "slategrey" });
