/**
 * Sequence Memory Game - Generate random sequences for each level
 */

export interface Level {
  id: number;
  name: string;
  description: string;
  sequenceLength: number;
  speed: number; // milliseconds between flashes
}

export const levels: Level[] = [
  {
    id: 1,
    name: "Warm Up",
    description: "Remember a simple 3-step sequence",
    sequenceLength: 3,
    speed: 800,
  },
  {
    id: 2,
    name: "Getting Tricky",
    description: "Now try 4 steps...",
    sequenceLength: 4,
    speed: 700,
  },
  {
    id: 3,
    name: "Memory Challenge",
    description: "5 steps and getting faster!",
    sequenceLength: 5,
    speed: 600,
  },
  {
    id: 4,
    name: "Expert Mode",
    description: "6 steps - stay focused!",
    sequenceLength: 6,
    speed: 500,
  },
  {
    id: 5,
    name: "Master Level",
    description: "7 steps at high speed!",
    sequenceLength: 7,
    speed: 450,
  },
  {
    id: 6,
    name: "Grandmaster",
    description: "8 steps - this is intense!",
    sequenceLength: 8,
    speed: 400,
  },
];

/**
 * Generate a random sequence of square indices for the given level
 */
export const generateSequence = (levelId: number): number[] => {
  const level = levels.find((l) => l.id === levelId);
  if (!level) return [];

  const sequence: number[] = [];
  for (let i = 0; i < level.sequenceLength; i++) {
    sequence.push(Math.floor(Math.random() * 25));
  }
  return sequence;
};
