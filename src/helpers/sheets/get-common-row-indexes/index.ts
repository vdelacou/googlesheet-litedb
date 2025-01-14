export const getCommonRowIndexes = (columnMatches: number[][]): number[] => {
  return columnMatches.reduce((acc, indexes) => acc.filter((index) => indexes.includes(index)), columnMatches[0] || []);
};
