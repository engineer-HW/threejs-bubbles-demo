import React, { useRef, forwardRef, useImperativeHandle, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PetBottleParticles = forwardRef((props, ref) => {
  const groupRef = useRef();

  // ペットボトルの形状を定義するパーティクル配置
  const particles = useMemo(() => {
    const particleData = [];
    const bottleHeight = 3;
    const bottleRadius = 0.8;
    const neckHeight = 0.5;
    const neckRadius = 0.3;
    const particleCount = 200; // パフォーマンスのため数を減らす

    for (let i = 0; i < particleCount; i++) {
      let x, y, z;
      
      if (i < particleCount * 0.7) {
        // ボトルの胴体部分（円柱）
        const angle = Math.random() * Math.PI * 2;
        const height = Math.random() * (bottleHeight - neckHeight);
        const radius = bottleRadius * (0.8 + Math.random() * 0.4); // 少しランダムな半径
        
        x = Math.cos(angle) * radius;
        y = height - bottleHeight / 2;
        z = Math.sin(angle) * radius;
      } else if (i < particleCount * 0.85) {
        // ボトルの首部分（細い円柱）
        const angle = Math.random() * Math.PI * 2;
        const height = Math.random() * neckHeight;
        const radius = neckRadius * (0.8 + Math.random() * 0.4);
        
        x = Math.cos(angle) * radius;
        y = bottleHeight / 2 - neckHeight / 2 + height;
        z = Math.sin(angle) * radius;
      } else {
        // ボトルの口部分（小さな円柱）
        const angle = Math.random() * Math.PI * 2;
        const height = Math.random() * 0.2;
        const radius = 0.15 * (0.8 + Math.random() * 0.4);
        
        x = Math.cos(angle) * radius;
        y = bottleHeight / 2 + height;
        z = Math.sin(angle) * radius;
      }
      
      particleData.push({
        id: i,
        position: new THREE.Vector3(x, y, z),
        originalPosition: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        size: Math.random() * 0.05 + 0.02,
      });
    }
    return particleData;
  }, []);

  useImperativeHandle(ref, () => ({
    getWorldPosition: () => {
      if (groupRef.current) {
        const worldPosition = new THREE.Vector3();
        groupRef.current.getWorldPosition(worldPosition);
        return worldPosition;
      }
      return new THREE.Vector3();
    },
    getRotation: () => {
      if (groupRef.current) {
        return groupRef.current.rotation;
      }
      return new THREE.Euler();
    },
    getBoundingBox: () => {
      if (groupRef.current) {
        const bbox = new THREE.Box3().setFromObject(groupRef.current);
        return bbox;
      }
      return null;
    }
  }));

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01; // ゆっくり回転
    }
  });
  
  return (
    <group ref={groupRef}>
      {particles.map((particle) => (
        <mesh
          key={particle.id}
          position={particle.position}
          scale={[particle.size, particle.size, particle.size]}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial 
            color={0x4CAF50} 
            transparent 
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
});

export default PetBottleParticles;
