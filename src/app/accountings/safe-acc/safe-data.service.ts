import { Injectable } from '@angular/core';
import { SafeData } from './safe-data';
import { HttpClient } from '@angular/common/http';
import { SafeInpts } from './safe-inpts';
import { SafeReceiptInpts } from './safe-receipt-inpts';
import { SafeTransaction } from './safe-transaction';

@Injectable({
  providedIn: 'root'
})
export class SafeDataService {

  safeList: SafeData[];
  safeReceiptList: SafeReceiptInpts[];

  safeInpts: SafeInpts;
  //safeReceipt_inpts: SafeReceiptInpts;

  theWorkerId: number;

  // safe transaction
  safeTransactionArr: SafeTransaction[];

  receiptDoneMsg = {
    recieptNum: () => null,
    from: () => '',
    to: () => '',
    val: null,
    notes: ''
  }

  constructor(private http: HttpClient) { }

  url: string = 'http://localhost/accounting/';

  creatSafe(safe: SafeData) {
    return this.http.post(`${this.url}postSafe.php`, safe)
  };

  getSafes() {
    return this.http.get<SafeData[]>(`${this.url}getSafesList.php`);
  };

  updateSafeData(safe: SafeData) {
    return this.http.put(`${this.url}updateSafeData.php?id=` + safe.safeId, safe)
  };

  getSafesReceipt() {
    return this.http.get<SafeReceiptInpts[]>(`${this.url}safeReceiptList.php`);
  };

  creatSafeReceipt(safeReceipt: SafeReceiptInpts) {
    return this.http.post(`${this.url}postSafeReceipt.php`, safeReceipt)
  };

  updateSafeReceipt(safeReceipt: SafeReceiptInpts) {
    return this.http.put(`${this.url}updateSafeReceipt.php?id=` + safeReceipt.safeReceiptId, safeReceipt)
  };

  deleteSafeReciept(id: number) {
    return this.http.delete<SafeReceiptInpts[]>(`${this.url}deleteSafeReciept.php?id=` + id)
  };

}
