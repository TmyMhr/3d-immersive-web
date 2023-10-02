
import { Canvas } from "@react-three/fiber"
import { Sky, Stars, Cloud, PointerLockControls, Stats } from "@react-three/drei"
import { Physics } from "@react-three/cannon"
import { Ground } from "./Ground"
import { Player } from "./Player"

import { Cubes } from "./Cube"
import { UserInterFaceTest } from "./userInterfaceTest"
// refactored and updated to remove use-cannon and drei. Much more utilities available now. still need to fix some small lighting issues but almost there. 


export default function App() {
  return (
    <Canvas shadows gl={{ alpha: false }} camera={{ fov: 45 }}>

      <Stats /> 
      <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25}  /> 
      <Cloud segments={40} bounds={[10, 2, 2]} volume={10} color="orange" position={[100, 60, 230]} />
      <Cloud seed={1} scale={2} volume={5} color="hotpink" fade={100} position={[80, 55, 0]} />

      <Stars />
      <ambientLight intensity={0.5} />
      <pointLight castShadow intensity={0.5} position={[100, 100, 100]} />
      <Physics gravity={[0, -30, 0]}>
        <Ground />
        <Player />
      <UserInterFaceTest />
        <Cubes />  
      </Physics>
      <PointerLockControls />
    </Canvas>
  )
}
