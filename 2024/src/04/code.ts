import * as fs from "fs";

const args = process.argv.slice(2);
const filename = args[0];

const input = fs.readFileSync(filename, "utf-8");

const WORD_TO_SEARCH = "XMAS";

const lines = input.split("\n");
const grid = lines.map((line) => line.split(""));
const height = grid.length;
const width = grid[0].length;
const wordLength = WORD_TO_SEARCH.length;

function checkDirection(grid: string[][], x: number, y: number, direction: { x: number, y: number }): boolean {
  for (let i = 1; i < wordLength; i++) {
    const newX = x + direction.x * i;
    const newY = y + direction.y * i;
    if (newX < 0 || newX >= width || newY < 0 || newY >= height) {
      return false;
    }
    if (grid[newY][newX] !== WORD_TO_SEARCH[i]) {
      return false;
    }
  }
  return true;
}

function checkWord(grid: string[][], word: string, x: number, y: number): number {
  const directions = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
  ];
  let count = 0;
  for (const direction of directions) {
    if (checkDirection(grid, x, y, direction)) {
      count++;
    }
  }

  return count;
}


function findWordCount(grid: string[][], word: string) {
  const height = grid.length;
  const width = grid[0].length;

  let count = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === word[0]) {
        count += checkWord(grid, word, x, y);
      }
    }
  }

  return count;
}

const count = findWordCount(grid, WORD_TO_SEARCH);
console.log(`Found ${WORD_TO_SEARCH} ${count} times`);