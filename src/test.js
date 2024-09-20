import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Model } from './Model';
import './App.css';

function App() {
  const [turbine1Speed, setTurbine1Speed] = useState(0);
  const [turbine2Speed, setTurbine2Speed] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0); // To store wind speed from backend

  // Function to fetch turbine status and wind speed
  const fetchTurbineData = async () => {
    try {
      // Fetch climate data (for wind speed)
      const climateResponse = await fetch('http://10.0.0.106:3001/climate');
      const climateData = await climateResponse.json();
      const currentWindSpeed = parseFloat(climateData.wind_speed[0]?.value);
      setWindSpeed(currentWindSpeed);

      // Fetch turbine statuses
      const [response1, response2] = await Promise.all([
        fetch('http://10.0.0.106:3001/device1'),
        fetch('http://10.0.0.106:3001/device2')
      ]);

      const [data1, data2] = await Promise.all([
        response1.json(),
        response2.json()
      ]);

      const status1 = data1[0]?.value;
      const status2 = data2[0]?.value;

      console.log('Device 1 status:', status1);
      console.log('Device 2 status:', status2);
      console.log('Wind Speed:', currentWindSpeed);

      // Set turbine speeds based on status and scaled wind speed
      const scaledSpeed = currentWindSpeed / 4; // Scale down the wind speed for slower rotation
      if (status1 === 'ON') {
        setTurbine1Speed(scaledSpeed); // Set scaled speed if ON
      } else if (status1 === 'OFF') {
        setTurbine1Speed(0); // Set speed to 0 if OFF
      }

      if (status2 === 'ON') {
        setTurbine2Speed(scaledSpeed); // Set scaled speed if ON
      } else if (status2 === 'OFF') {
        setTurbine2Speed(0); // Set speed to 0 if OFF
      }
    } catch (error) {
      console.error('Error fetching turbine data:', error);
    }
  };

  useEffect(() => {
    fetchTurbineData();
    const intervalId = setInterval(fetchTurbineData, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <div id="bg">
        <cloud class="cloud">
          <span class="cld a"></span>
          <span class="cld b"></span>
          <span class="cld c"></span>
          <span class="cld d"></span>
          <span class="cld a shd"></span>
          <span class="cld b shd"></span>
          <span class="cld c shd"></span>
          <span class="cld d shd"></span>
        </cloud>

        <cloud class="cloud cloud_a">
          <span class="cld a"></span>
          <span class="cld b"></span>
          <span class="cld c"></span>
          <span class="cld d"></span>
          <span class="cld a shd"></span>
          <span class="cld b shd"></span>
          <span class="cld c shd"></span>
          <span class="cld d shd"></span>
        </cloud>

        <cloud class="cloud cloud_b">
          <span class="cld a"></span>
          <span class="cld b"></span>
          <span class="cld c"></span>
          <span class="cld d"></span>
          <span class="cld a shd"></span>
          <span class="cld b shd"></span>
          <span class="cld c shd"></span>
          <span class="cld d shd"></span>
        </cloud>

        <cloud class="cloud cloud_c">
          <span class="cld a"></span>
          <span class="cld b"></span>
          <span class="cld c"></span>
          <span class="cld d"></span>
          <span class="cld a shd"></span>
          <span class="cld b shd"></span>
          <span class="cld c shd"></span>
          <span class="cld d shd"></span>
        </cloud>

        <cloud class="cloud cloud_d">
          <span class="cld a"></span>
          <span class="cld b"></span>
          <span class="cld c"></span>
          <span class="cld d"></span>
          <span class="cld a shd"></span>
          <span class="cld b shd"></span>
          <span class="cld c shd"></span>
          <span class="cld d shd"></span>
        </cloud>

        <ground class="ground">
          <tree class="tree tree_a">
            <span class="tree a"></span>
            <span class="tree b"></span>
            <span class="tree c"></span>
            <span class="tree trunk"></span>
          </tree>
          <tree class="tree tree_b">
            <span class="tree a"></span>
            <span class="tree b"></span>
            <span class="tree c"></span>
            <span class="tree trunk"></span>
          </tree>
          <tree class="tree tree_c">
            <span class="tree a"></span>
            <span class="tree b"></span>
            <span class="tree c"></span>
            <span class="tree trunk"></span>
          </tree>
          <tree class="tree tree_d">
            <span class="tree a"></span>
            <span class="tree b"></span>
            <span class="tree c"></span>
            <span class="tree trunk"></span>
          </tree>
        </ground>
      </div>
      <Canvas style={{ position: 'absolute',height:'max-content', bottom: 0 }} camera={{ position: [0, 2, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />

        {/* First turbine with adjusted Y-axis to place it lower */}
        <Model position={[-2, 0, 0]} scale={[0.015, 0.015, 0.015]} turbineSpeed={turbine1Speed} />

        {/* Second turbine with adjusted Y-axis to place it lower */}
        <Model position={[1, 0, 0]} scale={[0.015, 0.015, 0.015]} turbineSpeed={turbine2Speed} />

        <OrbitControls />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}

export default App;
