import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'
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
  totalDisc: number;
  netSalary: number = 0;
  netMinutes: number;
  moneyOut: number = 0;
  // delay variables

  result: number = 0;

  resultO: number = 0;

  condTest: any[] = [undefined, null, "غياب", "NaN", ""] // condetion test arry

  addBtnVal: string;
  workerData: FormGroup;
  workers: Worker[];
  rulesFromSql: WorkerRules[];
  //workerDataView: Worker;
  searchTxt: string;

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

  constructor(public _service: ServicesService, public formBuilder: FormBuilder,
    public router: Router, public logService: LoginService) { }

  ngOnInit() {

    this.logService.logStart(); this.logService.reternlog();

    this.getBackendData();

    this._service.handleTableHeight();

    this.workerData = new FormGroup({
      workerId: new FormControl(''),
      workerName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      workerTell: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
      workerAdd: new FormControl('', [Validators.required, Validators.min(5), Validators.max(100)]),
      workerJopCateg: new FormControl('', [Validators.required]),
      workerJop: new FormControl('', [Validators.required]),
      workerFbCode: new FormControl('', [Validators.required]),
      workerJopDate: new FormControl(''),
      workerSalary: new FormControl('', [Validators.required]),
      workerYearVacation: new FormControl(''),
      workerCheckIN: new FormControl('', [Validators.required]),
      workerCheckOut: new FormControl('', [Validators.required]),
    });
    // hide Fade layer
    $('#hideFadeLayer').click(function () {
      $('#workersfadeLayer').fadeOut('fast')
      $('.askForDelete').fadeOut('fast').removeClass('animate')
    })

  } // ngOnInit

  getBackendData() {
    this._service.url = localStorage.getItem('tmpDB');
    this._service.getWorker().subscribe((data: Worker[]) => {
      this.workers = data;
    })
    this._service.getWorkerRules().subscribe((dataRules: WorkerRules[]) => {
      this.rulesFromSql = dataRules;
    })
  }

  putWorkerDataValue(worker: Worker) {
    this.workerData = new FormGroup({
      workerId: new FormControl(worker.workerId),
      workerName: new FormControl(worker.workerName, [Validators.required, Validators.minLength(5)]),
      workerTell: new FormControl(worker.workerTell, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
      workerAdd: new FormControl(worker.workerAdd, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      workerJopCateg: new FormControl(worker.workerJopCateg, [Validators.required]),
      workerJop: new FormControl(worker.workerJop, [Validators.required]),
      workerFbCode: new FormControl(worker.workerFbCode, [Validators.required]),
      workerJopDate: new FormControl(worker.workerJopDate),
      workerSalary: new FormControl(worker.workerSalary, [Validators.required]),
      workerYearVacation: new FormControl(worker.workerYearVacation),
      workerCheckIN: new FormControl(worker.workerCheckIN, [Validators.required]),
      workerCheckOut: new FormControl(worker.workerCheckOut, [Validators.required]),
    })

  }

  validTest: boolean;
  inpArrErroTest = [];
  inpArrErroTouched = [];
  isValid() {
    let inpArrValidId = [
      'workerName',
      'workerTell',
      'workerAdd',
      'workerJopCateg',
      'workerJop',
      'workerFbCode',
      'workerJopDate',
      'workerSalary',
      'workerYearVacation',
      'workerCheckIN',
      'workerCheckOut',
    ]

    document.addEventListener("keyup", e => {
      this.inpArrErroTest = [
        this.workerData.controls.workerName.errors,
        this.workerData.controls.workerTell.errors,
        this.workerData.controls.workerAdd.errors,
        this.workerData.controls.workerJopCateg.errors,
        this.workerData.controls.workerJop.errors,
        this.workerData.controls.workerFbCode.errors,
        this.workerData.controls.workerJopDate.errors,
        this.workerData.controls.workerSalary.errors,
        this.workerData.controls.workerYearVacation.errors,
        this.workerData.controls.workerCheckIN.errors,
        this.workerData.controls.workerCheckOut.errors,
      ]
      this.inpArrErroTouched = [
        this.workerData.controls.workerName.touched,
        this.workerData.controls.workerTell.touched,
        this.workerData.controls.workerAdd.touched,
        this.workerData.controls.workerJopCateg.touched,
        this.workerData.controls.workerJop.touched,
        this.workerData.controls.workerFbCode.touched,
        this.workerData.controls.workerJopDate.touched,
        this.workerData.controls.workerSalary.touched,
        this.workerData.controls.workerYearVacation.touched,
        this.workerData.controls.workerCheckIN.touched,
        this.workerData.controls.workerCheckOut.touched,
      ]
      for (let i = 0; i < this.inpArrErroTest.length; i++) {
        if (this.inpArrErroTouched[i]) {
          if (this.inpArrErroTest[i] != null) {
            //this.validTest = true
            $(`#${inpArrValidId[i]}`).addClass('is-invalid').removeClass('is-valid')
          } else {
            $(`#${inpArrValidId[i]}`).removeClass('is-invalid').addClass('is-valid')
            //this.validTest = false
          }
        }
      }
    })
  }

  // saveSalarySetting
  updateSetting() {
    this.showWorkerEnquiry()
    this._service.updateWorkerRulesSer(this.WorkerRuleResult).subscribe(() => { },
      error => {
        alert(error);
      });
    this.showWorkerEnquiry()
    this.getBackendData();
  };

  buttonEffect(max: string, min: string) {
    $(max).removeClass("btn-light").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $(max).attr({ 'disabled': true });

    $(min).removeClass('btn-outline-secondary').addClass('btn-light').animate({ fontSize: '1em' }, 50);
    $(min).attr({ 'disabled': false });
  };

  activeAllBtns() {
    $('.headerMainBtn').removeClass('btn-outline-secondary').addClass('btn-light').animate({ fontSize: '1em' }, 50);
    $('.headerMainBtn').attr({ 'disabled': false });
  }

  showWorkerSetting() {
    this._service.getWorkerRules().subscribe((dataRules: WorkerRules[]) => {
      this.rulesFromSql = dataRules;
    });
    this.activeAllBtns()
    $('.workerClass').not('#workerSetting').hide();
    $('#workerSetting').show();
    this.WorkerRuleResult = this.rulesFromSql[0];
  }

  resetValues() {
    this.workerData = new FormGroup({
      workerId: new FormControl(''),
      workerName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      workerTell: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
      workerAdd: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      workerJopCateg: new FormControl('', [Validators.required]),
      workerJop: new FormControl('', [Validators.required]),
      workerFbCode: new FormControl('', [Validators.required]),
      workerJopDate: new FormControl(''),
      workerSalary: new FormControl('', [Validators.required]),
      workerYearVacation: new FormControl(''),
      workerCheckIN: new FormControl('', [Validators.required]),
      workerCheckOut: new FormControl('', [Validators.required]),
    })

  };

  // CRUD Functions
  addNewWorker() {
    this.addBtnVal = $('#addNewWorkerBtn').html()
    if (this.addBtnVal == 'اضافة') {
      this._service.creatEmployee(this.workerData.value)
        .subscribe()
      this._service.clearForm();
      //location.reload();
      this.getBackendData();
    } else if (this.addBtnVal == 'تعديل') {
      this._service.updateWorkerSer(this.workerData.value).subscribe(() => { //view
        this.showWorkerEnquiry()
        //location.reload();
      },
        error => {
          alert(error);
        });
      this.getBackendData();
    };
  };

  askForDelete(worker: Worker) {
    $('#workersfadeLayer').show(0)
    $('.askForDelete').show().addClass('animate')
    this.putWorkerDataValue(worker);
  };

  showUpdateWorker(worker: Worker) {
    $('.workerClass').not('#addWorker').hide();
    $('#addWorker').show();
    $('#addNewWorkerBtn').html('تعديل');
    $('#addWorker h2:first').html('تعديل بيانات موظف');

    this.buttonEffect('#showAddWorkerBtn', '#workerEnquirybtn');

    $('#workerSearch').hide(100)
    this.putWorkerDataValue(worker);
  };

  deletWorker() {
    $('#workersfadeLayer').hide()
    this._service.deleteWorkerSer(this.workerData.value.workerId)
      .subscribe(data => {
        this.workers = this.workers.filter(u => u !== this.workerData.value)
      });
  };

  ShowAddNewWorker() {
    this._service.clearForm();
    this.resetValues();
    $('#addNewWorkerBtn').html('اضافة');
    $('#addWorker h2:first').html('اضافة بيانات موظف');
    this.buttonEffect('#showAddWorkerBtn', '#workerEnquirybtn');

    $('.workerClass').not('#addWorker').hide();
    $('#addWorker').show();
    $('#workerSearch').hide(100);
  };

  showWorkerCard(worker: Worker) {
    this.putWorkerDataValue(worker);

    $('#showAddWorkerBtn').removeClass('btn-outline-secondary').addClass('btn-light').animate({ fontSize: '1em' }, 50);
    $('#workerEnquirybtn').removeClass('btn-outline-secondary').addClass('btn-light').animate({ fontSize: '1em' }, 50);
    $('#workerEnquirybtn').attr({ 'disabled': false });
    $('#showAddWorkerBtn').attr({ 'disabled': false });

    $('.workerClass').not('#workerDetails').hide();
    $('#workerDetails').show();
    $('#workerSearch').hide(100)
  };

  showWorkerEnquiry() {
    $('.workerClass').not('#workerEnquiry').hide();
    $('#workerEnquiry').show();
    this.buttonEffect('#workerEnquirybtn', '#showAddWorkerBtn');
    $('#workerSearch').show(100);
  };

  checkInpArry = {
    in: [
      { val: null, day: 'sun' },
      { val: null, day: 'mon' },
      { val: null, day: 'tus' },
      { val: null, day: 'wed' },
      { val: null, day: 'thur' },
      { val: null, day: 'fri' },
      { val: null, day: 'sat' }
    ],
    out: [
      { val: null, day: 'sun' },
      { val: null, day: 'mon' },
      { val: null, day: 'tus' },
      { val: null, day: 'wed' },
      { val: null, day: 'thur' },
      { val: null, day: 'fri' },
      { val: null, day: 'sat' }
    ],
    delayes: [
      { val: null, day: 'sun' },
      { val: null, day: 'mon' },
      { val: null, day: 'tus' },
      { val: null, day: 'wed' },
      { val: null, day: 'thur' },
      { val: null, day: 'fri' },
      { val: null, day: 'sat' }
    ],
    extraTime: [
      { val: null, day: 'sun' },
      { val: null, day: 'mon' },
      { val: null, day: 'tus' },
      { val: null, day: 'wed' },
      { val: null, day: 'thur' },
      { val: null, day: 'fri' },
      { val: null, day: 'sat' }
    ],
    netWorkedminutes: [
      { val: null, day: 'sun' },
      { val: null, day: 'mon' },
      { val: null, day: 'tus' },
      { val: null, day: 'wed' },
      { val: null, day: 'thur' },
      { val: null, day: 'fri' },
      { val: null, day: 'sat' }
    ],
    minutesArry: [null, null, null, null, null, null, null],
    minutesOArry: [null, null, null, null, null, null, null]
  }

  showSalaryCount(worker: Worker) {
    this.putWorkerDataValue(worker);
    $('#showAddWorkerBtn').removeClass('btn-outline-secondary').addClass('btn-light').animate({ fontSize: '1em' }, 50);
    $('#workerEnquirybtn').removeClass('btn-outline-secondary').addClass('btn-light').animate({ fontSize: '1em' }, 50);
    $('#workerEnquirybtn').attr({ 'disabled': false });
    $('#showAddWorkerBtn').attr({ 'disabled': false });
    $('.workerClass').not('#salaryCount').hide();
    $('#salaryCount').show();
    $('#workerSearch').hide(100)
    for (let i = 0; i < 7; i++) {
      this.checkInpArry.in[i].val = worker.workerCheckIN;
      this.checkInpArry.out[i].val = worker.workerCheckOut;
      this.checkInpArry.delayes[i].val = null;
      this.checkInpArry.extraTime[i].val = null;
      this.checkInpArry.netWorkedminutes[i].val = null;
      this.checkInpArry.minutesArry[i] = null;
      this.checkInpArry.minutesOArry[i] = null;
    }
    this.total = 0; this.netSalary = 0; this.counter = 0; this.net = 0; this.totalDisc = 0; // reset values
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
    let checkIn = this.workerData.value.workerCheckIN
    let checkOut = this.workerData.value.workerCheckOut
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

    let weekDays: number = 7

    // start Minutes

    let timeStartArr: any[] = []; // input times as a date
    let timeOutArry: any[] = []; // output times as a date

    for (let i = 0; i < weekDays; i++) {
      if (this.condTest.includes(this.checkInpArry.in[i].val)) {
        let start = '0:0'
        timeStartArr.push(start)
      } else {
        let start = this.checkInpArry.in[i].val.split(':');
        let s1: number = parseInt(start[0]);
        let s2: number = parseInt(start[1]);
        let timeStart = new Date(1, 1, 2, s1, s2, 0);
        timeStartArr.push(timeStart)
      }
      if (this.condTest.includes(this.checkInpArry.out[i].val)) {
        let start2 = '0:0'
        timeOutArry.push(start2)
      } else {
        let start2 = this.checkInpArry.out[i].val.split(':');
        let sO1: number = parseInt(start2[0]);
        let sO2: number = parseInt(start2[1]);
        let timeOut = new Date(1, 1, 2, sO1, sO2, 0);
        timeOutArry.push(timeOut)
      }
    }

    // start Minutes
    for (let i = 0; i < weekDays; i++) {
      if (this.condTest.includes(this.checkInpArry.in[i].val)) {
        this.checkInpArry.minutesArry[i] = 'غياب'
      } else {
        this.checkInpArry.minutesArry[i] = this.diff_minutes(endTime, timeStartArr[i])
      }
    };
    // end Minutes
    for (let i = 0; i < weekDays; i++) {
      if (this.condTest.includes(this.checkInpArry.out[i].val)) {
        this.checkInpArry.minutesOArry[i] = 'غياب'
      } else {
        let start2 = this.checkInpArry.out[i].val.split(':');
        let sO1: number = parseInt(start2[0]);
        let sO2: number = parseInt(start2[1]);
        let timeOut = new Date(1, 1, 3, sO1, sO2, 0);
        if (timeOutArry[i] < timeStartArr[i]) { // handle 24 hour
          timeOutArry[i] = timeOut
        }
        this.checkInpArry.minutesOArry[i] = this.diff_minutes(timeOutArry[i], endTimeOut)
      }
    };

    // start minutes result
    for (let i = 0; i < weekDays; i++) {
      if (this.condTest.includes(this.checkInpArry.in[i].val) || (this.checkInpArry.minutesArry[i] * -1) >= this.rulesFromSql[0].allDayDisc) {
        this.checkInpArry.delayes[i].val = 'غياب'
      } else if ((this.checkInpArry.minutesArry[i] * -1) > this.rulesFromSql[0].halfDayDisc) {
        this.checkInpArry.delayes[i].val = (this.netMinutes * -1) / 2
      } else {
        this.checkInpArry.delayes[i].val = this.checkInpArry.minutesArry[i]
      }
    };
    // end minutes result
    for (let i = 0; i < weekDays; i++) {
      if (this.condTest.includes(this.checkInpArry.out[i].val)) {
        this.checkInpArry.extraTime[i].val = 'غياب'
      } else if (this.checkInpArry.minutesOArry[i] < (this.rulesFromSql[0].outEarlyTime * -1)) {
        this.checkInpArry.extraTime[i].val = (this.netMinutes * -1) / 2
      } else if (this.checkInpArry.minutesOArry[i] < this.rulesFromSql[0].authOverTime && this.checkInpArry.minutesOArry[i] > 0) {
        this.checkInpArry.extraTime[i].val = 0;
      } else {
        this.checkInpArry.extraTime[i].val = this.checkInpArry.minutesOArry[i]
      }
    };

    // net minutes result
    for (let i = 0; i < weekDays; i++) {
      if (this.condTest.includes(this.checkInpArry.delayes[i].val) || this.condTest.includes(this.checkInpArry.extraTime[i].val)) {
        this.checkInpArry.netWorkedminutes[i].val = 'غياب'
      } else {
        this.checkInpArry.netWorkedminutes[i].val = this.checkInpArry.delayes[i].val + this.checkInpArry.extraTime[i].val
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

    let dailyWorkedMinutes: any[] = [0, 0, 0, 0, 0, 0, 0]

    for (let i = 0; i < weekDays; i++) {
      if (!this.condTest.includes(this.checkInpArry.netWorkedminutes[i].val)) {
        dailyWorkedMinutes[i] = this.netMinutes + this.checkInpArry.netWorkedminutes[i].val
      };
    };

    // total delay minutes
    let resultArry: any[] = [0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < weekDays; i++) {
      if (this.condTest.includes(this.checkInpArry.delayes[i].val)) {
        resultArry[i] = 0;
      } else {
        resultArry[i] = this.checkInpArry.delayes[i].val;
      }
    }
    // total OverTime minutes
    let resultOutArry: any[] = [0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < weekDays; i++) {
      if (this.condTest.includes(this.checkInpArry.extraTime[i].val)) {
        resultOutArry[i] = 0;
      } else {
        resultOutArry[i] = this.checkInpArry.extraTime[i].val;
      }
    }

    // count how many daysOff
    if (this.counter > 0) {
      this.counter = 0;
    }
    for (let i = 0; i < weekDays; i++) {
      if (this.checkInpArry.netWorkedminutes[i].val == 'غياب') {
        this.counter++;
      }
    }

    // totals
    let allWorkedMinutes = this.sumArry(dailyWorkedMinutes);
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
    $('#sunResult').removeClass('alert-success dangerBg')
  }

} //---------------------end
