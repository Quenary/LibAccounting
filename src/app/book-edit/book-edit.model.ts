import { BookModel } from './../core/models/book.model';

export interface BookEditModal {
    editType: BookEditTypes,
    book: BookModel
}
export enum BookEditTypes {
    create = 0,
    edit = 1
}