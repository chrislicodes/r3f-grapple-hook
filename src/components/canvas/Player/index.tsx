import { useKeyboardControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import {
  CapsuleCollider,
  RigidBody,
  useRapier,
  type RigidBodyApi,
} from '@react-three/rapier';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { Controls } from '../../../App';
import { BaseEntity } from '../Level/Blocks/shared';

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

const Player = () => {
  const [connectedTo, setConnectedTo] = useState<null | Vector3>(null);

  const ropeRef = useRef<
    THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
  >(null!);

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

    /**
     * FIRST PERSON CAMERA - Make the camera follow the body
     */
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

    /**
     * WALKING MOVEMENT - Enable normal walking movement if we are not connected to something
     */
    if (!connectedTo) {
      playerRef.current.setLinvel({
        x: direction.x,
        y: velocity.y,
        z: direction.z,
      });
    }

    /**
     * JUMPING
     */
    if (jump && Math.abs(parseFloat(velocity.y.toFixed(2))) < 0.05)
      playerRef.current.setLinvel({ x: velocity.x, y: 6, z: velocity.y });

    /**
     * ROPE PHYSICS - Hook (shift) is pressed and we are connected to something
     */
    if (hook && connectedTo) {
      /**
       * FORCES
       */
      //Apply Impulse in the direction of the target
      //TODO: minLength, maxLength, damping, springForce, massScale
      const origin = playerRef.current.translation();
      const targetDirection = new Vector3().copy(connectedTo).sub(origin);
      playerRef.current.applyImpulse(targetDirection.setLength(0.2));

      /**
       * ANIMATE ROPE
       */
      //rotate the rope torward the target
      const ropeAxis = targetDirection.normalize();
      const quaternion = new THREE.Quaternion();
      const cylinderUpAxis = new THREE.Vector3(0, 1, 0);
      quaternion.setFromUnitVectors(cylinderUpAxis, ropeAxis);
      ropeRef.current.setRotationFromQuaternion(quaternion);

      //translate the rope to the player
      ropeRef.current.translateX(origin.x - ropeRef.current.position.x + 0.5);
      ropeRef.current.translateY(origin.y - ropeRef.current.position.y + 0.5);
      ropeRef.current.translateZ(origin.z - ropeRef.current.position.z + 0.5);

      //? scale distance between target and player
    }

    /**
     * RAYCAST TO FIND OBJECT TO ATTACH TO - We press the hook (shift) button and are not currently connected to anything
     */
    if (hook && !connectedTo) {
      //Get current position
      const origin = playerRef.current.translation();
      //Get out of own rigid body
      origin.z += 0.1;

      //Shoot a ray out of the camera
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      direction.setLength(1);

      origin.add(direction);

      const ray = new rapier.Ray(origin, direction);
      const hit = rapierWorld.castRay(ray, 100, true);

      //If hit, register and set the hit
      if (hit?.toi) {
        const newRay = ray.pointAt(hit.toi);

        setConnectedTo(new Vector3(newRay.x, newRay.y, newRay.z));
      }
    }

    /**
     * DISCONNECT ROPE - We dont press the hook (shift) button and are currently connected to something
     */
    if (!hook && connectedTo) {
      setConnectedTo(null);
    }
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
      <Rope ropeRef={ropeRef} />
    </>
  );
};

export default Player;

export const Rope = ({
  position = [0, 0, 0],
  ropeRef,
}: BaseEntity & {
  ropeRef?:
    | React.Ref<
        THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
      >
    | undefined;
}) => {
  return (
    <group position={position}>
      <mesh ref={ropeRef}>
        <meshStandardMaterial color={'black'} />
        <cylinderGeometry args={[0.02, 0.02, 1, 8, 16, true]} />
      </mesh>
    </group>
  );
};
