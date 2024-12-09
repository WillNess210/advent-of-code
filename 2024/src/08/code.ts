import * as fs from "fs";

const args = process.argv.slice(2);
const filename = args[0];

const input = fs.readFileSync(filename, "utf-8");

function parseInputAsGridOfChars(input: string): string[][] {
  return input.split("\n").map((line) => line.split(""));
}

// antenna = lowercase letter, uppercase letter, or digit

function isAntenna(char: string): boolean {
  return /[a-zA-Z0-9]/.test(char);
}

type Location = {
  x: number;
  y: number;
}

function getAntennaRecord(grid: string[][]): Record<string, Location[]> {
  const antennas: Record<string, Location[]> = {};

  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (isAntenna(cell)) {
        if (!antennas[cell]) {
          antennas[cell] = [];
        }
        antennas[cell].push({ x, y });
      }
    });
  });

  return antennas;
}

function getAntennaPairCombinations(antennas: Record<string, Location[]>): [Location, Location][] {
  const antennaPairs: [Location, Location][] = [];

  Object.keys(antennas).forEach((antenna) => {
    const locations = antennas[antenna];
    if (locations.length < 2) {
      return;
    }
    for (let i = 0; i < locations.length; i++) {
      for (let j = i + 1; j < locations.length; j++) {
        antennaPairs.push([locations[i], locations[j]]);
      }
    }
  });

  return antennaPairs;
}

function getDelta(a: Location, b: Location): Location {
  return { x: a.x - b.x, y: a.y - b.y };
}

function getAntinodeLocations(grid: string[][], a: Location, b: Location): Location[] {
  const height = grid.length;
  const width = grid[0].length;
  const { x: dx, y: dy } = getDelta(a, b);
  const antinodeLocations: Location[] = [
    { x: a.x + dx, y: a.y + dy },
    { x: b.x - dx, y: b.y - dy },
  ].filter(({ x, y }) => x >= 0 && x < width && y >= 0 && y < height);
  return antinodeLocations;
}

function getAllAntinodeLocations(grid: string[][], antennaPairs: [Location, Location][]): Location[] {
  return antennaPairs.flatMap(([a, b]) => getAntinodeLocations(grid, a, b));
}

function simplifyFraction(numerator: number, denominator: number): [number, number] {
  // Find the greatest common divisor (GCD) using the Euclidean algorithm
  function gcd(a: number, b: number): number {
    while (b !== 0) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  const divisor = gcd(numerator, denominator);
  return [numerator / divisor, denominator / divisor];
}

function getAntinodeLocations2(grid: string[][], a: Location, b: Location): Location[] {
  const height = grid.length;
  const width = grid[0].length;
  const { x: dxUnsimplified, y: dyUnsimplified } = getDelta(a, b);
  const [dx, dy] = simplifyFraction(dxUnsimplified, dyUnsimplified);
  // const [dx, dy] = [dxUnsimplified, dyUnsimplified];

  const antinodeLocations: Location[] = [];
  let counter = 0;
  while (true) {
    const nx = a.x + (counter * dx);
    const ny = a.y + (counter * dy);
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
      break;
    }
    antinodeLocations.push({ x: nx, y: ny });
    counter++;
  }
  counter = 0;
  while (true) {
    const nx = b.x - (counter * dx);
    const ny = b.y - (counter * dy);
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
      break;
    }
    antinodeLocations.push({ x: nx, y: ny });
    counter++;
  }
  return antinodeLocations;
}

function getAllAntinodeLocations2(grid: string[][], antennaPairs: [Location, Location][]): Location[] {
  return antennaPairs.flatMap(([a, b]) => getAntinodeLocations2(grid, a, b));
}

function getNumberOfUniqueCellsWithAntinodeLocations(grid: string[][]): number {
  const antennas = getAntennaRecord(grid);
  const antennaPairs = getAntennaPairCombinations(antennas);
  const antinodeLocations = getAllAntinodeLocations(grid, antennaPairs);
  const uniqueAntinodeLocations = new Set(antinodeLocations.map(({ x, y }) => `${x},${y}`));
  return uniqueAntinodeLocations.size;
}

const grid = parseInputAsGridOfChars(input);
const result = getNumberOfUniqueCellsWithAntinodeLocations(grid);
console.log(`Result: ${result}`);

function getNumberOfUniqueCellsWithAntinodeLocations2(grid: string[][]): number {
  const antennas = getAntennaRecord(grid);
  const antennaPairs = getAntennaPairCombinations(antennas);
  const antinodeLocations = getAllAntinodeLocations2(grid, antennaPairs);
  const uniqueAntinodeLocations = new Set(antinodeLocations.map(({ x, y }) => `${x},${y}`));
  return uniqueAntinodeLocations.size;
}
const result2 = getNumberOfUniqueCellsWithAntinodeLocations2(grid);
console.log(`Result2: ${result2}`);