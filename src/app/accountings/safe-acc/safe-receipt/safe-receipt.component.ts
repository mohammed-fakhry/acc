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
  //safeReceiptData: SafeReceiptInpts;
  safeReceipt_inpts: SafeReceiptInpts;
  // for check val in edit
  valIsOk: number;
  // safeArry
  theSafeList: SafeData[];
  deleteReceiptCond: boolean = true;

  constructor(public _safeDataService: SafeDataService, public _stockService: StocksService,
    public _service: ServicesService, public _custService: CustomerService, public _safeAccComponent: SafeAccComponent) { }

  ngOnInit() {

    this._safeAccComponent.getBackendData_Receipt();
    this.getSafeInfo_backEnd();
    //this.checkReceiptValid();
    this.safeReceipt_inpts = new SafeReceiptInpts()

  };

  getSafeInfo_backEnd() {
    this._safeDataService.getSafes().subscribe((data: SafeData[]) => {
      this.theSafeList = data;
    });
  };

  getCurrentDate() {
    let currentDateNow = Date.now() //new Date()
    let currentDate = new Date(currentDateNow)
    this._service.makeTime_date(currentDate);
  };

  getSafeInfo(safeName) {
    let safeInfo = this._safeDataService.safeList.find(
      safe => safe.safeName == safeName
    )
    return safeInfo;
  };

  getCustomerInfo(customerName) {
    let customerInfo = this._safeAccComponent.customers.find(
      customer => customer.customerName == customerName
    )
    return customerInfo;
  };

  getAccInfo(accName) {
    let accInfo = this._safeAccComponent.otherAcc.find(
      acc => acc.AccName == accName
    );
    return accInfo;
  };

  theReceiptKind: string;

  makeDefultNewReceiptVals() {

    this._safeAccComponent.getBackendData_Receipt();

    this.getCurrentDate();
    this.safeReceipt_inpts.date_time = this._service.date_time;
    this.safeReceipt_inpts.safeName = this._safeDataService.safeList[0].safeName;
    this.safeReceipt_inpts.safeId = this._safeDataService.safeList[0].safeId;
    this.safeReceipt_inpts.currentSafeVal = this._safeDataService.safeList[0].currentSafeVal;

    this.safeChanged();
    // receiptKind section
    this.safeReceipt_inpts.transactionAccKind = 'حساب'
    this.safeReceipt_inpts.receiptKind = 'ايصال استلام نقدية'
    this.theReceiptKind = 'add'

    // check defult Vals
    this.transactionAccKindChanged();
    this.receiptKindChanged();
    // acc section
    this.safeReceipt_inpts.currentAccVal = null;

    this._safeAccComponent.safeRecClearForm();

    this.checkReceiptValid();

    $('#receiptVal').removeClass('is-invalid').removeClass('is-valid');
    $('#AccName').removeClass('is-invalid').removeClass('is-valid');
  };

  searchSafeReceiptTxt: string;

  changAddSafeReceiptBtn() {
    if (this.searchSafeReceiptTxt == '' || this.searchSafeReceiptTxt == undefined || this.searchSafeReceiptTxt == null) {
      $('#call_SafeRecieptBtn').html('ايصال جديد')
    } else {
      $('#call_SafeRecieptBtn').html('بحث')
    }
  };

  getTheReceiptInfo(receiptId) {
    let receiptInfo = this._safeDataService.safeReceiptList.find(
      safeReceipt => safeReceipt.safeReceiptId == receiptId
    );
    return receiptInfo
  };

  theReceiptInfo: SafeReceiptInpts;

  putValsForEdit(recInfo: SafeReceiptInpts) {

    this.safeReceipt_inpts = recInfo;

    this.safeChanged();

    if (recInfo.transactionAccKind == 'خزنة') {
      this.secSafeNameChanged();
    } else if (recInfo.transactionAccKind == 'عميل') {
      this.isCustomerValid();
    } else if (recInfo.transactionAccKind == 'حساب') {
      this.accNameChanged();
    };
  };

  showAddNewSafeReceipt() {

    this.makeCustomerCss()

    $('#showAddSafeReceipt').attr({ 'disabled': false })
    // getBackendData_Receipt
    this._safeAccComponent.getBackendData_Receipt();

    let call_SafeRecieptBtn = $('#call_SafeRecieptBtn').html();

    if (call_SafeRecieptBtn == 'ايصال جديد') {
      //this._service.clearForm();
      this.makeDefultNewReceiptVals();
      // Make receiptValValid false
      $('#receiptVal').removeClass('is-invalid').removeClass('is-valid');
      $('#AccName').removeClass('is-invalid').removeClass('is-valid');
      $('#addNewSafeReceipt').html('حفظ الايصال');
      $('#deleteSafeReceipt').hide();

      this.validTests.receiptValValid = false;
      this.safeReceipt_inpts.receiptVal = null;
      this.safeReceipt_inpts.safeReceiptId = null;
      this.safeReceipt_inpts.recieptNote = null;
    } else {

      $('#addNewSafeReceipt').html('تعديل الايصال');

      this.theReceiptInfo = this.getTheReceiptInfo(this.searchSafeReceiptTxt);
      //console.log(this.theReceiptInfo)

      this.putValsForEdit(this.theReceiptInfo)
      this.transactionAccKindChanged();
      this.receiptKindChanged();

      this.valIsOk = this.safeReceipt_inpts.currentSafeVal + this.theReceiptInfo.receiptVal;
      //console.log(this.valIsOk)
      $('#deleteSafeReceipt').show();
      this.deleteReceiptCond = false;
    };
    
    $('#add_SafeReceiptInside').show();
    $('#header_SafeRecipt').hide();
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
  };

  makeSndSafeNull() {
    // clear inputs
    this.safeReceipt_inpts.secSafeName = null;
    this.safeReceipt_inpts.secSafeId = null;
    this.safeReceipt_inpts.current_SecSafeVal = null;
    // clear validation
    this.validTests.fstSafeinValid = false;
    this.validTests.secSafeinValid = false;
    this.checkReceiptValid();
  };

  makeCustomerNull() {
    this.safeReceipt_inpts.customerId = 1;
    this.safeReceipt_inpts.customerName = null;
    this.safeReceipt_inpts.currentCustomerVal = null;
    $('#customerName_Receipt').removeClass('is-invalid').removeClass('is-valid');
    // clear validation
    this.validTests.customerValid = false;
    this.checkReceiptValid();
  };

  makeAccNameNull() {
    this.safeReceipt_inpts.AccName = null;
    this.safeReceipt_inpts.currentAccVal = null;
    this.validTests.accValid = false;
    $('#AccName').removeClass('is-invalid').removeClass('is-valid');
    this.checkReceiptValid();
  };

  checkReceiptValid() {

    const validKeys = Object.values(this.validTests)

    if (validKeys.includes(true)) {
      this.isReceiptValid = true;
    } else {

      this.isReceiptValid = false;

      if (this.safeReceipt_inpts.transactionAccKind == 'حساب') {

        if (this.safeReceipt_inpts.AccName == null) {
          this.isReceiptValid = true;
        } else {
          this.isReceiptValid = false;
        };

      } else if (this.safeReceipt_inpts.transactionAccKind == 'خزنة') {

        this.isReceiptValValid();

        if (this.safeReceipt_inpts.secSafeName == null) {
          this.isReceiptValid = true;
        } else {
          this.isReceiptValid = false;
        };

      } else if (this.safeReceipt_inpts.transactionAccKind == 'عميل') {

        if (this.safeReceipt_inpts.customerName == null) {
          this.isReceiptValid = true;
        } else {
          this.isReceiptValid = false;
        };

      };

      if (this.safeReceipt_inpts.receiptVal == null) {
        this.isReceiptValid = true;
      };
    };

    this.deleteReceiptCond = true;

  };

  transactionAccKindChanged() {

    if (this.safeReceipt_inpts.transactionAccKind == 'حساب') {

      // make othe sections null
      this.makeSndSafeNull();
      this.makeCustomerNull();

      $('.accKindClassRec').not('#accReceipt').hide();
      $('#accReceipt').show();

    } else if (this.safeReceipt_inpts.transactionAccKind == 'خزنة') {

      $('.accKindClassRec').not('#safeReceiptAcc').hide();
      $('#safeReceiptAcc').show();

      // make othe sections null
      this.makeCustomerNull();
      this.makeAccNameNull();

      // set defult safe Name
      this.safeReceipt_inpts.secSafeName = this._safeDataService.safeList[2].safeName
      this.safeReceipt_inpts.secSafeId = this._safeDataService.safeList[2].safeId
      this.safeReceipt_inpts.current_SecSafeVal = this._safeDataService.safeList[2].currentSafeVal

      this.secSafeNameChanged();
      // clear receiptVal validation
      $('#receiptVal').removeClass('is-invalid').removeClass('is-valid');
      this.validTests.receiptValValid = false;

    } else if (this.safeReceipt_inpts.transactionAccKind == 'عميل') {

      // make othe sections null
      this.makeSndSafeNull();
      this.makeAccNameNull();

      $('.accKindClassRec').not('#customerReceiptAcc').hide();
      $('#customerReceiptAcc').show();
    };
    // clear receiptVal and style
    $('#receiptVal').removeClass('is-invalid').removeClass('is-valid');
    // check validation
    this.checkReceiptValid();
  }

  receiptKindChanged() {

    if (this.safeReceipt_inpts.receiptKind == 'ايصال استلام نقدية') {
      this.theReceiptKind = 'add'
      $('#secSection_safeReceipt').removeClass('lightBg p-3');
    } else {
      this.theReceiptKind = 'min'
      $('#secSection_safeReceipt').addClass('lightBg p-3');
    }

    this.isReceiptValValid();
  };

  // safes information
  theSafeInfo: SafeData;
  theSnd_SafeInfo: SafeData;

  secSafeNameChanged() {

    this.theSnd_SafeInfo = this.getSafeInfo(this.safeReceipt_inpts.secSafeName);

    if (this.theSnd_SafeInfo == undefined) {

      this.validTests.secSafeValidMsg = 'اسم الخزنة غير صحيح'
      $('#secSafeName').removeClass('is-valid').addClass('is-invalid');
      this.validTests.secSafeinValid = true;
      this.safeReceipt_inpts.current_SecSafeVal = null;

    } else {

      if (this.safeReceipt_inpts.secSafeName == this.safeReceipt_inpts.safeName) {

        this.validTests.secSafeValidMsg = 'لا يمكن تكرار نفس الخزنة'
        $('#secSafeName').removeClass('is-valid').addClass('is-invalid');
        this.validTests.secSafeinValid = true;

      } else {

        $('#secSafeName').removeClass('is-invalid').addClass('is-valid');
        $('#safeNameReceipt').removeClass('is-invalid').addClass('is-valid');
        this.validTests.secSafeinValid = false;
        this.validTests.fstSafeinValid = false;
      };

      this.safeReceipt_inpts.current_SecSafeVal = this.theSnd_SafeInfo.currentSafeVal;
    };

    this.isReceiptValValid();
    this.checkReceiptValid();
  };

  safeChanged() {

    this.theSafeInfo = this.getSafeInfo(this.safeReceipt_inpts.safeName);

    if (this.theSafeInfo == undefined) {

      this.validTests.firstSafeValidMsg = 'اسم الخزنة غير صحيح';
      $('#safeNameReceipt').removeClass('is-valid').addClass('is-invalid');
      this.validTests.fstSafeinValid = true;
      this.safeReceipt_inpts.currentSafeVal = null;

    } else {

      if (this.safeReceipt_inpts.secSafeName == this.safeReceipt_inpts.safeName) {

        this.validTests.firstSafeValidMsg = 'لا يمكن تكرار نفس الخزنة';
        $('#safeNameReceipt').removeClass('is-valid').addClass('is-invalid');
        this.validTests.fstSafeinValid = true;

      } else {

        $('#safeNameReceipt').removeClass('is-invalid').addClass('is-valid');
        $('#secSafeName').removeClass('is-invalid').addClass('is-valid');
        this.validTests.fstSafeinValid = false;
        this.validTests.secSafeinValid = false;
      };

      this.safeReceipt_inpts.currentSafeVal = this.theSafeInfo.currentSafeVal
    };

    this.isReceiptValValid();
    this.checkReceiptValid();
  };

  theOtherAccInfo: OtherAcc;

  accNameChanged() {
    this.theOtherAccInfo = this.getAccInfo(this.safeReceipt_inpts.AccName);

    if (this.theOtherAccInfo == undefined) {

      this.validTests.accValid = true;
      this.validTests.accValidMsg = 'خطأ فى اسم الحساب'
      $('#AccName').removeClass('is-valid').addClass('is-invalid');
      this.safeReceipt_inpts.currentAccVal = null;

    } else {

      this.validTests.accValid = false;
      $('#AccName').removeClass('is-invalid').addClass('is-valid');
      this.safeReceipt_inpts.currentAccVal = this.theOtherAccInfo.currentAccVal;
    };
    this.checkReceiptValid();
  };

  theCustomerId: number;
  theCustomerInfo: Customer;
  customerCss: any[]


  makeCustomerCss() {
    this.custClass = ''
    this.customerCss = this._safeAccComponent.customers.map((cust) => {
      return {
        name: cust.customerName,
        css: () => {
          if (cust.customerName.includes('- سيف')) {
            return 'font-weight-bolder text-light bg-info pr-2'
          } else {
            return ''
          }
        }
      }
    })
    console.log(this.customerCss)
  };

  custClass: string = '';

  isCustomerValid() {

    this.theCustomerInfo = this.getCustomerInfo(this.safeReceipt_inpts.customerName);

    if (this.theCustomerInfo == undefined) {

      this.validTests.customerValid = true;
      this.validTests.custValidMsg = 'خطأ فى اسم العميل'
      $('#customerName_Receipt').removeClass('is-valid').addClass('is-invalid');
      this.safeReceipt_inpts.currentCustomerVal = null;

    } else {

      this.validTests.customerValid = false;
      $('#customerName_Receipt').addClass('is-valid').removeClass('is-invalid');
      this.theCustomerId = this.theCustomerInfo.customerId;
      this.safeReceipt_inpts.currentCustomerVal = this.theCustomerInfo.customerRemain;

      if (this.safeReceipt_inpts.currentCustomerVal < 0) {
        $('#currentCustomerVal').css('color', 'red')
      } else {
        $('#currentCustomerVal').css('color', 'black')
      };

    };
    this.checkReceiptValid();
    let cCss = this.customerCss.find(cust => cust.name == this.theCustomerInfo.customerName)
    this.custClass = cCss.css();

  } // isCustomerValid


  isReceiptValValid() {

    if (this.safeReceipt_inpts.transactionAccKind == 'خزنة') {

      if (this.theReceiptKind == 'add') {

        if (this.safeReceipt_inpts.receiptVal <= this.safeReceipt_inpts.current_SecSafeVal) {
          $('#receiptVal').removeClass('is-invalid').addClass('is-valid');
          this.validTests.receiptValValid = false;
        } else {
          $('#receiptVal').removeClass('is-valid').addClass('is-invalid');
          this.validTests.receiptValValid = true;
          this.validTests.receiptValValidMsg = 'الرصيد لا يسمح'
        }

      } else {

        if (this.safeReceipt_inpts.receiptVal <= this.safeReceipt_inpts.currentSafeVal) {
          $('#receiptVal').removeClass('is-invalid').addClass('is-valid');
          this.validTests.receiptValValid = false;
        } else {
          $('#receiptVal').removeClass('is-valid').addClass('is-invalid');
          this.validTests.receiptValValid = true;
          this.validTests.receiptValValidMsg = 'الرصيد لا يسمح'
        };

      };

    } else {

      if (this.theReceiptKind == 'min') {

        //let valIsOk: Number;
        let submBtn = $('#addNewSafeReceipt').html()



        if (submBtn == 'تعديل الايصال') {
          this.theReceiptInfo = this.getTheReceiptInfo(this.searchSafeReceiptTxt);
          this.valIsOk = this.safeReceipt_inpts.currentSafeVal + this.theReceiptInfo.receiptVal;
          if (this.valIsOk >= this.safeReceipt_inpts.receiptVal) {
            $('#receiptVal').removeClass('is-invalid').addClass('is-valid');
            this.validTests.receiptValValid = false;

          } else {
            $('#receiptVal').removeClass('is-valid').addClass('is-invalid');
            this.validTests.receiptValValid = true;
            this.validTests.receiptValValidMsg = 'الرصيد لا يسمح'
          };

        } else {

          if (this.safeReceipt_inpts.receiptVal <= this.safeReceipt_inpts.currentSafeVal) {
            $('#receiptVal').removeClass('is-invalid').addClass('is-valid');
            this.validTests.receiptValValid = false;
          } else {
            $('#receiptVal').removeClass('is-valid').addClass('is-invalid');
            this.validTests.receiptValValid = true;
            this.validTests.receiptValValidMsg = 'الرصيد لا يسمح'
          };

        };

      } else {
        $('#receiptVal').removeClass('is-invalid').addClass('is-valid');
        this.validTests.receiptValValid = false;
      };

    };

    if (this.safeReceipt_inpts.receiptVal == null || this.safeReceipt_inpts.receiptVal == 0) {
      $('#receiptVal').removeClass('is-valid').addClass('is-invalid');
      this.validTests.receiptValValid = true;
      this.validTests.receiptValValidMsg = 'يجب ادخال القيمة'
    };

    this.checkReceiptValid();
  };

  editSafeVal(receiptVal: number) { // from old receipt
    // get the old safe information
    let oldSafe = this._safeDataService.safeList.find(
      safe => safe.safeId == this.theReceiptInfo.safeId
    );

    let newVal: number = 0;

    // the condition
    if (this.theReceiptKind == 'add') {
      newVal = oldSafe.currentSafeVal - receiptVal;
    } else {
      newVal = oldSafe.currentSafeVal + receiptVal;
    };

    let i = this._safeDataService.safeList.findIndex(
      safe => safe.safeId === oldSafe.safeId
    );

    oldSafe.currentSafeVal = newVal

    this._safeDataService.updateSafeData(oldSafe).subscribe();
    // pass new Value to edit
    this._safeDataService.safeList[i].currentSafeVal = newVal;
  };

  editSecSafeVal(receiptVal: number) { // from old receipt
    // get the old safeVal
    let oldSecSafe = this._safeDataService.safeList.find(
      safe => safe.safeId == this.theReceiptInfo.secSafeId
    );
      
    // the condition
    if (this.theReceiptInfo.secSafeName != null && this.theReceiptInfo.secSafeName != undefined) {
      if (this.theReceiptKind == 'add') {
        oldSecSafe.currentSafeVal = oldSecSafe.currentSafeVal + receiptVal;
      } else {
        oldSecSafe.currentSafeVal = oldSecSafe.currentSafeVal - receiptVal;
      };

      let indx = this._safeDataService.safeList.findIndex(
        i => i.safeId === oldSecSafe.safeId
      );

      this._safeDataService.updateSafeData(oldSecSafe).subscribe();
      // pass new Value to edit
      this._safeDataService.safeList[indx].currentSafeVal = oldSecSafe.currentSafeVal;
    };

  };

  editCustomerVal(receiptVal: number) { // from old receipt
    // get the old customer
    let oldCustomer = this._safeAccComponent.customers.find(
      customer => customer.customerId == this.theReceiptInfo.customerId
    );

    // the condition
    if (this.theReceiptInfo.customerId != null) {
      if (this.theReceiptKind == 'add') {
        oldCustomer.customerRemain = oldCustomer.customerRemain + receiptVal;
      } else {
        oldCustomer.customerRemain = oldCustomer.customerRemain - receiptVal;
      };

      let indx = this._safeAccComponent.customers.findIndex(
        i => i.customerId === oldCustomer.customerId
      );

      this._custService.updateCustomerSer(oldCustomer).subscribe();
      // pass new Value to edit
      this._safeAccComponent.customers[indx].customerRemain = oldCustomer.customerRemain;
    };

  };

  editOtherAccVal(receiptVal: number) { // from old receipt
    // get the old acc information
    let oldAcc = this._safeAccComponent.otherAcc.find(
      acc => acc.AccName == this.theReceiptInfo.AccName
    );

    // the condition
    if (this.theReceiptInfo.AccName != null) {

      if (this.theReceiptKind == 'add') {
        oldAcc.currentAccVal = oldAcc.currentAccVal + receiptVal;
      } else {
        oldAcc.currentAccVal = oldAcc.currentAccVal - receiptVal;
      };

      let indx = this._safeAccComponent.otherAcc.findIndex(
        i => i.accId === oldAcc.accId
      );

      this._service.updateOtherAccSer(oldAcc).subscribe();
      // pass new Value to edit
      this._safeAccComponent.otherAcc[indx].currentAccVal = oldAcc.currentAccVal;
    };
  };

  receiptTestBtn() {

  };

  saveRecieptData() {

    let fstSafe_NewVal: number; //
    let sndSafe_NewVal: number; //
    let fstSafe_NewData: SafeData; //
    let sndSafe_NewData: SafeData; //
    // customer
    let customer_NewVal: number;
    let customer_NewData: Customer;
    // acc
    let acc_NewVal: number;
    let acc_NewData: OtherAcc;
    // validations
    let isSndSafe: Boolean = false;
    let isCustomer: boolean = false;

    let addNewSafeReceipt_Btn = $('#addNewSafeReceipt').html();

    if (addNewSafeReceipt_Btn == "تعديل الايصال") { // edite the old vals
      // receiptVal
      let theReceipt = this.getTheReceiptInfo(this.theReceiptInfo.safeReceiptId)
      // safe
      this.editSafeVal(theReceipt.receiptVal);
      // sec safe
      this.editSecSafeVal(theReceipt.receiptVal);
      // customer
      this.editCustomerVal(theReceipt.receiptVal);
      // other acc
      this.editOtherAccVal(theReceipt.receiptVal);
    };

    if (this.safeReceipt_inpts.transactionAccKind == 'خزنة') { // safe modify
      //make defult customer Id
      isSndSafe = true;

      if (this.theReceiptKind == 'add') {
        fstSafe_NewVal = this.theSafeInfo.currentSafeVal + this.safeReceipt_inpts.receiptVal;
        sndSafe_NewVal = this.theSafeInfo.currentSafeVal - this.safeReceipt_inpts.receiptVal;
      } else { // if (this.theReceiptKind == 'min')
        fstSafe_NewVal = this.theSafeInfo.currentSafeVal - this.safeReceipt_inpts.receiptVal;
        sndSafe_NewVal = this.theSafeInfo.currentSafeVal + this.safeReceipt_inpts.receiptVal;
      };

      fstSafe_NewData = { // first safe update in backend
        safeId: this.theSafeInfo.safeId,
        safeName: this.theSafeInfo.safeName,
        opendVal: this.theSafeInfo.opendVal,
        safeEmployee: this.theSafeInfo.safeEmployee,
        workerId: this.theSafeInfo.workerId,
        currentSafeVal: fstSafe_NewVal, // the only changed val
      };
      // save to backend
      this._safeDataService.updateSafeData(fstSafe_NewData).subscribe();

      sndSafe_NewData = { // snd safe update in backend
        safeId: this.theSnd_SafeInfo.safeId,
        safeName: this.theSnd_SafeInfo.safeName,
        opendVal: this.theSnd_SafeInfo.opendVal,
        safeEmployee: this.theSnd_SafeInfo.safeEmployee,
        workerId: this.theSnd_SafeInfo.workerId,
        currentSafeVal: sndSafe_NewVal, // the only changed val
      };
      // save to backend
      this._safeDataService.updateSafeData(sndSafe_NewData).subscribe();

    } else if (this.safeReceipt_inpts.transactionAccKind == 'عميل') { // customer modify

      isCustomer = true;

      if (this.theReceiptKind == 'add') {
        fstSafe_NewVal = this.theSafeInfo.currentSafeVal + this.safeReceipt_inpts.receiptVal;
        customer_NewVal = this.theCustomerInfo.customerRemain - this.safeReceipt_inpts.receiptVal
      } else {
        fstSafe_NewVal = this.theSafeInfo.currentSafeVal - this.safeReceipt_inpts.receiptVal;
        customer_NewVal = this.safeReceipt_inpts.receiptVal + this.theCustomerInfo.customerRemain;
      };

      fstSafe_NewData = { // first safe update in backend
        safeId: this.theSafeInfo.safeId,
        safeName: this.theSafeInfo.safeName,
        opendVal: this.theSafeInfo.opendVal,
        safeEmployee: this.theSafeInfo.safeEmployee,
        workerId: this.theSafeInfo.workerId,
        currentSafeVal: fstSafe_NewVal, // the only changed val
      };
      // save to backend
      console.log(fstSafe_NewData.currentSafeVal + ' : lastEdit');
      this._safeDataService.updateSafeData(fstSafe_NewData).subscribe();

      customer_NewData = { // customer update in backend
        customerId: this.theCustomerInfo.customerId,
        customerName: this.theCustomerInfo.customerName,
        customerAdd: this.theCustomerInfo.customerAdd,
        customerDateIN: this.theCustomerInfo.customerDateIN,
        customerPaid: this.theCustomerInfo.customerPaid,
        customerTell: this.theCustomerInfo.customerTell,
        customerUnit: this.theCustomerInfo.customerUnit,
        customerRemain: customer_NewVal // the only changed val
      };

      // save to backend
      this._custService.updateCustomerSer(customer_NewData).subscribe();

    } else if (this.safeReceipt_inpts.transactionAccKind == 'حساب') { // transactionAccKind modify

      if (this.theReceiptKind == 'add') {
        fstSafe_NewVal = this.theSafeInfo.currentSafeVal + this.safeReceipt_inpts.receiptVal;
        acc_NewVal = this.theOtherAccInfo.currentAccVal - this.safeReceipt_inpts.receiptVal;
      } else {
        fstSafe_NewVal = this.theSafeInfo.currentSafeVal - this.safeReceipt_inpts.receiptVal;
        acc_NewVal = this.theOtherAccInfo.currentAccVal + this.safeReceipt_inpts.receiptVal;
      };

      fstSafe_NewData = { // first safe update in backend
        safeId: this.theSafeInfo.safeId,
        safeName: this.theSafeInfo.safeName,
        opendVal: this.theSafeInfo.opendVal,
        safeEmployee: this.theSafeInfo.safeEmployee,
        workerId: this.theSafeInfo.workerId,
        currentSafeVal: fstSafe_NewVal, // the only changed val
      };
      // save to backend
      this._safeDataService.updateSafeData(fstSafe_NewData).subscribe();

      acc_NewData = {
        accId: this.theOtherAccInfo.accId,
        AccName: this.theOtherAccInfo.AccName,
        currentAccVal: acc_NewVal // the only changed val
      };
      // save to backend
      this._service.updateOtherAccSer(acc_NewData).subscribe();
    };

    if (isSndSafe == true) {
      this.safeReceipt_inpts.secSafeId = this.theSnd_SafeInfo.safeId
    } else {
      this.safeReceipt_inpts.secSafeId = 1
    };

    if (isCustomer == true) {
      this.safeReceipt_inpts.customerId = this.theCustomerInfo.customerId;
    } else {
      this.safeReceipt_inpts.customerId = 1
    };

    this.safeReceipt_inpts.safeId = this.theSafeInfo.safeId;

    if (addNewSafeReceipt_Btn == "تعديل الايصال") {
      this._safeDataService.updateSafeReceipt(this.safeReceipt_inpts).subscribe();
    } else {
      this._safeDataService.creatSafeReceipt(this.safeReceipt_inpts).subscribe();
    };

  };

  showInvoiceDone() {
    this._safeAccComponent.ngOnInit();
    this._safeAccComponent.showAddSafeReceipt_fade('showAddSafeReceipt_fade');
  };

  addNewSafeReceipt() {
    this.saveRecieptData();
    this.showInvoiceDone();
  };

  showDeleteSafeReciept() {
    $('#fadeLayer_SafeReceipt').show(0);
    $('.askForDelete').addClass('animate');
  };

  deleteSafeReceipt() {
    this._safeDataService.deleteSafeReciept(this.safeReceipt_inpts.safeReceiptId).subscribe()
    $('#fadeLayer_SafeReceipt').hide();
    $('.askForDelete').removeClass('animate');
    this._safeAccComponent.showSafeEnquir();
    window.alert(`تم حذف الفاتورة رقم ${this.safeReceipt_inpts.safeReceiptId}`)
  };

  hideFadeLayer_SafeReceipt() {
    $('#fadeLayer_SafeReceipt').hide();
    $('.askForDelete').removeClass('animate');
  };

};
