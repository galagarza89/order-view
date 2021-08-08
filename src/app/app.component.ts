import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  csvRecords: any[] = [];
  header = false;
  orders: any[] = [];

  constructor(private ngxCsvParser: NgxCsvParser) {
  }

  @ViewChild('fileImportInput', { static: false }) fileImportInput: any;



  // Your applications input change listener for the CSV File
  fileChangeListener($event: any): void {

    // Select the files from the event
    const files = $event.srcElement.files;

    // Parse the file you want to select for the operation along with the configuration
    this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',' })
      .pipe().subscribe((result: any) => {

        this.csvRecords = result;
        this.convertToJSON(result);
      }, (error: NgxCSVParserError) => {
        console.log('Error', error);
      });

  }

  // Convert CSV array to JSON
  convertToJSON(result: any) {
    const keys: string[] = result[0];
    const values = result.slice(1);
    const objects = values.map((arr: any) => {
      const object: any = {};

      keys.forEach((key, i) => object[key] = arr[i]);

      return object;
    });

    this.groupBy(objects);

  }


  groupBy(objArray: any[]) {
    let group = objArray.reduce((r, a) => {
      r[a["Order ID"]] = [...r[a["Order ID"]] || [], a];
      return r;
     }, {});

     this.orders = Object.entries(group);
  };



} // End of class AppComponent

