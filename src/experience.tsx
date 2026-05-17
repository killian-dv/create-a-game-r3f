import { Physics } from "@react-three/rapier";
import { Level } from "./components/level";
import { Lights } from "./components/lights";
import { Player } from "./components/player";
import { useGame } from "./stores/use-game";

export function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);
  return (
    <>
      <color attach="background" args={["#bdedfc"]} />
      <Physics>
        <Lights />
        <Level count={blocksCount} seed={blocksSeed} />
        <Player />
      </Physics>
    </>
  );
}
