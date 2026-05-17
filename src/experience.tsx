import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Level } from "./components/level";
import { Lights } from "./components/lights";
import { Player } from "./components/player";

export function Experience() {
  return (
    <>
      <OrbitControls makeDefault />
      <Physics debug>
        <Lights />
        <Level />
        <Player />
      </Physics>
    </>
  );
}
