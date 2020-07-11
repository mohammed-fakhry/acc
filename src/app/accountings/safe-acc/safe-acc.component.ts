import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login.service';
import { ServicesService } from 'src/app/services.service';
import { SafeData } from './safe-data';
import { SafeDataService } from './safe-data.service';
import { CustomerService } from 'src/app/customer.service';
import { Customer } from 'src/app/customer';
import { OtherAcc } from '../other-acc';
import { SafeTransaction } from './safe-transaction';
import { SafeReceiptInpts } from './safe-receipt-inpts';

@Component({
  selector: 'app-safe-acc',
  templateUrl: './safe-acc.component.html',
  styleUrls: ['./safe-acc.component.scss']
})
export class SafeAccComponent implements OnInit {

  customers: Customer[];
  otherAcc: OtherAcc[];

  theANum = "1000000"

  constructor(public logService: LoginService, public _safeDataService: SafeDataService,
    public _service: ServicesService, public _custService: CustomerService) { }

  ngOnInit() {

    this.logService.logStart(); this.logService.reternlog();
    this.getBackendData_Receipt();
    this._service.handleTableHeight();
    //this.inArabicWords(this.theANum);
  };



  inWords(numb) {

    let n: any;
    let num = "521230"

    var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : ''; // مليون
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : ''; // مائة الف
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : ''; // الف
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : ''; // مائة
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
  };


  inArabicWords = (number) => {
    let aNum: any;
    this.theANum = "1250000"

    var one = ['', 'واحد ', 'اثنان ', 'ثلاثة ', 'اربعة ', 'خمسة ', 'ست ', 'سبع ', 'ثمان ', 'تسع ', 'عشر ', 'احدى عشر ', 'اثنى عشر ', 'ثلاثة عشر ', 'اربعة عشر ', 'خمسة عشر ', 'ستة عشر ', 'سبعة عشر ', 'ثمانية عشر ', 'تسعة عشر '];
    var two = ['', '', ' عشرون ', 'ثلاثون ', 'اربعون ', 'خمسون ', 'ستون ', 'سبعون ', 'ثمانون ', 'تسعون'];

    if ((this.theANum = this.theANum.toString()).length > 9) return 'overflow';
    aNum = ('000000000' + this.theANum).substr(-9).match(/^(\d{2})(\d{1})(\d{3})(\d{3})/ /* (\d{2})$/ */);
    if (!aNum) return; var strA = '';
    strA += (aNum[1] != 0) ? (one[Number(aNum[1])] || two[aNum[1][0]] + ' ' + one[aNum[1][1]]) + 'بليون ' : '';
    strA += (aNum[2] != 0) ? (one[Number(aNum[2])] || two[aNum[2][0]] + ' ' + one[aNum[2][1]]) + 'مليون ' : '';
    strA += (aNum[3] != 0) ? (one[Number(aNum[3])] || one[aNum[3][1]] + 'و' + two[aNum[3][0]]) + 'مائة الف ' : '';
    return strA;
  };

  getOtheAccInfo_backEnd() {
    this._service.getOtherAccSer().subscribe((data: OtherAcc[]) => {
      this.otherAcc = data;
    });
  };

  getSafeInfo_backEnd() {
    this._safeDataService.getSafes().subscribe((data: SafeData[]) => {
      this._safeDataService.safeList = data;
    });
  };

  getCustomerData_backEnd() {
    this._custService.getCustomer().subscribe((data: Customer[]) => {
      this.customers = data;
    });
  };

  getReceiptData_backEnd() {
    this._safeDataService.getSafesReceipt().subscribe((data: SafeReceiptInpts[]) => {
      this._safeDataService.safeReceiptList = data;
    })
  }

  getBackendData_Receipt() {
    // getSafeCurrentVal
    this.getSafeInfo_backEnd();
    // getCustomerData_backEnd
    this.getCustomerData_backEnd();
    // getOtherAcc
    this.getOtheAccInfo_backEnd();
    // receipt data
    this.getReceiptData_backEnd();
  };

  safeRecClearForm() {
    $('.clearForm').val('')
  };

  showAddSafeReceipt_fade(btnId: string) {
    $('#theSafeFadeLayer').show();
    $('#SafeReceiptDone').show();
    $('.askForDelete').addClass('animate');
    $('.fadeBtns').not(`#${btnId}`).hide();
    $(`#${btnId}`).show();
  };

  showSafeEnquir_fade() {
    this.showSafeEnquir();
    $('#theSafeFadeLayer').fadeOut('fast');
    $('.askForDelete').fadeOut('fast').removeClass('animate');
  }

  showAddNewRecipt_fade() {
    this.showAddSafeReceipt();
    $('#theSafeFadeLayer').hide();
    $('.askForDelete').fadeOut('fast').removeClass('animate');
  };

  buttonEffect(max: string) {
    $(max).removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('.headerMainBtn').not(max).removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);

    $('.headerMainBtn').not(max).attr({ 'disabled': false });
    $(max).attr({ 'disabled': true });
  };

  showAddSafe() {
    this.getSafeInfo_backEnd();
    this._service.clearForm();
    $('#addSafeHeader').html('اضافة خزنة')
    $('#addNewSafeBtn').html('اضافة')
    $('.safeClass').not('#addSafe').hide();
    $('#addSafe').show();
    this.buttonEffect('#showAddSafeBtn');
  };

  showAddSafeReceipt() {
    this.getBackendData_Receipt();
    
    //this._service.clearForm();
    $('#call_SafeRecieptBtn').html('ايصال جديد')
    $('.safeClass').not('#safeReceipt').hide();
    $('#safeReceipt').show();
    $('#add_SafeReceiptInside').hide(); // first
    $('#header_SafeRecipt').show(); // second
    this.buttonEffect('#showAddSafeReceipt');
    $('#SafeReceiptSearch').val(null);
  };

  showSafeEnquir() {
    this.getSafeInfo_backEnd();
    this.getReceiptData_backEnd();
    $('.safeClass').not('#enquireSafe').hide();
    $('#enquireSafe').show();
    this.buttonEffect('#showSafeBtn');
  };

} // end
