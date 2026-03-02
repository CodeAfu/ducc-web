import { BingoCellStates } from "~/types/bingo";

export const getCellKey = (rowIndex: number, cellIndex: number): keyof BingoCellStates =>
  `cell${rowIndex * 5 + (cellIndex + 1)}`;
