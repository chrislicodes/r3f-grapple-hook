import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import grass from "../assets/texture.png";

import { CuboidCollider, RigidBody, RigidBodyProps } from "@react-three/rapier";
import { Color } from "three";

export const Ground = (props: RigidBodyProps) => {
  const texture = useTexture(grass);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return (
    <RigidBody type="fixed" colliders={false} {...props}>
      <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial
          map={texture}
          map-repeat={[240, 240]}
          color={new Color("#99999")}
        />
      </mesh>
      <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
    </RigidBody>
  );
};
