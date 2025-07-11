import React from "react";
import { Canvas } from "@react-three/fiber";
import Bubbles from "./Bubbles";
import Text3D from "./Text3D";
import "./App.css";

const App = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.5} />
      <Bubbles />
      <Text3D />
    </Canvas>
  );
};

export default App;
