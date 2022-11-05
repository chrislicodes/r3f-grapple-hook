import { Edges } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useState } from 'react';
import { BaseEntity, boxGeometry, boxMaterial, boxHitMaterial } from './shared';

/**
 * HOOKABLE BOX
 */
export const HookableBox = ({ position = [0, 0, 0] }: BaseEntity) => {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <group position={position} onClick={() => setIsClicked((prev) => !prev)}>
      <RigidBody
        type="fixed"
        colliders="cuboid"
        position={[0, 0, 0]}
        restitution={0}
        friction={0}
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
