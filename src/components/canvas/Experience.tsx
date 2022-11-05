import { PointerLockControls, Sky } from '@react-three/drei';
import { Debug, Physics } from '@react-three/rapier';
import { Perf } from 'r3f-perf';
import { useLeva } from '../Leva/useLeva';
import Level from './Level';
import Lights from './Lights';
import Player from './Player';

export const Update = {
  Early: -300,
  Physics: -250,
  Normal: -200,
  Late: -100,
};

const Experience = () => {
  const { rapierDebug } = useLeva();

  /**
   * EXPERIENCE
   */
  return (
    <>
      <Perf position="top-left" />
      <Lights />
      <Sky sunPosition={[50, 20, 50]} />
      <Physics updatePriority={Update.Physics}>
        {rapierDebug && <Debug />}
        <Level />
        <Player debug={rapierDebug} />
      </Physics>
      <PointerLockControls />
    </>
  );
};

export default Experience;
