import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { GlobalService } from '../global.service';
import { TagListComponent } from '../tag-list-dialog/tag-list.component';

/*
<ng-container matColumnDef="action">
            <mat-checkbox class="example-margin">Check me!</mat-checkbox>
          </ng-container>
*/
@Component({
  selector: 'app-tag-selection',
  templateUrl: './tag-selection.component.html',
  styleUrls: ['./tag-selection.component.css']
})
export class TagSelectionComponent implements OnInit {

  displayedColumns: string[] = ['name', 'weight', 'symbol', 'position','action'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  data ;
  period=5;
  typePeriod = "s";
  constructor(public dialog: MatDialog,public globalService:GlobalService) { }

  ngOnInit() {
   //this.data = new MatTableDataSource<PeriodicElement>(this.globalService.selectedTags);
  }

  selecetTags(){
    const dialogRef = this.dialog.open(TagListComponent, {
      width: '1000px',
      /*data: this.ELEMENT_DATA[0]*/
    });

    dialogRef.afterClosed().subscribe(result => {
      this.globalService.selectedTags=result;
      console.log('The dialog was closed',result);
      this.data = result;
    });
  }
  
  deleteTag(tag){
    this.data=this.data.filter(value=>tag.position!=value.position);
    this.globalService.selectedTags=this.data;
    console.log(this.data);
  }

  calistir(){
    let convertPeriod=this.period;
    if(this.typePeriod=="m")
    convertPeriod=60*convertPeriod;
    if(this.typePeriod=="h")
    convertPeriod=3600*convertPeriod;
    let tempDate=moment(moment(this.globalService.beginDate).format(this.globalService.formatDateShort));
    let endDate=moment(moment(this.globalService.endDate).format(this.globalService.formatDateShort));
    let tagData:{value:number,date:string}[]=[];
    let value=0;
    
    while(moment(tempDate).add(convertPeriod,"s")<=endDate){
      tempDate=moment(tempDate).add(convertPeriod,"s");
      tagData.push({value:value,date:tempDate.format(this.globalService.formatDate)})
      value++;
    }
    this.globalService.sendData(tagData,tempDate.dayOfYear());
  }
}
