import { KeyboardControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import Experience from './components/canvas/Experience';

export enum Controls {
  FORWARD = 'forward',
  BACKWARD = 'backward',
  LEFTWARD = 'leftward',
  RIGHTWARD = 'rightward',
  JUMP = 'jump',
}

function App() {
  const map = useMemo(
    () => [
      { name: Controls.FORWARD, keys: ['ArrowUp', 'KeyW'] },
      { name: Controls.BACKWARD, keys: ['ArrowDown', 'KeyS'] },
      { name: Controls.LEFTWARD, keys: ['ArrowLeft', 'KeyA'] },
      { name: Controls.RIGHTWARD, keys: ['ArrowRight', 'KeyD'] },
      { name: Controls.JUMP, keys: ['Space'] },
    ],
    []
  );
  //KeyW means the W position on QWERTY Keyboard, not the character W
  return (
    <>
      <div
        className="pointer"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          transform: 'translate3d(-50%, -50%, 0)',
          border: '2px solid red',
          zIndex: 1,
        }}
      />
      <KeyboardControls map={map}>
        <Canvas
          shadows
          camera={{
            fov: 60,
          }}
        >
          <Experience />
        </Canvas>
      </KeyboardControls>
    </>
  );
}

export default App;
