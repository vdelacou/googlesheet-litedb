const ASCII_A = 65;

const getColumnLetter = (index: number): string => {
  let result = '';
  index++;
  while (index > 0) {
    index--;
    result = String.fromCharCode(ASCII_A + (index % 26)) + result;
    index = Math.floor(index / 26);
  }
  return result;
};

export const buildRange = (sheetName: string, startColIndex: number, endColIndex: number, startRow?: number, endRow?: number): string => {
  const startColLetter = getColumnLetter(startColIndex);
  const endColLetter = getColumnLetter(endColIndex);
  const start = startRow ? `${startColLetter}${startRow}` : startColLetter;
  const end = endRow ? `${endColLetter}${endRow}` : endColLetter;
  return `${sheetName}!${start}:${end}`;
};
