import { useState, type ComponentProps, type ComponentType } from "react";
import { BlockAxe } from "./blocks/block-axe";
import { BlockEnd } from "./blocks/block-end";
import { BlockLimbo } from "./blocks/block-limbo";
import { BlockSpinner } from "./blocks/block-spinner";
import { BlockStart } from "./blocks/block-start";
import { Bounds } from "./blocks/bounds";

type BlockType = ComponentType<ComponentProps<"group">>;

interface BlockPlanEntry {
  Block: BlockType;
  z: number;
}

interface LevelProps {
  count?: number;
  types?: BlockType[];
}

export const Level = ({
  count = 5,
  types = [BlockAxe, BlockLimbo, BlockSpinner],
}: LevelProps) => {
  const [blockPlan] = useState<BlockPlanEntry[]>(() =>
    Array.from({ length: count }, (_, index) => ({
      Block: types[Math.floor(Math.random() * types.length)],
      z: -(index + 1) * 4,
    })),
  );

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blockPlan.map(({ Block, z }, index) => (
        <Block key={index} position={[0, 0, z]} />
      ))}
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
      <Bounds length={count + 2} />
    </>
  );
};
