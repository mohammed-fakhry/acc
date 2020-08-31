import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Worker } from './worker'
import { WorkerRules } from './worker-rules';
import { Router } from '@angular/router';
import { StocksService } from './accountings/stocks/the-stocks/stocks.service';
import { OtherAcc } from './accountings/other-acc';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(public http: HttpClient, public router: Router, public _stockService: StocksService) { }

  showAddNewInvoiceSer(invoice) {
    this.router.navigate['stocks'];
  };

  // make Date and Time
  dateNow: any;
  day: any;
  month: any;
  year: any;
  fullDate: any;
  hour: any;
  minutes: any;
  fullTime: any;
  date_time: any;

  handleTableHeight() {
    if (window.innerHeight == screen.height) {
      // browser is fullscreen
      $('.panel-body').not('.invoiceTable').not('.standTable').not('.tableWithHeader').css('height', '920px')
      $('.invoiceTable').css('height', '590px')
      $('.tableWithHeader').css('height', '860px')
    } else {
      $('.panel-body').not('.invoiceTable').not('.standTable').not('.tableWithHeader').css('height', '820px')
      $('.tableWithHeader').css('height', '740px')
      $('.invoiceTable').css('height', '530px')
    }
  }

  sortArry(key, order = 'asc') {


    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      };
      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      };
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  };

  inArabicWords = (number) => {
    let aNum: any;
    //this.theANum = "320862"

    var one = [
      '', 'واحد ', 'اثنان ', 'ثلاثة ', 'اربعة ', 'خمسة '
      , 'ستة ', 'سبعة ', 'ثمانية ', 'تسعة ', 'عشرة ', 'احدى عشر '
      , 'اثنى عشر ', 'ثلاثة عشر ', 'اربعة عشر ', 'خمسة عشر '
      , 'ستة عشر ', 'سبعة عشر ', 'ثمانية عشر ', 'تسعة عشر '
    ];

    var two = ['', '', ' عشرون ', 'ثلاثون ', 'اربعون ', 'خمسون ', 'ستون ', 'سبعون ', 'ثمانون ', 'تسعون'];
    var hund = ['', 'مائة', 'مئتان', 'ثلاثمائة ', 'اربعمائة ', 'خمسمائة', 'ستمائة ', 'سبعمائة', 'ثمانمائة', 'تسعمائة ']

    if ((number = number.toString()).length > 9) return 'overflow';
    aNum = ('000000000' + number).substr(-9).match(/^(\d{2})(\d{1})(\d{1})(\d{2})(\d{1})(\d{2})$/);
    if (!aNum) return; var strA = '';
    strA += (aNum[1] != 0) ? (one[Number(aNum[1])] || two[aNum[1][0]] + ' ' + one[aNum[1][1]]) + 'بليون ' : '';
    strA += (aNum[2] != 0) ? (one[Number(aNum[2])] || two[aNum[2][0]] + ' ' + one[aNum[2][1]]) + 'مليون ' : '';

    strA += (aNum[3] != 0) ?
      ((aNum[2] != 0) ? 'و ' : '') +
      `${(hund[Number(aNum[3])])} ` +
      ((aNum[4] == 0) ? 'الف ' : '')
      : '';

    strA += (aNum[4] != 0) ?
      ((aNum[3] != 0 && one[aNum[4][1]] != '') ? 'و' : '') +
      ((one[Number(aNum[4])] != undefined) ? ` ${one[Number(aNum[4])]} الف ` : `${one[aNum[4][1]]}و ${two[aNum[4][0]]} الف `) : '';

    strA += (aNum[5] != 0) ? `و ${(hund[Number(aNum[5])])} ` : '';

    strA += (aNum[6] != 0) ? ((one[aNum[6][1]] != '') ? 'و ' : '') + (one[Number(aNum[6])] || `${one[aNum[6][1]]}و ${two[aNum[6][0]]}`) : '';

    return strA;

  };

  sumArry(arr: any[]) {
    let s = 0
    for (let i = 0; i < arr.length; i++) {
      s = s + arr[i]
    }
    return s
  };

  makeTime_date(currentDate) {

    this.dateNow = currentDate // new Date();
    this.day = this.dateNow.getDate();
    this.month = this.dateNow.getMonth() + 1;
    this.year = this.dateNow.getFullYear();
    this.hour = this.dateNow.getHours();
    this.minutes = this.dateNow.getMinutes();

    let dateTimeArry = [
      this.day,
      this.month,
      this.year,
      this.hour,
      this.minutes
    ]

    for (let i = 0; i < dateTimeArry.length; i++) {
      if (dateTimeArry[i] < 10) {
        dateTimeArry[i] = '0' + dateTimeArry[i]
      };
    };

    this.fullDate = dateTimeArry[2] + '-' + dateTimeArry[1] + '-' + dateTimeArry[0] // this.year + '-' + this.month + '-' + this.day// this.month + '-' + this.day + '-' + this.year
    this.fullTime = dateTimeArry[3] + ':' + dateTimeArry[4] // this.hour + ':' + this.minutes
    this.fullDate.toString();
    this.fullTime.toString()
    this.date_time = this.fullDate + 'T' + this.fullTime // + ' ' + this.fullTime

  };

  setDate_time(date: string) {

    let d = new Date(date)

    let obj = {
      year: d.getFullYear(),
      month: () => ((d.getMonth() + 1) < 10) ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`,
      day: () => (d.getDate() < 10) ? `0${d.getDate()}` : `${d.getDate()}`,

      hour: () => {
        if (d.getHours() < 10) {
          return `0${d.getHours()}`

        } else if (d.getHours() >= 10 && d.getHours() <= 12) {
          return `${d.getHours()}`

        } else {

          if ((d.getHours() - 12) < 10) {
            return `0${d.getHours() - 12}`

          } else {
            return `${d.getHours() - 12}`
          };
        };
      },

      minutes: () => (d.getMinutes() < 10) ? `0${d.getMinutes()}` : `${d.getMinutes()}`,
      timeCond: () => (d.getHours() >= 12) ? 'pm' : 'am',
    };

    return `(${obj.hour()}:${obj.minutes()}${obj.timeCond()}) | ${obj.day()}/${obj.month()}/${obj.year}`

  };


  printThis() {
    $('table').removeClass('flex-table');
    $('.panel-body').removeClass('panel-flex-table');
    window.print();
    $('table').addClass('flex-table')
    $('.panel-body').addClass('panel-flex-table')
  };

  clearForm() {
    $('.form-control').val(null);
  };

  // defult url
  url: string = localStorage.getItem('tmpDB'); //'http://localhost/accounting/'

  getWorker() {
    return this.http.get<Worker[]>(`${this.url}list.php`);
  };

  creatEmployee(employee: Worker) {
    return this.http.post(`${this.url}postEmployee.php`, employee)
  };

  deleteWorkerSer(id: number) {
    return this.http.delete<Worker[]>(`${this.url}deleteEmployee.php?id=` + id)
  };

  updateWorkerSer(employee: Worker) {
    return this.http.put(`${this.url}updateEmployee.php?id=` + employee.workerId, employee)
  };

  updateWorkerRulesSer(workerRules: WorkerRules) {
    return this.http.put(`${this.url}editWorkerRules.php?id=1`, workerRules)
  };

  getWorkerRules() {
    return this.http.get<WorkerRules[]>(`${this.url}workerRulesList.php`);
  };

  getOtherAccSer() {
    return this.http.get<OtherAcc[]>(`${this.url}otherAccountsList.php`);
  };

  creatOtherAccSer(acc: OtherAcc) {
    return this.http.post(`${this.url}postOtherAcc.php`, acc)
  };

  updateOtherAccSer(acc: OtherAcc) {
    return this.http.put(`${this.url}updateOtherAccounts.php?id=` + acc.accId, acc)
  };

  backUp() {
    return this.http.get<any>(`${this.url}backup.php`);
  }

}
