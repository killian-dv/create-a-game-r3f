import { Physics } from "@react-three/rapier";
import { Level } from "./components/level";
import { Lights } from "./components/lights";
import { Player } from "./components/player";

export function Experience() {
  return (
    <>
      <Physics>
        <Lights />
        <Level />
        <Player />
      </Physics>
    </>
  );
}
