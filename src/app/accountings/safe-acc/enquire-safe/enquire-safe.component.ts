import { Component, OnInit } from '@angular/core';
import { SafeDataService } from '../safe-data.service';
import { SafeAccComponent } from '../safe-acc.component';
import { SafeData } from '../safe-data';
import { SafeTransaction } from '../safe-transaction';

@Component({
  selector: 'app-enquire-safe',
  templateUrl: './enquire-safe.component.html',
  styleUrls: ['./enquire-safe.component.scss']
})
export class EnquireSafeComponent implements OnInit {

  constructor(public _safeDataService: SafeDataService, public _safeAccComponent: SafeAccComponent) { }

  ngOnInit() {

  }

  fillData(safe) {
    this._safeDataService.safeInpts.safeId = safe.safeId;
    this._safeDataService.safeInpts.safeEmployee = safe.safeEmployee;
    this._safeDataService.safeInpts.safeName = safe.safeName;
    this._safeDataService.safeInpts.opendVal = safe.opendVal;
    this._safeDataService.theWorkerId = safe.workerId
  }

  showEditSafe(safe) {
    this.fillData(safe);
    console.log(safe)
    $('#addSafeHeader').html('تعديل بيانات خزنة')
    $('#addNewSafeBtn').html('تعديل')
    $('.safeClass').not('#addSafe').hide();
    $('#addSafe').show();
    $('#showAddSafeBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('.headerMainBtn').not('#showAddSafeBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    $('.headerMainBtn').attr({'disabled': false});
  };


  makeSafeTransaction(safe: SafeData) {
    this._safeDataService.safeTransactionArr = []
    this._safeAccComponent.getReceiptData_backEnd();
    //: SafeTransaction;

    if (safe.opendVal > 0) {
      let theSafeRecipt: any
      theSafeRecipt = {
        safeReceiptId: 0,
        receiptKind: 'رصيد أول',
        receiptKind_color: '',
        date_time: null,
        transactionAccKind: null,
        transactionExplain: 'رصيد أول',
        receiptValIn: safe.opendVal,
        receiptValOut: 0,
        safeNet: 0,
        recieptNote: '',
      };
      this._safeDataService.safeTransactionArr.push(theSafeRecipt)
    }
    
    for (let i = 0; i < this._safeDataService.safeReceiptList.length; i++) {
      let theSafeRecipt: any
      if (safe.safeId == this._safeDataService.safeReceiptList[i].safeId) {
        theSafeRecipt = {
          safeReceiptId: null,
          receiptKind: null,
          receiptKind_color: null,
          date_time: null,
          transactionAccKind: null,
          transactionExplain: null,
          receiptValIn: null,
          receiptValOut: null,
          safeNet: null,
          recieptNote: null,
        };
        theSafeRecipt.safeReceiptId = this._safeDataService.safeReceiptList[i].safeReceiptId;
        theSafeRecipt.receiptKind = this._safeDataService.safeReceiptList[i].receiptKind;
        //theSafeRecipt.receiptKind_color = '';
        theSafeRecipt.date_time = this._safeDataService.safeReceiptList[i].date_time;
        theSafeRecipt.transactionAccKind = this._safeDataService.safeReceiptList[i].transactionAccKind;
        //theSafeRecipt.transactionExplain = '';
        //theSafeRecipt.receiptValIn = 0;
        //theSafeRecipt.receiptValOut = 0;
        //theSafeRecipt.safeNet = 0;
        theSafeRecipt.recieptNote = this._safeDataService.safeReceiptList[i].recieptNote;

        if (this._safeDataService.safeReceiptList[i].transactionAccKind == 'حساب') {
          theSafeRecipt.transactionExplain = this._safeDataService.safeReceiptList[i].AccName;
        } else if (this._safeDataService.safeReceiptList[i].transactionAccKind == 'عميل') {
          theSafeRecipt.transactionExplain = this._safeDataService.safeReceiptList[i].customerName;
        } else if (this._safeDataService.safeReceiptList[i].transactionAccKind == 'خزنة') {
          theSafeRecipt.transactionExplain = this._safeDataService.safeReceiptList[i].secSafeName;
        }

        if (this._safeDataService.safeReceiptList[i].receiptKind == 'ايصال استلام نقدية' || this._safeDataService.safeReceiptList[i].receiptKind == 'رصيد أول') {
          theSafeRecipt.receiptValIn = this._safeDataService.safeReceiptList[i].receiptVal;
          theSafeRecipt.receiptValOut = 0;
          theSafeRecipt.receiptKind_color = 'text-dark'
        } else {
          theSafeRecipt.receiptKind_color = 'text-danger'
          theSafeRecipt.receiptValIn = 0;
          theSafeRecipt.receiptValOut = this._safeDataService.safeReceiptList[i].receiptVal;
        }

        this._safeDataService.safeTransactionArr.push(theSafeRecipt)
        //console.log(JSON.stringify( theSafeRecipt))
      }
    }

    let sortTrans =  this._safeDataService.safeTransactionArr.sort((a,b) => {
      return a.safeReceiptId - b.safeReceiptId
    })

    this._safeDataService.safeTransactionArr = sortTrans;

    for (let s = 0; s < this._safeDataService.safeTransactionArr.length; s++) {
      if (this._safeDataService.safeTransactionArr[s -1] == undefined) {
        this._safeDataService.safeTransactionArr[s].safeNet = this._safeDataService.safeTransactionArr[s].receiptValIn - this._safeDataService.safeTransactionArr[s].receiptValOut;
      } else {
        this._safeDataService.safeTransactionArr[s].safeNet = this._safeDataService.safeTransactionArr[s-1].safeNet + this._safeDataService.safeTransactionArr[s].receiptValIn - this._safeDataService.safeTransactionArr[s].receiptValOut;
      }
    }
    //console.log(this._safeDataService.safeTransactionArr)
    //console.log(theSafeRecipt);
  }

  showSafeTranaction(safe: SafeData) {
    this.makeSafeTransaction(safe);
    console.log(JSON.stringify(this._safeDataService.safeTransactionArr))
    console.log(safe)
    $('.safeClass').not('#safeTransaction').hide()
    $('#safeTransaction').show();
    $('.headerMainBtn').attr({'disabled': false});
  }

}
