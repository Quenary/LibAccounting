import { BookService } from './../../core/services/book.service';
import { AuthorService } from './../../core/services/author.service';
import { CategoryService } from './../../core/services/category.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BookModel } from 'src/app/core/models/book.model';
import { CategoryModel } from 'src/app/core/models/category.model';
import { SearchNodeModel, SearchNodeTypes } from '../search-node/search-node.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private authorService: AuthorService,
    private bookService: BookService
  ) { }


  /**
   * Создать базовое дерево
   * @param categories список категорий
   * @param books список книг
   */
  public createSearchNode(): Promise<SearchNodeModel> {
    return new Promise((resolve, reject) => {
      const bks = this.bookService.get()
        .toPromise();
      const cts = this.categoryService.get()
        .toPromise();
      Promise.all([bks, cts])
        .then(res => {
          const books = res[0];
          const categories = res[1];
          let baseNode = {
            name: 'Категории литературы',
            type: SearchNodeTypes.base,
            subItems: []
          }
          baseNode = this.getSearchNodesFromCategories(baseNode, categories);
          baseNode = this.addBooksToNodeTree(baseNode, books);
          resolve(baseNode);
        })
        .catch(error => {
          reject();
        })
    })
  }

  /**
   * Сравнение поискового значения и имени узла.
   * Возвращает тру, если имя включает значение частично или полностью.
   * @param value поисковое значение
   * @param name имя узла
   */
  private compareFn(value: string, name: string): boolean {
    return name.toLowerCase().includes(value.toLowerCase()) ? true : false;
  }

  /**
   * Получить отфильтрованные узлы дерева
   * @param value значение поиска
   * @param nodes узлы
   */
  public getFilteredNodes(value: string, nodes: SearchNodeModel[]): SearchNodeModel[] {
    let newNodes: SearchNodeModel[] = JSON.parse(JSON.stringify(nodes))
    // фильтруем узлы
    for (let node of newNodes) {
      // фильтруем потомки, если имя текущего узла не входит
      if (!this.compareFn(value, node.name)) {
        node.subItems = this.getFilteredNodes(value, node.subItems);
      }
      // на полное совпадение ISBN
      if (node.type == SearchNodeTypes.book && node.bookIsbn === value) {
        this.router.navigate([`/book/${node.bookIsbn}`])
        break;
      }
    }
    //фильтр для текущего уровня
    newNodes = newNodes.filter(node => {
      return this.compareFn(value, node.name) || node.subItems.length > 0;
    })
    // убираем верхний слой, если он один и в нем есть потомки
    if (newNodes.length == 1 && newNodes[0].subItems.length != 0) {
      newNodes = newNodes[0].subItems;
    }
    return newNodes;
  }

  /**
   * Создать узел дерева из категории
   * @param cat категории
   */
  private getNodeFromCategory(cat: CategoryModel): SearchNodeModel {
    return {
      categoryId: cat.id,
      name: cat.name,
      type: SearchNodeTypes.category,
      subItems: []
    }
  }

  /**
   * Создать узел дерева из книги
   * @param book книга
   */
  private getNodeFromBook(book: BookModel): SearchNodeModel {
    return {
      categoryId: book.categoryId,
      bookIsbn: book.isbn,
      name: book.name,
      type: SearchNodeTypes.book,
      subItems: []
    }
  }

  /**
   * Добавить книги к текущей ветке и к вложенным
   * @param node элемент дерева, первый раз base
   * @param books массив книг
   */
  private addBooksToNodeTree(node: SearchNodeModel, books: BookModel[]): SearchNodeModel {
    let prnt = { ...node };
    let notProcessedBooks: BookModel[] = [];

    if (prnt.type == SearchNodeTypes.category) {
      for (let book of books) {
        if (book.categoryId == prnt.categoryId) {
          prnt.subItems.push(this.getNodeFromBook(book));
        }
        else {
          notProcessedBooks.push({ ...book })
        }
      }
    }
    else {
      notProcessedBooks = JSON.parse(JSON.stringify(books))
    }

    for (let subItem of prnt.subItems) {
      subItem = this.addBooksToNodeTree(subItem, notProcessedBooks);
    }
    return prnt;
  }

  /**
   * Добавить категории к текущей категории и к вложенным
   * @param categories категории
   * @param node ветка дерева
   */
  private getSearchNodesFromCategories(node: SearchNodeModel, categories: CategoryModel[]): SearchNodeModel {

    let cats: CategoryModel[] = [...categories]
    let prnt: SearchNodeModel = { ...node }

    if (prnt.type == SearchNodeTypes.base) {
      prnt.subItems = cats
        .filter(cat =>
          !cat.parentCategoryId)
        .map(cat =>
          this.getNodeFromCategory(cat));
    }
    else {
      prnt.subItems = cats
        .filter(cat =>
          cat.parentCategoryId == prnt.categoryId)
        .map(cat =>
          this.getNodeFromCategory(cat))
    }

    let subCats = cats.filter(cat => cat.parentCategoryId)
    prnt.subItems = prnt.subItems.map(item => this.getSearchNodesFromCategories(item, subCats))

    return prnt;
  }
}
