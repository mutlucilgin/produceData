import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalService, PeriodicElement } from '../global.service';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {

  
  displayedColumns: string[] = ['select','name', 'weight', 'symbol', 'position'];
  dataSource ;
  selection = new SelectionModel<PeriodicElement>(true, []);
  selectedTags:any[];
  constructor(public globalService:GlobalService,public dialogRef: MatDialogRef<TagListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
    newData:{name:string,weight:string,symbol:string,position:string,action:string};

  ngOnInit() {
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.globalService.tagList);
    if(this.globalService.selectedTags!=null){
      this.globalService.selectedTags.forEach(tag=>this.selection.select(tag));
    }
  }
  save(){
    this.selectedTags = this.selection.selected.sort((pos1,pos2)=>{
      if (pos1.position > pos2.position) {
        return 1;
    }
    if (pos1.position < pos2.position) {
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

}
