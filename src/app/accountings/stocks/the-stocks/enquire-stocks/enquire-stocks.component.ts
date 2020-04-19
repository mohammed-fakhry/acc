import { Component, OnInit } from '@angular/core';
import { Stock } from '../../../stock';
import { StocksService } from '../stocks.service';
import { TheStocksComponent } from '../the-stocks.component';

@Component({
  selector: 'app-enquire-stocks',
  templateUrl: './enquire-stocks.component.html',
  styleUrls: ['./enquire-stocks.component.scss']
})
export class EnquireStocksComponent implements OnInit {

  constructor(public _stockService: StocksService,
    public _theStocksComponent:TheStocksComponent) { }

  ngOnInit() {
    // hide Fade layer
    $('#hideFadeLayer').click(function () {
      $('.fadeLayer').hide()
      $('.askForDelete').removeClass('animate')
    })

    //console.log(this._stockService.stocks)

  } // ngOnInit

  askForDelete(stock: Stock) {
    $('.fadeLayer').show(0);
    $('.askForDelete').addClass('animate');
    this._stockService.stockDataView = stock;
  };

  showUpdateStock(stock: Stock) {
    $('.stocksClass').not('#addNewStock').hide();
    $('#addNewStock').show();
    $('#addNewStockBtn').html('تعديل');
    $('#addWorkerInside h2:first').html('تعديل بيانات مخزن');
    $('#stocksSearch').hide(100);
    $('#stockBtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    this._stockService.stockDataView = stock;
  }

  sumArry(arr: any[]) {
    let s = 0
    for (let i = 0; i < arr.length; i++) {
      s = s + arr[i]
    }
    return s
  };

  //totalProductsValuInStock: number ; // in stockDetails
  //totalProductsValuArry: any[];
  showStockDetails(stock: Stock) {
    this._stockService.totalProductsValuInStock = 0;
    //this.totalProductsValuArry = [];
    $('.stocksClass').not('#stockDtails').hide();
    $('#stockDtails').show();
    $('#stocksSearch').hide(100);
    $('#stockBtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    // get the data
    this._theStocksComponent.testBackend();
    for (let i=0 ; i < this._stockService.makeStockArry.length ; i++) {
      if (stock.stockId == this._stockService.makeStockArry[i].stockId) {
        this._stockService.makeStockArryView = this._stockService.makeStockArry[i]
        this._stockService.productsFromStockArryView = this._stockService.makeStockArry[i].stockProducts;
        this._stockService.productsFromStockArryView.toLocaleString()
        console.log(this._stockService.makeStockArry)
        break
      }
    }
    let total = 0
    for (let s = 0 ; s < this._stockService.productsFromStockArryView.length; s++ ) {
      this._stockService.totalProductsValuInStock = this._stockService.totalProductsValuInStock +  parseInt(this._stockService.productsFromStockArryView[s].productQty) * parseInt(this._stockService.productsFromStockArryView[s].productCost)
    }

    //console.log(this.totalProductsValu)
  }
  
}
