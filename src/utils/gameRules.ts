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
    name: "Even Indices",
    description: "Flash all squares with even indices",
    sequenceLength: 13,
    speed: 800,
  },
  {
    id: 2,
    name: "Diagonals",
    description: "Flash all diagonal squares",
    sequenceLength: 9,
    speed: 700,
  },
  {
    id: 3,
    name: "Prime Numbers",
    description: "Flash squares whose index is prime",
    sequenceLength: 9,
    speed: 600,
  },
  {
    id: 4,
    name: "Center Cluster",
    description: "Flash center and its 4 neighbors",
    sequenceLength: 5,
    speed: 500,
  },
  {
    id: 5,
    name: "Formula Challenge",
    description: "Flash where (row + col) % 3 === 0",
    sequenceLength: 9,
    speed: 450,
  },
];

/**
 * Check if a number is prime
 */
const isPrime = (num: number): boolean => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

/**
 * Generate a pattern-based sequence for the given level
 */
export const generateSequence = (levelId: number): number[] => {
  const gridSize = 5;
  const sequence: number[] = [];

  switch (levelId) {
    case 1: // Even indices
      for (let i = 0; i < 25; i++) {
        if (i % 2 === 0) sequence.push(i);
      }
      break;

    case 2: // Diagonals
      for (let i = 0; i < 25; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        if (row === col || row + col === 4) {
          sequence.push(i);
        }
      }
      break;

    case 3: // Prime numbers
      for (let i = 0; i < 25; i++) {
        if (isPrime(i)) sequence.push(i);
      }
      break;

    case 4: // Center cluster
      const center = 12;
      sequence.push(7, 11, center, 13, 17); // top, left, center, right, bottom
      break;

    case 5: // Formula: (row + col) % 3 === 0
      for (let i = 0; i < 25; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        if ((row + col) % 3 === 0) {
          sequence.push(i);
        }
      }
      break;

    default:
      break;
  }

  return sequence;
};
