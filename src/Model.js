import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Physics, useBox } from "@react-three/cannon";
export default function Model(props) {
  const group = useRef();
  const { nodes, materials, errors } = useGLTF(
    'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/rocks-forrest/model.gltf'
  );

  if (errors) {
    console.error('Error loading model:', errors);
    return null; // Render nothing or a placeholder in case of an error
  }

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.rocksA_forest.geometry} material={materials['Stone.007']} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
}

useGLTF.preload('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/rocks-forrest/model.gltf');
