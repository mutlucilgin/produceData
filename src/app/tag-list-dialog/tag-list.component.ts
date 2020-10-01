import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalService, tagStructure } from '../global.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: true}) sort: MatSort;

  displayedColumns: string[] = ['select', 'no', 'name', 'description', 'location','client','extra'];
  dataSource;
  selection = new SelectionModel<tagStructure>(true, []);
  selectedTags: any[];
  newData: { name: string, weight: string, symbol: string, position: string, action: string };

  constructor(public globalService: GlobalService, 
    public dialogRef: MatDialogRef<TagListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<tagStructure>(this.globalService.tagList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.globalService.selectedTags != null) {
      this.globalService.selectedTags.forEach(tag => this.selection.select(tag));
    }
  }
  save() {
    this.selectedTags = this.selection.selected.sort((no1, no2) => {
      if (no1.no > no2.no) {
        return 1;
      }
      if (no1.no < no2.no) {
        return -1;
      }
      return 0;
    });
    this.dialogRef.close(this.selectedTags);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
