import { useEffect, useRef, useState } from "react";
import ThreeGlobe from "three-globe";
import { useThree, Canvas, extend } from "@react-three/fiber";
import countries from "../../data/globe.json";
import PropTypes from 'prop-types';
import { Color, Scene, Fog, PerspectiveCamera } from "three";
import { OrbitControls } from "@react-three/drei";
import * as THREE from 'three';



extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

let numbersOfRings = [0];

export function Globe({ globeConfig, data }) {
  const [globeData, setGlobeData] = useState(null);

  const globeRef = useRef(null);

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  useEffect(() => {
    if (globeRef.current) {
      _buildData();
      _buildMaterial();
    }
  }, [globeRef.current]);

  const _buildMaterial = () => {
    if (!globeRef.current) return;

    const globeMaterial = globeRef.current.globeMaterial();
    globeMaterial.color = new Color(globeConfig.globeColor);
    globeMaterial.emissive = new Color(globeConfig.emissive);
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
    globeMaterial.shininess = globeConfig.shininess || 0.9;
  };

  const _buildData = () => {
    const arcs = data;
    let points = [];
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      const rgb = hexToRgb(arc.color);
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }

    // remove duplicates for same lat and lng
    const filteredPoints = points.filter(
      (v, i, a) =>
        a.findIndex((v2) =>
          ["lat", "lng"].every((k) => v2[k] === v[k])
        ) === i
    );

    setGlobeData(filteredPoints);
  };

  useEffect(() => {
    if (globeRef.current && globeData) {
      globeRef.current
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(defaultProps.showAtmosphere)
        .atmosphereColor(defaultProps.atmosphereColor)
        .atmosphereAltitude(defaultProps.atmosphereAltitude)
        .hexPolygonColor(() => {
          return defaultProps.polygonColor;
        });
      startAnimation();
    }
  }, [globeData]);

  const startAnimation = () => {
    if (!globeRef.current || !globeData) return;

    globeRef.current
      .arcsData(data)
      .arcStartLat((d) => d.startLat * 1)
      .arcStartLng((d) => d.startLng * 1)
      .arcEndLat((d) => d.endLat * 1)
      .arcEndLng((d) => d.endLng * 1)
      .arcColor((e) => e.color)
      .arcAltitude((e) => {
        return e.arcAlt * 1;
      })
      .arcStroke(() => {
        return [0.32, 0.28, 0.3][Math.round(Math.random() * 2)];
      })
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap((e) => e.order * 1)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime);

    globeRef.current
      .pointsData(data)
      .pointColor((e) => e.color)
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2);

    globeRef.current
      .ringsData([])
      .ringColor((e) => (t) => e.color(t))
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(
        (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings
      );
  };

  useEffect(() => {
    if (!globeRef.current || !globeData) return;

    const interval = setInterval(() => {
      if (!globeRef.current || !globeData) return;
      numbersOfRings = genRandomNumbers(
        0,
        data.length,
        Math.floor((data.length * 4) / 5)
      );

      globeRef.current.ringsData(
        globeData.filter((d, i) => numbersOfRings.includes(i))
      );
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [globeRef.current, globeData]);

  return (
    <>
      <threeGlobe ref={globeRef} />
    </>
  );
}

Globe.propTypes = {
    globeConfig: PropTypes.shape({
      pointSize: PropTypes.number,
      globeColor: PropTypes.string,
      showAtmosphere: PropTypes.bool,
      atmosphereColor: PropTypes.string,
      atmosphereAltitude: PropTypes.number,
      emissive: PropTypes.string,
      emissiveIntensity: PropTypes.number,
      shininess: PropTypes.number,
      polygonColor: PropTypes.string,
      ambientLight: PropTypes.string,
      directionalLeftLight: PropTypes.string,
      directionalTopLight: PropTypes.string,
      pointLight: PropTypes.string,
      arcTime: PropTypes.number,
      arcLength: PropTypes.number,
      rings: PropTypes.number,
      maxRings: PropTypes.number,
      initialPosition: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
      autoRotate: PropTypes.bool,
      autoRotateSpeed: PropTypes.number,
    }),
    data: PropTypes.arrayOf(PropTypes.shape({
      order: PropTypes.number.isRequired,
      startLat: PropTypes.number.isRequired,
      startLng: PropTypes.number.isRequired,
      endLat: PropTypes.number.isRequired,
      endLng: PropTypes.number.isRequired,
      arcAlt: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    })).isRequired,
  };

function Lights({ globeConfig }) {
  const { scene } = useThree();

  useEffect(() => {
    const ambientLight = new THREE.AmbientLight(globeConfig.ambientLight, 0.6);
    const directionalLight1 = new THREE.DirectionalLight(globeConfig.directionalLeftLight);
    directionalLight1.position.set(-400, 100, 400);
    const directionalLight2 = new THREE.DirectionalLight(globeConfig.directionalTopLight);
    directionalLight2.position.set(-200, 500, 200);
    const pointLight = new THREE.PointLight(globeConfig.pointLight, 0.8);
    pointLight.position.set(-200, 500, 200);

    scene.add(ambientLight, directionalLight1, directionalLight2, pointLight);

    return () => {
      scene.remove(ambientLight, directionalLight1, directionalLight2, pointLight);
    };
  }, [scene, globeConfig]);

  return null;
}

Lights.propTypes = {
  globeConfig: PropTypes.shape({
    ambientLight: PropTypes.string.isRequired,
    directionalLeftLight: PropTypes.string.isRequired,
    directionalTopLight: PropTypes.string.isRequired,
    pointLight: PropTypes.string.isRequired,
  }).isRequired,
};

export function World({ globeConfig, data }) {
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);

  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, aspect, 180, 1800)}>
      <Lights globeConfig={globeConfig} />
      <Globe globeConfig={globeConfig} data={data} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={1}
        autoRotate={true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

World.propTypes = {
  globeConfig: PropTypes.shape({
    ambientLight: PropTypes.string.isRequired,
    directionalLeftLight: PropTypes.string.isRequired,
    directionalTopLight: PropTypes.string.isRequired,
    pointLight: PropTypes.string.isRequired,
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    order: PropTypes.number.isRequired,
    startLat: PropTypes.number.isRequired,
    startLng: PropTypes.number.isRequired,
    endLat: PropTypes.number.isRequired,
    endLng: PropTypes.number.isRequired,
    arcAlt: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
  })).isRequired,
};


export function hexToRgb(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
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

hexToRgb.propTypes = {
    hex: PropTypes.string.isRequired,
};
  
export function genRandomNumbers(min, max, count) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
}
genRandomNumbers.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
  };