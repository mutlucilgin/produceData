import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { GlobalService, recordStructure } from '../global.service';
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
export class TagSelectionComponent {

  displayedColumns: string[] = ['no', 'name', 'description', 'location', 'client', 'extra', 'action'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  period = 5;
  typePeriod = "s";
  constructor(public dialog: MatDialog, public globalService: GlobalService) { }

  selecetTags() {
    const dialogRef = this.dialog.open(TagListComponent, {
      width: '1000px',
      /*data: this.ELEMENT_DATA[0]*/
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.globalService.selectedTags = result;
        console.log('The dialog was closed', result);
      }
    });
  }

  deleteTag(tag) {
    this.globalService.selectedTags = this.globalService.selectedTags.filter(value => tag.no != value.no);
  }

  calistir() {
    let convertPeriod = this.period;
    if (this.typePeriod == "m")
      convertPeriod = 60 * convertPeriod;
    if (this.typePeriod == "h")
      convertPeriod = 3600 * convertPeriod;

    if (this.globalService.selectedTags != undefined)
      this.globalService.selectedTags.forEach(selected =>
        this.produceData(selected, convertPeriod)
      )
    else
      console.log("select tag")
  }
  produceData(selectedTag, period) {
    let value = 0;
    let tagData: any[] = [];
    let endDate = moment(moment(this.globalService.endDate).format(this.globalService.formatDateShort));
    let tempDate = moment(moment(this.globalService.beginDate).format(this.globalService.formatDateShort));
    let saat = Number(moment().format('HH')) * 60;
    while (moment(tempDate).add(period, "s") <= endDate) {
      tempDate = moment(tempDate).add(period, "s");
      let toplamdakika = Number(moment(tempDate).format('mm')) + saat;

      tagData.push({
        iDay: tempDate.dayOfYear() - 1, lastChange: tempDate.toISOString(), minutes:
          [{
            iMinute: toplamdakika, lastChange: tempDate.toISOString(), tags:
              [{
                no: selectedTag.no, Values:
                  [{ Value: value.toString(), timeStamp: tempDate.format(this.globalService.formatDate) }]
              }]
          }]
      });

      value++;
    }

    //ayrı ayrı üretilen data birleştiriliyor
    this.combineData(tagData);
  }
  combineData(tagData) {
    let combineData: recordStructure[] = [];
    let iMinutes: any[] = [];
    let tags: any[] = [];
    let tagValues: any[] = [];

    if (tagData.length != 0) {
      combineData.push(tagData[0])
    }

    // Minute değerlerini birleştirme
    for (let i = 0; i < tagData.length - 1; i++) {
      if (tagData[i].iDay == tagData[i + 1].iDay && tagData[i].minutes[0].iMinute != tagData[i + 1].minutes[0].iMinute) {
        combineData[combineData.length - 1].minutes = tagData[i + 1].minutes.concat(combineData[combineData.length - 1].minutes)
        combineData[0].lastChange = tagData[i + 1].lastChange;
      }
    }
    combineData[combineData.length - 1].minutes.reverse();

    // Value değerlerini birleştirme
    let countMinute = 0;
    for (let i = 0; i < tagData.length - 1; i++) {
      if (tagData[i].iDay == tagData[i + 1].iDay && tagData[i].minutes[0].iMinute == tagData[i + 1].minutes[0].iMinute) {
        if (tagData[i].minutes[0].tags[0].no == tagData[i + 1].minutes[0].tags[0].no) {
          combineData[0].minutes[countMinute].tags[0].Values = tagData[i + 1].minutes[0].tags[0].
            Values.concat(combineData[0].minutes[countMinute].tags[0].Values);

          combineData[0].minutes[countMinute].lastChange = tagData[i + 1].minutes[0].lastChange;
        }
      } else {
        combineData[0].minutes[countMinute].tags[0].Values.reverse();
        countMinute++;
      }
    }
    this.globalService.sendData(combineData);
  }
}
