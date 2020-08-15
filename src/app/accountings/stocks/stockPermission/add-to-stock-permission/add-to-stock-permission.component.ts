import { Component, OnInit } from '@angular/core';
import { ServicesService } from 'src/app/services.service';
import { StocksService } from '../../the-stocks/stocks.service';
import { FormBuilder, FormGroup, Validator, FormControl } from '@angular/forms';
import { HandleBackEnd } from 'src/app/handle-back-end';
import { StockPridge } from '../../stock-pridge';
import { CustomerService } from 'src/app/customer.service';
import { Customer } from '../../../../../app/customer'
import { InvoiceInp } from 'src/app/accountings/invoice-inp';
import { TheStocksComponent } from '../../the-stocks/the-stocks.component';
import { StockTransactionD } from '../../stock-transaction-d';
import { StockTransaction } from '../../stock-transaction';
import { Stock } from 'src/app/accountings/stock';
//import { CustomerComponent } from 'src/app/customer/customer.component';

@Component({
  selector: 'app-add-to-stock-permission',
  templateUrl: './add-to-stock-permission.component.html',
  styleUrls: ['./add-to-stock-permission.component.scss']
})
export class AddToStockPermissionComponent implements OnInit {

  customers: Customer[]
  addToStockPremData: FormGroup;
  invoiceInp = new InvoiceInp()
  newinvoiceInp = {}
  invoiceInpArry: any[] = [];
  totalInvoice: any[];
  searchTxt: string;

  /* invoiceData = new FormGroup({
    theStock: new FormControl(''),
    theCustomer: new FormControl(''),
    theNote: new FormControl(''),
  }); */

  deleteInvBtnDisabled: boolean;

  date_time: string;

  thestockName: string;
  theInvoiceNote: string;
  stockTransactionId: any;

  domElements = {
    inpt: {
      stockNameForAdd: document.querySelector('#stockNameForAdd'),
      invoiceSearch: document.querySelector('#invoiceSearch'),
    },

    btn: {
      callInvoiceBtn: document.querySelector('#callInvoiceBtn'),
      addNewInvoicetBtn: document.querySelector('#addNewInvoicetBtn'),
      deleteAddInvoice: document.querySelector('#deleteAddInvoice') as HTMLElement
    },

    html: {
      invNum: document.querySelector('#invNum') as HTMLElement,
      callInvoice: document.querySelector('#callInvoice') as HTMLElement,
      addInvoiceForm: document.querySelector('#addInvoiceForm') as HTMLElement,
      fadeLayerAP: document.querySelector('#fadeLayerAP') as HTMLElement,
      askForDelete: document.querySelector('.askForDelete') as HTMLElement
    }

  }

  constructor(public _stockService: StocksService, public formBuilder: FormBuilder,
    public _service: ServicesService, public _custService: CustomerService, public _theStockComp: TheStocksComponent) { }

  ngOnInit() {

    this.domElements = {
      inpt: {
        stockNameForAdd: document.querySelector('#stockNameForAdd'),
        invoiceSearch: document.querySelector('#invoiceSearch'),
      },
      btn: {
        callInvoiceBtn: document.querySelector('#callInvoiceBtn'),
        addNewInvoicetBtn: document.querySelector('#addNewInvoicetBtn'),
        deleteAddInvoice: document.querySelector('#deleteAddInvoice')
      },
      html: {
        invNum: document.querySelector('#invNum'),
        callInvoice: document.querySelector('#callInvoice'),
        addInvoiceForm: document.querySelector('#addInvoiceForm'),
        fadeLayerAP: document.querySelector('#fadeLayerAP'),
        askForDelete: document.querySelector('.askForDelete')
      }
    }

    this.addToStockPremData = this.formBuilder.group({
      stockName: [''],
    });

    this.getBackendData();

    $('#hideFadeLayerAP').click(function () {
      $('#fadeLayerAP').hide();
      $('.askForDelete').removeClass('animate');
    })

  } // ngOnInit

  productArr: any[] = [];

  getBackendData() {

    this._custService.getCustomer().subscribe((data: Customer[]) => {
      this.customers = data;
    });

    this._stockService.getStockTransactionList().subscribe((data: StockTransaction[]) => {
      this._stockService.stockTransactionArr = data;
    });
    this._stockService.getStockTransactionDetailsList().subscribe((data: StockTransactionD[]) => {
      this._stockService.stockTransactionDetailsArr = data;
    });
  };

  refreshBackendData() {
    this._theStockComp.ngOnInit();
    this.getBackendData();
    this._theStockComp.showAddToStockPrem();
  }

  theCustomerInfo: Customer;

  getCustomerInfo(customerId) {
    let customerInfo = this.customers.find(
      customer => customer.customerId == customerId
    )
    return customerInfo
  }

  sumArry(arr: any[]) {
    let s = 0
    for (let i = 0; i < arr.length; i++) {
      s = s + arr[i]
    }
    return s
  };

  addFilds() {
    this.deleteInvBtnDisabled = true;
    this.invoiceInp = new InvoiceInp();
    this.invoiceInp.total = 0;
    this.invoiceInpArry.push(this.invoiceInp);
  }

  isAddInvVaild: boolean = false;

  stockDetailsIdArr: any[];

  checkENU = (theVal: string, cond: string, way = 'notEqual') => { // cond = or || and

    let res: boolean = (way == 'notEqual') ? true : false
    let rev: boolean = (way == 'notEqual') ? false : true

    if (cond == 'and') {
      if (theVal != undefined && theVal !== '' && theVal !== null) {
        return res
      }
    } else if (cond == 'or') {
      if (theVal != undefined || theVal !== '' || theVal !== null) {
        return res
      }
    }
    return rev
  };

  isAddNameVaild(i) { // inputValidation

    this.deleteInvBtnDisabled = true;
    let found: boolean;
    let index: number;

    if (this.productArr.includes(this.invoiceInpArry[i].product) || this.invoiceInpArry[i].product == '') {
      this.invoiceInpArry[i].inpVaild = false;
    } else {
      this.invoiceInpArry[i].inpVaild = true;
      this.invoiceInpArry[i].productVaildMsg = 'خطأ فى اسم الصنف'
    }
    let valueArr = this.invoiceInpArry.map((item) => { return item.product });

    let filtert = valueArr.filter((product) => {
      return product != undefined
    })
    let isDublicate = filtert.some((item, indx) => {
      index = indx
      return valueArr.indexOf(item) != indx
    })
    if (isDublicate) {
      found = true
    }

    if (index != null && this.invoiceInpArry[index].product != '') {
      if (found == true) {
        this.invoiceInpArry[index].inpVaild = true;
        this.invoiceInpArry[index].productVaildMsg = 'لا يمكن تكرار هذا الصنف'
      };
    };

    if (this.invoiceInpArry[i].inpVaild == true) {
      this.isAddInvVaild = true;
    } else {
      this.isAddInvVaild = false;
    };

    if (this.invoiceInpArry[i].product == '') {

      let subBtn = $('#addNewInvoicetBtn').html()
      if (subBtn == 'تعديل الفاتورة') {
        if (this.invoiceInpArry[i].price >= 0 || this.invoiceInpArry[i].qty >= 0) {
          if (this.invoiceInpArry[i + 1] != undefined) {
            /* this.invoiceInpArry[i + 1].product != undefined || this.invoiceInpArry[i + 1].product != '' || this.invoiceInpArry[i + 1].product != null */
            if (this.checkENU(this.invoiceInpArry[i + 1].product, 'or')) {
              this.stockDetailsIdArr.push(this.invoiceInpArry[i].stockTransactionDetailsId)
              this.invoiceInpArry.splice(i, 1)
              //console.log(this.stockDetailsIdArr)
              this.calcTotals()
            } else {
              this.invoiceInpArry[i].price = null;
              this.invoiceInpArry[i].qty = null;
              this.invoiceInpArry[i].total = 0;
              this.calcTotals()
            };
          };
        };
      } else {
        if (this.checkENU(this.invoiceInpArry[i + 1].product, 'or')) {
          this.invoiceInpArry.splice(i, 1)
        } else {
          this.invoiceInpArry[i].price = null;
          this.invoiceInpArry[i].qty = null;
          this.invoiceInpArry[i].total = 0;
        }
      }

    };

    this.isInvoiceVaild()
  } // isAddNameVaild

  stockNameVaild: boolean;
  inptDisabled: boolean = true;

  dateChanged() {
    this.isInvoiceVaild();
  }

  customerInpArry: Customer[];

  createCustomerInpArry = () => {

    if (this.thestockName != undefined) {
      if (this.thestockName.includes('حسام')) {
        this.customerInpArry = this.customers.filter(customer => customer.customerName.includes('- حسام'))
      } else if (this.thestockName.includes('سيف')) {
        this.customerInpArry = this.customers.filter(customer => customer.customerName.includes('- سيف'))
      } else {
        this.customerInpArry = this.customers
      }
    } else {
      this.customerInpArry = this.customers
    }

  };



  customerVaild: boolean;
  custVaildMsg: string;

  customerCss: any[]

  makeCustomerCss(statu = 'defult') {

    if (statu == 'defult') {
      this.createCustomerInpArry();
    }
    //this.createCustomerInpArry();
    this.custClass = ''
    this.customerCss = this.customerInpArry.map((cust) => {
      return {
        name: cust.customerName,
        css: () => {
          if (cust.customerName.includes('- سيف')) {
            return 'font-weight-bolder text-light bg-info pr-2'
          } else {
            return ''
          }
        }
      }
    })
  };

  stockChanged() {

    //this.createCustomerInpArry();
    this.makeCustomerCss()
    //let name = $('#stockNameForAdd').val();
    this.deleteInvBtnDisabled = true;
    if (this.thestockName == '-' /* $('#stockNameForAdd').val() == '-' */) {
      this.stockNameVaild = true;
      this.inptDisabled = true;
    } else {
      this.stockNameVaild = false;
      this.inptDisabled = false;
    }
    if (this.thestockName != undefined) {
      if (this.thestockName.includes('سيف')) {
        this.domElements.inpt.stockNameForAdd.classList.add('bg-info', 'text-white');
        //$('#stockNameForAdd').addClass('bg-info text-white')
      } else {
        this.domElements.inpt.stockNameForAdd.classList.remove('bg-info', 'text-white');
        //$('#stockNameForAdd').removeClass('bg-info text-white');
      }
    }
    if (this.theCustomerName) {
      this.isCustomerVaild();
    }
  };


  custClass: string = '';
  isCustomerVaild() {

    //let customerNameForAddVal = $('#customerNameForAdd').val()
    //this.makeCustomerCss('customerInp');
    /* console.log({
      stockName: this.thestockName,
      custName: this.theCustomerName,
      custArry: this.customerInpArry
    }) */

    if (this.customerCss.length == 0) {
      this.customerVaild = true
      this.custVaildMsg = "لا يوجد هذا الاسم"
    } else {

      for (let i = 0; i < this.customerCss.length; i++) {
        if (this.theCustomerName == this.customerCss[i].name) {
          this.customerVaild = false;
          break
        } else {
          this.customerVaild = true;
          this.custVaildMsg = "لا يوجد هذا الاسم"
        };
      };
    };

    if (this.customerVaild == false) {

      if (this.invoiceInp[0] != undefined) {
        if (this.invoiceInp[0].productName == undefined) {
          this.isAddInvVaild = true;
        } else {
          this.isAddInvVaild = false;
        };
      };

    } else {
      this.isAddInvVaild = true;
    };

    if (!this.customerVaild) {
      let cCss = this.customerCss.find(cust => cust.name == this.theCustomerName);
      if (cCss) {
        this.custClass = cCss.css();
      }
    };

  };

  isInvoiceVaild() {
    if (this.customerVaild || this.stockNameVaild) {
      this.isAddInvVaild = true;
    } else {
      for (let i = 0; i < this.invoiceInpArry.length; i++) {
        if (this.invoiceInpArry[i].inpVaild || this.invoiceInpArry[i].Qtyinvaild) {
          this.isAddInvVaild = true;
        } else {
          this.isAddInvVaild = false;
        }
      }
    }
    this.deleteInvBtnDisabled = true;
  }

  invoiceTotal: string = '0';
  calcTotals(i: number = null) {
    this.deleteInvBtnDisabled = true;
    this.inptDisabled = false;
    this.totalInvoice = [];
    this.invoiceTotal = '0';

    if (i != null) {

      if (this.invoiceInpArry[i].price > 0 && this.checkENU(this.invoiceInpArry[i].qty, 'and', 'equal')) {
        this.invoiceInpArry[i].Qtyinvaild = true;
        this.invoiceInpArry[i].qtyMsg = `لا يمكن ترك الكمية فارغة`
        this.isAddInvVaild = true
      } else {
        this.invoiceInpArry[i].Qtyinvaild = false;
        this.isAddInvVaild = false;
      }
      if (this.invoiceInpArry[i].Qtyinvaild == false) {
        if (this.invoiceInpArry[i].price > 0) {
          this.invoiceInpArry[i].total = this.invoiceInpArry[i].qty * this.invoiceInpArry[i].price;
        };
      }

    } else {
      for (let l = 0; l < this.invoiceInpArry.length; l++) {
        if (this.invoiceInpArry[l].qty && this.invoiceInpArry[l].price) {
          this.invoiceInpArry[l].total = this.invoiceInpArry[l].qty * this.invoiceInpArry[l].price;
          this.totalInvoice = [...this.totalInvoice, this.invoiceInpArry[l].total]
        }
      }
    }

    this.totalInvoice = this.invoiceInpArry.map(inv => inv.total);

    let total: any = this.sumArry(this.totalInvoice)
    this.invoiceTotal = total;

  };

  theStockId: number;
  theCustomerId: number;

  getTheCustomerId() {
    //let theCustomer = $('#customerNameForAdd').val();
    let customerInfo = this.customers.find(cust => cust.customerName == this.theCustomerName)
    this.theCustomerId = customerInfo.customerId;
  };

  getTheStockId() {
    let stockInfo: Stock = this._stockService.stocks.find(stock => this.thestockName == stock.stockName);
    this.theStockId = stockInfo.stockId;
  };

  resetAddinvoiceValu() {
    this._service.clearForm();
    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      this.invoiceInpArry[i].total = 0;
    };
  };

  checkAllArry: number;

  //searchInVal: string = '';
  // changAddInvoiceBtn
  changAddInvoiceBtn() {
    //this.searchTxt = $('#invoiceSearch').val();
    if (this.searchTxt == '') {
      this.domElements.btn.callInvoiceBtn.innerHTML = 'فاتورة جديدة'
      //$('#callInvoiceBtn').html("فاتورة جديدة");
    } else {
      this.domElements.btn.callInvoiceBtn.innerHTML = 'بحث'
      //$('#callInvoiceBtn').html("بحث");
    }
  };

  theNote: string;
  theStockTransactionId: string;

  ivoiceItemesForEdit: any[];

  editStockQtys() {

    this._stockService.getHandleBackEnd().subscribe((data: HandleBackEnd[]) => {
      this._stockService.handleBackEnd = data;
    });

    //this.getTheStockId();
    //let this.domElements.btn.addNewInvoicetBtn.innerHTML = $('#addNewInvoicetBtn').html(); // to check if invoice for update or add
    let theProductId: number;
    let postStockPridgeObj: StockPridge = {
      stockProductId: null,
      stockId: 0, //
      productId: 0, //
      productQty: 0, //
      productCost: 0, //
      productPrice: 0,
    };
    let productTotalsPriceAvr: number;
    let allProductQty: number;

    if (this.domElements.btn.addNewInvoicetBtn.innerHTML == "تعديل الفاتورة") {

      this.theCustomerInfo = this.getCustomerInfo(this.ivoiceItemesForEdit[0].customerId);

      this.theCustomerInfo.customerRemain = this.theCustomerInfo.customerRemain + this.ivoiceItemesForEdit[0].invoiceTotal;
      this._custService.updateCustomerSer(this.theCustomerInfo).subscribe();

      for (let v = 0; v < this.ivoiceItemesForEdit.length; v++) {

        let getProductInfo = this._stockService.allProducts.find(
          product => product.productName === this.ivoiceItemesForEdit[v].productName);

        theProductId = getProductInfo.productId;

        let getHandleBackEndInfo = this._stockService.handleBackEnd.find(handleInfo =>
          handleInfo.productId === theProductId && handleInfo.stockId === this.ivoiceItemesForEdit[v].stockId);

        postStockPridgeObj = {
          stockProductId: null,
          productId: theProductId,
          stockId: this.ivoiceItemesForEdit[v].stockId,
          productCost: this.ivoiceItemesForEdit[v].price,
          productQty: parseInt(this.ivoiceItemesForEdit[v].Qty),
          productPrice: null,
        };

        if (getHandleBackEndInfo == undefined) {
          this._stockService.postStockPridge(postStockPridgeObj).subscribe();

        } else if (getHandleBackEndInfo != undefined) {

          let cost: number;
          allProductQty = getHandleBackEndInfo.productQty - parseInt(this.ivoiceItemesForEdit[v].Qty);
          productTotalsPriceAvr = (getHandleBackEndInfo.productCost * getHandleBackEndInfo.productQty)
            - (parseInt(this.ivoiceItemesForEdit[v].price) * parseInt(this.ivoiceItemesForEdit[v].Qty));
          if (allProductQty == 0) {
            cost = getHandleBackEndInfo.productCost;
          } else {
            cost = Math.floor(productTotalsPriceAvr / allProductQty) // price avarage
          };

          let indx = this._stockService.handleBackEnd.findIndex(
            i => i.stockProductId === getHandleBackEndInfo.stockProductId
          );
          postStockPridgeObj.stockProductId = getHandleBackEndInfo.stockProductId;
          postStockPridgeObj.productCost = cost;

          this._stockService.handleBackEnd[indx].productQty = postStockPridgeObj.productQty;
          this._stockService.handleBackEnd[indx].productCost = postStockPridgeObj.productCost;

          this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB
        };
      };
    };
  }; // editStockQtys

  makeAddStockPremArry() {

    this.getTheStockId();
    this.getTheCustomerId();
    this.editStockQtys(); // if edite will min all old invoice Qtys from stock Qtys

    let theProductId: number;
    this.checkAllArry = 1; // check after loop on the handleArry that the product not found
    this.theNote = $('#addInvoiceNote').val();
    this.theStockTransactionId = $('#stockTransactionId').val();

    // mainTable
    if (this._theStockComp.newAddInvNumber == 0) {
      this._theStockComp.newAddInvNumber = 1
    }

    let stockTransaction: StockTransaction = {
      stockTransactionId: Date.now().toString(),
      invNumber: this._theStockComp.newAddInvNumber,
      stockId: this.theStockId,
      sndStockId: 1,
      customerId: this.theCustomerId,
      transactionType: 1,
      invoiceTotal: parseInt(this.invoiceTotal),
      date_time: this.date_time,
      notes: this.theNote,
    };

    // edit or add

    if (this.theStockTransactionId == '') {
      this._stockService.creatStockTransaction(stockTransaction).subscribe();

      this.theCustomerInfo = this.getCustomerInfo(this.theCustomerId);
      this.theCustomerInfo.customerRemain = this.theCustomerInfo.customerRemain - parseInt(this.invoiceTotal);
      this._custService.updateCustomerSer(this.theCustomerInfo).subscribe();
    } else {
      stockTransaction.stockTransactionId = this.theStockTransactionId;
      this._stockService.UpdateStockTransaction(stockTransaction).subscribe();

      this.theCustomerInfo.customerRemain = this.theCustomerInfo.customerRemain - parseInt(this.invoiceTotal);

      this._custService.updateCustomerSer(this.theCustomerInfo).subscribe();
    };

    //let this.domElements.btn.addNewInvoicetBtn.innerHTML = $('#addNewInvoicetBtn').html(); // to check if invoice for update or add
    let allProductQty: number;
    let productTotalsPriceAvr: number;

    for (let i = 0; i < this.invoiceInpArry.length; i++) {

      let postStockPridgeObj = new StockPridge();
      let stockTransactionD = new StockTransactionD();

      // if not productName to delete stocktransactionDetail
      //for (let d = 0; d < this.invoiceInpArry.length; d++) {
      if (this.invoiceInpArry[i].stockTransactionDetailsId !== undefined && this.invoiceInpArry[i].product == '') {
        this._stockService.deleteStockTransactionDetails(this.invoiceInpArry[i].stockTransactionDetailsId).subscribe();
      };
      //}
      if (this.invoiceInpArry[i].product != undefined && this.invoiceInpArry[i].product != '' && this.invoiceInpArry[i].qty != 0) {

        let getProductInfo = this._stockService.allProducts.find(product => product.productName === this.invoiceInpArry[i].product)

        if (this.invoiceInpArry[i].product != '') {
          theProductId = getProductInfo.productId
        };

        // for the first invoice *********************************************************************************************
        if (this._stockService.handleBackEnd.length == 0) {
          postStockPridgeObj = {
            stockProductId: null,
            productId: theProductId,
            stockId: this.theStockId,
            productQty: parseInt(this.invoiceInpArry[i].qty),
            productCost: parseInt(this.invoiceInpArry[i].price),
            productPrice: 0,
          };

          this._stockService.postStockPridge(postStockPridgeObj).subscribe();
          // save stocktransactionDetails
          stockTransactionD = {
            stockTransactionDetailsId: null,
            stockTransactionId: stockTransaction.stockTransactionId,
            productId: theProductId,
            price: parseFloat(this.invoiceInpArry[i].price),
            Qty: parseInt(this.invoiceInpArry[i].qty),
          };

          this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB

          this.checkAllArry = 1; // reload
        };
        // for the first invoice *********************************************************************************************

        let getHandleBackEndInfo = this._stockService.handleBackEnd.find(handleInfo =>
          handleInfo.productId === theProductId && handleInfo.stockId === this.theStockId)

        if (getHandleBackEndInfo != undefined) {

          productTotalsPriceAvr = (getHandleBackEndInfo.productCost * getHandleBackEndInfo.productQty)
            + (parseInt(this.invoiceInpArry[i].price) * parseInt(this.invoiceInpArry[i].qty));
          allProductQty = getHandleBackEndInfo.productQty + parseInt(this.invoiceInpArry[i].qty);

          postStockPridgeObj = {
            productPrice: getHandleBackEndInfo.productPrice,
            productId: theProductId,
            stockId: this.theStockId,
            productCost: Math.floor(productTotalsPriceAvr / allProductQty),
            productQty: parseInt(this.invoiceInpArry[i].qty) + getHandleBackEndInfo.productQty,
            stockProductId: getHandleBackEndInfo.stockProductId
          }

          this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB

          // save stocktransactionDetails
          stockTransactionD = {
            stockTransactionDetailsId: null,
            stockTransactionId: stockTransaction.stockTransactionId,
            productId: theProductId,
            price: parseFloat(this.invoiceInpArry[i].price),
            Qty: parseInt(this.invoiceInpArry[i].qty),
          };

          // edite Or Add
          if (this.domElements.btn.addNewInvoicetBtn.innerHTML == "تعديل الفاتورة") {
            stockTransactionD.stockTransactionDetailsId = this.invoiceInpArry[i].stockTransactionDetailsId;
            this._stockService.UpdateStockTransactionDetails(stockTransactionD).subscribe();
            //console.log(stockTransactionD)
            //console.log('secound')
            if (stockTransactionD.stockTransactionDetailsId == undefined) {
              this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe(); // for invoice DB
              //console.log(stockTransactionD)
              //console.log('third')
            }

          } else if (this.domElements.btn.addNewInvoicetBtn.innerHTML == "تسجيل") {
            this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe(); // for invoice DB
            //console.log(stockTransactionD)
            //console.log('fifth')
          };

        } else {
          postStockPridgeObj = {
            stockProductId: null,
            productPrice: null,
            productId: theProductId,
            stockId: this.theStockId,
            productQty: parseInt(this.invoiceInpArry[i].qty),
            productCost: parseInt(this.invoiceInpArry[i].price)
          };

          // save stocktransactionDetails
          stockTransactionD = {
            stockTransactionDetailsId: null,
            stockTransactionId: stockTransaction.stockTransactionId,
            productId: theProductId,
            price: parseFloat(this.invoiceInpArry[i].price),
            Qty: parseInt(this.invoiceInpArry[i].qty)
          };

          this._stockService.postStockPridge(postStockPridgeObj).subscribe();
          this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe(); // for invoice DB
          //console.log(stockTransactionD);
          //console.log('six');
        };
      };
    }; // fst for invoiceInpArry
  }; // makeAddStockPremArry




  makeAddStockPremArryPre() {

    this.getTheStockId();
    this.getTheCustomerId();
    this.editStockQtys(); // if edite will min all old invoice Qtys from stock Qtys

    let theProductId: number;
    this.checkAllArry = 1; // check after loop on the handleArry that the product not found
    this.theNote = $('#addInvoiceNote').val()
    this.theStockTransactionId = $('#stockTransactionId').val()

    // mainTable
    if (this._theStockComp.newAddInvNumber == 0) {
      this._theStockComp.newAddInvNumber = 1
    }

    let stockTransaction: StockTransaction = {
      stockTransactionId: Date.now().toString(),
      invNumber: this._theStockComp.newAddInvNumber,
      stockId: this.theStockId,
      sndStockId: 1,
      customerId: this.theCustomerId,
      transactionType: 1,
      invoiceTotal: parseInt(this.invoiceTotal),
      date_time: this.date_time,
      notes: this.theNote,
    };

    // edit or add

    if (this.theStockTransactionId == '') {
      this._stockService.creatStockTransaction(stockTransaction).subscribe();

      this.theCustomerInfo = this.getCustomerInfo(this.theCustomerId);
      this.theCustomerInfo.customerRemain = this.theCustomerInfo.customerRemain - parseInt(this.invoiceTotal);
      this._custService.updateCustomerSer(this.theCustomerInfo).subscribe();

    } else {
      stockTransaction.stockTransactionId = this.theStockTransactionId;
      this._stockService.UpdateStockTransaction(stockTransaction).subscribe();

      this.theCustomerInfo.customerRemain = this.theCustomerInfo.customerRemain - parseInt(this.invoiceTotal);

      this._custService.updateCustomerSer(this.theCustomerInfo).subscribe();
    };

    //let this.domElements.btn.addNewInvoicetBtn.innerHTML = $('#addNewInvoicetBtn').html(); // to check if invoice for update or add
    let allProductQty: number;
    let productTotalsPriceAvr: number;

    for (let i = 0; i < this.invoiceInpArry.length; i++) {

      let postStockPridgeObj = new StockPridge();
      let stockTransactionD = new StockTransactionD();

      if (/* this.invoiceInpArry[i].product != undefined && this.invoiceInpArry[i].product !== '' */ this.checkENU(this.invoiceInpArry[i].product, 'and')) {

        let getProductInfo = this._stockService.allProducts.find(product => product.productName === this.invoiceInpArry[i].product)

        if (this.invoiceInpArry[i].product != '') {
          theProductId = getProductInfo.productId
        };

        // for the first invoice *********************************************************************************************
        if (this._stockService.handleBackEnd.length == 0) {
          postStockPridgeObj = {
            stockProductId: null,
            productId: theProductId,
            stockId: this.theStockId,
            productQty: parseInt(this.invoiceInpArry[i].qty),
            productCost: parseInt(this.invoiceInpArry[i].price),
            productPrice: 0,
          };

          this._stockService.postStockPridge(postStockPridgeObj).subscribe();
          // save stocktransactionDetails
          stockTransactionD = {
            stockTransactionDetailsId: null,
            stockTransactionId: stockTransaction.stockTransactionId,
            productId: theProductId,
            price: parseInt(this.invoiceInpArry[i].price),
            Qty: parseInt(this.invoiceInpArry[i].qty),
          };

          this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB

          //console.log(stockTransactionD)
          //console.log('first')
          this.checkAllArry = 1; // reload
          ////console.log('firstInvoice')
        };
        // for the first invoice *********************************************************************************************

        let getHandleBackEndInfo = this._stockService.handleBackEnd.find(handleInfo =>
          handleInfo.productId === theProductId && handleInfo.stockId === this.theStockId)

        if (getHandleBackEndInfo != undefined) {

          productTotalsPriceAvr = (getHandleBackEndInfo.productCost * getHandleBackEndInfo.productQty)
            + (parseInt(this.invoiceInpArry[i].price) * parseInt(this.invoiceInpArry[i].qty));
          allProductQty = getHandleBackEndInfo.productQty + parseInt(this.invoiceInpArry[i].qty);

          postStockPridgeObj = {
            productPrice: getHandleBackEndInfo.productPrice,
            productId: theProductId,
            stockId: this.theStockId,
            productCost: Math.floor(productTotalsPriceAvr / allProductQty),
            productQty: parseInt(this.invoiceInpArry[i].qty) + getHandleBackEndInfo.productQty,
            stockProductId: getHandleBackEndInfo.stockProductId
          }

          this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB
          ////console.log(postStockPridgeObj)

          // save stocktransactionDetails
          stockTransactionD = {
            stockTransactionDetailsId: null,
            stockTransactionId: stockTransaction.stockTransactionId,
            productId: theProductId,
            price: parseInt(this.invoiceInpArry[i].price),
            Qty: parseInt(this.invoiceInpArry[i].qty),
          };

          // edite Or Add
          if (this.domElements.btn.addNewInvoicetBtn.innerHTML == "تعديل الفاتورة") {
            stockTransactionD.stockTransactionDetailsId = this.invoiceInpArry[i].stockTransactionDetailsId;
            this._stockService.UpdateStockTransactionDetails(stockTransactionD).subscribe();
            //console.log(stockTransactionD)
            //console.log('secound')
            if (stockTransactionD.stockTransactionDetailsId == undefined) {
              this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe(); // for invoice DB
              //console.log(stockTransactionD)
              //console.log('third')
            }
            // if not productName to delete stocktransactionDetail
            for (let d = 0; d < this.invoiceInpArry.length; d++) {
              if (this.invoiceInpArry[d].stockTransactionDetailsId !== undefined && this.invoiceInpArry[d].product == '') {
                this._stockService.deleteStockTransactionDetails(this.invoiceInpArry[d].stockTransactionDetailsId).subscribe();
                //console.log(stockTransactionD)
                //console.log('fourth')
              }
            }
          } else if (this.domElements.btn.addNewInvoicetBtn.innerHTML == "تسجيل") {
            this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe(); // for invoice DB
            //console.log(stockTransactionD)
            //console.log('fifth')
          };

        } else {
          postStockPridgeObj = {
            stockProductId: null,
            productPrice: null,
            productId: theProductId,
            stockId: this.theStockId,
            productQty: parseInt(this.invoiceInpArry[i].qty),
            productCost: parseInt(this.invoiceInpArry[i].price)
          };

          // save stocktransactionDetails
          stockTransactionD = {
            stockTransactionDetailsId: null,
            stockTransactionId: stockTransaction.stockTransactionId,
            productId: theProductId,
            price: parseInt(this.invoiceInpArry[i].price),
            Qty: parseInt(this.invoiceInpArry[i].qty)
          };

          this._stockService.postStockPridge(postStockPridgeObj).subscribe();
          this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe(); // for invoice DB
          //console.log(stockTransactionD);
          //console.log('six');
        };
      };
    }; // fst for invoiceInpArry    
  }; // makeAddStockPremArry

  theCustomerName: string;

  showInvoiceDone() {
    this._theStockComp.ngOnInit();
    this._stockService.invoiceDoneMsg = {
      invoiceKind: 'فاتورة الشراء',
      from: this.theCustomerName, //$('#customerNameForAdd').val(),
      to: this.thestockName, //$('#stockNameForAdd').val(),
      invoiceVal: parseInt(this.invoiceTotal),
      invoiceNote: this.theInvoiceNote,
    }
    this._theStockComp.showFade_newInvoice('fade_addNewApBtn');
  };

  addToStockPrem() { // the main function
    this.makeAddStockPremArry();
    this.showInvoiceDone();
    // delete invDetail when delete the productName
    if (this.stockDetailsIdArr.length != 0) {
      for (let i = 0; i < this.stockDetailsIdArr.length; i++) {
        this._stockService.deleteStockTransactionDetails(this.stockDetailsIdArr[i]).subscribe();
      };
    }
  };


  printThis() {
    this._service.printThis()
  }

  reloadLoc() {
    location.reload();
  };

  invNum: number;

  showAddNewInvoice() {

    this.makeCustomerCss();

    this.stockDetailsIdArr = [] // for check productName vaild to delete when edite

    this._theStockComp.testBackend(); // to make stockArry
    this.productArr = []
    this.invoiceTotal = "0"

    for (let p = 0; p < this._stockService.allProducts.length; p++) {
      this.productArr.push(this._stockService.allProducts[p].productName)
    };

    //let this.domElements.btn.callInvoiceBtn.innerHTML: string = $('#callInvoiceBtn').html();
    this.invoiceInpArry = [];
    this.ivoiceItemesForEdit = [];
    // to add 5 fildes
    for (let i = 0; i < 10; i++) {
      this.invoiceInp = new InvoiceInp();
      this.invoiceInp.total = 0;
      this.invoiceInp.inpVaild = false;
      this.invoiceInp.Qtyinvaild = false;
      this.invoiceInpArry.push(this.invoiceInp);
    }

    if (this.domElements.btn.callInvoiceBtn.innerHTML == "فاتورة جديدة") {

      let currentDateNow = Date.now() //new Date()
      let currentDate = new Date(currentDateNow)
      this._service.makeTime_date(currentDate);
      this.date_time = this._service.date_time;

      this.domElements.html.invNum.style.display = 'none'; //$('#invNum').hide();
      this.domElements.html.callInvoice.style.display = 'none'; //$('#callInvoice').hide();
      //this.domElements.html.addInvoiceForm.style.height = '100%'; //$('#addInvoiceForm').slideDown('fast');
      this.domElements.btn.addNewInvoicetBtn.innerHTML = 'تسجيل'; //$('#addNewInvoicetBtn').html("تسجيل");
      this.domElements.btn.deleteAddInvoice.style.display = 'none'; //$('#deleteAddInvoice').hide();
      this.stockTransactionId = '', //$('#stockTransactionId').val('')
        this.domElements.inpt.stockNameForAdd.classList.remove('bg-info', 'text-white'); //$('#stockNameForAdd').removeClass('bg-info text-white');

      this.resetAddinvoiceValu()
      this._service.clearForm();
      this.inptDisabled = true;
      this.isAddInvVaild = true;
      this.customerVaild = false;

    } else if (this.domElements.btn.callInvoiceBtn.innerHTML == "بحث") {
      // add fildes if the inputArry < invoiceArry
      this.domElements.btn.addNewInvoicetBtn.innerHTML = 'تعديل الفاتورة';  //$('#addNewInvoicetBtn').html("تعديل الفاتورة");
      this.domElements.btn.deleteAddInvoice.style.display = 'inline'; //$('#deleteAddInvoice').show();
      this.domElements.html.invNum.style.display = 'inline'; //$('#invNum').show();

      this.inptDisabled = false;
      this.isAddInvVaild = true;

      this.invoiceInpArry = []

      this.resetAddinvoiceValu();

      let theInvoice = this._stockService.makeInvoiceArry.find(
        invoice => invoice.invoiceSearchVal == this.searchTxt
      );

      for (let i = 0; i < theInvoice.invoiceDetails.length; i++) {
        this.addFilds()
      };

      this.stockTransactionId = theInvoice.stockTransactionId; //$('#stockTransactionId').val(theInvoice.stockTransactionId)
      this.thestockName = theInvoice.stockName; //$('#stockNameForAdd').val(theInvoice.stockName);
      this.theCustomerName = theInvoice.customerName; //$('#customerNameForAdd').val(theInvoice.customerName);
      this.theInvoiceNote = theInvoice.notes; //$('#addInvoiceNote').val(theInvoice.notes);



      let cCss = this.customerCss.find(cust => cust.name == theInvoice.customerName)
      if (cCss) {
        this.custClass = cCss.css();
      }


      this.invNum = theInvoice.invNumber;
      this.ivoiceItemesForEdit = theInvoice.invoiceDetails;
      this.date_time = theInvoice.date_time;

      for (let d = 0; d < theInvoice.invoiceDetails.length; d++) {
        this.invoiceInpArry[d].stockTransactionDetailsId = theInvoice.invoiceDetails[d].stockTransactionDetailsId;
        this.invoiceInpArry[d].product = theInvoice.invoiceDetails[d].productName;
        this.invoiceInpArry[d].price = theInvoice.invoiceDetails[d].price;
        this.invoiceInpArry[d].qty = theInvoice.invoiceDetails[d].Qty;
      };

      this.calcTotals();
      this.deleteInvBtnDisabled = false;
    };
    this.domElements.html.callInvoice.style.display = 'none';
    //this.domElements.html.addInvoiceForm.style.display = 'block'; //$('#callInvoice').hide();
    //this.domElements.html.addInvoiceForm.style.height = '100%';
    $('#addInvoiceForm').slideDown('fast');

  }; // showAddNewInvoice

  showDeleteAddInvoice() {
    this.domElements.html.fadeLayerAP.style.display = 'inline' //$('#fadeLayerAP').show(0);
    $('.askForDelete').addClass('animate');
  };

  deleteAddInvoice() {
    this.domElements.html.fadeLayerAP.style.display = 'none' //$('#fadeLayerAP').hide();
    $('.askForDelete').removeClass('animate');
    //let stockTransId = $('#stockTransactionId').val();
    for (let i = 0; this.invoiceInpArry.length; i++) {

      if (this.invoiceInpArry[i]) {
        if (this.invoiceInpArry[i].stockTransactionDetailsId != undefined) {
          this._stockService.deleteStockTransactionDetails(this.invoiceInpArry[i].stockTransactionDetailsId).subscribe();
        };
        if (this.invoiceInpArry[i].stockTransactionDetailsId == undefined) {
          break
        }
      } else {
        break
      }

      /* if (this.invoiceInpArry[i].stockTransactionDetailsId == undefined) {
        break
      }
      if (this.invoiceInpArry[i].stockTransactionDetailsId != undefined) {
        this._stockService.deleteStockTransactionDetails(this.invoiceInpArry[i].stockTransactionDetailsId).subscribe();
      }; */
    };
    this._stockService.deleteStockTransaction(this.stockTransactionId).subscribe();
    this.editStockQtys();
    //location.reload();
    this._theStockComp.showStocksEnquiry();
    //this.refreshBackendData();
  };

  testBtn() {
    this.makeAddStockPremArry();
  };

}; // end