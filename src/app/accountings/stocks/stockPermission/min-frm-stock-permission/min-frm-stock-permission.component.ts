import { Component, OnInit } from '@angular/core';
import { StocksService } from '../../the-stocks/stocks.service';
import { ServicesService } from 'src/app/services.service';
import { CustomerService } from 'src/app/customer.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TheStocksComponent } from '../../the-stocks/the-stocks.component';
import { StockTransactionD } from '../../stock-transaction-d';
import { StockTransaction } from '../../stock-transaction';
import { StockPridge } from '../../stock-pridge';
import { HandleBackEnd } from 'src/app/handle-back-end';
import { Customer } from 'src/app/customer';
import { InvoiceInp } from 'src/app/accountings/invoice-inp';

@Component({
  selector: 'app-min-frm-stock-permission',
  templateUrl: './min-frm-stock-permission.component.html',
  styleUrls: ['./min-frm-stock-permission.component.scss']
})
export class MinFrmStockPermissionComponent implements OnInit {

  customers: Customer[]
  addToStockPremData: FormGroup;
  invoiceInp = new InvoiceInp()
  invoiceInpArry: any[] = [];
  totalInvoice: any[];
  searchTxt: string;
  deleteMinInvBtnDisabled: boolean;

  constructor(public _stockService: StocksService, public formBuilder: FormBuilder,
    public _service: ServicesService, public _custService: CustomerService, public _theStockComp: TheStocksComponent) { }

  ngOnInit() {

    this.addToStockPremData = this.formBuilder.group({
      stockName: [''],
    });

    this._custService.getCustomer().subscribe((data: Customer[]) => {
      this.customers = data;
    });

    this.getBackendData();

    $('#hideFadeLayerMP').click(function () {
      $('.fadeLayer').hide();
      $('.askForDelete').removeClass('animate')
    })

  } // ngOnInit

  getBackendData() {
    this._stockService.getStockTransactionList().subscribe((data: StockTransaction[]) => {
      this._stockService.stockTransactionArr = data;
    });
    this._stockService.getStockTransactionDetailsList().subscribe((data: StockTransactionD[]) => {
      this._stockService.stockTransactionDetailsArr = data;
    });
  };


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

  printThisMin() {
    let show = '#headerMinInv'
    let hide1 = '#deleteMinInvoice'
    let hide2 = '#minCallInvoice'
    let hide3 = '#minNewInvoicetBtn'
    this._service.printThis(show, hide1, hide2, hide3);
    $('#minPrimTable').css(
      { 'height': '100%' }
    );
    $('.closeBtn').show();
    $('.form-control').attr({'disabled' : true});
    $('#minAddFilds').hide();
    $('#printMinPremBtn').hide();
    //$('.vaildAlert').hide();
    //window.print()
    //location.reload()
  };

  openwindowPrint() {
    $('.closeBtn').hide();
    window.print();
    $('.closeBtn').show();
  }

  reloadLoc() {
    location.reload();
  };

  minAddFilds() {
    this.invoiceInp = new InvoiceInp();
    this.invoiceInp.total = 0;
    this.invoiceInpArry.push(this.invoiceInp);
    this.deleteMinInvBtnDisabled = true;
  };
  //theStockProd: any;
  theStockProds: any;
  inputDisabled: boolean = true;

  makeTheStockProds() {
    this.deleteMinInvBtnDisabled = true;
    this._theStockComp.testBackend();
    let theStock = $('#stockNameForMin').val();
    this.theStockProds = [];
    for (let m = 0; m < this._stockService.makeStockArry.length; m++) {
      let theStockProds = {}
      let stockObj = this._stockService.makeStockArry.find(
        obj => obj.stockName == theStock
      );
      if (stockObj != undefined) {
        this.theStockProds = stockObj.stockProducts;
        console.log(this.theStockProds)
        break
      }

      /*
      theStockProds = {
        productName: stockObj.productName,
        productQty: stockObj.productQty
      }*/
    }
    /*
    this._theStockComp.testBackend();
    let theStock = $('#stockNameForMin').val();
    this.theStockProd = {};
    this.theStockProds = [];
    for (let m = 0; m < this._stockService.makeStockArry.length; m++) { // make theStockProdsArr
      if (this._stockService.makeStockArry[m].stockName == theStock) {
        for (let s = 0; s < this._stockService.makeStockArry[m].stockProducts.length; s++) {
          this.theStockProd = {
            productName: this._stockService.makeStockArry[m].stockProducts[s].productName,
            productQty: this._stockService.makeStockArry[m].stockProducts[s].productQty,
          }
          this.theStockProds.push(this.theStockProd)
        }
      }
    }*/
    //console.log(this._stockService.makeStockArry)
    this.inputDisabled = false;
  }

  stockNameVaild: boolean;
  isAddInvVaild: boolean = false;
  productArr: any[] = [];
  isMinInvInvaild: boolean = false;

  isMinNameVaild() { // inputValidation

    this.deleteMinInvBtnDisabled = true;
    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      let productinpt = $(`#product${i}`).val();
      if (this.productArr.includes(productinpt) || productinpt == '') {
        this.invoiceInpArry[i].inpVaild = false;
      } else {
        this.invoiceInpArry[i].inpVaild = true;
      }
      if (this.invoiceInpArry[i].Qtyinvaild == true) {
        this.invoiceInpArry[i].qty = '';
        this.invoiceInpArry[i].Qtyinvaild = false;
      }
      if (this.invoiceInpArry[i].product == '') {
        if (this.invoiceInpArry[i].price > 0 || this.invoiceInpArry[i].qty > 0) {
          this.invoiceInpArry[i].price = null;
          this.invoiceInpArry[i].qty = null;
        }
      }
    }

    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      if (this.invoiceInpArry[i].inpVaild == true) {
        this.isMinInvInvaild = true;
        break
      } else if (this.invoiceInpArry[i].inpVaild == false) {
        this.isMinInvInvaild = false;
      }
    }

  } // isMinNameVaild

  qtyIsOkArry: any[];

  //theProductQtyInfo: any;
  getTheProdQty(productName) {
    let productQtyInfo = this.theStockProds.find(
      product => product.productName == productName
    )
    return productQtyInfo
  }

  isAddQtyVaild() {

    this.deleteMinInvBtnDisabled = true;
    let loopCount = 1;

    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      if (this.invoiceInpArry[i].product != undefined) {
        if (this.theStockProds.length == 0) {
          this.invoiceInpArry[i].Qtyinvaild = true;
        } else {

          let theProductQtyInfo = this.getTheProdQty(this.invoiceInpArry[i].product);

          console.log(theProductQtyInfo)
          if (theProductQtyInfo != undefined) {
            if (this.invoiceInpArry[i].product == theProductQtyInfo.productName && this.invoiceInpArry[i].qty > theProductQtyInfo.productQty) {
              if (this.qtyIsOkArry == undefined) {
                this.invoiceInpArry[i].Qtyinvaild = true;
                console.log(this.qtyIsOkArry + ' : this.qtyIsOkArry')
              } else if (this.qtyIsOkArry[i] == null) {
                console.log(this.qtyIsOkArry[i] + ' : this.qtyIsOkArry[i]')
                this.invoiceInpArry[i].Qtyinvaild = true;
              } else if (this.invoiceInpArry[i].qty <= this.qtyIsOkArry[i]) {
                this.invoiceInpArry[i].Qtyinvaild = false;
              } else if (this.invoiceInpArry[i].product == theProductQtyInfo.productName
                && this.invoiceInpArry[i].qty <= theProductQtyInfo.productQty
                && this.invoiceInpArry[i].inpVaild == false) {
                this.invoiceInpArry[i].Qtyinvaild = false;
                console.log(theProductQtyInfo + ' : the tree if')
              };
            } else {
              this.invoiceInpArry[i].Qtyinvaild = false;
              console.log('else')
            }
          } else {
            this.invoiceInpArry[i].Qtyinvaild = true;
          }
        }
      }
    }
    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      if (this.invoiceInpArry[i].Qtyinvaild == true) {
        this.isMinInvInvaild = true;
        break
      } else {
        this.isMinInvInvaild = false;
      }
    }
  } // isAddQtyVaild

  custNameInvaild: boolean;
  custVaildMsg: string;
  isCustNameInvaild() {
    let custName = $('#customerNameForMin').val()
    for (let i = 0; i < this.customers.length; i++) {
      if (custName == this.customers[i].customerName) {
        this.custNameInvaild = false;
        break
      } else {
        this.custNameInvaild = true;
        this.custVaildMsg = 'لا يوجد هذا الاسم'
      }
    }
    if (this.custNameInvaild == true) {
      this.isMinInvInvaild = true;
    } else {
      this.isMinInvInvaild = false;
    }
  }

  invoiceTotal: string = '0';
  calcTotals() {
    this.deleteMinInvBtnDisabled = true;
    this.isAddQtyVaild();
    this.totalInvoice = []
    this.invoiceTotal = '0'
    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      if (this.invoiceInpArry[i].qty == null || this.invoiceInpArry[i].price == null) {
        this.invoiceInpArry[i].total = 0;
        this.totalInvoice.push(this.invoiceInpArry[i].total)
      } else {
        this.invoiceInpArry[i].total = this.invoiceInpArry[i].qty * this.invoiceInpArry[i].price
        this.totalInvoice.push(this.invoiceInpArry[i].total)
      }
    }
    let total: any = this.sumArry(this.totalInvoice)
    this.invoiceTotal = total;
    //$('#invoiceTotal').html(`اجمالى الفاتورة : ${total}`)
  } // calcTotals

  theStockId: number;
  theCustomerId: number;

  getTheCustomerId() {
    let theCustomer = $('#customerNameForMin').val();
    for (let i = 0; i < this.customers.length; i++) {
      if (theCustomer == this.customers[i].customerName) {
        this.theCustomerId = this.customers[i].customerId;
        break
      };
    };
  }; // getTheCustomerId

  getTheStockId() {
    // get the stockId
    let theStock = $('#stockNameForMin').val();
    for (let i = 0; i < this._stockService.stocks.length; i++) {
      if (theStock == this._stockService.stocks[i].stockName) {
        this.theStockId = this._stockService.stocks[i].stockId;
        break
      };
    };
  }; // getTheStockId

  resetAddinvoiceValu() {
    this._service.clearForm();
    //$('#invoiceTotal').html(`اجمالى الفاتورة : 0`);
    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      this.invoiceInpArry[i].total = 0;
    }
  } // resetAddinvoiceValu

  checkAllArry: number;

  searchInVal: string = '';
  // changAddInvoiceBtn
  changMinInvoiceBtn() {
    this.searchInVal = $('#minInvoiceSearch').val();
    if (this.searchInVal == '') {
      $('#minCallInvoiceBtn').html("فاتورة جديدة")
    } else {
      $('#minCallInvoiceBtn').html("بحث")
    };
  }; // changMinInvoiceBtn

  theNote: string;
  theStockTransactionId: string;

  ivoiceItemesForEdit: any[]; /* = [{
    stockTransactionId: '',
    stockTransactionDetailsId: "",
    productId: "",
    productName: "",
    stockId: "",
    stockName: "",
    customerName: "",
    transactionType: "",
    price: 0,
    Qty: 0,
    notes: ""
  }
  ];*/

  invNumMin: number;

  ShowMinNewInvoice() {

    this.getTheStockId()
    //this.makeTheStockProds()
    this.productArr = []
    for (let p = 0; p < this._stockService.allProducts.length; p++) {
      this.productArr.push(this._stockService.allProducts[p].productName)
    }

    let callInvoiceBtnVal: string = $('#minCallInvoiceBtn').html();
    this.invoiceInpArry = [];
    this.ivoiceItemesForEdit = [];

    for (let i = 0; i < 7; i++) {
      this.invoiceInp = new InvoiceInp()
      this.invoiceInp.total = 0;
      this.invoiceInpArry.push(this.invoiceInp);
    }

    if (callInvoiceBtnVal == "فاتورة جديدة") {
      let currentDateNow = Date.now() //new Date()
      let currentDate = new Date(currentDateNow)
      this._service.makeTime_date(currentDate);
      $('#invNumMin').hide();
      $('#minCallInvoice').hide();
      $('#minInvoiceForm').show();
      $('#minNewInvoicetBtn').html("تسجيل")
      $('#deleteMinInvoice').hide();
      $('#stockTransactionId').val('')
      this.inputDisabled = true;
      this.isMinInvInvaild = true;
      this._service.clearForm();
      this.resetAddinvoiceValu();
    } else if (callInvoiceBtnVal == "بحث") {
      $('#minNewInvoicetBtn').html("تعديل الفاتورة");
      $('#deleteMinInvoice').show();
      $('#invNumMin').show();
      this.inputDisabled = false;
      //this.isMinInvInvaild = true;
      for (let i = 0; i < this._stockService.makeInvoiceArry.length; i++) {
        if (this._stockService.makeInvoiceArry[i].invoiceSearchVal == this.searchInVal) {
          if (this._stockService.makeInvoiceArry[i].invoiceDetails.length > this.invoiceInpArry.length) {
            let countDif: number = this._stockService.makeInvoiceArry[i].invoiceDetails.length - this.invoiceInpArry.length;
            for (let c = 0; c < countDif; c++) {
              this.minAddFilds();
            }
          }
        }
      }

      this.resetAddinvoiceValu();
      for (let i = 0; i < this._stockService.makeInvoiceArry.length; i++) {
        if (this._stockService.makeInvoiceArry[i].invoiceSearchVal == this.searchInVal) {
          $('#minStockTransactionId').val(this._stockService.makeInvoiceArry[i].stockTransactionId)
          for (let d = 0; d < this._stockService.makeInvoiceArry[i].invoiceDetails.length; d++) {
            this.ivoiceItemesForEdit.push(this._stockService.makeInvoiceArry[i].invoiceDetails[d]);
            this.invoiceInpArry[d].stockTransactionDetailsId = this._stockService.makeInvoiceArry[i].invoiceDetails[d].stockTransactionDetailsId;
            this.invoiceInpArry[d].product = this._stockService.makeInvoiceArry[i].invoiceDetails[d].productName;
            this.invoiceInpArry[d].price = this._stockService.makeInvoiceArry[i].invoiceDetails[d].price;
            this.invoiceInpArry[d].qty = this._stockService.makeInvoiceArry[i].invoiceDetails[d].Qty;
          }
          this._service.date_time = this._stockService.makeInvoiceArry[i].invoiceDetails[0].date_time;
          $('#stockNameForMin').val(this._stockService.makeInvoiceArry[i].stockName);
          $('#customerNameForMin').val(this._stockService.makeInvoiceArry[i].customerName);
          $('#minInvoiceNote').val(this._stockService.makeInvoiceArry[i].notes);
          this.invNumMin = this._stockService.makeInvoiceArry[i].invoiceDetails[0].invNumber;
        }
      }

      this.makeTheStockProds()
      this.calcTotals();
      this.qtyIsOkArry = [];
      for (let v = 0; v < this.invoiceInpArry.length; v++) {
        this.invoiceInpArry[v].inpVaild = false;
        if (this.invoiceInpArry[v].Qtyinvaild == true) {
          let theQtyIsOk = this.invoiceInpArry[v].qty;
          this.qtyIsOkArry.push(theQtyIsOk)
        } else {
          this.qtyIsOkArry.push(null)
        }
        //////console.log(this.qtyIsOkArry)
        //this.invoiceInpArry[v].Qtyinvaild = false;
      }
      this.isAddQtyVaild();
      $('#minCallInvoice').hide();
      $('#minInvoiceForm').show();

    }
    this.deleteMinInvBtnDisabled = false;
  } // ShowMinNewInvoice

  theCustomerInfo: Customer;

  editStockQtys() {

    this._stockService.getHandleBackEnd().subscribe((data: HandleBackEnd[]) => {
      this._stockService.handleBackEnd = data;
    })

    //this.getTheStockId();
    let BtnSubmitHtml = $('#minNewInvoicetBtn').html(); // to check if invoice for update or add
    let theProductId: number;
    let postStockPridgeObj: StockPridge = {
      stockProductId: null,
      stockId: 0, //
      productId: 0, //
      productQty: 0, //
      productCost: 0, //
      productPrice: 0,
    }

    if (BtnSubmitHtml == "تعديل الفاتورة") {

      this.theCustomerInfo = this.getCustomerInfo(this.ivoiceItemesForEdit[0].customerId)
      this.theCustomerInfo.customerRemain = this.theCustomerInfo.customerRemain + this.ivoiceItemesForEdit[0].invoiceTotal;
      this._custService.updateCustomerSer(this.theCustomerInfo).subscribe();

      for (let v = 0; v < this.ivoiceItemesForEdit.length; v++) {

        let getProductsInfo = this._stockService.allProducts.find(
          product => product.productName === this.ivoiceItemesForEdit[v].productName
        )
        theProductId = getProductsInfo.productId;

        let getHandleInfo = this._stockService.handleBackEnd.find(
          handleInfo => handleInfo.productId == theProductId &&
            handleInfo.stockId == this.ivoiceItemesForEdit[v].stockId
        )

        let indx = this._stockService.handleBackEnd.findIndex(
          i => i.stockProductId === getHandleInfo.stockProductId
        )

        postStockPridgeObj.productId = theProductId;
        postStockPridgeObj.stockId = this.ivoiceItemesForEdit[v].stockId;
        postStockPridgeObj.stockProductId = getHandleInfo.stockProductId;
        postStockPridgeObj.productQty = getHandleInfo.productQty + parseInt(this.ivoiceItemesForEdit[v].Qty);
        postStockPridgeObj.productCost = getHandleInfo.productCost;

        this._stockService.handleBackEnd[indx].productQty = postStockPridgeObj.productQty;
        this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB

      }
    }

  } // editStockQtys

  makeMinStockPremArry() {

    this.getTheStockId();
    this.getTheCustomerId();
    this.editStockQtys(); // if edite will min all old invoice Qtys from stock Qtys 

    let theProductId: number;
    this.checkAllArry = 1; // check after loop on the handleArry that the product not found
    this.theNote = $('#minInvoiceNote').val()
    this.theStockTransactionId = $('#minStockTransactionId').val()
    let postStockPridgeObj: StockPridge = {
      stockProductId: null,
      stockId: 0, //
      productId: 0, //
      productQty: 0, //
      productCost: 0, //
      productPrice: 0,
    }

    let stockTransactionD: StockTransactionD = {
      stockTransactionDetailsId: 0,
      stockTransactionId: '',
      productId: 0,
      price: 0,
      Qty: 0,
    }

    // mainTable
    let stockTransaction: StockTransaction = {
      stockTransactionId: Date.now().toString(),
      invNumber: this._theStockComp.newMinInvNumber,
      stockId: this.theStockId,
      sndStockId: 1,
      customerId: this.theCustomerId,
      transactionType: 2,
      invoiceTotal: parseInt(this.invoiceTotal),
      date_time: this._service.date_time,
      notes: this.theNote,
    }

    this.theCustomerInfo = this.getCustomerInfo(this.theCustomerId);
    // edit or add
    if (this.theStockTransactionId == '') {
      this._stockService.creatStockTransaction(stockTransaction).subscribe();
      this.theCustomerInfo.customerRemain = this.theCustomerInfo.customerRemain + parseInt(this.invoiceTotal);
      this._custService.updateCustomerSer(this.theCustomerInfo).subscribe();

    } else {
      stockTransaction.stockTransactionId = this.theStockTransactionId;
      this._stockService.UpdateStockTransaction(stockTransaction).subscribe();
      this.theCustomerInfo.customerRemain = this.theCustomerInfo.customerRemain + parseInt(this.invoiceTotal);
      this._custService.updateCustomerSer(this.theCustomerInfo).subscribe();
    }

    let BtnSubmitHtml = $('#minNewInvoicetBtn').html(); // to check if invoice for update or add

    for (let i = 0; i < this.invoiceInpArry.length; i++) {

      if (this.invoiceInpArry[i].product !== undefined) {

        let getProductInfo = this._stockService.allProducts.find(
          product => product.productName === this.invoiceInpArry[i].product
        )

        theProductId = getProductInfo.productId

        // for the first invoice
        if (this._stockService.handleBackEnd.length == 0) {

          postStockPridgeObj.productId = theProductId;
          postStockPridgeObj.stockId = this.theStockId;
          postStockPridgeObj.productQty = parseInt(this.invoiceInpArry[i].qty);
          postStockPridgeObj.productPrice = parseInt(this.invoiceInpArry[i].price);
          this._stockService.postStockPridge(postStockPridgeObj).subscribe();
          //////console.log(postStockPridgeObj)
          //////console.log('thrd')
          // save stocktransactionDetails
          stockTransactionD.stockTransactionId = stockTransaction.stockTransactionId;
          stockTransactionD.productId = theProductId;
          stockTransactionD.price = parseInt(this.invoiceInpArry[i].price);
          stockTransactionD.Qty = parseInt(this.invoiceInpArry[i].qty);

          this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB
          //////console.log(postStockPridgeObj)
          //////console.log('fourth')
        } // for the first invoice

        let getHandleInfo = this._stockService.handleBackEnd.find(
          handleInfo => handleInfo.productId == theProductId &&
            handleInfo.stockId == this.theStockId
        )

        if (getHandleInfo != undefined) {

          postStockPridgeObj.productId = theProductId; // for edit and add
          postStockPridgeObj.stockId = this.theStockId; // for edit and add
          postStockPridgeObj.productCost = getHandleInfo.productCost;
          postStockPridgeObj.productPrice = parseInt(this.invoiceInpArry[i].price);
          postStockPridgeObj.productQty = getHandleInfo.productQty - parseInt(this.invoiceInpArry[i].qty);
          postStockPridgeObj.stockProductId = getHandleInfo.stockProductId;

          this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB
          //////console.log(postStockPridgeObj)
          //////console.log('fifth')
          // save stocktransactionDetails
          stockTransactionD.stockTransactionId = stockTransaction.stockTransactionId;
          stockTransactionD.productId = theProductId;
          stockTransactionD.price = parseInt(this.invoiceInpArry[i].price);
          stockTransactionD.Qty = parseInt(this.invoiceInpArry[i].qty);

          // edite Or Add
          if (BtnSubmitHtml == "تعديل الفاتورة") {
            stockTransactionD.stockTransactionDetailsId = this.invoiceInpArry[i].stockTransactionDetailsId;
            if (stockTransactionD.stockTransactionDetailsId == undefined) {
              this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB
              //////console.log(postStockPridgeObj)
              //////console.log('six')
            }
            // if not productName to delete stocktransactionDetail
            for (let d = 0; d < this.invoiceInpArry.length; d++) {
              if (this.invoiceInpArry[d].stockTransactionDetailsId !== undefined && this.invoiceInpArry[d].product == '') {
                this._stockService.deleteStockTransactionDetails(this.invoiceInpArry[d].stockTransactionDetailsId).subscribe();
              }
            }
            this._stockService.UpdateStockTransactionDetails(stockTransactionD).subscribe();
            //////console.log(postStockPridgeObj)
            //////console.log('seven')
          } else if (BtnSubmitHtml == "تسجيل") {
            this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB
            //////console.log(postStockPridgeObj)
            //////console.log('eight')
          }
        } else {
          postStockPridgeObj.productId = theProductId;
          postStockPridgeObj.stockId = this.theStockId;
          postStockPridgeObj.productQty = parseInt(this.invoiceInpArry[i].qty);
          postStockPridgeObj.productPrice = parseInt(this.invoiceInpArry[i].price);
          // save stocktransactionDetails
          stockTransactionD.stockTransactionId = stockTransaction.stockTransactionId;
          stockTransactionD.productId = theProductId;
          stockTransactionD.price = parseInt(this.invoiceInpArry[i].price);
          stockTransactionD.Qty = parseInt(this.invoiceInpArry[i].qty);
          this._stockService.postStockPridge(postStockPridgeObj).subscribe();
          //////console.log(postStockPridgeObj)
          //////console.log('nine')

          this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB
          //////console.log(postStockPridgeObj)
          //////console.log('ten')
        }
      }
    } // fst loop

  } // makeMinStockPremArry

  showInvoiceDone() {
    this._theStockComp.ngOnInit();
    this._theStockComp.showFade_newInvoice('fade_minNewApBtn');
  }

  minFrmStockPrem() {
    this.makeMinStockPremArry();
    this.showInvoiceDone();
    //this.resetAddinvoiceValu();
    //this._theStockComp.showStocksEnquiry();
    //this._theStockComp.showMinToStockPrem();
    //this._theStockComp.CreateTheInvoiceArry();
    //consol.log(this._stockService.handleBackEnd)
    //location.reload();
  } // minFrmStockPrem

  showDeleteMinInvoice() {
    $('.fadeLayer').show(0);
    $('.askForDelete').addClass('animate');
    let stockTransId = $('#minStockTransactionId').val();
    console.log(stockTransId)
  };

  deleteMinInvoice() {
    $('.fadeLayer').hide();
    let stockTransId = $('#minStockTransactionId').val();
    for (let i = 0; this.invoiceInpArry.length; i++) {
      if (this.invoiceInpArry[i].stockTransactionDetailsId == undefined) {
        break
      };
      if (this.invoiceInpArry[i].stockTransactionDetailsId != undefined) {
        this._stockService.deleteStockTransactionDetails(this.invoiceInpArry[i].stockTransactionDetailsId).subscribe();
      };
    };
    
    this.editStockQtys();
    this.deleteTransaction(stockTransId);
    //location.reload();
    this._theStockComp.showStocksEnquiry();
    //this.refreshBackendData();
  };

  deleteTransaction(stockTransId) {
    this._stockService.deleteStockTransaction(stockTransId).subscribe();
  }

  minTestBtn() {
  } // minTestBtn

} // End

/* old editStockQtys (Method)
for (let sE = 0; sE < this._stockService.allProducts.length; sE++) { *** Done
  if (this.ivoiceItemesForEdit[v].productName == this._stockService.allProducts[sE].productName) { *** Done
    theProductId = this._stockService.allProducts[sE].productId; *** Done
    for (let hE = 0; hE < this._stockService.handleBackEnd.length; hE++) { *** Done
      if (theProductId == this._stockService.handleBackEnd[hE].productId &&
        this.ivoiceItemesForEdit[v].stockId == this._stockService.handleBackEnd[hE].stockId) { *** Done
        postStockPridgeObj.productId = theProductId; *** Done
        postStockPridgeObj.stockId = this.ivoiceItemesForEdit[v].stockId; *** Done
        postStockPridgeObj.stockProductId = this._stockService.handleBackEnd[hE].stockProductId; *** Done
        postStockPridgeObj.productQty = this._stockService.handleBackEnd[hE].productQty + parseInt(this.ivoiceItemesForEdit[v].Qty); *** Done
        postStockPridgeObj.productCost = this._stockService.handleBackEnd[hE].productCost *** Done
        this._stockService.handleBackEnd[hE].productQty = postStockPridgeObj.productQty;
        this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB
      }
    }
  }
}*/

/* old makeMinStockPremArry(method)

for (let s = 0; s < this._stockService.allProducts.length; s++) {

  if (this.invoiceInpArry[i].product == this._stockService.allProducts[s].productName) { *** Done
    theProductId = this._stockService.allProducts[s].productId;

    // for the first invoice *********************************************************************************************
    if (this._stockService.handleBackEnd.length == 0) {

      postStockPridgeObj.productId = theProductId; *** Done
      postStockPridgeObj.stockId = this.theStockId; *** Done
      postStockPridgeObj.productQty = parseInt(this.invoiceInpArry[i].qty); *** Done
      postStockPridgeObj.productPrice = parseInt(this.invoiceInpArry[i].price); *** Done
      this._stockService.postStockPridge(postStockPridgeObj).subscribe(); *** Done

      // save stocktransactionDetails
      stockTransactionD.stockTransactionId = stockTransaction.stockTransactionId; *** Done
      stockTransactionD.productId = theProductId; *** Done
      stockTransactionD.price = parseInt(this.invoiceInpArry[i].price); *** Done
      stockTransactionD.Qty = parseInt(this.invoiceInpArry[i].qty); *** Done

      this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB *** Done

      this.checkAllArry = 1; // reload
    }
    // for the first invoice *********************************************************************************************

    for (let h = 0; h < this._stockService.handleBackEnd.length; h++) { *** Done

      if (theProductId == this._stockService.handleBackEnd[h].productId &&
        this.theStockId == this._stockService.handleBackEnd[h].stockId) { *** Done

        postStockPridgeObj.productId = theProductId; // for edit and add *** Done
        postStockPridgeObj.stockId = this.theStockId; // for edit and add *** Done
        postStockPridgeObj.productCost = this._stockService.handleBackEnd[h].productCost; *** Done
        postStockPridgeObj.productPrice = parseInt(this.invoiceInpArry[i].price); *** Done
        postStockPridgeObj.productQty = this._stockService.handleBackEnd[h].productQty - parseInt(this.invoiceInpArry[i].qty); *** Done
        postStockPridgeObj.stockProductId = this._stockService.handleBackEnd[h].stockProductId; *** Done
        this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB *** Done
        // save stocktransactionDetails
        stockTransactionD.stockTransactionId = stockTransaction.stockTransactionId; *** Done
        stockTransactionD.productId = theProductId; *** Done
        stockTransactionD.price = parseInt(this.invoiceInpArry[i].price); *** Done
        stockTransactionD.Qty = parseInt(this.invoiceInpArry[i].qty); *** Done

        // edite Or Add
        if (BtnSubmitHtml == "تعديل الفاتورة") { *** Done
          stockTransactionD.stockTransactionDetailsId = this.invoiceInpArry[i].stockTransactionDetailsId; *** Done
          if (stockTransactionD.stockTransactionDetailsId == undefined) { *** Done
            this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB *** Done
          }
          // if not productName to delete stocktransactionDetail*** Done
          for (let d = 0; d < this.invoiceInpArry.length; d++) { *** Done
            if (this.invoiceInpArry[d].stockTransactionDetailsId !== undefined && this.invoiceInpArry[d].product == '') { *** Done
              this._stockService.deleteStockTransactionDetails(this.invoiceInpArry[d].stockTransactionDetailsId).subscribe(); *** Done
            }
          }
          this._stockService.UpdateStockTransactionDetails(stockTransactionD).subscribe(); *** Done

        } else if (BtnSubmitHtml == "تسجيل") {
          this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB *** Done
        }

        this._service.clearForm();
        this.checkAllArry = 1; // reload
        break
      }
      this.checkAllArry++ // for handleBackEnd[]
      if (this.checkAllArry > this._stockService.handleBackEnd.length) { // if the product isn't in theStock's DataBase

        postStockPridgeObj.productId = theProductId; *** Done
        postStockPridgeObj.stockId = this.theStockId; *** Done
        postStockPridgeObj.productQty = parseInt(this.invoiceInpArry[i].qty);
        postStockPridgeObj.productPrice = parseInt(this.invoiceInpArry[i].price);
        // save stocktransactionDetails
        stockTransactionD.stockTransactionId = stockTransaction.stockTransactionId; *** Done
        stockTransactionD.productId = theProductId; *** Done
        stockTransactionD.price = parseInt(this.invoiceInpArry[i].price); *** Done
        stockTransactionD.Qty = parseInt(this.invoiceInpArry[i].qty); *** Done
        this._stockService.postStockPridge(postStockPridgeObj).subscribe(); *** Done
        this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB
        this.checkAllArry = 1; // reload
      }
    } // this._stockService.handleBackEnd loop

  }
} // snd loop
*/

/* oldQty Vaild
for (let t = 0; t < this.theStockProds.length; t++) {
  if (this.invoiceInpArry[i].product == this.theStockProds[t].productName && this.invoiceInpArry[i].qty > this.theStockProds[t].productQty) {
    if (this.qtyIsOkArry == undefined) { ***
      this.invoiceInpArry[i].Qtyinvaild = true;
      loopCount = 1;
      break;
    } else if (this.qtyIsOkArry[i] == null) { ***
      this.invoiceInpArry[i].Qtyinvaild = true;
      loopCount = 1;
      break;
    } else if (this.invoiceInpArry[i].qty <= this.qtyIsOkArry[i]) { ***
      this.invoiceInpArry[i].Qtyinvaild = false;
      loopCount = 1;
      break;
    }
  } else if (this.invoiceInpArry[i].product == this.theStockProds[t].productName
    && this.invoiceInpArry[i].qty <= this.theStockProds[t].productQty
    && this.invoiceInpArry[i].inpVaild == false) {
    this.invoiceInpArry[i].Qtyinvaild = false; ***
    loopCount = 1;
    break
  }
  loopCount++
  if (loopCount > this.theStockProds.length) {
    this.invoiceInpArry[i].Qtyinvaild = true;
  }
}*/