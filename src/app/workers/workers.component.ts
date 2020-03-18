import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'
import { ServicesService } from '../services.service';
import { Worker } from '../worker'
import { Router } from '@angular/router'
import { WorkerRules } from '../worker-rules';
import { LoginService } from '../login.service';


@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.scss']
})
export class WorkersComponent implements OnInit {

  editeId: number;
  counter: number = 0;
  total: number;
  net: number;
  totalDisc:number;
  netSalary: number = 0;
  netMinutes: number;
  moneyOut: number = 0;
  // delay variables
  result: number = 0;
  sunResult: any;
  monResult: any;
  tusResult: any;
  wedResult: any;
  thuResult: any;
  friResult: any;
  satResult: any;
  checkInDailyMinutes: any[] = [this.sunResult, this.monResult, this.tusResult, this.wedResult, this.thuResult, this.friResult, this.satResult]
  // total delayes
  resultO: number = 0;
  sunResultO: any;
  monResultO: any;
  tusResultO: any;
  wedResultO: any;
  thuResultO: any;
  friResultO: any;
  satResultO: any;
  checkOutDailyMinutes: any[] = [this.sunResultO, this.monResultO, this.tusResultO, this.wedResultO, this.thuResultO, this.friResultO, this.satResultO]
  // netminutes
  resultD: number = 0;
  sunResultD: any;
  monResultD: any;
  tusResultD: any;
  wedResultD: any;
  thuResultD: any;
  friResultD: any;
  satResultD: any;
  dailyResultDArry: any[] = [this.sunResultD, this.monResultD, this.thuResultD, this.wedResultD, this.thuResultD, this.friResultD, this.satResultD]

  // this.minutes(Number for day) // (O) for checkOut
  minutes1: number; minutes2: number; minutes3: number; minutes4: number; minutes5: number; minutes6: number; minutes7: number;
  minutesArry: any[] = [this.minutes1, this.minutes2, this.minutes3, this.minutes4, this.minutes5, this.minutes6, this.minutes7]

  minutesO1: number; minutesO2: number; minutesO3: number; minutesO4: number; minutesO5: number; minutesO6: number; minutesO7: number;
  minutesOArry: any[] = [this.minutesO1, this.minutesO2, this.minutesO3, this.minutesO4, this.minutesO5, this.minutesO6, this.minutesO7];

  // input variables
  fst: string; snd: string; thrd: string; forth: string; fif: string; six: string; sev: string // checkIn variables
  CheckInInputsArry: string[]; // = [this.fst, this.snd, this.thrd, this.forth, this.fif, this.six, this.sev]

  fstO: string; sndO: string; thrdO: string; forthO: string; fifO: string; sixO: string; sevO: string // checkOut variables
  CheckOutInputsArry: any[]; // = [this.fifO, this.sndO, this.thrdO, this.forthO, this.fifO, this.sixO, this.sevO]

  condTest: any[] = [undefined, null, "غياب", "NaN", ""] // condetion test arry

  addBtnVal: string;
  workerData: FormGroup;
  workers: Worker[];
  rulesFromSql: WorkerRules[];
  workerDataView: Worker;

  //Rules to setting
  WorkerRuleResult: WorkerRules = {
    workerRuleId: 0,
    outEarlyTime: 59,
    authOverTime: 10,
    authDelayTime: 10,
    halfDayDisc: 60,
    salarytimeKind: '',
    allDayDisc: 0
  };
  workerRule = new FormGroup({
    authOverTime: new FormControl(), // over time author minutes
    authDelayTime: new FormControl(), // delay time author minutes
    outEarlyTime: new FormControl(), // bach home early
    halfDayDisc: new FormControl(), // discound halfDay from salary if
    allDayDisc: new FormControl(), // discound halfDay from salary if
    salarytimeKind: new FormControl() // monthly || daily || weekly
  });

  checkCurrentRoute = this.logService.checkCurrentRoute();
  //------

  constructor(private _service: ServicesService, private formBuilder: FormBuilder,
    private router: Router, private logService: LoginService) {}

  ngOnInit() {

    this.logService.logStart(); this.logService.reternlog();

    this._service.getWorker().subscribe((data: Worker[]) => {
      this.workers = data;
    })
    this._service.getWorkerRules().subscribe((dataRules: WorkerRules[]) => {
      this.rulesFromSql = dataRules;
    })

    this.workerDataView = {
      workerId: null,
      workerName: null, 
      workerTell: null, 
      workerAdd: null, 
      workerJopCateg: null, 
      workerJop: null, 
      workerFbCode: null, 
      workerJopDate: null,
      workerSalary: null, 
      workerYearVacation: null,
      workerCheckIN: null, 
      workerCheckOut: null, 
    }

    this.workerData = this.formBuilder.group({
      workerId: [''],
      workerName: [''],
      workerTell: [''],
      workerAdd: [''],
      workerJopCateg: [''],
      workerJop: [''],
      workerFbCode: [''],
      workerJopDate: [''],
      workerSalary: [''],
      workerYearVacation: [''],
      workerCheckIN: [''],
      workerCheckOut: [''],
    })

    // hide Fade layer
    $('#hideFadeLayer').click(function () {
      $('.fadeLayer').hide()
      $('.askForDelete').removeClass('animate')
    })

  } // ngOnInit

  // saveSalarySetting
  updateSetting() {
    this.showWorkerEnquiry()
    this._service.updateWorkerRulesSer(this.WorkerRuleResult).subscribe(() => {
      //console.log(this.WorkerRuleResult);
      this.showWorkerEnquiry()
      location.reload()
      //console.log('data : ' + this.workerData.value, "view : " + this.workerDataView)
    },
      error => {
        alert(error);
        //console.log(this.workerDataView);
      });
  }

  showWorkerSetting() {
    this._service.getWorkerRules().subscribe((dataRules: WorkerRules[]) => {
      this.rulesFromSql = dataRules;
    });
    console.log(this.logService.isUser)
    $('#showAddWorkerBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    $('#workerEnquirybtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    $('.workerClass').not('#workerSetting').hide();
    $('#workerSetting').show();
    this.WorkerRuleResult = this.rulesFromSql[0];
  }

  resetValues() {
    this.workerData = this.formBuilder.group({
      workerId: [''],
      workerName: [''],
      workerTell: [''],
      workerAdd: [''],
      workerJopCateg: [''],
      workerJop: [''],
      workerFbCode: [''],
      workerJopDate: [''],
      workerSalary: [''],
      workerYearVacation: [''],
      workerCheckIN: [''],
      workerCheckOut: [''],
    });
    this.workerDataView = {
      workerId: null,
      workerName: null,
      workerTell: null,
      workerAdd: null,
      workerJopCateg: null,
      workerJop: null,
      workerFbCode: null,
      workerJopDate: null,
      workerSalary: null,
      workerYearVacation: null,
      workerCheckIN: null,
      workerCheckOut: null,
    };
  };

  // CRUD Functions
  addNewWorker() {
    this.addBtnVal = $('#addNewWorkerBtn').html()
    if (this.addBtnVal == 'اضافة') {
      this._service.creatEmployee(this.workerData.value)
        .subscribe()
      this._service.clearForm();
    } else if (this.addBtnVal == 'تعديل') {
      this._service.updateWorkerSer(this.workerDataView).subscribe(() => {
        this.showWorkerEnquiry()
      },
        error => {
          alert(error);
          console.log(this.workerDataView);
        });
    };
  };

  askForDelete(worker: Worker) {
    $('.fadeLayer').show(0)
    $('.askForDelete').addClass('animate')
    this.workerDataView = worker;
  };

  showUpdateWorker(worker: Worker) {
    $('.workerClass').not('#addWorker').hide();
    $('#addWorker').show();
    $('#addNewWorkerBtn').html('تعديل');
    $('#addWorker h2:first').html('تعديل بيانات موظف');
    this.workerDataView = worker;
    $('#showAddWorkerBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    $('#workerEnquirybtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    $('#workerSearch').hide(100)
  };

  deletWorker() {
    $('.fadeLayer').hide()
    this._service.deleteWorkerSer(this.workerDataView.workerId)
      .subscribe(data => {
        this.workers = this.workers.filter(u => u !== this.workerDataView)
      });
  };

  ShowAddNewWorker() {
    this._service.clearForm();
    this.resetValues();
    $('#addNewWorkerBtn').html('اضافة');
    $('#addWorker h2:first').html('اضافة بيانات موظف');
    $('#showAddWorkerBtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
    $('#workerEnquirybtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    $('.workerClass').not('#addWorker').hide();
    $('#addWorker').show();
    $('#workerSearch').hide(100);
  };

  showWorkerCard(worker: Worker) {
    this.workerDataView = worker;
    $('#showAddWorkerBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    $('#workerEnquirybtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    $('.workerClass').not('#workerDetails').hide();
    $('#workerDetails').show();
    $('#workerSearch').hide(100)
  };

  showWorkerEnquiry() {
    $('.workerClass').not('#workerEnquiry').hide();
    $('#workerEnquiry').show();
    $('#workerEnquirybtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
    $('#showAddWorkerBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    $('#workerSearch').show(100);
  };

  showSalaryCount(worker: Worker) {
    this.workerDataView = worker;
    $('#salaryCount h4:first').val(worker.workerCheckIN);
    $('#salaryCount h4:first').next().val(worker.workerCheckOut);
    $('#salaryCount h4:first').next().next().val(worker.workerSalary);
    $('#showAddWorkerBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    $('#workerEnquirybtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    $('.workerClass').not('#salaryCount').hide();
    $('#salaryCount').show();
    $('#workerSearch').hide(100)
    for (let i = 0; i < this.checkInDailyMinutes.length; i++) {
      this.checkInDailyMinutes[i] = 0;
      this.checkOutDailyMinutes[i] = 0;
      this.dailyResultDArry[i] = 0;
    };
    this.total = 0; this.netSalary = 0; this.counter = 0; this.net = 0; this.totalDisc = 0; // reset values
   
    this.snd = worker.workerCheckIN; this.thrd = worker.workerCheckIN; this.forth = worker.workerCheckIN; this.fif = worker.workerCheckIN; this.six = worker.workerCheckIN; this.sev = worker.workerCheckIN // checkIn variables
    this.sndO = worker.workerCheckOut; this.thrdO = worker.workerCheckOut; this.forthO = worker.workerCheckOut; this.fifO = worker.workerCheckOut; this.sixO = worker.workerCheckOut; this.sevO = worker.workerCheckOut // checkOut variables
  }

  // defult start and end time
  startTimeD: any;
  endTimeD: any;

  // sum Array method
  sumArry(arr: any[]) {
    let s = 0
    for (let i = 0; i < arr.length; i++) {
      s = s + arr[i]
    }
    return s
  };

  mathWorkerInfo() {
    let checkIn = this.workerDataView.workerCheckIN
    let checkOut = this.workerDataView.workerCheckOut
    let startHour = checkIn.split(":");
    let endHour = checkOut.split(":");
    let inH: number = parseInt(startHour[0]);
    let inM: number = parseInt(startHour[1]);
    let outH: number = parseInt(endHour[0]);
    let outM: number = parseInt(endHour[1]);
    this.startTimeD = new Date(1, 1, 2, inH, inM, 0); // Defult start time
    this.endTimeD = new Date(1, 1, 2, outH, outM, 0); // Defult end time
    if (this.endTimeD < this.startTimeD) {
      this.endTimeD = new Date(1, 1, 3, outH, outM, 0); // handle 24 hour
    }
    let diffD: number = this.endTimeD.getTime() - this.startTimeD.getTime();
    this.netMinutes = Math.floor(diffD / 1000 / 60);
    //console.log('net minutes : ' + this.netMinutes)
  }


  diff_minutes(dt2, dt1) {
    let diff = dt2.getTime() - dt1.getTime()
    return Math.floor(diff / 1000 / 60);
  }

  calc(worker) {

    this.mathWorkerInfo();

    // defultCheckIn
    let end = (worker.workerCheckIN).split(":");
    let b3: number = parseInt(end[0]);
    let b4: number = parseInt(end[1]);
    let endTime = new Date(1, 1, 2, b3, b4, 0);
    // defultCheckOut
    let endO = (worker.workerCheckOut).split(":");
    let b1: number = parseInt(endO[0]);
    let b2: number = parseInt(endO[1]);
    let endTimeOut = new Date(1, 1, 2, b1, b2, 0);
    if (endTimeOut < endTime) { // handle 24 hour
      endTimeOut = new Date(1, 1, 3, b1, b2, 0);
    }

    this.CheckInInputsArry = [this.fst, this.snd, this.thrd, this.forth, this.fif, this.six, this.sev]
    this.CheckOutInputsArry = [this.fstO, this.sndO, this.thrdO, this.forthO, this.fifO, this.sixO, this.sevO]
    let weekDays: number = 7

    // start Minutes

    let timeStartArr: any[] = []; // input times as a date
    let timeOutArry: any[] = []; // output times as a date

    for (let i = 0; i < weekDays; i++) {
      if (this.condTest.includes(this.CheckInInputsArry[i])) {
        let start = '0:0'
        timeStartArr.push(start)
      } else {
        let start = this.CheckInInputsArry[i].split(':');
        let s1: number = parseInt(start[0]);
        let s2: number = parseInt(start[1]);
        let timeStart = new Date(1, 1, 2, s1, s2, 0);
        timeStartArr.push(timeStart)
      }
      if (this.condTest.includes(this.CheckOutInputsArry[i])) {
        let start2 = '0:0'
        timeOutArry.push(start2)
      } else {
        let start2 = this.CheckOutInputsArry[i].split(':');
        let sO1: number = parseInt(start2[0]);
        let sO2: number = parseInt(start2[1]);
        let timeOut = new Date(1, 1, 2, sO1, sO2, 0);
        timeOutArry.push(timeOut)
      }
    }

    // start Minutes
    for (let i = 0; i < weekDays; i++) {
      if (this.condTest.includes(this.CheckInInputsArry[i])) {
        this.minutesArry[i] = 'غياب'
      } else {
        this.minutesArry[i] = this.diff_minutes(endTime, timeStartArr[i])
      }
    };
    // end Minutes
    for (let i = 0; i < weekDays; i++) {
      if (this.condTest.includes(this.CheckOutInputsArry[i])) {
        this.minutesOArry[i] = 'غياب'
      } else {
        let start2 = this.CheckOutInputsArry[i].split(':');
        let sO1: number = parseInt(start2[0]);
        let sO2: number = parseInt(start2[1]);
        let timeOut = new Date(1, 1, 3, sO1, sO2, 0);
        if (timeOutArry[i] < timeStartArr[i]) { // handle 24 hour
          timeOutArry[i] = timeOut
        }
        this.minutesOArry[i] = this.diff_minutes( timeOutArry[i] , endTimeOut)
      }
    }; //console.log('timeOutArry : ' + timeOutArry[1], 'timeStartArr : ' + timeStartArr[1])

    // start minutes result
    for (let i = 0; i < weekDays; i++) {
      if (this.condTest.includes(this.CheckInInputsArry[i]) || (this.minutesArry[i] * -1) >= this.rulesFromSql[0].allDayDisc) {
        this.checkInDailyMinutes[i] = 'غياب'
      } else if ((this.minutesArry[i] * -1) > this.rulesFromSql[0].halfDayDisc) {
        this.checkInDailyMinutes[i] = (this.netMinutes * -1) / 2
      } else {
        this.checkInDailyMinutes[i] = this.minutesArry[i]
      }
    }; //console.log('minutesArry : ' + this.minutesArry[1])
    // end minutes result
    for (let i = 0; i < weekDays; i++) {
      if (this.condTest.includes(this.CheckOutInputsArry[i])) {
        this.checkOutDailyMinutes[i] = 'غياب'
      } else if (this.minutesOArry[i] < (this.rulesFromSql[0].outEarlyTime * -1)) {
        this.checkOutDailyMinutes[i] = (this.netMinutes * -1) / 2
      } else if (this.minutesOArry[i] < this.rulesFromSql[0].authOverTime && this.minutesOArry[i] > 0) {
        this.checkOutDailyMinutes[i] = 0;
      } else {
        this.checkOutDailyMinutes[i] = this.minutesOArry[i]
      }
    };

    // net minutes result
    for (let i = 0; i < weekDays; i++) {
      if (this.condTest.includes(this.checkInDailyMinutes[i]) || this.condTest.includes(this.checkOutDailyMinutes[i])) {
        this.dailyResultDArry[i] = 'غياب'
      } else {
        this.dailyResultDArry[i] = this.checkInDailyMinutes[i] + this.checkOutDailyMinutes[i]
      }
    }

    // all workedMinutes
    let salary: number = worker.workerSalary
    let minuteCost: number; //((this.netMinutes * 6) * 4);
    if (this.rulesFromSql[0].salarytimeKind == 'يومى') {
      minuteCost = (salary / this.netMinutes)
    } else if (this.rulesFromSql[0].salarytimeKind == 'شهرى') {
      minuteCost = (salary / 4 / 6 / this.netMinutes)
    } else if (this.rulesFromSql[0].salarytimeKind == 'اسبوعى') {
      minuteCost = (salary / 6 / this.netMinutes)
    };

    let workedMinutesSun: number;
    let workedMinutesMon: number;
    let workedMinutesTus: number;
    let workedMinutesWed: number;
    let workedMinutesThu: number;
    let workedMinutesFri: number;
    let workedMinutesSat: number;
    let allWorkedMinutes: number;
    let dailyWorkedMinutes: any[] = [workedMinutesSun, workedMinutesMon, workedMinutesTus, workedMinutesWed, workedMinutesThu, workedMinutesFri, workedMinutesSat]

    for (let i = 0; i < weekDays; i++) {
      if (this.condTest.includes(this.dailyResultDArry[i])) {
        dailyWorkedMinutes[i] = 0
      } else {
        dailyWorkedMinutes[i] = this.netMinutes + this.dailyResultDArry[i]
      };
    };

    // total delay minutes
    let resultArry: any[] = [0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < weekDays; i++) {
      if (this.condTest.includes(this.checkInDailyMinutes[i])) {
        resultArry[i] = 0;
      } else {
        resultArry[i] = this.checkInDailyMinutes[i];
      }
    }
    // total OverTime minutes
    let resultOutArry: any[] = [0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < weekDays; i++) {
      if (this.condTest.includes(this.checkOutDailyMinutes[i])) {
        resultOutArry[i] = 0;
      } else {
        resultOutArry[i] = this.checkOutDailyMinutes[i];
      }
    }

    // count how many daysOff
    if (this.counter > 0) {
      this.counter = 0;
    }
    for (let i = 0; i < weekDays; i++) {
      if (this.dailyResultDArry[i] == 'غياب') {
        this.counter++;
      }
    }

    // totals
    allWorkedMinutes = this.sumArry(dailyWorkedMinutes);
    this.total = Math.floor(allWorkedMinutes * minuteCost);
    this.result = this.sumArry(resultArry);
    this.resultO = this.sumArry(resultOutArry);
    this.net = Math.floor(this.resultO + this.result);
    this.totalDisc = Math.ceil((this.net * minuteCost) * -1);
    if (this.totalDisc < 0) {
      this.totalDisc = this.totalDisc * -1
      $('#discOrOver').html('اجمالى اضافة')
    } else {
      $('#discOrOver').html('اجمالى خصم');
      //this.totalDisc = Math.floor((this.net * minuteCost) * -1);
    }
    this.netSalary = Math.floor(this.total - this.moneyOut);

    
  } // calc()

  reCount() {
    this.counter = 0
    $('#sunResult').removeClass('bg-success bg-danger')
  }

} //---------------------end
