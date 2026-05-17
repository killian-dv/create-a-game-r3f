import { useMemo, type ComponentProps, type ComponentType } from "react";
import { BlockAxe } from "./blocks/block-axe";
import { BlockEnd } from "./blocks/block-end";
import { BlockLimbo } from "./blocks/block-limbo";
import { BlockSpinner } from "./blocks/block-spinner";
import { BlockStart } from "./blocks/block-start";
import { Bounds } from "./blocks/bounds";

type BlockType = ComponentType<ComponentProps<"group">>;

const BLOCK_TYPES = [BlockAxe, BlockLimbo, BlockSpinner];

const createSeededRandom = (seed: number) => {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};

interface BlockPlanEntry {
  Block: BlockType;
  z: number;
}

interface LevelProps {
  count?: number;
  types?: BlockType[];
  seed?: number;
}

export const Level = ({
  count = 5,
  types = BLOCK_TYPES,
  seed = 0,
}: LevelProps) => {
  const blockPlan = useMemo<BlockPlanEntry[]>(() => {
    const random = createSeededRandom(seed);
    return Array.from({ length: count }, (_, index) => ({
      Block: types[Math.floor(random() * types.length)],
      z: -(index + 1) * 4,
    }));
  }, [count, seed, types]);

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blockPlan.map(({ Block, z }, index) => (
        <Block key={`${seed}-${index}`} position={[0, 0, z]} />
      ))}
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
      <Bounds length={count + 2} />
    </>
  );
};
