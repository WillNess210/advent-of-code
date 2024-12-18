import * as fs from "fs";

const args = process.argv.slice(2);
const filename = args[0];

const input = fs.readFileSync(filename, "utf-8");

const EMPTY = ".";
const OCCUPIED = "#";
const UP = "^";
const DOWN = "v";
const LEFT = "<";
const RIGHT = ">";
const DIRECTIONS = [UP, DOWN, LEFT, RIGHT];
const TURN_RIGHT_RECORD: Record<string, string> = {
  "^": ">",
  ">": "v",
  "v": "<",
  "<": "^",
}


const lines = input.split("\n");
const grid = lines.map((line) => line.split(""));
const getGridCopy = (grid: string[][]): string[][] => grid.map((line) => line.slice());
const height = grid.length;
const width = grid[0].length;
const visitedBooleanGrid = grid.map((line) => line.map(() => false));

const getInitialPosition = (grid: string[][]): { x: number, y: number, direction: string } => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (DIRECTIONS.includes(grid[y][x])) {
        return { x, y, direction: grid[y][x] };
      }
    }
  }
  throw new Error("No initial position found");
}

const initialPosition = getInitialPosition(grid);

const getNextPosition = (grid: string[][], x: number, y: number, direction: string): { x: number, y: number, direction: string } | { finished: true } => {
  visitedBooleanGrid[y][x] = true;
  const delta = { x: 0, y: 0 };
  switch (direction) {
    case UP:
      delta.y = -1;
      break;
    case DOWN:
      delta.y = 1;
      break;
    case LEFT:
      delta.x = -1;
      break;
    case RIGHT:
      delta.x = 1;
      break;
  }
  const nextPosition = { x: x + delta.x, y: y + delta.y, direction };
  if (nextPosition.x < 0 || nextPosition.x >= width || nextPosition.y < 0 || nextPosition.y >= height) {
    return { finished: true };
  } else if (grid[nextPosition.y][nextPosition.x] === OCCUPIED) {
    return { x, y, direction: TURN_RIGHT_RECORD[direction] };
  }
  return nextPosition;
}

const getNumberOfTilesVisited = (grid: string[][]): number => {
  let position = initialPosition;
  while (true) {
    const nextPosition = getNextPosition(grid, position.x, position.y, position.direction);
    if ("finished" in nextPosition) {
      break;
    }
    position = nextPosition;
  }
  // count booleans set to true in visitedBooleanGrid
  const visitedCellCount = visitedBooleanGrid.reduce((acc, line) => acc + line.filter((cell) => cell).length, 0);
  return visitedCellCount;
}

const result = getNumberOfTilesVisited(grid);
console.log(`Number of tiles visited: ${result}`);

const doesInfiniteLoopOccur = (grid: string[][]): boolean => {
  let position = initialPosition;
  let steps = 0;
  while (true) {
    const nextPosition = getNextPosition(grid, position.x, position.y, position.direction);
    if ("finished" in nextPosition) {
      break;
    }
    position = nextPosition;
    steps++;
    if (steps > 10_000) {
      return true;
    }
  }
  return false;
}

const getNumberOfTilesThatWhenObstacleAddedCauseInfiniteLoop = (grid: string[][]): number => {
  let count = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === EMPTY) {
        const newGrid = getGridCopy(grid);
        newGrid[y][x] = OCCUPIED;
        if (doesInfiniteLoopOccur(newGrid)) {
          count++;
        }
      }
    }
  }
  return count;
}

const result2 = getNumberOfTilesThatWhenObstacleAddedCauseInfiniteLoop(grid);
console.log(`Number of tiles that when obstacle added cause infinite loop: ${result2}`);