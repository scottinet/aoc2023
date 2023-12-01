import fs from "fs/promises";

const STRINGIFIED_DIGITS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

async function loadInput(fileName: string): Promise<string[]> {
  const content = await fs.readFile(fileName, { encoding: "utf8" });
  return content.split("\n");
}

function convertSpelledNumberToNumber(str: string): string {
  let converted = str;

  for (const [index, stringifiedDigit] of STRINGIFIED_DIGITS.entries()) {
    // The 1st and last char of the stringified digit can be shared with another stringified digit
    // e.g. "oneight" -> "18"
    // So, simplest way: always add the 1st and last char of the stringified digit to the converted string
    // e.g. "oneight" -> "o1e8t"
    converted = converted.replace(
      new RegExp(stringifiedDigit, "g"),
      `${stringifiedDigit[0]}${index}${stringifiedDigit.slice(-1)}`
    );
  }

  return converted;
}

function calibrationStringToNumber(str: string): number {
  const numberStr = str
    .split("")
    .map((char) => parseInt(char, 10))
    .filter((num) => !isNaN(num))
    .join("");

  const filtered = numberStr[0] + numberStr.slice(-1);
  return parseInt(filtered, 10);
}

async function day1Part1(inputFileName: string): Promise<void> {
  const input = await loadInput(inputFileName);
  const numbers = input.map((line) => calibrationStringToNumber(line));
  const result = numbers.reduce((acc, curr) => acc + curr, 0);

  console.log(`Result part 1: ${result}`);
}

async function day1Part2(inputFileName: string): Promise<void> {
  const input = await loadInput(inputFileName);
  const numbers = input
    .map((line) => convertSpelledNumberToNumber(line))
    .map((line) => calibrationStringToNumber(line));
  const result = numbers.reduce((acc, curr) => acc + curr, 0);

  console.log(`Result part 2: ${result}`);
}

day1Part1("day1/assets/input.txt");
day1Part2("day1/assets/input.txt");
