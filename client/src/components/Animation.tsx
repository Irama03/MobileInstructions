'use client'
import React, { Suspense, useEffect } from 'react';
import { Canvas } from 'react-three-fiber';
import { Environment, OrbitControls, PerspectiveCamera, Stats, useAnimations, useGLTF } from '@react-three/drei';

const Model = () => {
  const {animations, scene} = useGLTF('/final.glb');
  const { actions, names } = useAnimations(animations, scene);
  useEffect(() => {
    actions[names[3]]?.play();
  }, [actions, names]);
  
  return  <group scale={[2, 2, 2]}>
    <primitive object={scene} />
  </group>
};

const Animation = () => {
  return (
    <Canvas style={{
      position: 'fixed',
      right: 0,
      bottom: 0,
      width: 500,
      height: 500,
      pointerEvents: 'none'
    }}>
      <PerspectiveCamera makeDefault position={[6, 2, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[5, 5, 5]} angle={0.3} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <Environment preset="studio" />
      {/* <OrbitControls /> */}
      {/* <Stats /> */}
    </Canvas>
  );
};

export default Animation;
