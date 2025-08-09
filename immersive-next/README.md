# 3D Immersive Web Experience

A walkable 3D web environment built with Next.js, Three.js, and React Three Fiber. Experience a dynamic ocean world with day/night cycles, physics-based movement, and immersive 3D interactions.

![3D Immersive Web](https://img.shields.io/badge/3D-Web%20Experience-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)
![Three.js](https://img.shields.io/badge/Three.js-0.179.1-green)
![React](https://img.shields.io/badge/React-19.1.0-blue)

## 🌟 Features

- **Walkable 3D Environment**: First-person movement with WASD controls and pointer lock
- **Dynamic Day/Night Cycle**: Realistic sun positioning and atmospheric lighting
- **Physics Simulation**: Collision detection and realistic movement using Cannon.js
- **Ocean Simulation**: Animated water with realistic wave effects
- **Mobile Support**: Touch controls for mobile devices
- **Performance Optimized**: Built with modern web technologies for smooth 60fps experience

## 🎮 Controls

### Desktop
- **W/A/S/D**: Move forward/left/backward/right
- **Mouse**: Look around (click to enable pointer lock)
- **Space**: Jump
- **ESC**: Exit pointer lock

### Mobile
- **Touch Controls**: On-screen joystick for movement
- **Touch & Drag**: Look around
- **Jump Button**: Tap to jump

## 🏗️ Architecture

### Core Components

#### `Scene.tsx` - Main 3D Scene Manager
- Orchestrates the entire 3D environment
- Manages day/night cycle timing
- Configures lighting, fog, and camera settings
- Integrates physics simulation

#### `Player.tsx` - First-Person Controller
- Handles keyboard/touch input for movement
- Implements physics-based character controller
- Manages camera positioning and smooth jumping
- Provides collision detection with environment

#### `DynamicSky.tsx` - Atmospheric Rendering
- Creates realistic sky gradients based on time of day
- Manages sun positioning throughout the cycle
- Provides atmospheric scattering effects

#### `Ocean.tsx` - Water Simulation
- Renders animated ocean surface
- Implements realistic wave patterns
- Responds to lighting conditions

#### `MobileControls.tsx` - Touch Interface
- Provides virtual joystick for mobile devices
- Touch-based camera controls
- Mobile-optimized UI elements

## 🛠️ Technology Stack

### Core Framework
- **[Next.js](https://nextjs.org/) v15.4.6** - React framework with server-side rendering and optimization
- **[React](https://reactjs.org/) v19.1.0** - Component-based UI library
- **[TypeScript](https://www.typescriptlang.org/) v5** - Type-safe JavaScript development

### 3D Graphics & Physics
- **[Three.js](https://threejs.org/) v0.179.1** - WebGL 3D graphics library
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber) v9.3.0** - React renderer for Three.js
- **[React Three Drei](https://github.com/pmndrs/drei) v10.6.1** - Useful helpers and abstractions for R3F
- **[React Three Cannon](https://github.com/pmndrs/use-cannon) v6.6.0** - Physics simulation using Cannon.js

### State Management & Utilities
- **[Zustand](https://zustand-demo.pmnd.rs/) v5.0.7** - Lightweight state management
- **[Noise.js](https://github.com/josephg/noisejs) v2.1.0** - Perlin noise generation
- **[Simplex Noise](https://github.com/jwagner/simplex-noise.js) v4.0.3** - Improved noise algorithms

### Styling & Development
- **[Tailwind CSS](https://tailwindcss.com/) v4** - Utility-first CSS framework
- **[PostCSS](https://postcss.org/)** - CSS post-processing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 3d-immersive-web/immersive-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm run start
```

## 📁 Project Structure

```
immersive-next/
├── app/                    # Next.js app directory
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Home page
├── src/
│   └── scene/              # 3D scene components
│       ├── components/     # Scene-specific components
│       │   ├── DynamicSky.tsx    # Sky and atmosphere
│       │   ├── Ocean.tsx         # Water simulation
│       │   ├── Player.tsx        # First-person controller
│       │   ├── MobileControls.tsx # Touch controls
│       │   └── Ground.tsx        # Basic ground plane
│       ├── store/          # State management
│       │   └── input.ts    # Input state store
│       └── Scene.tsx       # Main scene orchestrator
├── public/
│   └── assets/             # 3D models and textures
│       ├── *.gltf          # 3D models
│       ├── *.glb           # Binary 3D models
│       └── *.jpg/*.png     # Textures and materials
└── package.json
```

This README provides:

1. **Clear Overview**: What the project is and what it does
2. **Feature Highlights**: Key capabilities of your 3D environment
3. **Technology Stack**: Complete attribution to all libraries and tools
4. **Getting Started**: Step-by-step setup instructions
5. **Architecture**: How the codebase is organized and works
6. **Customization Guide**: How others can modify and extend it
7. **Proper Attribution**: Credits to all the amazing open-source projects you're using
8. **Professional Presentation**: Badges, structure, and formatting that looks great on GitHub

The README maintains proper accreditation for all the tools and libraries while explaining your codebase in a simple, accessible way. It will help other developers understand how to use, contribute to, and extend your immersive 3D web experience!

## 🎨 Adding 3D Content

### Supported Formats
- **GLTF/GLB**: Recommended for 3D models
- **Textures**: JPG, PNG, WebP
- **Audio**: MP3, WAV, OGG

### Blender Integration
For creating custom 3D content:

1. **Export Settings**:
   - Format: glTF 2.0 (.glb)
   - Transform: +Y Up
   - Apply Modifiers: ✓
   - Include Materials & Textures: ✓

2. **Optimization**:
   - Keep polygon count reasonable (< 5K triangles)
   - Texture size: 1024x1024 max
   - Use texture compression

## 🔧 Customization

### Environment Settings
Modify `Scene.tsx` to adjust:
- Lighting intensity and colors
- Fog distance and color
- Physics gravity and collision settings
- Camera field of view and positioning

### Player Movement
Customize `Player.tsx` for:
- Movement speed and acceleration
- Jump height and physics
- Camera height and smoothing
- Collision sphere size

### Visual Effects
Update component files to modify:
- Sky colors and gradients (`DynamicSky.tsx`)
- Ocean wave patterns (`Ocean.tsx`)
- UI styling (`MobileControls.tsx`)

## 🌊 Performance Optimization

- **Automatic LOD**: Models adapt quality based on distance
- **Frustum Culling**: Only render visible objects
- **Shadow Optimization**: Configurable shadow map sizes
- **Mobile Optimization**: Reduced quality settings for mobile devices
- **Asset Preloading**: Critical assets loaded on startup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source. Please check the license file for details.

## 🙏 Acknowledgments

### Core Technologies
- **[Three.js](https://threejs.org/)** - The foundation of 3D web graphics
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** by [Poimandres](https://github.com/pmndrs) - Revolutionary React integration for Three.js
- **[React Three Drei](https://github.com/pmndrs/drei)** - Essential helpers and utilities
- **[Cannon.js](https://github.com/schteppe/cannon.js/)** - Lightweight 3D physics engine
- **[Next.js](https://nextjs.org/)** by [Vercel](https://vercel.com/) - The React framework for production

### Special Thanks
- **Poimandres Collective** - For the incredible React Three ecosystem
- **Three.js Contributors** - For making 3D accessible on the web
- **Vercel Team** - For Next.js and deployment platform
- **Open Source Community** - For all the amazing libraries that make this possible

---

**Built with ❤️ using modern web technologies**

*Experience the future of web interactions in 3D*
