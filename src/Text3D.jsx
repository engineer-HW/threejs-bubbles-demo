import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";

const Text = () => {
  const textRef = useRef();

  useFrame(() => {
    if (textRef.current) {
      textRef.current.rotation.z += 0.01; //z軸で回転(時計回り)
    }
  });
  return (
    <Center>
      {" "}
      {/* ← 自動で中央揃え */}
      <Text3D
        font="/fonts/Dela Gothic One_Regular.json"
        size={1}
        height={0.2}
        bevelEnabled
        bevelThickness={0.05}
        bevelSize={0.02}
        bevelSegments={10}
      >
        Happy!
        <meshNormalMaterial /> {/* 表面の質感 */}
      </Text3D>
    </Center>
  );
};

export default Text;
