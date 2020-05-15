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

    for (let i = 0 ; i < dateTimeArry.length ; i++) {
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

    $(show).addClass('wideScreen container');
    $('#app-side-bar').hide();
    $('#sidebarToggle').hide();
    if (hide1 != '') {
      $(hide1).hide();
    }
    if (hide2 != '') {
      $(hide2).hide();
    }
    if (hide3 != '') {
      $(hide3).hide();
    }
    $('#mainStockHeader').hide();
    $('.vaildAlert').hide();

  }

  clearForm() {
    $('.form-control').val('')
  };

  getWorker() {
    return this.http.get<Worker[]>('http://localhost/accounting/list.php');
  }

  creatEmployee(employee: Worker) {
    return this.http.post('http://localhost/accounting/postEmployee.php', employee)
  }

  deleteWorkerSer(id: number) {
    return this.http.delete<Worker[]>('http://localhost/accounting/deleteEmployee.php?id=' + id)
  }

  updateWorkerSer(employee: Worker) {
    return this.http.put('http://localhost/accounting/updateEmployee.php?id=' + employee.workerId, employee)
  }

  updateWorkerRulesSer(workerRules: WorkerRules) {
    return this.http.put('http://localhost/accounting/editWorkerRules.php?id=1', workerRules)
  }

  getWorkerRules() {
    return this.http.get<WorkerRules[]>('http://localhost/accounting/workerRulesList.php');
  }

  getOtherAccSer() {
    return this.http.get<OtherAcc[]>('http://localhost/accounting/otherAccountsList.php');
  }

}
