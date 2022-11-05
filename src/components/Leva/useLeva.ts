import { useControls } from 'leva';

export const useLeva = () => {
  /**
   * CONTROLS
   */
  const { rapierDebug } = useControls('General Settings', {
    rapierDebug: false,
  });

  return {
    rapierDebug,
  };
};
