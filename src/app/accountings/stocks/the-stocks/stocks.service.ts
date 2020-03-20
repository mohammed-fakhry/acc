import { Injectable } from '@angular/core';
import { Stock } from '../../stock';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'
import { HttpClient } from '@angular/common/http';
import { HandleBackEnd } from '../../../handle-back-end'
import { ProductsClass } from '../products-class';

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
  // merge every stock with it's products
  handleBackEnd: HandleBackEnd[];
  makeStockArry: any[];
  makeStockArryView: any = {
    stockId: 0,
    stockName: '',
    stockPlace: '',
    stockEmployee: '',
    stockProducts: [{
      stockName: '',
      stockId: 0,
      productName: '',
      productId: 0,
      stockProductId: 0,
      productQty: 0,
      productCost: 0,
      productPrice: 0,
    }]
  }

  // all products
  productDataView:ProductsClass = {
    productId: 0,
    productName: '',
  }

  productsFromStockArryView: any[];
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

  deleteStockSer(id: number) {
    return this.http.delete<Stock[]>('http://localhost/accounting/deleteStock.php?id=' + id)
  }

  updateStockSer(stock: Stock) {
    return this.http.put('http://localhost/accounting/editeStock.php?id=' + stock.stockId, stock )
  }

  getHandleBackEnd() {
    return this.http.get<HandleBackEnd[]>('http://localhost/accounting/pridgeList.php');
  }

  creatProduct(product: ProductsClass) {
    return this.http.post('http://localhost/accounting/postProduct.php', product)
  }
}
