import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UnitData } from '../unit-data';
import { UnitService } from '../unit.service';
import { ServicesService } from '../services.service';
import { TowerData } from '../tower-data';
import { ContractData } from '../contract-data';
import { ContractVaildInpts } from '../contract-vaild-inpts';
import { ContractInpts } from '../contract-inpts';
import { ClientServiceService } from '../client-service.service';
import { ClientsData } from '../clients-data';
import { ClientPaymentService } from '../client-payment.service';
import { ClientPayment } from '../client-payment';

@Component({
  selector: 'app-unites',
  templateUrl: './unites.component.html',
  styleUrls: ['./unites.component.scss']
})
export class UnitesComponent implements OnInit {

  // calculator vars
  metrPrice: number;
  apartWidth: number;
  preMoney: number;
  years: number;
  totalPrice: number;
  remainPrice: number;
  remainPaid: number;
  preMoneyResult: number;
  searchTxt: string;

  // addUnit vars
  unitDataView: UnitData;
  unites: UnitData[];
  addBtnVal: string;
  //unitQtys: number;
  //fstUnitNum: number;
  unitBuildingNum: string;

  // towerData
  towerDataArr: TowerData[];
  choosTowerArr: any[];
  // towerDetails
  theTowerInfo: TowerData;
  towerUnits: UnitData[] = [];

  // clientsData
  clients: ClientsData[];

  calcRemain() {
    this.totalPrice = this.metrPrice * this.apartWidth;
    this.preMoneyResult = (this.totalPrice * this.preMoney) / 100;
    this.remainPrice = this.totalPrice - this.preMoneyResult;
    this.remainPaid = Math.ceil(this.remainPrice / this.years / 12);
  }
  constructor(
    public router: Router,
    public logService: LoginService,
    public formBuilder: FormBuilder,
    public _unitService: UnitService,
    public _service: ServicesService,
    public _clientService: ClientServiceService,
    public _clientPaymentService: ClientPaymentService
  ) { }

  ngOnInit() {

    this.logService.logStart(); this.logService.reternlog();

    // getUnites
    this._unitService.url = localStorage.getItem('tmpDB');
    this._unitService.getUnites().subscribe((data: UnitData[]) => {
      this.unites = data;
    });

    // unitData Model
    this.unitDataView = new UnitData();

    // getTowers
    this._unitService.getTowers().subscribe((data: TowerData[]) => {
      this.towerDataArr = data;
    });

    // getClients
    this._clientService.url = localStorage.getItem('tmpDB');
    this._clientService.getClients().subscribe((data: ClientsData[]) => {
      this.clients = data
    })

    // Methods
    $('#hideFadeLayer').click(function () {
      $('.fadeLayer').hide()
      $('.askForDelete').removeClass('animate')
    })
    $('#hideCalcLayer').click(function () {
      $('#calcFade').hide()
      $('#calculator').removeClass('animate');
      this._service.clearForm();
    })

    this._service.handleTableHeight();
  }; // ngOnInit

  buttonEffect(max: string, min: string, min2: string) {
    $(max).removeClass("btn-light").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $(min).removeClass('btn-outline-secondary').addClass('btn-light').animate({ fontSize: '1em' }, 50);
    $(min2).removeClass('btn-outline-secondary').addClass('btn-light').animate({ fontSize: '1em' }, 50);
  };

  // show Methods
  showAddUnit() {
    this._service.clearForm();
    this.resetValues();

    this.choosTowerArr = this.towerDataArr.map((tower) => {
      return { name: `${tower.towerName} - ${tower.towerStage}`, id: tower.towerId, stadge: tower.towerStage, alpha: tower.towerName }
    });

    $('.unitsClass').not('#addUnit').hide();
    $('#addUnit').show();
    $('#unitSearch').hide(100);
    $('#addNewUnitBtn').html('اضافة');
    $('#addUnit h2:first').html('اضافة بيانات وحدة');
    this.buttonEffect('#mainAdd_Towers', '#mainEnquir_Towers', '#mainContracts');
  };

  showAddContract() {

    this._unitService.getUnites().subscribe((data: UnitData[]) => {
      this.unites = data;
    });

    //this._service.clearForm();
    $('.unitsClass').not('#addContract').hide();
    $('#addContract').show();
    $('#unitSearch').hide(100);
    this.buttonEffect('#mainContracts', '#mainAdd_Towers', '#mainEnquir_Towers');
    // reset inptVals
    this._unitService.contractData = new ContractData();
    this._unitService.contractVaildInpts = new ContractVaildInpts();
    this._unitService.contractInpts = new ContractInpts();
    // lock unready inpts
    this._unitService.lockedInputs = {
      unitLocked: true,
      prepaidPercLocked: true,
    };
    $('.form-control').removeClass('is-invalid')

    this._unitService.towerInfoArr = this.towerDataArr.map((tower) => {
      return { name: `${tower.towerName} - ${tower.towerStage}`, id: tower.towerId, stadge: tower.towerStage }
    });

    // get the name of day
    let today_Date = Date.now();
    let d = new Date(today_Date);
    this._unitService.todayName = this._unitService.days[d.getDay()];

    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    this._unitService.TodayDate = `${day} / ${month} / ${year}`
  };

  showAddTower() {
    this._service.clearForm();
    $('.unitsClass').not('#addTower').hide();
    $('#addTower').show();
    $('#unitSearch').hide(100);
    this.buttonEffect('#mainAdd_Towers', '#mainEnquir_Towers', '#mainContracts');
  };

  showUnitEnquiry() {

    $('#containerLoader').fadeIn();
    this.unites = []

    let clientPayments: ClientPayment[] = []
    let clientUnites: UnitData[] = []

    const getUnites = new Promise((res) => {
      this._unitService.getUnites().subscribe((data: UnitData[]) => {
        //this.unites = data;
        res(data)
      });
    });

    const getPayments = new Promise((res) => {
      this._clientPaymentService.getClientPayment().subscribe((data: ClientPayment[]) => {
        // clientPayments = data;
        res(data)
      });
    });

    const reviewUnit = (unites: UnitData[], paymentArr: ClientPayment[]) => {

      for (let i = 0; i < unites.length; i++) {

        let unitDet = {

          payments: {
            arr: clientPayments.filter(payment => payment.unitId == unites[i].unitId),
            totalVal: () => {
              if (unitDet.payments.arr.length == 0) {
                return 0
              }
              return this._service.sumArry(unitDet.payments.arr)
            },
          },

          totalPrice: unites[i].unitExtent * unites[i].unitPrice,

          remain: () => unitDet.totalPrice - unitDet.payments.totalVal()

        };

        if (unites[i].remainVal != unitDet.remain()) {
          unites[i].remainVal = unitDet.remain();
          unites[i].paidVal = unitDet.payments.totalVal();
          this._unitService.updateUnit(unites[i]).subscribe();
        };

      };

    };

    Promise.all([getUnites, getPayments])
      .then((res: any[]) => {

        this.unites = res[0];
        reviewUnit(res[0], res[1]);

      }).then(() => {

        this.unites.sort(this._service.sortArry('unitNum'))
        $('.unitsClass').not('#unitEnquiry').hide();
        $('#unitEnquiry').show();
        $('#unitSearch').show(100);
        this.buttonEffect('#mainEnquir_Towers', '#mainAdd_Towers', '#mainContracts');
        $('#containerLoader').fadeOut();

      });

    /* getUnites.then((data: UnitData[]) => this.unites = data).then(() => {
      this.unites.sort(this._service.sortArry('unitNum'))

      $('.unitsClass').not('#unitEnquiry').hide();
      $('#unitEnquiry').show();
      $('#unitSearch').show(100);
      this.buttonEffect('#mainEnquir_Towers', '#mainAdd_Towers', '#mainContracts');
      $('#containerLoader').fadeOut();
    }) */
  };

  showTowerEnquiry() {
    $('.unitsClass').not('#towerEnquire').hide();
    $('#towerEnquire').show();
    $('#unitSearch').hide(100);
    this.buttonEffect('#mainEnquir_Towers', '#mainAdd_Towers', '#mainContracts');
  };

  clientValid = {
    cond: true,
    msg: '',
    class: ''
  };


  showUpdateUnit(unit: UnitData) {

    this.unitDataView = unit;

    const mapTower = new Promise((res) => {
      this.choosTowerArr = this.towerDataArr.map((tower) => {
        return {
          name: `${tower.towerName} - ${tower.towerStage}`,
          id: tower.towerId,
          stadge: tower.towerStage,
          alpha: tower.towerName
        }
      });
      res(this.choosTowerArr)
    }).then(() => {
      //clientInpt validation
      this.clientValid.cond = true
      this.clientValid.class = ''

      this.unitBuildingNum = `${unit.towerName} - ${unit.towerStage}`;
      $('#unitBuildingNum').val(this.unitBuildingNum);

      $('#addNewUnitBtn').html('تعديل');
      $('#addUnit h2:first').html('تعديل بيانات وحدة');
      $('.unitsClass').not('#addUnit').hide();
      $('#addUnit').show();
      $('#unitSearch').hide(100);
      //$('#unitDateHead').show();
      this.buttonEffect('#mainAdd_Towers', '#mainEnquir_Towers', '#mainContracts');
    })

  };


  resetValues() {
    this.unitDataView = new UnitData();
  };

  //apartNum: number;

  generateUnitSerial() {

    let towerInfo = this.choosTowerArr.find(tower => tower.name == this.unitBuildingNum);

    let theStrings = {
      towerNum: () => {
        if (towerInfo) {
          if (towerInfo.alpha.length > 1) {
            return towerInfo.alpha
          } else {
            return `0${towerInfo.alpha}`
          }
        } else {
          return ''
        };
      },
      stage: () => {
        if (towerInfo) {
          if (towerInfo.stadge == 'أ') {
            return '1'
          } else if (towerInfo.stadge == 'ب') {
            return '2'
          } else if (towerInfo.stadge == 'ج') {
            return '3'
          } else { return '' }
        } else {
          return ''
        }
      },
      floor: () => {
        if (this.unitDataView.unitFloar == null) {
          return ''
        }
        if (this.unitDataView.unitFloar >= 0) {
          if (this.unitDataView.unitFloar > 9) {
            return `${this.unitDataView.unitFloar}`
          } else {
            return `0${this.unitDataView.unitFloar}`
          }
        } else {
          return ''
        }
      },
      apartNum: () => {
        if (this.unitDataView.apartNum == null) {
          return ''
        }
        if (this.unitDataView.apartNum >= 0) {
          if (this.unitDataView.apartNum > 9) {
            return `${this.unitDataView.apartNum}`
          } else {
            return `0${this.unitDataView.apartNum}`
          }
        } else {
          return ''
        }
      }
    };

    this.unitDataView.unitNum = `1${theStrings.towerNum()}${theStrings.stage()}${theStrings.floor()}${theStrings.apartNum()}`;
  };

  //theClientName: string;
  isClientNameValid = () => {

    let clientInfo = this.clients.find(client => client.clientName == this.unitDataView.clientName);

    if (clientInfo) {
      this.unitDataView.clientId = clientInfo.clientId;
      this.clientValid.cond = true
      this.clientValid.class = ''
    } else {
      this.clientValid = {
        cond: false,
        msg: 'خطأ فى اسم العميل',
        class: 'is-invalid pr-4'
      }
    }

  }

  addNewUnit() {

    this.addBtnVal = $('#addNewUnitBtn').html();

    let towerInfo = this.choosTowerArr.find(tower => tower.name == this.unitBuildingNum);

    this.unitDataView.towerId = towerInfo.id;
    this.unitDataView.towerStage = towerInfo.stadge;
    this.unitDataView.towerName = towerInfo.alpha;

    if (this.clientValid.cond) {
      if (this.addBtnVal == 'اضافة') {

        this._unitService.creatUnit(this.unitDataView).subscribe(() => { },
          error => {
            if (error.status == 201) {
              this.showUnitEnquiry();
              this._service.clearForm();
            }
          }
        );

      } else if (this.addBtnVal == 'تعديل') {

        if (this.logService.check.edi != 1) {
          window.alert('لا يوجد صلاحية للتعديل')
        } else {
          this._unitService.updateUnit(this.unitDataView).subscribe(() => {
            this.showUnitEnquiry();
          });
        }
      };
    };

  }; //addNewUnit

  askForDeleteUnit(unit: UnitData) {
    if (this.logService.check.del != 1) {
      window.alert('لا يوجد صلاحية للحذف')
    } else {
      $('#DelFade').show(0)
      $('.askForDelete').addClass('animate')
      this.unitDataView = unit;
    }
  };

  deletUnit() {
    $('#DelFade').hide()
    this._unitService.deleteUnitSer(this.unitDataView.unitId)
      .subscribe(data => {
        this.unites = this.unites.filter(u => u !== this.unitDataView)
      });
  };

  showcalculator() {
    $('#calcFade').show(0);
    $('#calculator').addClass('animate')
  };

  showContractsDetail = () => {

  }
} // end

