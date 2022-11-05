import * as THREE from 'three';
import { Material } from 'three';

/**
 * SETUP
 */
//@ts-ignore
THREE.ColorManagement.legacyMode = false;

/**
 * MATERIALS
 */
export const floor1Material = new THREE.MeshStandardMaterial({
  color: 'seagreen',
});

export const boxMaterial = new THREE.MeshStandardMaterial({
  color: 'white',
});

export const boxHitMaterial = new THREE.MeshStandardMaterial({
  color: 'red',
});

/**
 * GEOMETRIES
 */
export const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

/**
 * TYPES
 */
export interface BaseEntity {
  position?: [x: number, y: number, z: number];
  material?: Material;
}
