import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  beginDate: Date;
  endDate: Date;
  formatDate = "YYYY-MM-DD HH:mm:ss.SSS";
  formatDateShort = "YYYY-MM-DD HH:mm";
  url:string="http://192.168.2.11:5300/api/"; /////tmmmm
  selectedTags: tagStructure[];

  tagList: any;

  constructor(private http: HttpClient) {
    this.http.get(this.url+"Tags").subscribe(value => {
      this.tagList = [];
      this.tagList = value;
      console.log("tag listesi ", this.tagList)

    })
  }


  sendData(recordTag) {
    console.log(recordTag);
      this.http.post (this.url+"Records",  JSON.stringify(recordTag[0]),
    {headers:new HttpHeaders( {'Content-Type': 'application/json'})})
    .subscribe(response =>{
    
    console.log(response);
    console.log("combineData", recordTag)
    
    },error=> 
    console.log(error))    
    

    }
}

export interface tagStructure {
  no: string;
  name: string;
  description: string;
  location: number;
  client: number;
  extra: string;
}
export interface recordStructure {
  iDay: string,
  lastChange: string,
  minutes: [{
    iMinute:string,
    lastChange: string,
    tags:[{
      no:number,
      Values:[{
        Value:string,
        timeStamp:string
      }]
    }]
  }];
}