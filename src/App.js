import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Model } from './Model';
import { Ground } from './Ground';
import './App.css';

function App() {
  const [turbine1Speed, setTurbine1Speed] = useState(0);
  const [turbine2Speed, setTurbine2Speed] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const fetchTurbineData = async () => {
    try {
      const climateResponse = await fetch('http://10.0.0.106:3001/climate');
      const climateData = await climateResponse.json();
      const currentWindSpeed = parseFloat(climateData.wind_speed[0]?.value);
      setWindSpeed(currentWindSpeed);

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

      const scaledSpeed = currentWindSpeed / 4;
      if (status1 === 'ON') {
        setTurbine1Speed(scaledSpeed);
      } else if (status1 === 'OFF') {
        setTurbine1Speed(0);
      }
      if (status2 === 'ON') {
        setTurbine2Speed(scaledSpeed);
      } else if (status2 === 'OFF') {
        setTurbine2Speed(0);
      }
    } catch (error) {
      console.error('Error fetching turbine data:', error);
    }
  };
  useEffect(() => {
    fetchTurbineData();
    const intervalId = setInterval(fetchTurbineData, 5000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <div id="bg">
      </div>
      <Canvas style={{ position: 'absolute',height:'max-content', bottom: 0 }} camera={{ position: [0, 0, 10], fov: 50 }}>
        <Model position={[-3, -1.2, 0]} scale={[0.015, 0.015, 0.015]} turbineSpeed={turbine1Speed} />
        <Model position={[2, -1.28, 0]} scale={[0.015, 0.015, 0.015]} turbineSpeed={turbine2Speed} />
        <Ground />
        <OrbitControls 
        maxPolarAngle={Math.PI / 2}
        target={[0, 2, 0]}
        />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}

export default App;
