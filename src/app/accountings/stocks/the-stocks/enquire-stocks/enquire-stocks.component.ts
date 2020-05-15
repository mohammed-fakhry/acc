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
    public _theStocksComponent: TheStocksComponent) { }

  ngOnInit() {
    // hide Fade layer
    $('#hideFadeLayer').click(function () {
      //$('.fadeLayer').hide()
      $('#theStockFadeLayer').hide()
      $('.askForDelete').removeClass('animate')
    })

    ////console.log(this._stockService.stocks)

  } // ngOnInit

  askForDelete(stock: Stock) {
    //$('.fadeLayer').show(0);
    $('#theStockFadeLayer').show(0)
    $('.askForDelete').addClass('animate');
    this._stockService.stockDataView = stock;
  };

  showUpdateStock(stock: Stock) {
    $('.stocksClass').not('#addNewStock').hide();
    $('#addNewStock').show();
    $('#addNewStockBtn').html('تعديل');
    $('#addWorkerInside h2:first').html('تعديل بيانات مخزن');
    $('#stocksSearch').hide(100);
    $('#stockBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
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
    $('#stockBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    // get the data
    this._theStocksComponent.testBackend();
    /*
    for (let i = 0; i < this._stockService.makeStockArry.length; i++) {
      if (stock.stockId == this._stockService.makeStockArry[i].stockId) {
        this._stockService.makeStockArryView = this._stockService.makeStockArry[i]
        this._stockService.productsFromStockArryView = this._stockService.makeStockArry[i].stockProducts;
        this._stockService.productsFromStockArryView.toLocaleString()
        console.log(this._stockService.productsFromStockArryView)
        this._stockService.productsFromStockArryView.filter(
          product => product.productQty != 0
        )
        break
      }
    }*/
    
    let getStockProducts = this._stockService.makeStockArry.find(
      stockArr => stockArr.stockId == stock.stockId
    );
    this._stockService.makeStockArryView = getStockProducts;

    this._stockService.productsFromStockArryView = getStockProducts.stockProducts.filter(
      p => p.productQty != 0
    );

    this._stockService.productsFromStockArryView.toLocaleString()
    let total = 0
    let TotalForSum: any[] = [];
    let count = 0;
    for (let s = 0; s < this._stockService.productsFromStockArryView.length; s++) {
      //this._stockService.totalProductsValuInStock = this._stockService.totalProductsValuInStock +
      total = parseInt(this._stockService.productsFromStockArryView[s].productQty) * parseInt(this._stockService.productsFromStockArryView[s].productCost)
      TotalForSum.push(total)
      count++
      //console.log(count)
    }
    //this._stockService.makeInvoiceArry()
    ////console.log(this._stockService.makeInvoiceArry())
    this._stockService.totalProductsValuInStock = this.sumArry(TotalForSum)
    //console.log(this._stockService.productsFromStockArryView)

    ////console.log(this.totalProductsValu)
  }

}
