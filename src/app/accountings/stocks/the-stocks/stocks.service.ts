import { Injectable } from '@angular/core';
import { Stock } from '../../stock';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'
import { HttpClient } from '@angular/common/http';
import { HandleBackEnd } from '../../../handle-back-end'
import { ProductsClass } from '../products-class';
import { StockPridge } from '../stock-pridge';
import { StockTransactionD } from '../stock-transaction-d';
import { StockTransaction } from '../stock-transaction';
import { HandleAddPrimBE } from '../handle-add-prim-be';
import { StockTransactionList } from '../../stock-transaction-list';

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
  allProducts: ProductsClass[];
  stockTransactionArr: StockTransaction[];
  stockTransactionDetailsArr: StockTransactionD[];
  makeInvoiceArry:any[];

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
  totalProductsValuInStock: number ; // in stockDetails
  constructor(private http: HttpClient) { };

  HandleAddtoStockPrimArry: HandleAddPrimBE[];

  // defult url
  url: string = 'http://localhost/accounting/'

  stockDataViewVal() {
    return this.stockDataView;
  }

  getStockes() {
    return this.http.get<Stock[]>(`${this.url}stocksList.php`);
  }

  creatStock(stock: Stock) {
    return this.http.post(`${this.url}postStock.php`, stock)
  }

  deleteStockSer(id: number) {
    return this.http.delete<Stock[]>(`${this.url}deleteStock.php?id=` + id)
  }

  updateStockSer(stock: Stock) {
    return this.http.put(`${this.url}editeStock.php?id=` + stock.stockId, stock )
  }

  postStockPridge(stockPridge : StockPridge) {
    return this.http.post(`${this.url}postProductPridge.php`, stockPridge)
  }

  updateStockPridge(stockPridge: StockPridge) {
    return this.http.put(`${this.url}updatePridgeList.php?id=` + stockPridge.stockProductId, stockPridge )
  }
  
  getHandleBackEnd() {
    return this.http.get<HandleBackEnd[]>(`${this.url}pridgeList.php`);
  }

  creatProduct(product: ProductsClass) {
    return this.http.post(`${this.url}postProduct.php`, product)
  }

  getProducts() {
    return this.http.get<ProductsClass[]>(`${this.url}productsList.php`);
  }

  creatStockTransactionDetails(StockTransactionD: StockTransactionD) {
    return this.http.post(`${this.url}postStocktTransactionDetailsId.php`, StockTransactionD)
  };

  creatStockTransaction(StockTransaction: StockTransaction) {
    return this.http.post(`${this.url}stockTransaction.php`, StockTransaction)
  }

  // for invoice search || edite
  getHandleAddtoStockPrimList() {
    return this.http.get<HandleAddPrimBE[]>(`${this.url}addtoStockPrimList.php`);
  }
  // stockTransactionDetailsList
  getStockTransactionDetailsList() {
    return this.http.get<StockTransactionD[]>(`${this.url}stockTransactionDetailsList.php`);
  }

  // stockTransactionList
  getStockTransactionList() {
    return this.http.get<StockTransactionList[]>(`${this.url}stockTransactionList.php`);
  }

  UpdateStockTransactionDetails(stockTransactionDetails: StockTransactionD) {
    return this.http.put(`${this.url}updatestocktransactiondetails.php?id=` + stockTransactionDetails.stockTransactionDetailsId, stockTransactionDetails )
  }

  deleteStockTransactionDetails(id: number) {
    return this.http.delete<StockTransactionD[]>(`${this.url}deleteInvoiceDetails.php?id=` + id)
  }

  UpdateStockTransaction(stockTransaction: StockTransaction) {
    return this.http.put(`${this.url}updateStocktransaction.php?id=` + stockTransaction.stockTransactionId, stockTransaction )
  }

  deleteStockTransaction(id: number) {
    return this.http.delete<StockTransactionD[]>(`${this.url}deleteInvoice.php?id=` + id)
  }

}
