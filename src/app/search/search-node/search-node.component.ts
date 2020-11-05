import { SearchNodeModel, SearchNodeTypes } from './search-node.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-node',
  templateUrl: './search-node.component.html',
  styleUrls: ['./search-node.component.scss']
})
export class SearchNodeComponent implements OnInit {

  @Input('data') item: SearchNodeModel;
  @Input('hideChilds') hideChilds: boolean = true;
  // public hideChilds: boolean = hideChildren;
  public types = SearchNodeTypes;

  constructor() { }

  ngOnInit(): void {
  }

  public changeToggleCategory() {
    this.hideChilds = !this.hideChilds;
  }

  public deleteCategory() {
    
  }
}
