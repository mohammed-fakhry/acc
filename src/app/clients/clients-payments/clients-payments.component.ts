import { Component, OnInit } from '@angular/core';
import { ClientPayment } from 'src/app/client-payment';
import { SafeDataService } from 'src/app/accountings/safe-acc/safe-data.service';
import { ClientServiceService } from 'src/app/client-service.service';
import { ServicesService } from 'src/app/services.service';
import { BankService } from 'src/app/bank/bank.service';
import { ClientPaymentService } from 'src/app/client-payment.service';
import { SafeData } from 'src/app/accountings/safe-acc/safe-data';
import { Bank } from 'src/app/bank';
import { ClientsData } from 'src/app/clients-data';
import { UnitService } from 'src/app/unit.service';
import { UnitData } from 'src/app/unit-data';
import { data } from 'jquery';
import { ClientsComponent } from '../clients.component';

@Component({
  selector: 'app-clients-payments',
  templateUrl: './clients-payments.component.html',
  styleUrls: ['./clients-payments.component.scss']
})
export class ClientsPaymentsComponent implements OnInit {

  searchClientPaymentTxt: string;

  cPayment_inpts: ClientPayment;

  validTests = {
    safe: {
      msg: null,
      valid: true
    },
    bank: {
      msg: null,
      valid: true
    },
    client: {
      msg: null,
      valid: true
    },
    unit: {
      msg: null,
      valid: true
    },
    val: {
      msg: null,
      valid: true
    },
    submit: {
      msg: null,
      valid: true
    }
  };

  isFormValid: boolean;

  validArr: any[];

  theSafeList: SafeData[];
  thebankList: Bank[];
  clientsInpArry: ClientsData[];
  allUnites: UnitData[];
  unitsInpArry: UnitData[];
  clientPaymentArr: ClientPayment[];

  // input information
  clientInfo: ClientsData;
  unitInfo: UnitData;
  safeInfo: SafeData;

  constructor(
    public _safeDataService: SafeDataService,
    public _clientServiceService: ClientServiceService,
    public _service: ServicesService,
    public _bankService: BankService,
    public _clientPaymentService: ClientPaymentService,
    public _unitService: UnitService,
    public _clientsComponent: ClientsComponent
  ) { }

  ngOnInit() {
    this.cPayment_inpts = new ClientPayment();
    this.getBackEndData();
  };

  getBackEndData = () => {
    this._safeDataService.getSafes().subscribe((data: SafeData[]) => {
      this.theSafeList = data
    });

    this._bankService.getBanks().subscribe((data: Bank[]) => {
      this.thebankList = data;
    });

    this._clientServiceService.getClients().subscribe((data: ClientsData[]) => {
      this.clientsInpArry = data.filter(client => client.clientName != 'متاح للبيع')
    });

    this._unitService.getUnites().subscribe((data: UnitData[]) => {
      this.allUnites = data;
    });

    this._clientPaymentService.getClientPayment().subscribe((data: ClientPayment[]) => {
      this.clientPaymentArr = data;
    })
  };

  cardSwitch = (elementId: String) => {
    $('.cPInpClass').not(`${elementId}`).hide();
    $(elementId).show();
  };

  showAddNewClientPayment = () => {

    this.getBackEndData();

    this.cPayment_inpts = new ClientPayment();
    this.clientInfo = new ClientsData();
    this.unitInfo = new UnitData();

    this.cPayment_inpts.date_time = this._service.makeTime_date(new Date(Date.now()))

    // cash in aynalize
    this.cPayment_inpts.PaymentKind = 'ايصال استلام نقدية';
    this.cPayment_inpts.cashInKind = 'خزنة';
    this.cashInKindChanged();
    this.makeOtherCashInNull('#safe');

    this.cPayment_inpts.safeName = this.theSafeList[0].safeName;
    this.cPayment_inpts.currentSafeVal = this.theSafeList[0].currentSafeVal;
    this.safeChanged();

    // input Valid Remove
    $('.form-control').removeClass('is-valid is-invalid');
    $('#addNewcPaymentBtn').attr({ 'disabled': true })
    this.isFormValid = true;

    // card effect
    this.cardSwitch('#add_clientPaymentInside');
    $('#showClientsPaymentsBtn').attr({ 'disabled': false });
  };

  checkPaymentValid = () => {

    this.validArr = [
      this.validTests.bank.valid,
      this.validTests.client.valid,
      this.validTests.safe.valid,
      this.validTests.unit.valid
    ];

    if (this.validArr.includes(false)) {
      this.validTests.submit.valid = false;
    } else {
      this.validTests.submit.valid = true;
      this.isFormValid = true;
    };

  }

  hideFadeLayer_ClientPayment = () => {

  };

  switchIsValid = (elementId: string, cond: string) => {
    if (cond == 'invalid') {
      $(elementId).removeClass('is-valid').addClass('is-invalid');
    } else if (cond == 'valid') {
      $(elementId).addClass('is-valid').removeClass('is-invalid');
    };
  };

  changAddClientPayment = () => {

  };

  makeOtherCashInNull = (elementId: String) => { // if bank => make safeNull
    if (elementId == '#bank') {
      this.cPayment_inpts.safeName = null;
      this.cPayment_inpts.safeId = 1;
      this.cPayment_inpts.currentSafeVal = null;
      this.validTests.safe.msg = null;
      this.validTests.safe.valid = true;
    } else if (elementId == '#safe') {
      this.cPayment_inpts.bankName = null;
      this.cPayment_inpts.bankId = 1;
      this.cPayment_inpts.currentbankVal = null;
      this.validTests.bank.msg = null;
      this.validTests.bank.valid = true;
    }
  }

  cashInKindChanged = () => {
    if (this.cPayment_inpts.cashInKind == 'خزنة') {
      $('.cashInClass').not('#safe').hide();
      $('#safe').show();
      this.makeOtherCashInNull('#safe')
    } else if (this.cPayment_inpts.cashInKind == 'بنك') {
      $('.cashInClass').not('#bank').hide();
      $('#bank').show();
      this.makeOtherCashInNull('#bank')
    }
  };

  paymentKindChanged = () => {

  };

  safeChanged = () => {

    this.safeInfo = this.theSafeList.find(safe => safe.safeName == this.cPayment_inpts.safeName);

    if (this.safeInfo) {
      this.cPayment_inpts.safeId = this.safeInfo.safeId;
      this.cPayment_inpts.currentSafeVal = this.safeInfo.currentSafeVal;
    }

  };

  bankChanged = () => {

  };

  clientChanged = () => {

    this.clientInfo = this.clientsInpArry.find(client => client.clientName == this.cPayment_inpts.clientName);

    if (this.clientInfo) {

      this.cPayment_inpts.clientId = this.clientInfo.clientId;

      this.unitsInpArry = this.allUnites.filter(unit => unit.clientId == this.clientInfo.clientId);
      this.cPayment_inpts.unitName = null;

      this.validTests.client.valid = true;
      this.validTests.unit.valid = false;
      this.validTests.unit.msg = 'ادخل رقم الوحدة'
      this.switchIsValid('#clientName_Payment', 'valid');
      $('#unitName_Payment').attr({ 'disabled': false });
      $('#unitName_Payment').removeClass('is-valid is-invalid');

    } else {

      this.cPayment_inpts.clientId = null;

      this.validTests.client.valid = false;
      this.validTests.unit.valid = true;
      this.cPayment_inpts.unitName = null;
      this.validTests.client.msg = 'خطأ فى اسم العميل';
      this.switchIsValid('#clientName_Payment', 'invalid');
      $('#unitName_Payment').removeClass('is-valid is-invalid').attr({ 'disabled': true });

    };

    this.checkPaymentValid();
  };

  unitChanged = () => {

    if (this.cPayment_inpts.unitName == null) {

      this.validTests.unit.valid = false;
      this.validTests.unit.msg = 'ادخل رقم الوحدة'
      $('#unitName_Payment').removeClass('is-valid is-invalid');

    } else {

      this.unitInfo = this.unitsInpArry.find(unit => unit.unitNum == this.cPayment_inpts.unitName);

      if (this.unitInfo) {

        this.cPayment_inpts.unitId = this.unitInfo.unitId;

        this.validTests.unit.valid = true;
        this.switchIsValid('#unitName_Payment', 'valid');
        this.cPayment_inpts.currentClientVal = this.unitInfo.remainVal;

      } else {

        this.cPayment_inpts.unitId = null;

        this.validTests.unit.valid = false;
        this.validTests.unit.msg = 'خطأ فى رقم الوحدة';
        this.switchIsValid('#unitName_Payment', 'invalid');
        this.cPayment_inpts.currentClientVal = null

      };

    };

    this.checkPaymentValid()
  };

  paymentValChanged = () => {

    if (this.cPayment_inpts.paymentVal > 0) {
      this.validTests.val.valid = true;
      $('#paymentVal').removeClass('is-invalid').addClass('is-valid');
    } else {
      this.validTests.val.valid = false;
      $('#paymentVal').removeClass('is-valid').addClass('is-invalid');
    };

    this.checkPaymentValid();
  };

  analysePaymentData = () => {

    this.unitInfo.remainVal = this.unitInfo.remainVal - this.cPayment_inpts.paymentVal;
    this.safeInfo.currentSafeVal = this.safeInfo.currentSafeVal + this.cPayment_inpts.paymentVal;

    this._clientPaymentService.creatClientPayment(this.cPayment_inpts).subscribe(() => { },
      error => {
        //its not error (backend responce done)
        if (error.status == 201) {
          this._clientsComponent.showClientsEnquir();
          this._unitService.updateUnit(this.unitInfo).subscribe();
          this._safeDataService.updateSafeData(this.safeInfo).subscribe();
          //this._service.clearForm();
        }
      })
  };

  addNewcPayment = () => {

    this.checkPaymentValid();
    if (!this.validTests.submit.valid || this.cPayment_inpts.paymentVal == null) {
      if (this.cPayment_inpts.paymentVal == null) {
        this.validTests.val.msg = 'يجب ادخال قيمة للايصال'
        this.validTests.val.valid = false;
        $('#paymentVal').removeClass('is-valid').addClass('is-invalid');
      };
      this.isFormValid = false;
    } else {
      this.analysePaymentData();
      //this._clientPaymentService.creatClientPayment(this.cPayment_inpts).subscribe();
    }

  };

} // End
