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
import { async } from 'rxjs/internal/scheduler/async';
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

  } // ngOnInit

  getBackendData() {
    // get handle BackEnd
    this._stockService.getHandleBackEnd().subscribe((data: HandleBackEnd[]) => {
      this._stockService.handleBackEnd = data;
    });
    // getHandleAddtoStockPrimList
    this.getHandlePrimList();

    this._stockService.getStockes().subscribe((data: Stock[]) => {
      this._stockService.stocks = data;
      //console.log(this._stockService.stocks)
    });

    this._stockService.getProducts().subscribe((data: ProductsClass[]) => {
      this._stockService.allProducts = data;
    });

    this.getStockTransactionArr();
  };

  getStockTransactionArr() {
    this._stockService.getStockTransactionList().subscribe((data: StockTransaction[]) => {
      this._stockService.stockTransactionArr = data;
    });
  };

  getHandlePrimList() {
    this._stockService.getHandleAddtoStockPrimList().subscribe((data: HandleAddPrimBE[]) => {
      this._stockService.HandleAddtoStockPrimArry = data;
    });
  };

  showFade_newInvoice(btnId: string) {
    $('#theStockFadeLayer').show();
    $('#stockPerDone').show();
    $('.askForDelete').addClass('animate');
    $('.fadeBtns').not(`#${btnId}`).hide();
    $(`#${btnId}`).show();
  }

  closeFade() {
    $('#theStockFadeLayer').hide();
    $('.askForDelete').removeClass('animate').hide();
  };

  showAddToStockPrem_fade() {
    this.showAddToStockPrem();
    this.closeFade()
  };

  showTranceStockPrem_fade() {
    this.showTranceStockPrem();
    this.closeFade();
  };

  showMinToStockPrem_fade() {
    this.showMinToStockPrem();
    this.closeFade();
  };

  showStocksEnquiry_fade() {
    this.showStocksEnquiry();
    this.closeFade();
  };


  CreateTheInvoiceArry(type: number) {

    // getHandleAddtoStockPrimList from Db
    this.getStockTransactionArr(); // stockTransactionArr
    this.getHandlePrimList(); // HandleAddtoStockPrimArry

    this._stockService.makeInvoiceArry = [];

    for (let i = 0; i < this._stockService.stockTransactionArr.length; i++) {
      if (this._stockService.stockTransactionArr[i].transactionType == type) {
        this._stockService.makeInvoiceArry.push(this._stockService.stockTransactionArr[i])
      };
    };

    for (let m = 0; m < this._stockService.makeInvoiceArry.length; m++) {
      this._stockService.makeInvoiceArry[m].invoiceDetails = [];

      let invoiceDetail = this._stockService.HandleAddtoStockPrimArry.filter(
        obj => obj.stockTransactionId == this._stockService.makeInvoiceArry[m].stockTransactionId
      );

      this._stockService.makeInvoiceArry[m].invoiceDetails = invoiceDetail;

      let date = new Date(this._stockService.makeInvoiceArry[m].date_time);
      let fullYear = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      let inVal = `${this._stockService.makeInvoiceArry[m].invNumber} - ${this._stockService.makeInvoiceArry[m].customerName}  |  ${fullYear}`;
      this._stockService.makeInvoiceArry[m].invoiceSearchVal = inVal;
    };

    this._stockService.makeInvoiceArry.sort((a, b) => {
      return a.invNumber - b.invNumber
    });

  }; // CreateTheInvoiceArry

  makeMinInvArry() {

    this.CreateTheInvoiceArry(2);

    this.minInvArry = this._stockService.makeInvoiceArry
  }

  makeAddInvArry() {

    this.CreateTheInvoiceArry(1);

    this.addInvArry = this._stockService.makeInvoiceArry
  }

  makeTranceInvArry() {

    this.CreateTheInvoiceArry(3);

    this.tranceInvArry = this._stockService.makeInvoiceArry;
    for (let i = 0; i < this.tranceInvArry.length; i++) {

      let sndStock = this._stockService.stocks.find(
        stock => stock.stockId == this.tranceInvArry[i].sndStockId
      );

      this.tranceInvArry[i].sndStockName = sndStock.stockName;

      if (this.tranceInvArry[i].stockId == 1) {
        this.tranceInvArry[i].stockName = 'اذن اضافة'
      } else if (this.tranceInvArry[i].sndStockId == 1) {
        this.tranceInvArry[i].sndStockName = 'اذن خصم'
      };

      let inVal = `${this.tranceInvArry[i].invNumber} - ${this.tranceInvArry[i].stockName} - ${this.tranceInvArry[i].sndStockName}`
      this._stockService.makeInvoiceArry[i].invoiceSearchVal = inVal;
    };
  };

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
    }]; // makeStockArry

    for (let i = 0; i < this._stockService.stocks.length; i++) {
      this._stockService.makeStockArry.push(this._stockService.stocks[i]);
    };
    for (let m = 0; m < this._stockService.makeStockArry.length; m++) {
      this._stockService.makeStockArry[m].stockProducts = [];
    }
    for (let h = 0; h < this._stockService.handleBackEnd.length; h++) {
      for (let s = 0; s < this._stockService.makeStockArry.length; s++) {
        if (this._stockService.handleBackEnd[h].stockId == this._stockService.makeStockArry[s].stockId) {
          this._stockService.makeStockArry[s].stockProducts.push(this._stockService.handleBackEnd[h]);
        };
      };
    };
  };



  randomId: number;
  // testBtn
  testbtn() {


    //this.getBackendData();
  }

  showStocksEnquiry() {
    this.getBackendData();
    $('.stocksClass').not('#stocksEnquiry').hide();
    $('#stocksEnquiry').show();
    $('#stocksSearch').fadeIn(100);
    $('#stockBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
  };

  showProductsReport() {
    $('#prodDetTable').hide();
    $('.stocksClass').not('#productsReport').hide();
    $('#productsReport').show();
    $('#stocksSearch').fadeIn(100);
    $('#stockBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    this.getBackendData();
    this._service.clearForm();
  }

  showAddNewStock() {
    $('.stocksClass').not('#addNewStock').hide();
    $('#addNewStock').show();
    $('#stocksSearch').hide(100);
    $('#stockBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
  };

  productNameArr: any[];

  makeProductNameArr() {

    this._stockService.getProducts().subscribe((data: ProductsClass[]) => {
      this._stockService.allProducts = data;
    });

    this.productNameArr = [];

    this.productNameArr = this._stockService.allProducts.map(product => product.productName)

    //console.log(this.productNameArr + ' : stock')
  };

  showAddNewProduct() {

    this.makeProductNameArr();
    this.productNameVaild = true;

    $('.stocksClass').not('#addNewProduct').hide();
    $('#productName').removeClass('is-valid').removeClass('is-invalid');
    $('#addNewProduct').show();
    $('#stocksSearch').hide(100);
    $('#stockBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
  };

  newAddInvNumber: number;

  showAddToStockPrem() {

    this.makeAddInvArry();

    $('.stocksClass').not('#addToStockPrem').hide();
    $('#addToStockPrem').show();
    $('#stocksSearch').hide(100);
    $('#premissionBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('#stockBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    // hide invoice addForm
    $('#callInvoice').show();
    $('#addInvoiceForm').hide();
    $('#callInvoiceBtn').html("فاتورة جديدة");

    this._service.clearForm()
    if (this.addInvArry.length == 0) {
      this.newAddInvNumber = 1
    } else {
      let lastArrIndx: number = this.addInvArry.length - 1
      this.newAddInvNumber = this.addInvArry[lastArrIndx].invNumber + 1
    };
    this._service.clearForm();
    //console.log(this.addInvArry)
  };

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
    $('#callTranceInvoiceBtn').html("اذن جديد");

    this._service.clearForm();

    if (this.tranceInvArry.length == 0) {
      this.newTranceInvNumber = 1
    } else {
      let lastArrIndx: number = this.tranceInvArry.length - 1
      this.newTranceInvNumber = this.tranceInvArry[lastArrIndx].invNumber + 1
    };

  };

  newMinInvNumber: number;
  showMinToStockPrem() {
    this.makeMinInvArry();
    $('.stocksClass').not('#minFrmStockPrem').hide();
    $('#minFrmStockPrem').show();
    $('#stocksSearch').hide(100);
    $('#premissionBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('#stockBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    $('#minCallInvoice').show();
    $('#minInvoiceForm').hide();
    $('#minCallInvoiceBtn').html("فاتورة جديدة");
    this._service.clearForm();
    if (this.minInvArry.length == 0) {
      this.newTranceInvNumber = 1
    } else {
      let lastArrIndx: number = this.minInvArry.length - 1
      this.newMinInvNumber = this.minInvArry[lastArrIndx].invNumber + 1
    };
    //console.log(this.newMinInvNumber)
  };

  deleteStock() {
    $('.fadeLayer').hide()
    this._stockService.deleteStockSer(this._stockService.stockDataView.stockId)
      .subscribe(data => {
        this._stockService.stocks = this._stockService.stocks.filter(u => u !== this._stockService.stockDataView)
      });
  };

}; // End
