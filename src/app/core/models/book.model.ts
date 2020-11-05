import { CategoryModel } from './category.model';
export interface BookModel {
    /**
     * Не заполнять при создании новой книги
     */
    id?: number;
    isbn: string;
    name: string;
    description: string;
    authorId: number;
    categoryId: number;
}