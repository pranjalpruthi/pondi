import React, { useEffect, useRef, useState, useMemo } from "react"; // Added React import
import { Color,  Vector3, WebGLRenderer, Spherical, MathUtils } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei"; // Removed Html import
import countries from "@/data/globe.json";
// Removed Badge import

// Simplified module declaration for three-globe
declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: any;
  }
}

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3; // Adjusted for smoother visual effect
const aspect = 1.2;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string | ((feature: any) => string);
  polygonStrokeColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  pointLightIntensity?: number;
  arcTime?: number;
  arcLength?: number;
  arcColor?: string;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enableWebGPU?: boolean;
  // Camera settings for zoom level
  cameraZ?: number;
  cameraFov?: number;
  // Ring animation settings
  ringPropagationSpeed?: number;
  // Control settings
  enableZoom?: boolean;
  noBoundaries?: boolean;
};

import type { CountryCenterData } from "@/components/country-display"; // Use type-only import

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[]; // Arc data
  targetCoordinates?: { lat: number; lng: number };
  selectedCenter?: CountryCenterData | null; // Use selectedCenter object
  // highlightedCenter?: string; // Remove this
  controlsRef?: React.RefObject<any>;
}

// Update Globe component props
export function Globe({ globeConfig, data, targetCoordinates, selectedCenter, controlsRef }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const { camera } = useThree();
  const [globeData, setGlobeData] = useState<
    | {
        size: number;
        order: number;
        color: (t: number) => string;
        lat: number;
        lng: number;
        name?: string;
        highlighted?: boolean;
      }[]
    | null
  >(null);

  // Enhanced default props with much whiter appearance
  const configStr = JSON.stringify(globeConfig);
  const defaultProps = useMemo(() => {
    // Create a base configuration with defaults
    const baseConfig = {
      pointSize: 1.0, 
      globeColor: "#ffffff", // Pure white
      showAtmosphere: true,
      atmosphereColor: "#ffffff", // White atmosphere
      atmosphereAltitude: 0.12, // Thinner atmosphere
      emissive: "#ffffff", 
      emissiveIntensity: 1.0, // Maximum intensity
      shininess: 1.2, // Extra high shininess
      polygonColor: (_feature: any) => { // Prefixed feature
        // Pure white for all countries
        return "#ffffff";
      },
      polygonStrokeColor: "#ffffff", // White borders
      ambientLight: "#ffffff",
      directionalLeftLight: "#ffffff",
      directionalTopLight: "#ffffff",
      pointLight: "#ffffff", // White light
      pointLightIntensity: 1.5, // Brighter point light
      arcTime: 600, 
      arcLength: 0.85,
      arcColor: "#ffffff", // White arcs
      rings: 3, 
      maxRings: 3, 
      autoRotate: true,
      autoRotateSpeed: 0.3, 
      enableWebGPU: true, 
      cameraZ: 380, 
      cameraFov: 32, 
    };

    // Merge with provided configuration
    return { ...baseConfig, ...globeConfig };
  }, [configStr]); // Use stringified config to ensure changes are detected

  // Create point data with highlighted center
  const _buildData = useMemo(() => {
    if (!data) return null;
    
    const arcs = data;
    let points = []; // Initialize points array
    // Generate points based on arc start/end and check against selectedCenter coordinates
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      const rgb = hexToRgb(arc.color);
      
      if (rgb) {
        // Check if start point matches selected center
        const isStartHighlighted = selectedCenter?.coordinates[1] === arc.startLat && selectedCenter?.coordinates[0] === arc.startLng;
        points.push({
          size: defaultProps.pointSize * (isStartHighlighted ? 1.2 : 1), // Adjusted highlight multiplier
          order: arc.order,
          color: (t: number) => {
            const baseOpacity = isStartHighlighted ? 0.98 : 0.7; // Higher opacity for highlighted
            if (isStartHighlighted) {
              // Pure Bright Green color for highlighted points
              return `rgba(0, 255, 0, ${baseOpacity - t * 0.5})`; 
            } else {
              // Original color for non-highlighted points
              return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${baseOpacity - t * 0.5})`;
            }
          },
          lat: arc.startLat,
          lng: arc.startLng,
          // name: centerName, // Name generation is no longer needed for highlighting
          highlighted: isStartHighlighted // Keep highlighted flag if needed elsewhere
        });
        
        // Check if end point matches selected center
        const isEndHighlighted = selectedCenter?.coordinates[1] === arc.endLat && selectedCenter?.coordinates[0] === arc.endLng;
        points.push({
          size: defaultProps.pointSize * (isEndHighlighted ? 1.2 : 1), // Adjusted highlight multiplier
          order: arc.order,
          color: (t: number) => {
            const baseOpacity = isEndHighlighted ? 0.98 : 0.7; // Higher opacity for highlighted
            if (isEndHighlighted) {
              // Pure Bright Green color for highlighted points
              return `rgba(0, 255, 0, ${baseOpacity - t * 0.5})`;
            } else {
              // Original color for non-highlighted points
              return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${baseOpacity - t * 0.5})`;
            }
          },
          lat: arc.endLat,
          lng: arc.endLng,
          // name: endCenterName, // Name generation is no longer needed for highlighting
          highlighted: isEndHighlighted // Keep highlighted flag if needed elsewhere
        });
      }
    }
    // Filter duplicate points *after* the loop finishes generating all points
    const filteredPoints = points.filter(
      (v, i, a) =>
        a.findIndex((v2) =>
          ["lat", "lng"].every( // Ensure we compare both lat and lng for uniqueness
            (k) => v2[k as "lat" | "lng"] === v[k as "lat" | "lng"]
          )
        ) === i
    );
    
    return filteredPoints;
  }, [data, defaultProps.pointSize, selectedCenter]); // Depend on selectedCenter now

  // Helper function to get name from coordinates - can be removed or kept if used elsewhere
  // function getNameFromCoordinates(lat: number, lng: number) { ... }


  useEffect(() => {
    // Set globe data when it changes
    if (_buildData) {
      setGlobeData(_buildData);
    }
  }, [_buildData]);

  useEffect(() => {
    if (globeRef.current) {
      _buildMaterial();
    }
  }, [globeRef.current, defaultProps.globeColor, defaultProps.emissive, defaultProps.emissiveIntensity, defaultProps.shininess]);

  const _buildMaterial = () => {
    if (!globeRef.current) return;
    const globeMaterial = globeRef.current.globeMaterial() as any;
    
    // Set to pure white with maximum brightness
    globeMaterial.color = new Color(defaultProps.globeColor);
    globeMaterial.emissive = new Color(defaultProps.emissive);
    globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity;
    globeMaterial.shininess = defaultProps.shininess;
    
    // Add these properties for extra brightness
    globeMaterial.opacity = 1.0;
    globeMaterial.transparent = true;
    globeMaterial.reflectivity = 1.0;
    globeMaterial.specular = new Color(0xffffff);
  };

  useEffect(() => {
    if (globeRef.current && globeData) {
      // Configure globe visualization
      globeRef.current
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.4) // Reduced margin for subtle borders
        .showAtmosphere(defaultProps.showAtmosphere)
        .atmosphereColor(defaultProps.atmosphereColor)
        .atmosphereAltitude(defaultProps.atmosphereAltitude)
        .hexPolygonColor((feature: any): string => {
          // Use the polygonColor function if it's a function, otherwise use the string value
          return typeof defaultProps.polygonColor === 'function' 
            ? defaultProps.polygonColor(feature) 
            : defaultProps.polygonColor;
        })
        .polygonStrokeColor((): string => defaultProps.polygonStrokeColor);
        
      startAnimation();
    }
  }, [globeData, defaultProps, data]);

  const startAnimation = () => {
    if (!globeRef.current || !data) return;

    // Configure arcs with slightly thinner lines
    globeRef.current
      .arcsData(data)
      .arcStartLat((d: any) => (d as Position).startLat)
      .arcStartLng((d: any) => (d as Position).startLng)
      .arcEndLat((d: any) => (d as Position).endLat)
      .arcEndLng((d: any) => (d as Position).endLng)
      // Assign color and store it on the data object for use in dash properties
      .arcColor((d: any) => {
        const color = Math.random() > 0.5 ? "#E91E63" : "#FFEB3B"; // Randomly Pink or Yellow
        (d as any)._assignedColor = color; // Store the assigned color
        return color;
      })
      .arcAltitude((d: any) => (d as Position).arcAlt * 0.8) // Slightly lower altitude
      .arcStroke(0.2) // Keep it relatively thin
      // Adjust dash length based on color: Pink = short dash, Yellow = long dash
      .arcDashLength((d: any) => {
        const color = (d as any)._assignedColor;
        return color === "#E91E63" ? defaultProps.arcLength * 0.3 : defaultProps.arcLength * 1.5;
      })
      .arcDashInitialGap((d: any) => (d as Position).order * 0.2) // Even less initial gap variation
      // Adjust dash gap based on color: Pink = large gap, Yellow = small gap
      .arcDashGap((d: any) => {
        const color = (d as any)._assignedColor;
        return color === "#E91E63" ? 3 : 1; // Larger gap for pink shooting stars
      })
      .arcDashAnimateTime((): number => defaultProps.arcTime * 1.2); // Slightly slower animation for smoother flow

    // Configure points
    if (globeData) {
      globeRef.current
        .pointsData(globeData)
        .pointColor((e: any) => e.color(0.4))
        .pointsMerge(true)
        .pointAltitude(0.0)
        .pointRadius((e: any) => e.highlighted ? e.size * 1.4 : e.size); 
    }

    // Important: Configure rings with exact values from config
    globeRef.current
      .ringsData([]) // Initially empty, will be populated by interval
      .ringColor((e: any) => e.color(0.4))
      .ringMaxRadius(defaultProps.maxRings)
      // Use the configured speed or fall back to the constant
      .ringPropagationSpeed(defaultProps.ringPropagationSpeed || RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(defaultProps.arcTime / defaultProps.rings); // Adjusted formula for proper ring timing
  };

  useEffect(() => {
    // Animate rings with less frequency for a cleaner look
    if (!globeRef.current || !globeData || globeData.length === 0) return;
    
    // Clear any existing intervals when effect reruns
    const ringInterval = setInterval(() => {
      if (!globeRef.current || !globeData || globeData.length === 0) return;
      
      // Determine how many rings to show based on config
      const maxActiveRings = Math.min(defaultProps.rings, globeData.length);
      const numbersOfRings = genRandomNumbers(
        0,
        globeData.length - 1,
        maxActiveRings // Use the exact number from config
      );
      
      globeRef.current.ringsData(
        globeData.filter((_d, i) => numbersOfRings.includes(i)) // Prefixed d
      );
    }, 2500); // Increased interval for less frequent animations
    
    return () => clearInterval(ringInterval);
  }, [globeData, defaultProps.rings, defaultProps.maxRings]); // Add dependency on ring config

  // Effect for click navigation with smooth animation
  useEffect(() => {
    if (targetCoordinates && controlsRef && controlsRef.current) {
      // Convert lat/lng to 3D coordinates
      const phi = MathUtils.degToRad(90 - targetCoordinates.lat);
      const theta = MathUtils.degToRad(targetCoordinates.lng);
      
      // Calculate distance based on camera's current position
      const distance = camera.position.length();
      
      // Create a new target position
      const position = new Vector3();
      position.setFromSpherical(new Spherical(distance, phi, theta));
      
      // Set the camera target
      controlsRef.current.target.set(0, 0, 0);
      
      // Animate to the new position
      const duration = 1800; // Increased for smoother transition
      const startPosition = camera.position.clone();
      const startTime = Date.now();
      
      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const easeProgress = easeInOutCubic(progress);
        
        // Interpolate camera position
        camera.position.lerpVectors(startPosition, position, easeProgress);
        
        // Continue animation until complete
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, [targetCoordinates, camera]);

  // Easing function for smooth animation
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  return (
    <>
      <threeGlobe ref={globeRef} />
      {/* Removed HTML badge rendering */}
    </>
  );
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();
  
  useEffect(() => {
    // Optimize WebGL renderer
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffffff, 0); // White clear color
    
    if (gl instanceof WebGLRenderer) {
      gl.shadowMap.enabled = true;
      gl.outputColorSpace = 'srgb';
      gl.toneMappingExposure = 1.2; // Increase exposure for brighter scene
      
      // Enable WebGPU if available
      if (
        'isWebGPUSupported' in navigator && 
        (navigator as any).isWebGPUSupported && 
        (document as any).createElement('canvas').getContext('webgpu')
      ) {
        console.log('WebGPU is supported and enabled');
      }
    }
  }, [gl, size]);
  
  return null;
}

export function World(props: WorldProps) {
  const { globeConfig } = props;
  const controlsRef = useRef<any>(null);
  
  // Use the latest configuration values
  const configStr = JSON.stringify(globeConfig);
  const config = useMemo(() => {
    const baseConfig = {
      // Default camera settings
      cameraFov: 32,
      cameraZ: 380,
      // Default lighting
      ambientLight: "#ffffff",
      directionalLeftLight: "#ffffff",
      directionalTopLight: "#ffffff",
      pointLight: "#E91E63",
      pointLightIntensity: 1.2,
      // Default controls
      autoRotate: true,
      autoRotateSpeed: 0.3,
      enableZoom: true,
      noBoundaries: false,
    };
    
    // Merge with provided configuration
    return { ...baseConfig, ...globeConfig };
  }, [configStr]);

  // Determine canvas style based on noBoundaries setting
  const canvasStyle = config.noBoundaries 
    ? { width: '100%', height: '100%', overflow: 'visible' } 
    : { width: '100%', height: '100%', position: 'absolute' as const, overflow: 'visible' };

  return (
    <Canvas 
      camera={{ 
        fov: config.cameraFov, 
        aspect, 
        near: 150, 
        far: 2000, 
        position: [0, 0, config.cameraZ] 
      }}
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
      style={canvasStyle}
      className="overflow-visible"
    >
      <fog attach="fog" args={[0xffffff, 400, 2000]} />
      <WebGLRendererConfig />
      
      <ambientLight color={config.ambientLight} intensity={1.2} />
      <directionalLight
        color={config.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
        intensity={1.0}
        castShadow
      />
      <directionalLight
        color={config.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
        intensity={1.0}
      />
      <pointLight
        color={config.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={config.pointLightIntensity || 1.5}
        distance={1000}
      />
      
      <Globe {...props} controlsRef={controlsRef} />
      
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={config.enableZoom}
        minDistance={config.cameraZ - 150} 
        maxDistance={config.cameraZ + 150} 
        zoomSpeed={0.5}
        rotateSpeed={0.35}
        autoRotateSpeed={config.autoRotateSpeed}
        autoRotate={config.autoRotate}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export function hexToRgb(hex: string) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (_m, r, g, b) { // Prefixed m
    return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr: number[] = [];
  if (min > max || count <= 0) return arr;
  
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min + 1)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
    if (arr.length >= (max - min + 1) && arr.length < count) break;
  }
  
  return arr;
}
