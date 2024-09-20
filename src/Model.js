// src/Model.js
import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Model({ turbineSpeed, position, scale, ...props }) {
    const { nodes, materials } = useGLTF('/model.glb');
    const groupRef = useRef();
    const bladesRef = useRef();

    useEffect(() => {
      if (groupRef.current) {
        const box = new THREE.Box3().setFromObject(groupRef.current);
        const center = new THREE.Vector3();
        box.getCenter(center);
        groupRef.current.position.set(-center.x, -center.y, -center.z);
      }
    }, [nodes, materials]);
    useEffect(() => {
      if (nodes) {
        console.log('GLTF Nodes:', nodes);  // Log the nodes to inspect the structure
      }
    }, [nodes]);

    useFrame(() => {
      if (bladesRef.current && turbineSpeed > 0) {
        bladesRef.current.rotation.y += turbineSpeed * 0.01; 
      }
    });

    return (
      <group {...props} position={position} scale={scale} ref={groupRef} dispose={null}>
        <group scale={[0.10, 0.10, 0.10]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Soportes_Base__0.geometry}
            material={materials['Scene_-_Root']}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Tornillos__0.geometry}
            material={materials['Scene_-_Root']}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          />
          <mesh
            ref={bladesRef}
            castShadow
            receiveShadow
            geometry={nodes.Helice__0.geometry}
            material={materials['Scene_-_Root']}
            position={[0, 1895.546, 37.117]}
            rotation={[-Math.PI / 2, Math.PI / 2, 0]}
            scale={100}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Turbina__0.geometry}
            material={materials['Scene_-_Root']}
            position={[0, 860.346, 30.564]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Torre__0.geometry}
            material={materials['Scene_-_Root']}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          />
        </group>
      </group>
    );
}

useGLTF.preload('/model.glb');
