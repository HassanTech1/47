import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Model3D = ({ modelUrl, position = 'top', className = '' }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const modelRef = useRef(null);
  const rendererRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup with better perspective
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 4;
    camera.position.y = 0;

    // Renderer setup with better quality
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced Lighting for 3D effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Key light (main light from top)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Fill light (softer light from side)
    const fillLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    // Rim light (back light for depth)
    const rimLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    rimLight.position.set(0, -3, -5);
    scene.add(rimLight);

    // Point lights for sparkle
    const pointLight1 = new THREE.PointLight(0xFFFFFF, 1.5, 10);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xFFFFFF, 1.2, 10);
    pointLight2.position.set(-3, -3, 3);
    scene.add(pointLight2);

    // Load 3D Model
    const loader = new OBJLoader();
    loader.load(
      modelUrl,
      (object) => {
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.0 / maxDim; // Larger scale
        
        object.scale.multiplyScalar(scale);
        object.position.sub(center.multiplyScalar(scale));
        
        // Apply premium white/silver material with better 3D effect
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xFFFFFF,
              metalness: 0.95,
              roughness: 0.1,
              emissive: 0xCCCCCC,
              emissiveIntensity: 0.2,
              envMapIntensity: 1.5,
            });
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(object);
        modelRef.current = object;

        // Initial rotation for better 3D view
        object.rotation.y = position === 'top' ? 0.4 : -0.4;
        object.rotation.x = 0.1;

        // Scroll-based rotation animation synchronized
        gsap.to(object.rotation, {
          y: position === 'top' ? Math.PI * 3 : -Math.PI * 3,
          x: position === 'top' ? 0.5 : -0.5,
          scrollTrigger: {
            trigger: container.parentElement.parentElement,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    // Animation loop with auto-rotation
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Add subtle continuous rotation for 3D effect
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.003;
        modelRef.current.rotation.z = Math.sin(Date.now() * 0.0005) * 0.05;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!container) return;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }
      
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === container.parentElement?.parentElement) {
          trigger.kill();
        }
      });
    };
  }, [modelUrl, position]);

  return (
    <div 
      ref={containerRef} 
      className={`model-3d-container ${className}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    />
  );
};

export default Model3D;
