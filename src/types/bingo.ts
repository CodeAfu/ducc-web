export type BingoCellStates = Record<`cell${number}`, BingoCellValue>;
export type BingoCellValue = string | "";
export type BingoCellKey = keyof BingoCellStates;

export const WINNING_PATTERNS = [
  // Rows
  ["cell1", "cell2", "cell3", "cell4", "cell5"],
  ["cell6", "cell7", "cell8", "cell9", "cell10"],
  ["cell11", "cell12", "cell13", "cell14", "cell15"],
  ["cell16", "cell17", "cell18", "cell19", "cell20"],
  ["cell21", "cell22", "cell23", "cell24", "cell25"],

  // Columns
  ["cell1", "cell6", "cell11", "cell16", "cell21"],
  ["cell2", "cell7", "cell12", "cell17", "cell22"],
  ["cell3", "cell8", "cell13", "cell18", "cell23"],
  ["cell4", "cell9", "cell14", "cell19", "cell24"],
  ["cell5", "cell10", "cell15", "cell20", "cell25"],

  // Diagonals
  ["cell1", "cell7", "cell13", "cell19", "cell25"],
  ["cell5", "cell9", "cell13", "cell17", "cell21"],
] as const;

// API
export interface BingoImage {
  id: number;
  img_data: string;
  img_hash: string;
  added_by: string;
  filename: string;
  fileext: string;
  is_protected: boolean;
  created_at: Date;
  updated_at: Date;
}

export type BingoImageResponse = BingoImage[]
