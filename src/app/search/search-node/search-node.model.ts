export interface SearchNodeModel {
  categoryId?: number;
  bookIsbn?: string;
  name: string;
  type: SearchNodeTypes
  subItems: SearchNodeModel[];
}
export enum SearchNodeTypes {
  base = 0,
  category = 1,
  book = 2
}