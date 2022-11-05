import { Line, useKeyboardControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import {
  CapsuleCollider,
  RigidBody,
  useRapier,
  type RigidBodyApi,
} from '@react-three/rapier';
import { useLayoutEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { Controls } from '../../../App';

import { extend } from '@react-three/fiber';
import { Line2 } from 'three-stdlib';

extend({ Line_: THREE.Line });

interface PlayerProps {
  debug: boolean;
}

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

const Player = ({ debug }: PlayerProps) => {
  const [connectedTo, setConnectedTo] = useState<null | {
    origin: Vector3;
    target: Vector3;
  }>(null);

  const lineRef = useRef<Line2>(null!);

  const [drawLines, setDrawLines] = useState<[] | Vector3[][]>([]);
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
  const { rapier, world } = useRapier();
  const rapierWorld = world.raw();

  /**
   * Animation Frame
   */
  useFrame(() => {
    if (!playerRef.current) return;

    const { forward, backward, leftward, rightward, jump, hook } = get();

    const rigidBodyTranslation = playerRef.current.translation();

    camera.position.set(
      rigidBodyTranslation.x,
      rigidBodyTranslation.y,
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

    if (hook && connectedTo) {
      const origin = playerRef.current.translation();
      const direction2 = new Vector3().copy(connectedTo.target).sub(origin);
      playerRef.current.applyImpulse(direction2.setLength(0.2));

      if (lineRef.current) {
        console.log(lineRef.current);
        lineRef.current?.geometry.setFromPoints([
          new Vector3(...[0, 0, 0]),
          new Vector3(...[0, 10, 0]),
        ]);
      }
    }

    if (hook && !connectedTo) {
      const origin = playerRef.current.translation();
      origin.z += 0.1;

      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      direction.setLength(1);

      origin.add(direction);

      const ray = new rapier.Ray(origin, direction);
      const hit = rapierWorld.castRay(ray, 100, true);

      if (hit?.toi) {
        const newRay = ray.pointAt(hit.toi);
        setConnectedTo({
          origin: new Vector3(ray.origin.x, ray.origin.y, ray.origin.z),
          target: new Vector3(newRay.x, newRay.y, newRay.z),
        });
      }
    }

    if (!hook && connectedTo) {
      setConnectedTo(null);
    }
    if (!connectedTo) {
      playerRef.current.setLinvel({
        x: direction.x,
        y: velocity.y,
        z: direction.z,
      });
    }

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
      <Line
        points={[
          [0, 0, 0],
          [0, 0, 0],
        ]}
        ref={lineRef}
        lineWidth={20}
      />
    </>
  );
};

export default Player;
