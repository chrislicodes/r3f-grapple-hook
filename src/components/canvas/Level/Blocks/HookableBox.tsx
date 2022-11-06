import { Edges } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody, type RigidBodyApi } from '@react-three/rapier';
import { useRef, useState } from 'react';
import { BaseEntity, boxGeometry, boxMaterial, boxHitMaterial } from './shared';

/**
 * HOOKABLE BOX
 */
export const HookableBox = ({
  position = [0, 0, 0],
  isMoving = false,
}: BaseEntity & { isMoving?: boolean }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
  const boxRef = useRef<RigidBodyApi>(null!);
  useFrame((state) => {
    if (isMoving) {
      const time = state.clock.getElapsedTime();

      const y = Math.sin(time + timeOffset) + 2;

      boxRef.current.setNextKinematicTranslation({
        x: position[0],
        y: position[1] + y,
        z: position[2],
      });
    }
  });
  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        setIsClicked((prev) => !prev);
      }}
    >
      <RigidBody
        type="kinematicPosition"
        colliders="cuboid"
        position={[0, 0, 0]}
        restitution={0}
        friction={0}
        ref={boxRef}
      >
        <mesh
          geometry={boxGeometry}
          material={isClicked ? boxMaterial : boxHitMaterial}
          position={[0, 0, 0]}
          scale={[2, 2, 2]}
          castShadow
        >
          <Edges />
        </mesh>
      </RigidBody>
    </group>
  );
};
