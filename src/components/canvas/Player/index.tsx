import { useKeyboardControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import {
  CapsuleCollider,
  RigidBody,
  type RigidBodyApi,
} from '@react-three/rapier';
import { useRef } from 'react';
import * as THREE from 'three';
import { Controls } from '../../../App';

interface PlayerProps {
  debug: boolean;
}

const Player = ({ debug }: PlayerProps) => {
  /**
   * Keyboard Controls
   */
  //eslint-disable-next-line
  const [_, get] = useKeyboardControls<Controls>();
  const { camera } = useThree();

  /**
   * Rapier & Actions
   */
  const playerRef = useRef<RigidBodyApi>(null!);

  const SPEED = 5;
  const direction = new THREE.Vector3();
  const frontVector = new THREE.Vector3();
  const sideVector = new THREE.Vector3();

  const debugOffset = debug ? 10 : 0;

  /**
   * Animation Frame
   */
  useFrame(() => {
    if (!playerRef.current) return;

    const { forward, backward, leftward, rightward, jump } = get();

    const rigidBodyTranslation = playerRef.current.translation();

    camera.position.set(
      rigidBodyTranslation.x + debugOffset,
      rigidBodyTranslation.y + debugOffset,
      rigidBodyTranslation.z
    );

    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(leftward) - Number(rightward), 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation);

    const velocity = playerRef.current.linvel();

    playerRef.current.setLinvel({
      x: direction.x,
      y: velocity.y,
      z: direction.z,
    });
    if (jump && Math.abs(parseFloat(velocity.y.toFixed(2))) < 0.05)
      playerRef.current.setLinvel({ x: velocity.x, y: 6, z: velocity.y });
  });

  return (
    <>
      <RigidBody
        ref={playerRef}
        colliders={false}
        mass={1}
        type="dynamic"
        position={[0, 2, 0]}
        enabledRotations={[false, false, false]}
      >
        <CapsuleCollider args={[0.5, 0.5]} />
      </RigidBody>
    </>
  );
};

export default Player;
