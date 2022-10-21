import * as THREE from "three";
import { useRef } from "react";
import { useThree, useFrame, ThreeElements } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
// import { HookGun } from "./HookGun";
import { CapsuleCollider, RigidBody, RigidBodyApi } from "@react-three/rapier";

const SPEED = 10;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const rotation = new THREE.Vector3();

export const Player = () => {
  const axe = useRef<ThreeElements["group"]>(null!!);
  const [, get] = useKeyboardControls();
  const { camera } = useThree();
  const ref = useRef<RigidBodyApi>(null);

  useFrame((state) => {
    if (!ref.current) return;

    const { forward, backward, left, right, jump } = get();

    const rigidBodyTranslation = ref.current.translation();

    camera.position.set(
      rigidBodyTranslation.x,
      rigidBodyTranslation.y + 0.5,
      rigidBodyTranslation.z
    );

    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation);

    const velocity = ref.current.linvel();

    // axe.current.children[0].rotation.x = THREE.MathUtils.lerp(
    //   axe.current.children[0].rotation.x,
    //   Math.sin((velocity.length() > 1) * state.clock.elapsedTime * 10) / 6,
    //   0.1
    // );

    // axe.current.rotation.copy(camera.rotation);
    // axe.current.position
    //   .copy(camera.position)
    //   .add(camera.getWorldDirection(rotation).multiplyScalar(1));

    ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });
    if (jump && Math.abs(parseFloat(velocity.y.toFixed(2))) < 0.05)
      ref.current.setLinvel({ x: velocity.x, y: 9, z: velocity.y });
  });

  return (
    <>
      <RigidBody
        ref={ref}
        colliders={false}
        mass={1}
        type="dynamic"
        position={[0, 10, 0]}
        enabledRotations={[false, false, false]}
      >
        <CapsuleCollider args={[0.5, 0.5]} />
      </RigidBody>
      {/* <group
        ref={axe}
        onPointerMissed={(e) => (axe.current.children[0].rotation.x = -0.5)}
      >
        <HookGun position={[0.3, -0.35, 0.5]} />
      </group> */}
    </>
  );
};
