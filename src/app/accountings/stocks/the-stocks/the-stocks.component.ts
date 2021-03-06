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
  deleteMsg: string;

  constructor(
    public router: Router,
    public logService: LoginService,
    public _stockService: StocksService,
    public _service: ServicesService
  ) { }

  productNameVaild: boolean;

  ngOnInit() {

    this.logService.logStart(); this.logService.reternlog();

    // getStocks data from backEnd
    this._service.handleTableHeight();

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
    this._stockService.url = localStorage.getItem('tmpDB');
    this._stockService.getHandleBackEnd().subscribe((data: HandleBackEnd[]) => {
      this._stockService.handleBackEnd = data;
    });
    // getHandleAddtoStockPrimList
    this.getHandlePrimList();

    this._stockService.getStockes().subscribe((data: Stock[]) => {
      this._stockService.stocks = data;
    });

    this._stockService.getProducts().subscribe((data: ProductsClass[]) => {
      this._stockService.allProducts = data;
    });

    this.getStockTransactionArr();
  };

  getStockTransactionArr() {
    this._stockService.url = localStorage.getItem('tmpDB');
    this._stockService.getStockTransactionList().subscribe((data: StockTransaction[]) => {
      this._stockService.stockTransactionArr = data;
    });
  };

  getHandlePrimList() {
    this._stockService.url = localStorage.getItem('tmpDB');
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
    $('#theStockFadeLayer').fadeOut('fast');
    $('.askForDelete').removeClass('animate');
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

  getStockTrance = new Promise((res) => {
    this._stockService.getStockTransactionList().subscribe((data: StockTransaction[]) => {
      //this._stockService.stockTransactionArr = data;
      res(data);
    });
  });

  getHandle = new Promise((res) => {
    this._stockService.getHandleAddtoStockPrimList().subscribe((data: HandleAddPrimBE[]) => {
      //this._stockService.HandleAddtoStockPrimArry = data;
      res(data)
    });
  });

  getAllProducts = new Promise((res, rej) => {
    this._stockService.getProducts().subscribe((data: ProductsClass[]) => {
      if (data) {
        this._stockService.allProducts = data;
        res(data)
      } else (
        rej('nodata')
      );
    });
  });

  getStocks = new Promise((res, rej) => {
    this._stockService.getStockes().subscribe((data: Stock[]) => {
      this._stockService.stocks = data;
      res(data)
    });
  });

  createTheInvoiceArry(type: number, transAction: any, handleAdd: any) {

    this._stockService.makeInvoiceArry = [];

    for (let i = 0; i < transAction.length; i++) {
      if (transAction[i].transactionType == type) {
        this._stockService.makeInvoiceArry.push(transAction[i])
      };
    };

    for (let m = 0; m < this._stockService.makeInvoiceArry.length; m++) {
      this._stockService.makeInvoiceArry[m].invoiceDetails = [];

      let invoiceDetail = handleAdd.filter(
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

    return this._stockService.makeInvoiceArry
  }; // createTheInvoiceArry

  makeMinInvArry() {

    //this.createTheInvoiceArry(2);
    this.minInvArry = this._stockService.makeInvoiceArry;

  };

  makeAddInvArry() {
    //this.createTheInvoiceArry(1);
    this.addInvArry = this._stockService.makeInvoiceArry;
  };

  makeTranceInvArry() {

    //this.createTheInvoiceArry(3);

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

  tranceArr: any = []

  getTransDetails = new Promise((res) => {
    this._stockService.allStockProductsTrans().subscribe((data: any[]) => {
      this.tranceArr = data
      res(data)
    });
  });

  stockProdFactory = (stock: Stock) => {

    let products = [];

    let filterd = []

    if (stock) {
      filterd = this.tranceArr.filter(trance => trance.stockId == stock.stockId || trance.sndStockId == stock.stockId);
      for (let i = 0; i < this._stockService.allProducts.length; i++) {

        let addProdArry =
          filterd.filter(trance => trance.productId == this._stockService.allProducts[i].productId &&
            trance.transactionType == 1).map(trance => trance.Qty)

        let minProdArry =
          filterd.filter(trance => trance.productId == this._stockService.allProducts[i].productId &&
            trance.transactionType == 2).map(trance => trance.Qty);

        let addTrance = filterd.filter(trance => trance.productId == this._stockService.allProducts[i].productId &&
          trance.transactionType == 3 && trance.sndStockId == stock.stockId).map(trance => trance.Qty);

        let minTrance = filterd.filter(trance => trance.productId == this._stockService.allProducts[i].productId &&
          trance.transactionType == 3 && trance.sndStockId != stock.stockId).map(trance => trance.Qty);

        let productDet = {
          productName: this._stockService.allProducts[i].productName,
          plus: this._service.sumArry(addProdArry),
          min: this._service.sumArry(minProdArry),
          plusTrance: this._service.sumArry(addTrance),
          minTrance: this._service.sumArry(minTrance),
          productQty: ((this._service.sumArry(addProdArry) + this._service.sumArry(addTrance)) - (this._service.sumArry(minProdArry) + this._service.sumArry(minTrance)))
        };

        products = [...products, productDet]

      };
    }

    return products
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
    }]; // makeStockArry

    for (let i = 0; i < this._stockService.stocks.length; i++) {
      this._stockService.makeStockArry.push(this._stockService.stocks[i]);
    };
    for (let m = 0; m < this._stockService.makeStockArry.length; m++) {
      this._stockService.makeStockArry[m].stockProducts = [];
    };
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

    this._service.backUp().subscribe();
    //this.getBackendData();
  };

  buttonEffect(max: string) {
    $(max).removeClass("btn-light").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('.headerMainBtn').not(max).removeClass('btn-outline-secondary').addClass('btn-light').animate({ fontSize: '1em' }, 50);
  };

  animateToggle(hide: string, show: string) {
    $(`${hide}`).not(`${show}`).hide();
    $(`${show}`).show();
  };

  showStocksEnquiry() {
    //this.getBackendData();
    this.getStocks.then(() => {
      this.animateToggle('.stocksClass', '#stocksEnquiry');
      $('#stocksEnquiry').css('display', 'block')
      $('#stocksSearch').fadeIn(100);
      this.buttonEffect('#stockBtn');
    });
  };

  showProductsReport() {
    $('#prodDetTable').hide();
    this.animateToggle('.stocksClass', '#productsReport');
    $('#stocksSearch').fadeIn(100);
    this.buttonEffect('#stockBtn');
    this._service.clearForm();
  };

  showAddNewStock() {
    this.animateToggle('.stocksClass', '#addNewStock');
    $('#stocksSearch').hide(100);
    this.buttonEffect('#stockBtn');
  };

  showProfits() {
    this.getBackendData();
    this.animateToggle('.stocksClass', '#profits');
    $('#stocksSearch').hide(100);
    this.buttonEffect('#showProfitsBtn');
    $('#howIsProfits').hide();
    $('#productProfits').hide();
    $('#totalProfits').hide();
    this.makeMinInvArry()
  };

  productNameArr: any[];

  showAddNewProduct() {
    this.getAllProducts.then(() => {
      this.productNameArr = [];
      this.productNameArr = this._stockService.allProducts.map(product => product.productName);
      this.productNameVaild = true;
      $('#productName').removeClass('is-valid').removeClass('is-invalid');
      this.animateToggle('.stocksClass', '#addNewProduct');
      $('#stocksSearch').hide(100);
      this.buttonEffect('#stockBtn');
    });

  };

  newAddInvNumber: number;

  showAddToStockPrem() {

    $('#containerLoader').show()

    let getProds = new Promise((res) => {
      this._stockService.getProducts().subscribe((data: ProductsClass[]) => {
        this._stockService.allProducts = data;
        res(data);
      });
    })

    let StockTrance = new Promise((res) => {
      this._stockService.getStockTransactionList().subscribe((data: StockTransaction[]) => {
        //this._stockService.stockTransactionArr = data;
        res(data);
      });
    });

    let Handle = new Promise((res) => {
      this._stockService.getHandleAddtoStockPrimList().subscribe((data: HandleAddPrimBE[]) => {
        //this._stockService.HandleAddtoStockPrimArry = data;
        res(data)
      });
    });

    let addInvoiceForm = document.querySelector('#addInvoiceForm') as HTMLElement

    Promise.all([StockTrance, Handle, getProds])
      .then((res) => this.addInvArry = this.createTheInvoiceArry(1, res[0], res[1]))
      .then(() => {
        this.animateToggle('.stocksClass', '#addToStockPrem');
        $('#stocksSearch').hide(100);
        this.buttonEffect('#premissionBtn');
        // hide invoice addForm
        $('#callInvoice').show();
        //addInvoiceForm.style.display = 'none'
        //addInvoiceForm.classList.remove('animate')
        //addInvoiceForm.style.height = '0px'
        //document.querySelector('#addInvoiceForm').style
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

        $('#containerLoader').hide()

      });
  };

  newTranceInvNumber: number;
  showTranceStockPrem() {

    $('#containerLoader').show()

    let getProds = new Promise((res) => {
      this._stockService.getProducts().subscribe((data: ProductsClass[]) => {
        this._stockService.allProducts = data;
        res(data);
      });
    })

    let StockTrance = new Promise((res) => {
      this._stockService.getStockTransactionList().subscribe((data: StockTransaction[]) => {
        //this._stockService.stockTransactionArr = data;
        res(data);
      });
    });

    let Handle = new Promise((res) => {
      this._stockService.getHandleAddtoStockPrimList().subscribe((data: HandleAddPrimBE[]) => {
        //this._stockService.HandleAddtoStockPrimArry = data;
        res(data)
      });
    });

    Promise.all([StockTrance, Handle, getProds])
      .then((res) => this.tranceInvArry = this.createTheInvoiceArry(3, res[0], res[1]))
      .then(() => {

        /* $('.stocksClass').not('#tranceFrmStockPrem').hide();
        $('#tranceFrmStockPrem').show(); */
        this.animateToggle('.stocksClass', '#tranceFrmStockPrem');
        $('#stocksSearch').hide(100);
        this.buttonEffect('#premissionBtn');
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

        $('#containerLoader').hide()

      });

  };

  newMinInvNumber: number;
  showMinToStockPrem() {

    $('#containerLoader').show()

    let getProds = new Promise((res) => {
      this._stockService.getProducts().subscribe((data: ProductsClass[]) => {
        this._stockService.allProducts = data;
        res(data);
      });
    })

    let StockTrance = new Promise((res) => {
      this._stockService.getStockTransactionList().subscribe((data: StockTransaction[]) => {
        //this._stockService.stockTransactionArr = data;
        res(data);
      });
    });

    let Handle = new Promise((res) => {
      this._stockService.getHandleAddtoStockPrimList().subscribe((data: HandleAddPrimBE[]) => {
        //this._stockService.HandleAddtoStockPrimArry = data;
        res(data)
      });
    });

    Promise.all([StockTrance, Handle, getProds])
      .then((res) => {
        this.minInvArry = this.createTheInvoiceArry(2, res[0], res[1])
      })
      .then(() => {

        /* $('.stocksClass').not('#minFrmStockPrem').hide();
        $('#minFrmStockPrem').show(); */
        this.animateToggle('.stocksClass', '#minFrmStockPrem');
        $('#stocksSearch').hide(100);
        this.buttonEffect('#premissionBtn');
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
        $('#containerLoader').hide()

      });
  };

  deleteStock() {
    if (this.logService.check.del != 1) {
      window.alert('لا يوجد صلاحية للحذف')
    } else {
      $('#theStockFadeLayer').hide()
      this._stockService.deleteStockSer(this._stockService.stockDataView.stockId)
        .subscribe(data => {
          this._stockService.stocks = this._stockService.stocks.filter(u => u !== this._stockService.stockDataView)
        });
    }

  };

}; // End
