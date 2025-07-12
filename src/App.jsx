import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import PetBottleParticles from "./Text3D";
import "./App.css";

const App = () => {
  const textRef = useRef();

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.5} />
      <PetBottleParticles ref={textRef} />
    </Canvas>
  );
};

export default App;
