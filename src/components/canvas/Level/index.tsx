import { useMemo } from 'react';
import { Floor } from './Blocks/Floor';
import { HookableBox } from './Blocks/HookableBox';

const Level = () => {
  const blocks = useMemo(() => {
    return Array.from({ length: 10 }).map((_, index) => (
      <HookableBox
        key={index}
        position={[0, 10, index * 10]}
        isMoving={Math.random() > 0.5}
      />
    ));
  }, []);
  return (
    <>
      {blocks}
      <Floor />
    </>
  );
};

export default Level;
