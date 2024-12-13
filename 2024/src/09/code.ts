import * as fs from "fs";

const args = process.argv.slice(2);
const filename = args[0];

const input = fs.readFileSync(filename, "utf-8");

function convertInputToNumberArray(input: string): number[] {
  return input.split("").map((line) => parseInt(line));
}

type SystemArray = ("." | number)[];

function getSystemArray(
  numberArray: number[],
  totalSizeofSystem: number
): SystemArray {
  const systemArray: ("." | number)[] = [];
  for (let i = 0; i < numberArray.length; i++) {
    const number = numberArray[i];
    const isFile = i % 2 === 0;
    for (let j = 0; j < number; j++) {
      systemArray.push(isFile ? i / 2 : ".");
    }
  }
  return systemArray;
}

function shiftSystemArray(prevSystemArray: ("." | number)[]): SystemArray {
  const systemArray: SystemArray = [...prevSystemArray];
  let leftMostFreeSpace = 0;
  let rightMostFileSpace = systemArray.length - 1;
  while (leftMostFreeSpace < rightMostFileSpace) {
    if (systemArray[leftMostFreeSpace] !== ".") {
      leftMostFreeSpace++;
      continue;
    } else if (systemArray[rightMostFileSpace] === ".") {
      rightMostFileSpace--;
      continue;
    }
    systemArray[leftMostFreeSpace] = systemArray[rightMostFileSpace];
    systemArray[rightMostFileSpace] = ".";
  }
  return systemArray;
}

function shiftSystemArray2(prevSystemArray: ("." | number)[]): SystemArray {
  const systemArray: SystemArray = [...prevSystemArray];
  function tryToShiftId(id: number, startingIndex: number, length: number) {
    let startingFreeSpace = -1;
    for (let i = 0; i < startingIndex; i++) {
      const currentValue = systemArray[i];
      if (currentValue !== ".") {
        startingFreeSpace = -1;
        continue;
      }
      if (startingFreeSpace === -1) {
        startingFreeSpace = i;
      }
      const streakOfFreeSpaces = i - startingFreeSpace + 1;
      if (streakOfFreeSpaces >= length) {
        for (let j = 0; j < length; j++) {
          systemArray[startingFreeSpace + j] = id;
          systemArray[startingIndex + j] = ".";
        }
        return;
      }
    }
  }
  const alreadyShiftedIds = new Set<number>();
  for (let i = systemArray.length - 1; i > 0; i--) {
    const currentValue = systemArray[i];
    if (systemArray[i - 1] !== currentValue && currentValue !== ".") {
      const startingIndex = i;
      let length = 1;
      for (let j = i + 1; j < systemArray.length; j++) {
        if (systemArray[j] === currentValue) {
          length++;
        } else {
          break;
        }
      }
      if (alreadyShiftedIds.has(currentValue)) {
        continue;
      }
      tryToShiftId(currentValue, startingIndex, length);
      alreadyShiftedIds.add(currentValue);
    }
  }
  return systemArray;
}

function computeSystemArrayChecksum(systemArray: SystemArray): number {
  let checksum = 0;
  for (let i = 0; i < systemArray.length; i++) {
    const value = systemArray[i];
    if (value !== ".") {
      checksum += i * value;
    }
  }
  return checksum;
}

function getAnswerToPart1(input: string): number {
  const numberArray = convertInputToNumberArray(input);

  const systemArray = getSystemArray(numberArray, 10);

  const shiftedSystemArray = shiftSystemArray(systemArray);

  return computeSystemArrayChecksum(shiftedSystemArray);
}

console.log(getAnswerToPart1(input));

function getAnswerToPart2(input: string): number {
  const numberArray = convertInputToNumberArray(input);

  const systemArray = getSystemArray(numberArray, 10);

  const shiftedSystemArray = shiftSystemArray2(systemArray);

  return computeSystemArrayChecksum(shiftedSystemArray);
}

console.log(getAnswerToPart2(input));
