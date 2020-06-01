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

  }

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

  sortArry(key, order = 'asc') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    }
  }

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
      }
    }

    this.fullDate = dateTimeArry[2] + '-' + dateTimeArry[1] + '-' + dateTimeArry[0] // this.year + '-' + this.month + '-' + this.day// this.month + '-' + this.day + '-' + this.year
    this.fullTime = dateTimeArry[3] + ':' + dateTimeArry[4] // this.hour + ':' + this.minutes
    this.fullDate.toString();
    this.fullTime.toString()
    this.date_time = this.fullDate + 'T' + this.fullTime // + ' ' + this.fullTime

  }


  printThis(show: string, hide1: string, hide2: string, hide3: string) {

    $(show).animate({
      'width': '85%',
      'hight': '100%',
    })//.addClass('wideScreen')
    $('#app-side-bar').hide();
    $('#sidebarToggle').hide();
    if (hide1 != '') {
      $(hide1).slideUp(50)
    }
    if (hide2 != '') {
      $(hide2).slideUp(50);
    }
    if (hide3 != '') {
      $(hide3).slideUp(50)
    }
    $('#mainStockHeader').slideUp(75)
    $('.vaildAlert').fadeOut();

  }

  clearForm() {
    $('.form-control').val(null)
  };

  // defult url
  url: string = 'http://localhost/accounting/'

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

}
