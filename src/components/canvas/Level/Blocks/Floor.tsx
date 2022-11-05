import { Edges } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { BaseEntity, boxGeometry, floor1Material } from './shared';

/**
 * FLOOR
 */
export const Floor = ({
  position = [0, 0, 0],
  material = floor1Material,
}: BaseEntity) => {
  return (
    <group position={position}>
      <RigidBody type="fixed" restitution={0.2} friction={1}>
        <mesh
          geometry={boxGeometry}
          material={material}
          position={[0, -0.1, 0]}
          scale={[30, 0.2, 30]}
          receiveShadow
        >
          <Edges />
        </mesh>
      </RigidBody>
    </group>
  );
};
