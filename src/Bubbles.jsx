import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const MAX_BUBBLES = 100;

function Bubble({ bubble, onFadeOut, mousePosition }) {
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

    // マウスカーソルとの衝突判定
    if (mousePosition) {
      const bubblePosition = ref.current.position;
      const bubbleSize = bubble.size;
      
      // マウス位置とバブルの距離を計算
      const distance = bubblePosition.distanceTo(mousePosition);
      const collisionDistance = bubbleSize + 0.5; // マウスカーソルの範囲を少し大きく
      
      if (distance < collisionDistance && !isPopping) {
        setIsPopping(true);
      }
    }

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
  const [mousePosition, setMousePosition] = useState(new THREE.Vector3());
  const { camera, gl } = useThree();

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

  // マウス移動イベントハンドラー
  const handleMouseMove = (event) => {
    const rect = gl.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // マウス位置を3D空間に変換
    const mouse = new THREE.Vector3(x, y, 0.5);
    mouse.unproject(camera);
    
    // カメラの位置からマウス方向にレイを飛ばして、Z=0の平面との交点を求める
    const direction = mouse.sub(camera.position).normalize();
    const distance = -camera.position.z / direction.z;
    const worldPosition = camera.position.clone().add(direction.multiplyScalar(distance));
    
    setMousePosition(worldPosition);
  };

  // マウスイベントリスナーを設定
  React.useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gl, camera]);

  const handleFadeOut = (id) => {
    bubblesRef.current = bubblesRef.current.filter((b) => b.id !== id);
    setRenderBubbles([...bubblesRef.current]);
  };

  return (
    <>
      {renderBubbles.map((bubble) => (
        <Bubble key={bubble.id} bubble={bubble} onFadeOut={handleFadeOut} mousePosition={mousePosition} />
      ))}
    </>
  );
};

export default Bubbles;
