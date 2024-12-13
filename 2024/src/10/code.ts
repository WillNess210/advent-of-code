import * as fs from "fs";

const args = process.argv.slice(2);
const filename = args[0];

const input = fs.readFileSync(filename, "utf-8");

const inputAsNumericGrid: number[][] = input
  .split("\n")
  .map((line) => line.split("").map((char) => parseInt(char)));

type Position = { x: number; y: number };

const deltas = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
];

function exploreUntilPeak(
  grid: number[][],
  position: Position,
  peaksVisited: boolean[][]
): number {
  const { x, y } = position;
  const currentValue = grid[y][x];
  if (currentValue === 9) {
    peaksVisited[y][x] = true;
    return 1;
  }
  const width = grid[0].length;
  const height = grid.length;
  const nextValue = currentValue + 1;
  let score = 0;
  for (const delta of deltas) {
    const newX = x + delta.x;
    const newY = y + delta.y;
    if (newX < 0 || newX >= width || newY < 0 || newY >= height) {
      continue;
    }
    if (grid[newY][newX] !== nextValue) {
      continue;
    }
    const nextPosition = { x: newX, y: newY };

    score += exploreUntilPeak(grid, nextPosition, peaksVisited);
  }
  return score;
}

function getScore(grid: number[][]) {
  let score = 0;
  let totalPaths = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== 0) {
        continue;
      }
      const position = { x, y };
      const peaksVisited: boolean[][] = grid.map((row) => row.map(() => false));
      totalPaths += exploreUntilPeak(grid, position, peaksVisited);
      score += peaksVisited.reduce(
        (acc, row) => acc + row.filter((cell) => cell).length,
        0
      );
    }
  }
  return { score, totalPaths };
}

const { score, totalPaths } = getScore(inputAsNumericGrid);
console.log(`The score is: ${score}`);
console.log(`The total number of paths is: ${totalPaths}`);
