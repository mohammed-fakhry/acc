import { Injectable } from '@angular/core';
import { SafeData } from './safe-data';
import { HttpClient } from '@angular/common/http';
import { SafeInpts } from './safe-inpts';
import { SafeReceiptInpts } from './safe-receipt-inpts';

@Injectable({
  providedIn: 'root'
})
export class SafeDataService {

  safeList: SafeData[];

  safeInpts: SafeInpts;
  safeReceipt_inpts: SafeReceiptInpts;

  theWorkerId: number;

  constructor(private http: HttpClient) { }

  creatSafe(safe: SafeData) {
    return this.http.post('http://localhost/accounting/postSafe.php', safe)
  }

  getSafes() {
    return this.http.get<SafeData[]>('http://localhost/accounting/getSafesList.php');
  }

  updateSafeData(safe: SafeData) {
    return this.http.put('http://localhost/accounting/updateSafeData.php?id=' + safe.safeId, safe)
  }

}
