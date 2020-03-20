import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'
import { ServicesService } from '../../../services.service';
import { Router } from '@angular/router'
import { LoginService } from '../../../login.service';
import { StocksService } from './stocks.service';
import { Stock } from '../../stock';
import { HandleBackEnd } from '../../../handle-back-end'
@Component({
  selector: 'app-the-stocks',
  templateUrl: './the-stocks.component.html',
  styleUrls: ['./the-stocks.component.scss']
})
export class TheStocksComponent implements OnInit {

  constructor(private router: Router, private logService: LoginService,
    private _stockService: StocksService) { }


  ngOnInit() {

    this.logService.logStart(); this.logService.reternlog();
    // getStocks data from backEnd
    this._stockService.getStockes().subscribe((data: Stock[]) => {
      this._stockService.stocks = data;
    });

    // get handle BackEnd
    this._stockService.getHandleBackEnd().subscribe((data: HandleBackEnd[]) => {
      this._stockService.handleBackEnd = data;
    })

    this._stockService.makeStockArry = [{
      stockId: 0,
      stockName: '',
      stockProducts: [{ // as HandleBackEnd Class
        stockName: '',
        stockId: 0,
        productName: '',
        productId: 0,
        productQty: 0,
        productCost: 0,
        productPrice: 0
      }] // stockProducts
    }
    ]; // makeStockArry

    //this.testBackend();
    //console.log(this._stockService.stocks.length)
  } // ngOnInit

  testBackend() {
    //
    for (let i = 0; i < this._stockService.stocks.length; i++) {
      this._stockService.makeStockArry[i].stockProducts = []
      this._stockService.makeStockArry.push(this._stockService.stocks[i])
      //console.log(this._stockService.stocks[i])
    }
    for (let i = 0; i < this._stockService.handleBackEnd.length; i++) {
      for (let s = 0; s < this._stockService.makeStockArry.length; s++) {
        if (this._stockService.handleBackEnd[i].stockId == this._stockService.makeStockArry[s].stockId) {
          this._stockService.makeStockArry[s].stockProducts.push(this._stockService.handleBackEnd[i])
        }
      }
    }
    /*for (let h = 0 ; h < this.handleBackEnd.length ; h++) {
 
    }*/
    console.log(this._stockService.makeStockArry)
    //console.log(this._stockService.stocks)
  }

  resetBackendValues() {
    this._stockService.makeStockArryView = {
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

    this._stockService.makeStockArry = [{
      stockId: 0,
      stockName: '',
      stockProducts: [{ // as HandleBackEnd Class
        stockName: '',
        stockId: 0,
        productName: '',
        productId: 0,
        productQty: 0,
        productCost: 0,
        productPrice: 0
      }] // stockProducts
    }
    ]; // makeStockArry
  
    this._stockService.productsFromStockArryView = []
  }
  showStocksEnquiry() {
    $('.stocksClass').not('#stocksEnquiry').hide();
    $('#stocksEnquiry').show();
    $('#stocksSearch').show(100);
    $('#stockBtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    this.resetBackendValues();
    console.log(this._stockService.productsFromStockArryView)
  };

  showAddNewStock() {
    $('.stocksClass').not('#addNewStock').hide();
    $('#addNewStock').show();
    $('#stocksSearch').hide(100);
    $('#stockBtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    this.resetBackendValues();
  };

  showAddNewProduct() {
    $('.stocksClass').not('#addNewProduct').hide();
    $('#addNewProduct').show();
    $('#stocksSearch').hide(100);
    $('#stockBtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    this.resetBackendValues();
  }

  showAddToStockPrem() {
    $('.stocksClass').not('#addToStockPrem').hide();
    $('#addToStockPrem').show();
    $('#stocksSearch').hide(100);
    $('#premissionBtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
    $('#stockBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    this.resetBackendValues();
  }

  deleteStock() {
    $('.fadeLayer').hide()
    this._stockService.deleteStockSer(this._stockService.stockDataView.stockId)
      .subscribe(data => {
        this._stockService.stocks = this._stockService.stocks.filter(u => u !== this._stockService.stockDataView)
      });
  };

} // End
