// src/App.js
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Model } from './Model';
import './App.css';

function App() {
  const [turbine1Speed, setTurbine1Speed] = useState(2); // Speed for the first turbine
  const [turbine2Speed, setTurbine2Speed] = useState(4); // Speed for the second turbine

  // Simulate dynamic speed change (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      setTurbine1Speed(0); // Change speed dynamically for testing
      setTurbine2Speed(5); // Change second turbine's speed dynamically
    }, 3000); // Change after 3 seconds

    return () => clearTimeout(timer); // Clean up on unmount
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        
        {/* First turbine with its own speed */}
        <Model position={[-2, 0, 0]} scale={[0.015, 0.015, 0.015]} turbineSpeed={turbine1Speed} />
        
        {/* Second turbine with a different speed */}
        <Model position={[1, 0, 0]} scale={[0.015, 0.015, 0.015]} turbineSpeed={turbine2Speed} />
        
        <OrbitControls />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}

export default App;
