import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MAX_BUBBLES = 50;

function Bubble({ bubble, onFadeOut }) {
  const ref = useRef();
  const [opacity, setOpacity] = useState(0.8);
  const [isPopping, setIsPopping] = useState(false);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y += bubble.velocity;
      const newOpacity = opacity - bubble.opacitySpeed;
      setOpacity(newOpacity);
      ref.current.material.opacity = newOpacity;
      if (newOpacity <= 0 || ref.current.position.y > 5) {
        onFadeOut(bubble.id);
      }
    }
    if (!ref.current) return;

    if (isPopping) {
      ref.current.scale.x += 0.1;
      ref.current.scale.y += 0.1;
      ref.current.scale.z += 0.1;

      const newOpacity = ref.current.material.opacity - 0.05;
      ref.current.material.opacity = newOpacity;

      if (newOpacity <= 0 || ref.current.scale.x >= 2) {
        onFadeOut(bubble.id); //弾ける
      }
    } else {
      // 通常の上昇 & フェードアウト
      ref.current.position.y += bubble.velocity;
      const newOpacity = opacity - bubble.opacitySpeed;
      setOpacity(newOpacity);
      ref.current.material.opacity = newOpacity;

      if (newOpacity <= 0 || ref.current.position.y > 5) {
        onFadeOut(bubble.id);
      }
    }
  });

  return (
    <mesh
      ref={ref}
      position={bubble.position}
      onPointerDown={() => setIsPopping(true)} // ← クリックで削除
    >
      <sphereGeometry args={[bubble.size, 16, 16]} />
      <meshBasicMaterial color="white" transparent opacity={opacity} />
    </mesh>
  );
}

const Bubbles = () => {
  const [renderBubbles, setRenderBubbles] = useState([]); // 表示用
  const bubblesRef = useRef([]); // 実データ保持

  useFrame(() => {
    // 泡追加
    if (Math.random() < 0.1 && bubblesRef.current.length < MAX_BUBBLES) {
      const newBubble = {
        id: Math.random().toString(36),
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 15,
          -2.5,
          (Math.random() - 0.5) * 2
        ),
        velocity: Math.random() * 0.02 + 0.01,
        opacitySpeed: Math.random() * 0.002 + 0.001,
        size: Math.random() * 0.1 + 0.07,
      };

      bubblesRef.current.push(newBubble);
      setRenderBubbles([...bubblesRef.current]); // 強制再描画
    }
  });

  const handleFadeOut = (id) => {
    bubblesRef.current = bubblesRef.current.filter((b) => b.id !== id);
    setRenderBubbles([...bubblesRef.current]);
  };

  return (
    <>
      {renderBubbles.map((bubble) => (
        <Bubble key={bubble.id} bubble={bubble} onFadeOut={handleFadeOut} />
      ))}
    </>
  );
};

export default Bubbles;
