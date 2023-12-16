function getNextSequence(sequence: number[]): number[] {
  const nextSequence: number[] = Array(sequence.length - 1).fill(0);

  for (let i = 0; i < sequence.length - 1; i++) {
    nextSequence[i] = sequence[i + 1] - sequence[i];
  }

  return nextSequence;
}

function extrapolate(sequences: number[][]): number {
  let extrapolated = 0;

  for (let i = sequences.length - 1; i > 0; i--) {
    extrapolated = sequences[i - 1][0] - extrapolated;
  }
  return extrapolated;
}

export function part2(sequences: number[][]): void {
  let extrapolatedSum = 0;

  for (let sequence of sequences) {
    const steps: number[][] = [sequence];

    while (sequence.some((num) => num !== 0)) {
      sequence = getNextSequence(sequence);
      steps.push(sequence);
    }

    extrapolatedSum += extrapolate(steps);
  }

  console.log(`Extrapolated sum: ${extrapolatedSum}`);
}
