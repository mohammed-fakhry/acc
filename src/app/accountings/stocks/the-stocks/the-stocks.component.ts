import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'
import { ServicesService } from '../../../services.service';
import { Router } from '@angular/router'
import { LoginService } from '../../../login.service';
import { StocksService } from './stocks.service';
import { Stock } from '../../stock';
import { HandleBackEnd } from '../../../handle-back-end'
import { ProductsClass } from '../products-class';
import { HandleAddPrimBE } from '../handle-add-prim-be';
//import { AddToStockPermissionComponent } from '../stockPermission/add-to-stock-permission/add-to-stock-permission.component';
@Component({
  selector: 'app-the-stocks',
  templateUrl: './the-stocks.component.html',
  styleUrls: ['./the-stocks.component.scss']
})
export class TheStocksComponent implements OnInit {

  constructor(private router: Router, private logService: LoginService,
    private _stockService: StocksService, private _service: ServicesService) { }
  //, private _AddToStockPermissionComponent: AddToStockPermissionComponent

  ngOnInit() {

    this.logService.logStart(); this.logService.reternlog();
    // getStocks data from backEnd
    this._stockService.getStockes().subscribe((data: Stock[]) => {
      this._stockService.stocks = data;
      //console.log(this._stockService.stocks)
    });

    // get handle BackEnd
    this._stockService.getHandleBackEnd().subscribe((data: HandleBackEnd[]) => {
      this._stockService.handleBackEnd = data;
    })
    // getHandleAddtoStockPrimList
    this._stockService.getHandleAddtoStockPrimList().subscribe((data: HandleAddPrimBE[]) => {
      this._stockService.HandleAddtoStockPrimArry = data;
    })

    this._stockService.getProducts().subscribe((data: ProductsClass[]) => {
      this._stockService.allProducts = data;
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

  CreateTheInvoiceArry() {
    let countId = -1
    this._stockService.makeInvoiceArry = [];
    // make InvoiceArry
    this._stockService.makeInvoiceArry = [{
      invoiceId: null,
      invoiceSearchVal: null,
      stockTransactionId: null,
      stockId: null,
      stockName: '',
      customerName: '',
      transactionType: null,
      notes: null,
      invoiceDetails: [{
        stockTransactionId: null,
        productName: null,
        stockName: '',
        customerName: '',
        price: null,
        Qty: null,
        notes: null,
      }]
    }]

    for (let i = 0; i < this._stockService.stockTransactionArr.length; i++) {
      this._stockService.makeInvoiceArry.push(this._stockService.stockTransactionArr[i])
    }

    for (let s = 0; s < this._stockService.makeInvoiceArry.length; s++) {
      countId++
      this._stockService.makeInvoiceArry[s].invoiceId = countId;
      this._stockService.makeInvoiceArry[s].invoiceDetails = [];
    }

    for (let h = 0; h < this._stockService.HandleAddtoStockPrimArry.length; h++) {
      for (let m = 0; m < this._stockService.makeInvoiceArry.length; m++) {
        if (this._stockService.HandleAddtoStockPrimArry[h].stockTransactionId == this._stockService.makeInvoiceArry[m].stockTransactionId) {
          this._stockService.makeInvoiceArry[m].invoiceDetails.push(this._stockService.HandleAddtoStockPrimArry[h]);
          //console.log(this._stockService.HandleAddtoStockPrimArry[h])
          this._stockService.makeInvoiceArry[m].customerName = this._stockService.makeInvoiceArry[m].invoiceDetails[0].customerName;
          this._stockService.makeInvoiceArry[m].stockName = this._stockService.makeInvoiceArry[m].invoiceDetails[0].stockName;
        };
      };
    };

    this._stockService.makeInvoiceArry.shift(); // delete the first index "coz its Null"

    for (let m = 0; m < this._stockService.makeInvoiceArry.length; m++) {
      //this._stockService.makeInvoiceArry[m].customerName = this._stockService.makeInvoiceArry[m].invoiceDetails[0].customerName;
      let inVal = `${this._stockService.makeInvoiceArry[m].invoiceId} - ${this._stockService.makeInvoiceArry[m].customerName}`
      this._stockService.makeInvoiceArry[m].invoiceSearchVal = inVal;
      //this._stockService.makeInvoiceArry[m].stockName = this._stockService.makeInvoiceArry[m].invoiceDetails[0].stockName;
    }
    
  }; // CreateTheInvoiceArry



  testBackend() {
    //
    for (let i = 0; i < this._stockService.stocks.length; i++) {
      this._stockService.makeStockArry.push(this._stockService.stocks[i]);
      //console.log(this._stockService.makeStockArry)
    };
    for (let m = 0; m < this._stockService.makeStockArry.length; m++) {
      this._stockService.makeStockArry[m].stockProducts = [];
    }
    for (let h = 0; h < this._stockService.handleBackEnd.length; h++) {
      for (let s = 0; s < this._stockService.makeStockArry.length; s++) {
        if (this._stockService.handleBackEnd[h].stockId == this._stockService.makeStockArry[s].stockId) {
          this._stockService.makeStockArry[s].stockProducts.push(this._stockService.handleBackEnd[h]);
          //console.log(this._stockService.makeStockArry[s].stockProducts)
        };
      };
    };
  };

  randomId: number;
  // testBtn
  testbtn() {
    console.log(this._stockService.makeInvoiceArry)
    console.log(this._stockService.handleBackEnd)
    //this._AddToStockPermissionComponent.testBtn()
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
    $('.stocksClass').not('#stocksEnquiry').hide()
    $('#stocksEnquiry').show();
    $('#stocksSearch').fadeIn(100);
    $('#stockBtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    this.resetBackendValues();
    //location.reload();
    //console.log(this._stockService.productsFromStockArryView)
  };

  showAddNewStock() {
    $('.stocksClass').not('#addNewStock').hide()
    $('#addNewStock').show()
    $('#stocksSearch').hide(100);
    $('#stockBtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    this.resetBackendValues();
  };

  showAddNewProduct() {
    $('.stocksClass').not('#addNewProduct').hide()
    $('#addNewProduct').show()
    $('#stocksSearch').hide(100);
    $('#stockBtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    this.resetBackendValues();
  }

  showAddToStockPrem() {
    this.CreateTheInvoiceArry()
    $('.stocksClass').not('#addToStockPrem').hide()
    $('#addToStockPrem').show()
    $('#stocksSearch').hide(100);
    $('#premissionBtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
    $('#stockBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    // hide invoice addForm
    $('#callInvoice').show();
    $('#addInvoiceForm').hide();
    $('#callInvoiceBtn').html("فاتورة جديدة");

    this.resetBackendValues();
    this._service.clearForm()
  }

  deleteStock() {
    $('.fadeLayer').hide()
    this._stockService.deleteStockSer(this._stockService.stockDataView.stockId)
      .subscribe(data => {
        this._stockService.stocks = this._stockService.stocks.filter(u => u !== this._stockService.stockDataView)
      });
  };



} // End
