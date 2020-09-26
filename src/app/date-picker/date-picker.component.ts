import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' },
    { provide: MAT_DATE_FORMATS, useValue: {
      parse: {
        dateInput: 'DD.MM.YYYY HH:mm:ss',
      },
      display: {
        dateInput: 'DD.MM.YYYY  HH:mm',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LLL',
        monthYearA11yLabel: 'MMMM YYYY',
      },
    } },
  ]
})

export class DatePickerComponent implements OnInit {

  beginDate: Date;
  endDate: Date;
  _beginDate: FormControl;
  _endDate: FormControl;
  
  constructor( public globalDate:GlobalService) { 
    this.endDate = moment().toDate();
    this.beginDate = moment().subtract(10, 'minute').toDate();
    /*     let d1 = moment(globalService.getBeginDateTimeFilter());//("2017-12-22 5:50:00");//  moment().format(GlobalService.sqlDateTimeFormat));
        let d2 = moment(globalService.getEndDateTimeFilter());//("2017-12-22 5:50:00");//  moment().format(GlobalService.sqlDateTimeFormat));
     */
    this._beginDate = new FormControl(this.beginDate);
    this._endDate = new FormControl(this.endDate); 
    this.updateForm();   
  }

  ngOnInit() {
  }

  updateForm() {
    this._beginDate.setValue(this.beginDate);
    this._endDate.setValue(this.endDate);
    this.updateGlobalServices();
  }

  updateGlobalServices() {
    this.globalDate.beginDate=this.beginDate;
    this.globalDate.endDate=this.endDate;
  }

  formChangeSetBeginDate(type: string, event: any) {
    if (moment(this.beginDate).format("DD-MM-YYYY") != moment(event.value.toDate()).format("DD-MM-YYYY")) {
      let takeDate = moment(event.value.toDate()).format("DD-MM-YYYY");
      let takeTime = moment(this.beginDate).format("HH:mm");
      this.beginDate = moment(takeDate + " " + takeTime, 'DD-MM-YYYY HH:mm').toDate();
      this.updateForm();
    }
  }

  formChangeSetEndDate(type: string, event: any) {
    if (moment(this.endDate).format("DD-MM-YYYY") != moment(event.value.toDate()).format("DD-MM-YYYY")) {
      let takeDate = moment(event.value.toDate()).format("DD-MM-YYYY");
      let takeTime = moment(this.endDate).format("HH:mm");
      this.endDate = moment(takeDate + " " + takeTime, 'DD-MM-YYYY HH:mm').toDate();
      this.updateForm();
    }
  }
  
  setBeginTime(event) {
    let str2Date = moment(event, 'DD-MM-YYYY HH:mm');
    this.beginDate = str2Date.toDate();
    this.updateForm();
  }

  setEndTime(event) {
    let str2Date = moment(event, 'DD-MM-YYYY HH:mm');
    this.endDate = str2Date.toDate();
    this.updateForm();
  }
}


 