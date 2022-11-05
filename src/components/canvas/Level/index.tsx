import { Floor } from './Blocks/Floor';
import { HookableBox } from './Blocks/HookableBox';

const Level = () => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <HookableBox key={index} position={[0, 10, index * 10]} />
      ))}
      <Floor />
    </>
  );
};

export default Level;
