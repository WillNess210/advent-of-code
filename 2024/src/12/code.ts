import * as fs from "fs";

const args = process.argv.slice(2);
const filename = args[0];

const input = fs.readFileSync(filename, "utf-8");

const grid: string[][] = input.split("\n").map((line) => line.split(""));
const gridHeight = grid.length;
const gridWidth = grid[0].length;
const gridVisited: boolean[][] = [];
for (let i = 0; i < gridHeight; i++) {
  gridVisited.push(new Array(gridWidth).fill(false));
}

type Position = { x: number; y: number };
const directions: Position[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

function exploreRegion(region: Position[], x: number, y: number) {
  gridVisited[y][x] = true;
  region.push({ x, y });
  for (const direction of directions) {
    const newX = x + direction.x;
    const newY = y + direction.y;
    if (newX < 0 || newX >= gridWidth || newY < 0 || newY >= gridHeight) {
      continue;
    }
    if (gridVisited[newY][newX]) {
      continue;
    }
    if (grid[newY][newX] !== grid[y][x]) {
      continue;
    }
    exploreRegion(region, newX, newY);
  }
}

type Region = {
  key: string;
  positions: Position[];
};
function getRegions(): Region[] {
  const regions: Region[] = [];
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (gridVisited[y][x]) {
        continue;
      }
      const region: Position[] = [];
      exploreRegion(region, x, y);
      regions.push({
        key: grid[y][x],
        positions: region,
      });
    }
  }
  return regions;
}

function getRegionArea(region: Region): number {
  return region.positions.length;
}

function getRegionPermiter(region: Region): number {
  let perimeter = 0;
  for (const position of region.positions) {
    for (const direction of directions) {
      const x = position.x + direction.x;
      const y = position.y + direction.y;
      if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) {
        perimeter++;
        continue;
      }
      if (grid[y][x] !== region.key) {
        perimeter++;
      }
    }
  }
  return perimeter;
}

function getTotalScore(): number {
  const regions = getRegions();
  let totalScore = 0;
  for (const region of regions) {
    totalScore += getRegionArea(region) * getRegionPermiter(region);
  }
  return totalScore;
}

const result = getTotalScore();
console.log(`The total score is ${result}`);
