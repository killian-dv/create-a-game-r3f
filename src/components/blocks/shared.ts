import { BoxGeometry, MeshStandardMaterial } from "three";

export const boxGeometry = new BoxGeometry(1, 1, 1);

export const floor1Material = new MeshStandardMaterial({ color: "limegreen" });
export const floor2Material = new MeshStandardMaterial({
  color: "greenyellow",
});
export const obstacleMaterial = new MeshStandardMaterial({
  color: "orangered",
});
export const wallMaterial = new MeshStandardMaterial({ color: "slategrey" });
