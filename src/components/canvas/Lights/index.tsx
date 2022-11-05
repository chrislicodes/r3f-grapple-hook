const Lights = () => {
  return (
    <>
      <directionalLight
        castShadow
        position={[3, 15, 1]}
        intensity={1.5}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-top={20}
        shadow-camera-right={20}
        shadow-camera-bottom={-20}
        shadow-camera-left={-20}
      />
      <ambientLight intensity={0.5} />
    </>
  );
};

export default Lights;
