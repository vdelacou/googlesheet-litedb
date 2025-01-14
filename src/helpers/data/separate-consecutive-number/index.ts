export const separateConsecutiveNumbers = (arr: number[]): number[][] => {
  if (arr.length === 0) return [];

  const result: number[][] = [];
  let currentGroup: number[] = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    const current = arr.at(i);
    const previous = arr.at(i - 1);
    if (!current || !previous) continue;
    if (current === previous + 1) {
      currentGroup.push(current);
    } else {
      result.push(currentGroup);
      currentGroup = [current];
    }
  }

  result.push(currentGroup);
  return result;
};
