import * as fs from "fs";

const args = process.argv.slice(2);
const filename = args[0];
const input = fs.readFileSync(filename, "utf-8");

const parseInput = (input: string) =>
  input.split("\n").map((line) => line.split("   ").map(Number));

const calculateTotalDistance = (
  sortedLefts: number[],
  sortedRights: number[]
) =>
  sortedLefts.reduce(
    (acc, left, i) => acc + Math.abs(left - sortedRights[i]),
    0
  );

const calculateTotalScore = (lefts: number[], rights: number[]) => {
  const scoreMap = new Map<number, number>();
  const leftNumbers = new Set(lefts);

  rights.forEach((right) => {
    if (leftNumbers.has(right)) {
      scoreMap.set(right, (scoreMap.get(right) || 0) + right);
    }
  });

  return lefts.reduce((acc, left) => acc + (scoreMap.get(left) || 0), 0);
};

const [lefts, rights] = [[], []] as number[][];
parseInput(input).forEach(([left, right]) => {
  lefts.push(left);
  rights.push(right);
});

lefts.sort();
rights.sort();

const totalDistance = calculateTotalDistance(lefts, rights);
const totalScore = calculateTotalScore(lefts, rights);

console.log(`totalDistance: ${totalDistance}`);
console.log(`totalScore: ${totalScore}`);
