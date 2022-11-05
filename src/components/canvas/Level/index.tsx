import { Floor } from './Blocks/Floor';
import { HookableBox } from './Blocks/HookableBox';

const Level = () => {
  return (
    <>
      <Floor />
      <HookableBox position={[0, 10, 0]} />
    </>
  );
};

export default Level;
