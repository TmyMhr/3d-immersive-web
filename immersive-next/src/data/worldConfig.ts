export interface IslandConfig {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  type: 'tropical' | 'rocky' | 'grassy' | 'desert';
  hasTrees: boolean;
  hasRocks: boolean;
}

export interface CollectibleConfig {
  id: string;
  position: [number, number, number];
  color: string;
  size: number;
}

export const islands: IslandConfig[] = [
  {
    id: 'main-tropical',
    position: [0, 0, 0],
    size: [35, 4, 35],
    type: 'tropical',
    hasTrees: true,
    hasRocks: true
  },
  {
    id: 'rocky-mountain',
    position: [60, -0.5, 25],
    size: [18, 6, 18],
    type: 'rocky',
    hasTrees: false,
    hasRocks: true
  },
  {
    id: 'grassy-meadow',
    position: [-45, -1, -35],
    size: [25, 3, 15],
    type: 'grassy',
    hasTrees: true,
    hasRocks: false
  },
  {
    id: 'desert-oasis',
    position: [30, 0.5, -50],
    size: [15, 2.5, 20],
    type: 'desert',
    hasTrees: false,
    hasRocks: true
  },
  {
    id: 'small-atoll',
    position: [-25, -0.5, 40],
    size: [12, 2, 12],
    type: 'tropical',
    hasTrees: true,
    hasRocks: false
  }
];

export const collectibles: CollectibleConfig[] = [
  {
    id: 'c1',
    position: [0, 6, 0],
    color: "#ff6b6b",
    size: 0.6
  },
  {
    id: 'c2',
    position: [60, 8, 25],
    color: "#4ecdc4",
    size: 0.7
  },
  {
    id: 'c3',
    position: [-45, 4, -35],
    color: "#45b7d1",
    size: 0.5
  },
  {
    id: 'c4',
    position: [30, 4, -50],
    color: "#96ceb4",
    size: 0.6
  },
  {
    id: 'c5',
    position: [-25, 3, 40],
    color: "#feca57",
    size: 0.5
  },
  {
    id: 'c6',
    position: [15, 5, 15],
    color: "#ff9ff3",
    size: 0.6
  }
];
