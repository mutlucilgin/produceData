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
  period = 1;
  typePeriod = "h";
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
    let saat = Number(moment(this.globalService.beginDate).format('HH')) * 60;
    let iMinute = Number(moment(tempDate).format('mm')) + saat;

    while (moment(tempDate).add(period, "s") <= endDate) {
      tempDate = moment(tempDate).add(period, "s");
      iMinute = Number(moment(tempDate).format("mm")) + Number(moment(tempDate).format("HH")) * 60;
      //console.log(tempDate.toISOString())
      tagData.push({
        iDay: tempDate.dayOfYear() - 1, lastChange: tempDate.toISOString(), minutes:
          [{
            iMinute: iMinute, lastChange: tempDate.toISOString(), tags:
              [{
                no: selectedTag.no, Values:
                  [{ Value: value.toString(), timeStamp: tempDate.format(this.globalService.formatDate) }]
              }]
          }]
      });

      value++;
    }
    // tagData.forEach(val=>
    //   console.log(val.minutes[0].iMinute)
    //   )
    console.log(tagData)
    //ayrı ayrı üretilen data birleştiriliyor
    this.combineData(tagData);
  }
  combineData(tagData) {
    let combineData: recordStructure[] = [];
    let iMinutes: any[] = [];
    let tags: any[] = [];
    let tagValues: any[] = [];
    let countDay = 0;
    let countMinute = 0;
    if (tagData.length != 0) {
      combineData.push(tagData[0])
    }

    // Day değerlerini birleştirme
    for (let i = 0; i < tagData.length - 1; i++) {
      if (tagData[i].iDay != tagData[i + 1].iDay) {
        // combineData = tagData.concat(combineData[combineData.length - 1]);
        // combineData[combineData.length - 1].lastChange = tagData[i + 1].lastChange;
        combineData.push(tagData[i + 1]);
      } else {
        combineData[combineData.length - 1].lastChange = tagData[i + 1].lastChange;
      }
    }
    // Minute değerlerini birleştirme
    for (let i = 0; i < tagData.length - 1; i++) {
      if (tagData[i].iDay == tagData[i + 1].iDay) {
        if (tagData[i + 1].minutes[0].iMinute != undefined && tagData[i].minutes[0].iMinute != tagData[i + 1].minutes[0].iMinute) {
          combineData[countDay].minutes = tagData[i + 1].minutes.concat(combineData[countDay].minutes);
        } else countMinute++;
      } else {
        countDay++;
      }
    }
    combineData.forEach(value => value.minutes.reverse())
    countMinute = 0;
    countDay = 0;
    // Value değerlerini birleştirme
    for (let i = 0; i < tagData.length - 1; i++) {
      if (tagData[i].iDay == tagData[i + 1].iDay) {
        if (tagData[i].minutes[0].iMinute == tagData[i + 1].minutes[0].iMinute) {
          if (tagData[i].minutes[0].tags[0].no == tagData[i + 1].minutes[0].tags[0].no) {
            console.log(combineData[countDay].minutes[countMinute])
            combineData[countDay].minutes[countMinute].tags[0].Values = tagData[i + 1].minutes[0].tags[0].
              Values.concat(combineData[countDay].minutes[countMinute].tags[0].Values);

            combineData[countDay].minutes[countMinute].lastChange = tagData[i + 1].minutes[0].lastChange;
          }
        } else {
          countMinute++;
        }
      } else {
        countMinute = 0;
        countDay++;
      }
    }
    combineData.forEach(day =>
      day.minutes.forEach(minute =>
        minute.tags[0].Values.reverse()));
    //combineData[countDay].minutes[countMinute].tags[0].Values.reverse();
    console.log(combineData)
    // this.globalService.sendData(combineData);
  }
}
