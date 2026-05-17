import { Physics } from "@react-three/rapier";
import { Level } from "./components/level";
import { Lights } from "./components/lights";
import { Player } from "./components/player";
import { useGame } from "./stores/use-game";

export function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  return (
    <>
      <Physics>
        <Lights />
        <Level count={blocksCount} />
        <Player />
      </Physics>
    </>
  );
}
