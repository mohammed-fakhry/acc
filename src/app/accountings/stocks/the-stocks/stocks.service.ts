import { Injectable } from '@angular/core';
import { Stock } from '../../stock';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StocksService {

  stocks:any[];
  stockData: FormGroup;
  stockDataView: Stock = {
    stockId: null,
    stockName: null,
    stockPlace: null,
    stockEmployee: null,
    stockProducts: null,
  }

  constructor(private http: HttpClient) { };

  stockDataViewVal() {
    return this.stockDataView;
  }

  getStockes() {
    return this.http.get<Stock[]>('http://localhost/accounting/stocksList.php');
  }

  creatStock(stock: Stock) {
    return this.http.post('http://localhost/accounting/postStock.php', stock)
  }

  deleteWorkerSer(id: number) {
    return this.http.delete<Stock[]>('http://localhost/accounting/deleteStock.php?id=' + id)
  }

  updateWorkerSer(stock: Stock) {
    return this.http.put('http://localhost/accounting/editeStock.php?id=' + stock.stockId, stock )
  }
}
