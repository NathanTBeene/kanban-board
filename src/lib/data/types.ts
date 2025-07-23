export type Id = string | number;

export interface BoardData {
  id: Id;
  columns: ColumnData[];
}

export interface ColumnData {
  id: Id;
  title: string;
  items: EntryData[];
}

export interface EntryData {
  id: Id;
  description: string;
}