import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  Center,
  OrbitControls,
  Sparkles,
  shaderMaterial,
  useGLTF,
  useTexture,
} from "@react-three/drei";

import portalVertexShader from "./shaders/portal/vertex.glsl";
import portalFragmentShader from "./shaders/portal/fragment.glsl";
import { extend } from "@react-three/fiber";

const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color("#ffffff"),
    uColorEnd: new THREE.Color("#000000"),
  },
  portalVertexShader,
  portalFragmentShader
);
extend({ PortalMaterial });

export default function App() {
  const portalShaderRef = useRef();
  const portalModal = useGLTF("./model/portal.glb");
  const { nodes } = portalModal;
  const portalTexture = useTexture("./model/baked.jpg");
  portalTexture.flipY = false;

  useFrame((state, delta) => {
    // portalShaderRef.current.uniforms.uTime.value += delta;
    portalShaderRef.current.uTime += delta;
  });

  return (
    <>
      <color args={["#000000"]} attach="background" />
      <OrbitControls makeDefault />

      <Center>
        <mesh geometry={nodes.baked.geometry}>
          <meshBasicMaterial map={portalTexture} />
        </mesh>
        <mesh
          geometry={nodes.poleLightA.geometry}
          position={nodes.poleLightA.position}
        >
          <meshBasicMaterial color="#ffffe5" />
        </mesh>
        <mesh
          geometry={nodes.poleLightB.geometry}
          position={nodes.poleLightB.position}
        >
          <meshBasicMaterial color="#ffffe5" />
        </mesh>
        <mesh
          geometry={nodes.portalLight.geometry}
          position={nodes.portalLight.position}
          rotation={nodes.portalLight.rotation}
        >
          <portalMaterial ref={portalShaderRef} />
          {/* <shaderMaterial
            ref={portalShaderRef}
            vertexShader={portalVertexShader}
            fragmentShader={portalFragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uColorStart: { value: new THREE.Color("#ffffff") },
              uColorEnd: { value: new THREE.Color("#000000") },
            }}
          /> */}
        </mesh>

        <Sparkles
          size={6}
          scale={[4, 2, 4]}
          position-y={1}
          speed={0.2}
          count={40}
        />
      </Center>

      {/* <mesh geometry={nodes.baked.geometry} /> */}
      {/* <mesh */}
      {/* <primitive object={portalModal.scene} /> */}
    </>
  );
}
