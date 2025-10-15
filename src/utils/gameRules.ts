/**
 * Game rules define which squares should flash for each level
 */

export interface Level {
  id: number;
  name: string;
  description: string;
  hint: string;
  rule: (index: number) => boolean;
}

// Helper function to check if a number is prime
const isPrime = (num: number): boolean => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// Convert 1D index to 2D coordinates (row, col)
const indexToCoords = (index: number): { row: number; col: number } => {
  return {
    row: Math.floor(index / 5),
    col: index % 5,
  };
};

export const levels: Level[] = [
  {
    id: 1,
    name: "Even Indices",
    description: "Watch carefully and memorize the pattern...",
    hint: "Look for squares at even positions (0, 2, 4, 6...)",
    rule: (index: number) => index % 2 === 0,
  },
  {
    id: 2,
    name: "Diagonals",
    description: "The pattern is getting more complex...",
    hint: "Focus on the diagonal lines across the grid",
    rule: (index: number) => {
      const { row, col } = indexToCoords(index);
      return row === col || row + col === 4;
    },
  },
  {
    id: 3,
    name: "Prime Numbers",
    description: "This one requires mathematical thinking...",
    hint: "Think about prime numbers: 2, 3, 5, 7, 11, 13...",
    rule: (index: number) => isPrime(index),
  },
  {
    id: 4,
    name: "Center Cluster",
    description: "Focus on the center of the grid...",
    hint: "The center square and its direct neighbors (up, down, left, right)",
    rule: (index: number) => {
      // Center is index 12, neighbors are 7, 11, 13, 17
      return [7, 11, 12, 13, 17].includes(index);
    },
  },
  {
    id: 5,
    name: "Modulo Pattern",
    description: "The final challenge uses a mathematical formula...",
    hint: "For each square, check if (row + col) is divisible by 3",
    rule: (index: number) => {
      const { row, col } = indexToCoords(index);
      return (row + col) % 3 === 0;
    },
  },
];

/**
 * Get the indices of squares that should flash for a given level
 */
export const getFlashingIndices = (levelId: number): number[] => {
  const level = levels.find((l) => l.id === levelId);
  if (!level) return [];

  const indices: number[] = [];
  for (let i = 0; i < 25; i++) {
    if (level.rule(i)) {
      indices.push(i);
    }
  }
  return indices;
};
