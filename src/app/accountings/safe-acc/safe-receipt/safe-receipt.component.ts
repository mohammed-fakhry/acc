import { Component, OnInit } from '@angular/core';
import { SafeDataService } from '../safe-data.service';
import { StocksService } from '../../stocks/the-stocks/stocks.service';
import { CustomerService } from 'src/app/customer.service';
import { ServicesService } from 'src/app/services.service';
import { Customer } from 'src/app/customer';
import { SafeData } from '../safe-data';
import { SafeAccComponent } from '../safe-acc.component';
import { SafeReceiptInpts } from '../safe-receipt-inpts';
import { OtherAcc } from '../../other-acc';

@Component({
  selector: 'app-safe-receipt',
  templateUrl: './safe-receipt.component.html',
  styleUrls: ['./safe-receipt.component.scss']
})
export class SafeReceiptComponent implements OnInit {


  isReceiptValid: boolean;

  constructor(public _safeDataService: SafeDataService, public _stockService: StocksService,
    public _service: ServicesService, public _custService: CustomerService, public _safeAccComponent: SafeAccComponent) { }

  ngOnInit() {

    this._safeAccComponent.getBackendData_Receipt();
    //this.checkReceiptValid();

    this._safeDataService.safeReceipt_inpts = {
      safeReceiptId: null,
      receiptKind: '',
      safeRec_DateTime: '',
      safeName: '',
      currentSafeVal: null,
      // sec section
      transactionAccKind: '',
      // acc inpts
      AccName: '',
      currentAccVal: null,
      //safe inpts
      secSafeName: '',
      current_SecSafeVal: null,
      // customer inpts
      customerName: '',
      customerId: 1,
      currentCustomerVal: null,
      // user inpts
      receiptVal: null,
      recieptNote: '',
    }

  }

  getCurrentDate() {
    let currentDateNow = Date.now() //new Date()
    let currentDate = new Date(currentDateNow)
    this._service.makeTime_date(currentDate);
  }

  getSafeInfo(safeName) {
    let safeInfo = this._safeDataService.safeList.find(
      safe => safe.safeName == safeName
    )
    return safeInfo;
  }

  getCustomerInfo(customerName) {
    let customerInfo = this._safeAccComponent.customers.find(
      customer => customer.customerName == customerName
    )
    return customerInfo;
  }

  getAccInfo(accName) {
    let accInfo = this._safeAccComponent.otherAcc.find(
      acc => acc.AccName == accName
    )
    return accInfo;
  }

  theReceiptKind: string;

  makeDefultNewReceiptVals() {

    this.getCurrentDate();
    this._safeDataService.safeReceipt_inpts.safeRec_DateTime = this._service.date_time;
    this._safeDataService.safeReceipt_inpts.safeName = this._safeDataService.safeList[0].safeName
    this._safeDataService.safeReceipt_inpts.currentSafeVal = this._safeDataService.safeList[0].currentSafeVal
    this.safeChanged();
    // receiptKind section
    this._safeDataService.safeReceipt_inpts.transactionAccKind = 'حساب'
    this._safeDataService.safeReceipt_inpts.receiptKind = 'ايصال استلام نقدية'
    this.theReceiptKind = 'add'
    // acc section
    this._safeDataService.safeReceipt_inpts.AccName = null;
    // check defult Vals
    this.transactionAccKindChanged();
    this._safeAccComponent.safeRecClearForm();
    //this.accNameChanged()
    this.checkReceiptValid();
  }

  showAddSafeReceipt() {
    // getSafeCurrentVal
    this._safeAccComponent.getSafeInfoBEnd();
    // getCustomerData_backEnd
    this._safeAccComponent.getCustomerData_backEnd();
    // getOtherAcc
    this._safeAccComponent.getOtheAccInfo_backEnd()

    $('#add_SafeReceiptInside').show();
    $('#header_SafeRecipt').hide();
    this.makeDefultNewReceiptVals();
    // Make receiptValValid false
    $('#receiptVal').removeClass('is-invalid').removeClass('is-valid');
    this.validTests.receiptValValid = false;
    this._safeDataService.safeReceipt_inpts.receiptVal = null;
    //
    console.log(this._safeDataService.safeReceipt_inpts.receiptKind)
  };

  validTests = {
    // fst safe valid
    firstSafeValidMsg: '',
    fstSafeinValid: false,
    // sec safe valid
    secSafeValidMsg: '',
    secSafeinValid: false,
    // customer vaild
    customerValid: false,
    custValidMsg: '',
    // Acc valid
    accValid: false,
    accValidMsg: '',
    // receipt val valid
    receiptValValid: false,
    receiptValValidMsg: '',
  }

  makeSndSafeNull() {
    // clear inputs
    this._safeDataService.safeReceipt_inpts.secSafeName = null;
    this._safeDataService.safeReceipt_inpts.current_SecSafeVal = null;
    // clear validation
    this.validTests.fstSafeinValid = false;
    this.validTests.secSafeinValid = false;
    this.checkReceiptValid();
  };

  makeCustomerNull() {
    this._safeDataService.safeReceipt_inpts.customerId = 1;
    this._safeDataService.safeReceipt_inpts.customerName = null;
    this._safeDataService.safeReceipt_inpts.currentCustomerVal = null;
    // clear validation
    this.validTests.customerValid = false;
    this.checkReceiptValid();
  }

  makeAccNameNull() {
    this._safeDataService.safeReceipt_inpts.AccName = null;
    this._safeDataService.safeReceipt_inpts.currentAccVal = null;
    this.validTests.accValid = false;
    $('#AccName').removeClass('is-invalid').removeClass('is-valid');
    this.checkReceiptValid();
  }

  checkReceiptValid() {
    //this.isReceiptValid = true;
    const validKeys = Object.values(this.validTests)
    if (validKeys.includes(true)) {
      this.isReceiptValid = true;
    } else {
      this.isReceiptValid = false;
    }

    if (this._safeDataService.safeReceipt_inpts.transactionAccKind == 'حساب') {
      if (this._safeDataService.safeReceipt_inpts.AccName == null) {
        this.isReceiptValid = true;
      } else {
        this.isReceiptValid = false;
      }
    } else if (this._safeDataService.safeReceipt_inpts.transactionAccKind == 'خزنة') {
      if (this._safeDataService.safeReceipt_inpts.secSafeName == null) {
        this.isReceiptValid = true;
      } else {
        this.isReceiptValid = false;
      }
    } else if (this._safeDataService.safeReceipt_inpts.transactionAccKind == 'عميل') {
      if (this._safeDataService.safeReceipt_inpts.customerName == null) {
        this.isReceiptValid = true;
      } else {
        this.isReceiptValid = false;
      }
    }

    if (this._safeDataService.safeReceipt_inpts.receiptVal == null) {
      this.isReceiptValid = true;
    }
    
  }

  transactionAccKindChanged() {
    if (this._safeDataService.safeReceipt_inpts.transactionAccKind == 'حساب') {
      $('.accKindClassRec').not('#accReceipt').hide();
      // make othe sections null
      this.makeSndSafeNull();
      this.makeCustomerNull();
      $('#accReceipt').show();
    } else if (this._safeDataService.safeReceipt_inpts.transactionAccKind == 'خزنة') {
      $('.accKindClassRec').not('#safeReceiptAcc').hide();
      $('#safeReceiptAcc').show();
      // make othe sections null
      this.makeCustomerNull();
      this.makeAccNameNull();
      // set defult safe Name
      this._safeDataService.safeReceipt_inpts.secSafeName = this._safeDataService.safeList[1].safeName
      this._safeDataService.safeReceipt_inpts.current_SecSafeVal = this._safeDataService.safeList[1].currentSafeVal
      this.secSafeNameChanged();
      // clear receiptVal validation
      $('#receiptVal').removeClass('is-invalid').removeClass('is-valid');
      this.validTests.receiptValValid = false;
    } else if (this._safeDataService.safeReceipt_inpts.transactionAccKind == 'عميل') {
      $('.accKindClassRec').not('#customerReceiptAcc').hide();
      // make othe sections null
      this.makeSndSafeNull();
      this.makeAccNameNull();
      $('#customerReceiptAcc').show();
    }
    // clear receiptVal and style
    this._safeDataService.safeReceipt_inpts.receiptVal = null;
    $('#receiptVal').removeClass('is-invalid').removeClass('is-valid');
    // check validation
    this.checkReceiptValid();
  }

  receiptKindChanged() {
    if (this._safeDataService.safeReceipt_inpts.receiptKind == 'ايصال استلام نقدية') {
      this.theReceiptKind = 'add'
      $('#secSection_safeReceipt').css('color', 'black')
    } else {
      this.theReceiptKind = 'min'
      $('#secSection_safeReceipt').css('color', 'blue');
    }
    this.isReceiptValValid();
  }

  // safes information
  theSafeInfo: SafeData;
  theSnd_SafeInfo: SafeData;

  secSafeNameChanged() {
    if (this._safeDataService.safeReceipt_inpts.secSafeName === this._safeDataService.safeReceipt_inpts.safeName) {
      this.validTests.secSafeValidMsg = 'لا يمكن تكرار نفس الخزنة'
      this.validTests.secSafeinValid = true;
    } else {
      this.validTests.secSafeinValid = false;
      this.validTests.fstSafeinValid = false;
    }
    this.theSnd_SafeInfo = this.getSafeInfo(this._safeDataService.safeReceipt_inpts.secSafeName);
    this._safeDataService.safeReceipt_inpts.current_SecSafeVal = this.theSnd_SafeInfo.currentSafeVal;
    this.isReceiptValValid();
    this.checkReceiptValid();
  }

  safeChanged() {
    if (this._safeDataService.safeReceipt_inpts.secSafeName === this._safeDataService.safeReceipt_inpts.safeName) {
      this.validTests.firstSafeValidMsg = 'لا يمكن تكرار نفس الخزنة';
      this.validTests.fstSafeinValid = true;
    } else {
      this.validTests.fstSafeinValid = false;
      this.validTests.secSafeinValid = false;
    }
    this.theSafeInfo = this.getSafeInfo(this._safeDataService.safeReceipt_inpts.safeName);
    this._safeDataService.safeReceipt_inpts.currentSafeVal = this.theSafeInfo.currentSafeVal
    this.isReceiptValValid();
    this.checkReceiptValid();
  }

  otherAccInfo: OtherAcc;

  accNameChanged() {
    this.otherAccInfo = this.getAccInfo(this._safeDataService.safeReceipt_inpts.AccName);

    if (this.otherAccInfo == undefined) {
      this.validTests.accValid = true;
      this.validTests.accValidMsg = 'خطأ فى اسم الحساب'
      $('#AccName').removeClass('is-valid').addClass('is-invalid');
      this._safeDataService.safeReceipt_inpts.currentAccVal = null;
    } else {
      this.validTests.accValid = false;
      $('#AccName').removeClass('is-invalid').addClass('is-valid');
      this._safeDataService.safeReceipt_inpts.currentAccVal = this.otherAccInfo.currentAccVal;
    }
    this.checkReceiptValid();
    console.log(this._safeDataService.safeReceipt_inpts.AccName)
  }

  theCustomerId: number;
  theCustomerInfo: Customer;

  isCustomerValid() {

    this.theCustomerInfo = this.getCustomerInfo(this._safeDataService.safeReceipt_inpts.customerName);

    if (this.theCustomerInfo == undefined) {
      this.validTests.customerValid = true;
      this.validTests.custValidMsg = 'خطأ فى اسم العميل'
      $('#customerName_Receipt').removeClass('is-valid').addClass('is-invalid');
      this._safeDataService.safeReceipt_inpts.currentCustomerVal = null;
    } else {
      this.validTests.customerValid = false;
      $('#customerName_Receipt').addClass('is-valid').removeClass('is-invalid');
      this.theCustomerId = this.theCustomerInfo.customerId;
      this._safeDataService.safeReceipt_inpts.currentCustomerVal = this.theCustomerInfo.customerRemain;

      if (this._safeDataService.safeReceipt_inpts.currentCustomerVal < 0) {
        $('#currentCustomerVal').css('color', 'red')
      } else {
        $('#currentCustomerVal').css('color', 'black')
      }
    }

  } // isCustomerValid

  isReceiptValValid() {
    if (this._safeDataService.safeReceipt_inpts.transactionAccKind == 'خزنة') {

      if (this.theReceiptKind == 'add') {

        if (this._safeDataService.safeReceipt_inpts.receiptVal <= this._safeDataService.safeReceipt_inpts.current_SecSafeVal) {
          $('#receiptVal').removeClass('is-invalid').addClass('is-valid');
          this.validTests.receiptValValid = false;
        } else {
          $('#receiptVal').removeClass('is-valid').addClass('is-invalid');
          this.validTests.receiptValValid = true;
          this.validTests.receiptValValidMsg = 'الرصيد لا يسمح'
        }

      } else {

        if (this._safeDataService.safeReceipt_inpts.receiptVal <= this._safeDataService.safeReceipt_inpts.currentSafeVal) {
          $('#receiptVal').removeClass('is-invalid').addClass('is-valid');
          this.validTests.receiptValValid = false;
        } else {
          $('#receiptVal').removeClass('is-valid').addClass('is-invalid');
          this.validTests.receiptValValid = true;
          this.validTests.receiptValValidMsg = 'الرصيد لا يسمح'
        }

      }

    } else {

      if (this.theReceiptKind == 'min') {

        if (this._safeDataService.safeReceipt_inpts.receiptVal <= this._safeDataService.safeReceipt_inpts.currentSafeVal) {
          $('#receiptVal').removeClass('is-invalid').addClass('is-valid');
          this.validTests.receiptValValid = false;
        } else {
          $('#receiptVal').removeClass('is-valid').addClass('is-invalid');
          this.validTests.receiptValValid = true;
          this.validTests.receiptValValidMsg = 'الرصيد لا يسمح'
        }

      } else {
        $('#receiptVal').removeClass('is-invalid').addClass('is-valid');
        this.validTests.receiptValValid = false;
      }

    }

    if (this._safeDataService.safeReceipt_inpts.receiptVal == null) {
      $('#receiptVal').removeClass('is-valid').addClass('is-invalid');
      this.validTests.receiptValValid = true;
      this.validTests.receiptValValidMsg = 'يجب ادخال القيمة'
    }
    this.checkReceiptValid();
  }

  safeReceiptData: SafeReceiptInpts;

  /*
  this._safeDataService.safeReceipt_inpts = {
    safeReceiptId: null,
    receiptKind: '',
    safeRec_DateTime: '',
    safeName: '',
    currentSafeVal: null,
    // sec section
    transactionAccKind: '',
    // acc inpts
    AccName: '',
    currentAccVal: null,
    //safe inpts
    secSafeName: '',
    current_SecSafeVal: null,
    // customer inpts
    customerName: '',
    currentCustomerVal: null,
    // user inpts
    receiptVal: null,
    recieptNote: '',
  }*/

  saveRecieptData() {

    this.safeReceiptData = this._safeDataService.safeReceipt_inpts;
    console.log(this.safeReceiptData)

    let fstSafe_NewVal: number;
    let sndSafe_NewVal: number;

    let customer_NewVal: number;

    if (this._safeDataService.safeReceipt_inpts.transactionAccKind == 'خزنة') { // safe modify

      //make defult customer Id
      this.safeReceiptData.customerId = 1;

      if (this.theReceiptKind == 'add') {
        fstSafe_NewVal = this.theSafeInfo.currentSafeVal + this._safeDataService.safeReceipt_inpts.receiptVal;
        sndSafe_NewVal = this.theSafeInfo.currentSafeVal - this._safeDataService.safeReceipt_inpts.receiptVal;
      } else {
        fstSafe_NewVal = this.theSafeInfo.currentSafeVal - this._safeDataService.safeReceipt_inpts.receiptVal;
        sndSafe_NewVal = this.theSafeInfo.currentSafeVal - this._safeDataService.safeReceipt_inpts.receiptVal;
      }
      console.log(fstSafe_NewVal)

    } else if (this._safeDataService.safeReceipt_inpts.transactionAccKind == 'عميل') { // customer modify

      if (this.theReceiptKind == 'add') {
        fstSafe_NewVal = this.theSafeInfo.currentSafeVal + this._safeDataService.safeReceipt_inpts.receiptVal;
        customer_NewVal = this.theCustomerInfo.customerRemain - this._safeDataService.safeReceipt_inpts.receiptVal
      } else {
        fstSafe_NewVal = this.theSafeInfo.currentSafeVal - this._safeDataService.safeReceipt_inpts.receiptVal;
        customer_NewVal = this._safeDataService.safeReceipt_inpts.receiptVal + this.theCustomerInfo.customerRemain;
      }
      console.log(this.theCustomerInfo.customerRemain + ' : customerRemain')
      console.log(customer_NewVal + ' : customer_NewVal')
    }


  }

  addNewSafeReceipt() {
    this.saveRecieptData();
    this.makeDefultNewReceiptVals();

  }
}
