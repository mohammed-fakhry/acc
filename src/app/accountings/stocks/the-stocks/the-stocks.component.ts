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
import { StockTransaction } from '../stock-transaction';
//import { AddToStockPermissionComponent } from '../stockPermission/add-to-stock-permission/add-to-stock-permission.component';
@Component({
  selector: 'app-the-stocks',
  templateUrl: './the-stocks.component.html',
  styleUrls: ['./the-stocks.component.scss']
})
export class TheStocksComponent implements OnInit {

  minInvArry: any[];
  addInvArry: any[];
  tranceInvArry: any[];

  searchTxt: string;
  constructor(public router: Router, public logService: LoginService,
    public _stockService: StocksService, public _service: ServicesService) { }
  //, public _AddToStockPermissionComponent: AddToStockPermissionComponent

  productNameVaild: boolean;

  ngOnInit() {

    this.logService.logStart(); this.logService.reternlog();
    // getStocks data from backEnd

    this.getBackendData();
    this._stockService.makeStockArry = [{
      stockId: 0,
      stockName: '',
      stockProducts: [{ // as HandleBackEnd Class
        stockName: '',
        stockId: 0,
        sndStockId: 0,
        productName: '',
        productId: 0,
        productQty: 0,
        productCost: 0,
        productPrice: 0
      }] // stockProducts
    }]; // makeStockArry

    //this.testBackend();
    ////console.log(this._stockService.stocks.length)
  } // ngOnInit

  getBackendData() {
    // get handle BackEnd
    this._stockService.getHandleBackEnd().subscribe((data: HandleBackEnd[]) => {
      this._stockService.handleBackEnd = data;
    })
    // getHandleAddtoStockPrimList
    this.getHandlePrimList();

    this._stockService.getStockes().subscribe((data: Stock[]) => {
      data.shift()
      this._stockService.stocks = data;
      ////console.log(this._stockService.stocks)
    });

    this._stockService.getProducts().subscribe((data: ProductsClass[]) => {
      this._stockService.allProducts = data;
    })

    this.getStockTransactionArr();

  }

  getStockTransactionArr() {
    this._stockService.getStockTransactionList().subscribe((data: StockTransaction[]) => {
      this._stockService.stockTransactionArr = data;
    });
  }

  getHandlePrimList() {
    this._stockService.getHandleAddtoStockPrimList().subscribe((data: HandleAddPrimBE[]) => {
      this._stockService.HandleAddtoStockPrimArry = data;
      ////console.log(this._stockService.HandleAddtoStockPrimArry + ' : data')
    })
  }

  CreateTheInvoiceArry() {

    this.getHandlePrimList(); // getHandleAddtoStockPrimList from Db
    this.getStockTransactionArr();

    this._stockService.makeInvoiceArry = [];
    // make InvoiceArry
    this._stockService.makeInvoiceArry = [{
      invoiceId: null,
      invoiceSearchVal: null,
      stockTransactionId: null,
      stockId: null,
      stockName: '',
      sndStockName: '',
      customerName: '',
      transactionType: null,
      notes: null,
      invoiceDetails: [{
        stockTransactionId: null,
        productName: null,
        stockName: '',
        sndStockId: null,
        customerName: '',
        invoiceTotal: 0,
        price: null,
        Qty: null,
        date_time: null,
        notes: null,
      }]
    }]

    for (let i = 0; i < this._stockService.stockTransactionArr.length; i++) {
      this._stockService.makeInvoiceArry.push(this._stockService.stockTransactionArr[i])
    }

    for (let s = 0; s < this._stockService.makeInvoiceArry.length; s++) {
      //countId++
      //this._stockService.makeInvoiceArry[s].invoiceId = countId;
      this._stockService.makeInvoiceArry[s].invoiceDetails = [];
    }

    for (let h = 0; h < this._stockService.HandleAddtoStockPrimArry.length; h++) {
      for (let m = 0; m < this._stockService.makeInvoiceArry.length; m++) {
        if (this._stockService.HandleAddtoStockPrimArry[h].stockTransactionId == this._stockService.makeInvoiceArry[m].stockTransactionId) {
          this._stockService.makeInvoiceArry[m].invoiceDetails.push(this._stockService.HandleAddtoStockPrimArry[h]);
          ////console.log(this._stockService.HandleAddtoStockPrimArry[h])
          this._stockService.makeInvoiceArry[m].customerName = this._stockService.makeInvoiceArry[m].invoiceDetails[0].customerName;
          this._stockService.makeInvoiceArry[m].stockName = this._stockService.makeInvoiceArry[m].invoiceDetails[0].stockName;
          this._stockService.makeInvoiceArry[m].sndStockId = this._stockService.makeInvoiceArry[m].invoiceDetails[0].sndStockId;
        };
      };
    };

    this._stockService.makeInvoiceArry.shift(); // delete the first index "coz its Null"

    for (let m = 0; m < this._stockService.makeInvoiceArry.length; m++) {
      //this._stockService.makeInvoiceArry[m].customerName = this._stockService.makeInvoiceArry[m].invoiceDetails[0].customerName;
      let date = new Date(this._stockService.makeInvoiceArry[m].date_time)
      let fullYear = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      let inVal = `${this._stockService.makeInvoiceArry[m].invNumber} - ${this._stockService.makeInvoiceArry[m].customerName}  |  ${fullYear}`
      this._stockService.makeInvoiceArry[m].invoiceSearchVal = inVal;
      //this._stockService.makeInvoiceArry[m].stockName = this._stockService.makeInvoiceArry[m].invoiceDetails[0].stockName;
    }
    //console.log(this._stockService.makeInvoiceArry)

  }; // CreateTheInvoiceArry

  makeMinInvArry() {
    this.CreateTheInvoiceArry();
    this.minInvArry = [];
    for (let i = 0; i < this._stockService.makeInvoiceArry.length; i++) {
      if (this._stockService.makeInvoiceArry[i].transactionType == 2) {
        this.minInvArry.push(this._stockService.makeInvoiceArry[i])
      }
    }
  }

  makeAddInvArry() {
    this.CreateTheInvoiceArry();
    this.addInvArry = [];
    for (let i = 0; i < this._stockService.makeInvoiceArry.length; i++) {
      if (this._stockService.makeInvoiceArry[i].transactionType == 1) {
        this.addInvArry.push(this._stockService.makeInvoiceArry[i])
      }
    }
    //console.log(this._stockService.makeInvoiceArry)
  }

  makeTranceInvArry() {
    this.CreateTheInvoiceArry();
    this.tranceInvArry = [];
    for (let i = 0; i < this._stockService.makeInvoiceArry.length; i++) {
      if (this._stockService.makeInvoiceArry[i].transactionType == 3) {
        for (let s = 0; s < this._stockService.stocks.length; s++) {
          if (this._stockService.makeInvoiceArry[i].sndStockId == this._stockService.stocks[s].stockId) {
            this._stockService.makeInvoiceArry[i].sndStockName = this._stockService.stocks[s].stockName;
            break
          }
        }
        let inVal = `${this._stockService.makeInvoiceArry[i].invNumber} - ${this._stockService.makeInvoiceArry[i].stockName} - ${this._stockService.makeInvoiceArry[i].sndStockName}`
        this._stockService.makeInvoiceArry[i].invoiceSearchVal = inVal;
        this.tranceInvArry.push(this._stockService.makeInvoiceArry[i]);
      }
    }
    //console.log(this.tranceInvArry)
  }

  testBackend() {
    //
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

    for (let i = 0; i < this._stockService.stocks.length; i++) {
      this._stockService.makeStockArry.push(this._stockService.stocks[i]);
      ////console.log(this._stockService.makeStockArry)
    };
    for (let m = 0; m < this._stockService.makeStockArry.length; m++) {
      this._stockService.makeStockArry[m].stockProducts = [];
    }
    for (let h = 0; h < this._stockService.handleBackEnd.length; h++) {
      for (let s = 0; s < this._stockService.makeStockArry.length; s++) {
        if (this._stockService.handleBackEnd[h].stockId == this._stockService.makeStockArry[s].stockId) {
          this._stockService.makeStockArry[s].stockProducts.push(this._stockService.handleBackEnd[h]);
          ////console.log(this._stockService.makeStockArry[s].stockProducts)
        };
      };
    };
  };

  randomId: number;
  // testBtn
  testbtn() {
    this.getBackendData();
    //console.log(this._stockService.HandleAddtoStockPrimArry)
    ////console.log(this._stockService.handleBackEnd)
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
    }]; // makeStockArry

    this._stockService.productsFromStockArryView = []
  }

  showStocksEnquiry() {
    this.getBackendData();
    $('.stocksClass').not('#stocksEnquiry').hide()
    $('#stocksEnquiry').show();
    $('#stocksSearch').fadeIn(100);
    $('#stockBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    this.resetBackendValues();
    //location.reload();
    ////console.log(this._stockService.productsFromStockArryView)
  };

  showProductsReport() {
    $('#prodDetTable').hide();
    $('.stocksClass').not('#productsReport').hide();
    $('#productsReport').show();
    $('#stocksSearch').fadeIn(100);
    $('#stockBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    this.resetBackendValues();
    this.getBackendData();
    this._service.clearForm();
  }

  showAddNewStock() {
    $('.stocksClass').not('#addNewStock').hide()
    $('#addNewStock').show()
    $('#stocksSearch').hide(100);
    $('#stockBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    this.resetBackendValues();
  };

  productNameArr: any[];

  makeProductNameArr() {
    this._stockService.getProducts().subscribe((data: ProductsClass[]) => {
      this._stockService.allProducts = data;
    })
    this.productNameArr = [];
    for (let i = 0; i < this._stockService.allProducts.length; i++) {
      this.productNameArr.push(this._stockService.allProducts[i].productName);
    }
    //console.log(this.productNameArr + ' : stock')
  }

  showAddNewProduct() {
    this.makeProductNameArr();
    this.productNameVaild = true;
    $('.stocksClass').not('#addNewProduct').hide()
    $('#addNewProduct').show()
    $('#stocksSearch').hide(100);
    $('#stockBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    this.resetBackendValues();
  }

  newAddInvNumber: number;

  showAddToStockPrem() {
    this.makeAddInvArry()
    $('.stocksClass').not('#addToStockPrem').hide()
    $('#addToStockPrem').show()
    $('#stocksSearch').hide(100);
    $('#premissionBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('#stockBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    // hide invoice addForm
    $('#callInvoice').show();
    $('#addInvoiceForm').hide();
    $('#callInvoiceBtn').html("فاتورة جديدة");
    this.resetBackendValues();
    this._service.clearForm()
    if (this.addInvArry.length == 0) {
      this.newAddInvNumber = 1
    } else {
      let lastArrIndx: number = this.addInvArry.length - 1
      this.newAddInvNumber = this.addInvArry[lastArrIndx].invNumber + 1
    }

    //console.log(this.addInvArry)
  }

  newTranceInvNumber: number;
  showTranceStockPrem() {
    this.makeTranceInvArry();
    $('.stocksClass').not('#tranceFrmStockPrem').hide();
    $('#tranceFrmStockPrem').show();
    $('#stocksSearch').hide(100);
    $('#premissionBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('#stockBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    $('#callTranceInvoice').show();
    $('#tranceInvoiceForm').hide();
    $('#callTranceInvoiceBtn').html("فاتورة جديدة");
    this.resetBackendValues();
    this._service.clearForm();
    if (this.tranceInvArry.length == 0) {
      this.newTranceInvNumber = 1
    } else {
      let lastArrIndx: number = this.tranceInvArry.length - 1
      this.newTranceInvNumber = this.tranceInvArry[lastArrIndx].invNumber + 1
    }

  }

  newMinInvNumber: number;
  showMinToStockPrem() {
    this.makeMinInvArry()
    $('.stocksClass').not('#minFrmStockPrem').hide();
    $('#minFrmStockPrem').show();
    $('#stocksSearch').hide(100);
    $('#premissionBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('#stockBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    $('#minCallInvoice').show();
    $('#minInvoiceForm').hide();
    $('#minCallInvoiceBtn').html("فاتورة جديدة");
    this.resetBackendValues();
    this._service.clearForm();
    if (this.minInvArry.length == 0) {
      this.newTranceInvNumber = 1
    } else {
      let lastArrIndx: number = this.minInvArry.length - 1
      this.newMinInvNumber = this.minInvArry[lastArrIndx].invNumber + 1
    }
  }

  deleteStock() {
    $('.fadeLayer').hide()
    this._stockService.deleteStockSer(this._stockService.stockDataView.stockId)
      .subscribe(data => {
        this._stockService.stocks = this._stockService.stocks.filter(u => u !== this._stockService.stockDataView)
      });
  };



} // End
