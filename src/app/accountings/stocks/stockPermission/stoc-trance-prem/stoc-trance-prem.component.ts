import { Component, OnInit } from '@angular/core';
import { TheStocksComponent } from '../../the-stocks/the-stocks.component';
import { StocksService } from '../../the-stocks/stocks.service';
import { FormBuilder } from '@angular/forms';
import { ServicesService } from 'src/app/services.service';
import { CustomerService } from 'src/app/customer.service';
import { InvoiceInp } from 'src/app/accountings/invoice-inp';
import { HandleBackEnd } from 'src/app/handle-back-end';
import { StockPridge } from '../../stock-pridge';
import { StockTransactionD } from '../../stock-transaction-d';
import { StockTransaction } from '../../stock-transaction';

@Component({
  selector: 'app-stoc-trance-prem',
  templateUrl: './stoc-trance-prem.component.html',
  styleUrls: ['./stoc-trance-prem.component.scss']
})
export class StocTrancePremComponent implements OnInit {

  searchTxt: string;
  searchInVal: string;
  productArr: any[];
  invoiceTotal: string;
  invoiceInpArry: any[];
  invoiceInp: InvoiceInp;
  ivoiceItemesForEdit: any[];
  totalInvoice: any[];
  // validation
  inptDisabled: boolean;
  isAddInvVaild: boolean;
  fstStockNameVaild: boolean;
  sndStockNameVaild: boolean;

  deleteInvTranceBtnDisabled: boolean;

  dateNow: any;
  day: any;
  month: any;
  year: any;
  fullDate: any;
  hour: any;
  minutes: any;
  fullTime: any;
  date_time: any;


  constructor(public _stockService: StocksService, public formBuilder: FormBuilder,
    public _service: ServicesService, public _custService: CustomerService, public _theStockComp: TheStocksComponent) { }

  ngOnInit() {

    $('#hideFadeLayerMP').click(function () {
      $('.fadeLayer').hide();
      $('.askForDelete').removeClass('animate')
    })

  }

  addFilds() {
    this.deleteInvTranceBtnDisabled = true;
    this.invoiceInp = new InvoiceInp();
    this.invoiceInp.total = 0;
    this.invoiceInpArry.push(this.invoiceInp);
  }

  theFstStockId: number;
  theSndStockId: number;

  getTheStockId() {
    this.deleteInvTranceBtnDisabled = true;
    // get the stockId
    let theStock = $('#fstStockNameForTrance').val();
    let sndStock = $('#sndStockNameForTrance').val();

    for (let i = 0; i < this._stockService.stocks.length; i++) {
      if (theStock == this._stockService.stocks[i].stockName) {
        this.theFstStockId = this._stockService.stocks[i].stockId;
        break
      };
    };

    for (let i = 0; i < this._stockService.stocks.length; i++) {
      if (sndStock == this._stockService.stocks[i].stockName) {
        this.theSndStockId = this._stockService.stocks[i].stockId;
        break
      };
    };
  };

  sumArry(arr: any[]) {
    let s = 0
    for (let i = 0; i < arr.length; i++) {
      s = s + arr[i]
    }
    return s
  };

  printThisTranceInv() {
    let show = '#headerTranceInv'
    let hide1 = ''
    let hide2 = '#callTranceInvoice'
    let hide3 = '#newTranceInvoicetBtn'
    this._service.printThis(show, hide1, hide2, hide3)
    $('#trancePrimTable').css(
      { 'height': '100%' }
    );
    //$('.vaildAlert').hide();
    window.print()
    location.reload()
  }

  theStockProd: any;
  theStockProds: any;
  inputDisabled: boolean = true;

  makeTheStockProds() {
    this.deleteInvTranceBtnDisabled = true;
    this._theStockComp.testBackend();
    let theStock = $('#fstStockNameForTrance').val();
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
    }
    this.inputDisabled = false;
  }

  qtyIsOkArry: any[];

  isAddQtyVaild() {
    let loopCount = 1;
    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      if (this.invoiceInpArry[i].product != undefined) {
        for (let t = 0; t < this.theStockProds.length; t++) {
          if (this.invoiceInpArry[i].product == this.theStockProds[t].productName && this.invoiceInpArry[i].qty > this.theStockProds[t].productQty) {
            if (this.qtyIsOkArry == undefined) {
              this.invoiceInpArry[i].Qtyinvaild = true;
              loopCount = 1;
              break;
            } else if (this.qtyIsOkArry[i] == null) {
              this.invoiceInpArry[i].Qtyinvaild = true;
              loopCount = 1;
              break;
            } else if (this.invoiceInpArry[i].qty <= this.qtyIsOkArry[i]) {
              this.invoiceInpArry[i].Qtyinvaild = false;
              loopCount = 1;
              break;
            }
          } else if (this.invoiceInpArry[i].product == this.theStockProds[t].productName
            && this.invoiceInpArry[i].qty <= this.theStockProds[t].productQty
            && this.invoiceInpArry[i].inpVaild == false) {
            this.invoiceInpArry[i].Qtyinvaild = false;
            loopCount = 1;
            break
          }
          loopCount++
          if (loopCount > this.theStockProds.length) {
            this.invoiceInpArry[i].Qtyinvaild = true;
          }
        }
      }
    }
    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      if (this.invoiceInpArry[i].Qtyinvaild == true) {
        this.isAddInvVaild = true;
        break
      } else {
        this.isAddInvVaild = false;
      }
    }
  }  // isAddQtyVaild

  fstVaildMsg: string;
  sndVaildMsg: string;

  stockChanged() {
    this.getTheStockId();
    this.makeTheStockProds();
    this.sndStockNameVaild = false;
    this.fstStockNameVaild = false;
    if (this.theFstStockId != undefined && this.theSndStockId != undefined
      && this.theFstStockId != this.theSndStockId) {
      this.inptDisabled = false;
    } else {
      this.inptDisabled = true;
    }

    let fstStockNameForTrance = $('#fstStockNameForTrance').val();
    let sndStockNameForTrance = $('#sndStockNameForTrance').val();

    if (this.theFstStockId == this.theSndStockId) {
      this.sndStockNameVaild = true;
      this.fstStockNameVaild = true;
      this.fstVaildMsg = 'لا يمكن تكرار نفس المخزن'
      this.sndVaildMsg = 'لا يمكن تكرار نفس المخزن'
    } else {
      this.sndStockNameVaild = false;
      this.fstStockNameVaild = false;
    }
    if (fstStockNameForTrance == '-') {
      this.fstStockNameVaild = true;
      this.fstVaildMsg = 'لا يوجد هذا المخزن'
      this.inptDisabled = true;
      this.isAddInvVaild = true;
    } else {
      this.isAddInvVaild = false;
    }
    if (sndStockNameForTrance == '-') {
      this.sndStockNameVaild = true;
      this.sndVaildMsg = 'لا يوجد هذا المخزن'
      this.inptDisabled = true;
      this.isAddInvVaild = true;
    } else {
      this.isAddInvVaild = false;
    }

  }

  productNameIdArr: any[];

  isTranceNameVaild() {

    let theProductId: number;
    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      let productinpt = $(`#product${i}`).val();
      if (this.productArr.includes(productinpt) || productinpt == '') {
        this.invoiceInpArry[i].inpVaild = false;
      } else {
        this.invoiceInpArry[i].inpVaild = true;
      };
      if (this.invoiceInpArry[i].Qtyinvaild == true) {
        this.invoiceInpArry[i].qty = '';
        this.invoiceInpArry[i].price = '';
        this.invoiceInpArry[i].Qtyinvaild = false;
      }
      for (let p = 0; p < this.productNameIdArr.length; p++) {
        if (this.invoiceInpArry[i].product == this.productNameIdArr[p].productName) {
          theProductId = this.productNameIdArr[p].productId;
          for (let h = 0; h < this._stockService.handleBackEnd.length; h++) {
            if (theProductId == this._stockService.handleBackEnd[h].productId &&
              this.theFstStockId == this._stockService.handleBackEnd[h].stockId) {
              this.invoiceInpArry[i].price = this._stockService.handleBackEnd[h].productCost;
            }
          }
        }
      }
    } // *********************************** I stopped Here

    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      if (this.invoiceInpArry[i].inpVaild == true) {
        this.isAddInvVaild = true;
        break
      } else {
        this.isAddInvVaild = false;
      }
    }

  }

  calcTotals() {
    this.deleteInvTranceBtnDisabled = true;
    this.isAddQtyVaild()
    this.totalInvoice = [];
    this.invoiceTotal = '0'
    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      if (this.invoiceInpArry[i].qty == null || this.invoiceInpArry[i].price == null) {
        this.invoiceInpArry[i].total = 0;
        this.totalInvoice.push(this.invoiceInpArry[i].total)
      } else {
        this.invoiceInpArry[i].total = this.invoiceInpArry[i].qty * this.invoiceInpArry[i].price;
        this.totalInvoice.push(this.invoiceInpArry[i].total);
      }
    }
    let total: any = this.sumArry(this.totalInvoice)
    this.invoiceTotal = total;
  }

  resetTranceinvoiceValu() {
    this._service.clearForm();
    //$('#invoiceTotal').html(`اجمالى الفاتورة : 0`);
    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      this.invoiceInpArry[i].total = 0;
    }
  }

  makeTime_date(currentDate) {
    this.dateNow = currentDate // new Date();
    this.day = this.dateNow.getDate();
    this.month = this.dateNow.getMonth();
    this.year = this.dateNow.getFullYear();
    this.fullDate = this.day + '-' + this.month + '-' + this.year
    this.hour = this.dateNow.getHours();
    this.minutes = this.dateNow.getMinutes();
    this.fullTime = this.hour + ':' + this.minutes
    this.fullDate.toString();
    this.fullTime.toString()
    this.date_time = this.fullDate + ' ' + this.fullTime
  }

  showNewTranceInvoice() {

    this._theStockComp.testBackend();
    this.productArr = [];
    this.productNameIdArr = [];
    this.invoiceTotal = "0"
    let productNameIdObj: Object;

    for (let p = 0; p < this._stockService.allProducts.length; p++) {
      this.productArr.push(this._stockService.allProducts[p].productName);
      productNameIdObj = {
        productId: this._stockService.allProducts[p].productId,
        productName: this._stockService.allProducts[p].productName
      }
      this.productNameIdArr.push(productNameIdObj)
    }

    let callInvoiceBtnVal: string = $('#callTranceInvoiceBtn').html();
    this.invoiceInpArry = [];
    this.ivoiceItemesForEdit = [];
    // to add 5 fildes
    for (let i = 0; i < 7; i++) {
      this.invoiceInp = new InvoiceInp()
      this.invoiceInp.total = 0;
      this.invoiceInp.inpVaild = false;
      this.invoiceInp.Qtyinvaild = false;
      this.invoiceInp.price = null;
      this.invoiceInpArry.push(this.invoiceInp);
    }

    if (callInvoiceBtnVal == "فاتورة جديدة") {
      let currentDate = new Date()
      this.makeTime_date(currentDate);
      $('#callTranceInvoice').hide();
      $('#tranceInvoiceForm').show();
      $('#newTranceInvoicetBtn').html("تسجيل");
      $('#stockTransactionId').val('');
      this.resetTranceinvoiceValu();
      this.inptDisabled = true;
      this.isAddInvVaild = true;
    } else if (callInvoiceBtnVal == "بحث") {

      // add fildes if the inputArry < invoiceArry
      $('#newTranceInvoicetBtn').html("تعديل الفاتورة");
      this.inptDisabled = false;

      for (let i = 0; i < this._stockService.makeInvoiceArry.length; i++) { // add fields if the invoice details > 7 inpts
        if (this._stockService.makeInvoiceArry[i].invoiceSearchVal == this.searchInVal) {
          if (this._stockService.makeInvoiceArry[i].invoiceDetails.length > this.invoiceInpArry.length) {
            let countDif: number = this._stockService.makeInvoiceArry[i].invoiceDetails.length - this.invoiceInpArry.length;
            for (let c = 0; c < countDif; c++) {
              this.addFilds();
            }
          }
        }
      }

      this.resetTranceinvoiceValu();

      for (let i = 0; i < this._stockService.makeInvoiceArry.length; i++) {
        if (this._stockService.makeInvoiceArry[i].invoiceSearchVal == this.searchInVal) {
          $('#stockTransactionId').val(this._stockService.makeInvoiceArry[i].stockTransactionId);
          $('#fstStockNameForTrance').val(this._stockService.makeInvoiceArry[i].stockName);
          $('#sndStockNameForTrance').val(this._stockService.makeInvoiceArry[i].sndStockName);
          $('#tranceInvoiceNote').val(this._stockService.makeInvoiceArry[i].notes);
          for (let d = 0; d < this._stockService.makeInvoiceArry[i].invoiceDetails.length; d++) {
            this.ivoiceItemesForEdit.push(this._stockService.makeInvoiceArry[i].invoiceDetails[d]);
            this.invoiceInpArry[d].stockTransactionDetailsId = this._stockService.makeInvoiceArry[i].invoiceDetails[d].stockTransactionDetailsId;
            this.invoiceInpArry[d].product = this._stockService.makeInvoiceArry[i].invoiceDetails[d].productName;
            this.invoiceInpArry[d].price = this._stockService.makeInvoiceArry[i].invoiceDetails[d].price;
            this.invoiceInpArry[d].qty = this._stockService.makeInvoiceArry[i].invoiceDetails[d].Qty;
          }
        }
      }

      //
      //
      this.makeTheStockProds();
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
        //this.invoiceInpArry[v].Qtyinvaild = false;
      }
      this.isAddQtyVaild();
      $('#callTranceInvoice').hide();
      $('#tranceInvoiceForm').show();
      this.deleteInvTranceBtnDisabled = true;
    }
  } // showNewTranceInvoice

  changTranceInvoiceBtn() {
    this.searchInVal = $('#invoiceTranceSearch').val();
    if (this.searchInVal == '') {
      $('#callTranceInvoiceBtn').html("فاتورة جديدة");
    } else {
      $('#callTranceInvoiceBtn').html("بحث");
    }
  }

  checkAllArry: number;
  theNote: string;
  theStockTransactionId: string;

  editStockQtys() {
    this.getTheStockId();
    let BtnSubmitHtml = $('#newTranceInvoicetBtn').html(); // to check if invoice for update or add
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
      for (let v = 0; v < this.ivoiceItemesForEdit.length; v++) {
        for (let sE = 0; sE < this._stockService.allProducts.length; sE++) {
          if (this.ivoiceItemesForEdit[v].productName == this._stockService.allProducts[sE].productName) {
            theProductId = this._stockService.allProducts[sE].productId;
            for (let hE = 0; hE < this._stockService.handleBackEnd.length; hE++) {
              if (theProductId == this._stockService.handleBackEnd[hE].productId &&
                this.theFstStockId == this._stockService.handleBackEnd[hE].stockId) {
                postStockPridgeObj.productId = theProductId;
                postStockPridgeObj.stockId = this.theFstStockId;
                postStockPridgeObj.stockProductId = this._stockService.handleBackEnd[hE].stockProductId;
                postStockPridgeObj.productQty = this._stockService.handleBackEnd[hE].productQty + parseInt(this.ivoiceItemesForEdit[v].Qty);
                postStockPridgeObj.productCost = this._stockService.handleBackEnd[hE].productCost;
                this._stockService.handleBackEnd[hE].productQty = postStockPridgeObj.productQty;
                this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB
              }
              if (theProductId == this._stockService.handleBackEnd[hE].productId &&
                this.theSndStockId == this._stockService.handleBackEnd[hE].stockId) {
                postStockPridgeObj.productId = theProductId;
                postStockPridgeObj.stockId = this.theSndStockId;
                postStockPridgeObj.stockProductId = this._stockService.handleBackEnd[hE].stockProductId;
                postStockPridgeObj.productQty = this._stockService.handleBackEnd[hE].productQty - parseInt(this.ivoiceItemesForEdit[v].Qty);
                postStockPridgeObj.productCost = this._stockService.handleBackEnd[hE].productCost;
                this._stockService.handleBackEnd[hE].productQty = postStockPridgeObj.productQty;
                this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB
              }
            }
          }
        }
      }
    }
  }

  makeTranceStockPremArry() {
    this.editStockQtys();
    this.getTheStockId();
    this._stockService.getHandleBackEnd().subscribe((data: HandleBackEnd[]) => {
      this._stockService.handleBackEnd = data;
    })
    let theProductId: number;
    this.checkAllArry = 1; // check after loop on the handleArry that the product not found
    this.theNote = $('#tranceInvoiceNote').val();
    if (this.theNote == undefined) {
      this.theNote = null;
    }

    this.theStockTransactionId = $('#stockTransactionId').val();
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
      stockId: this.theFstStockId,
      sndStockId: this.theSndStockId,
      customerId: 14,
      transactionType: 3,
      invoiceTotal: parseInt(this.invoiceTotal),
      date_time: this.date_time,
      notes: this.theNote,
    }

    // edit or add
    if (this.theStockTransactionId == '') {
      this._stockService.creatStockTransaction(stockTransaction).subscribe();
    } else {
      stockTransaction.stockTransactionId = this.theStockTransactionId;

      this._stockService.UpdateStockTransaction(stockTransaction).subscribe();
    }

    let BtnSubmitHtml = $('#newTranceInvoicetBtn').html(); // to check if invoice for update or add

    for (let i = 0; i < this.invoiceInpArry.length; i++) {

      if (this.invoiceInpArry[i].product !== undefined) {

        for (let s = 0; s < this._stockService.allProducts.length; s++) {
          if (this.invoiceInpArry[i].product == this._stockService.allProducts[s].productName) {
            theProductId = this._stockService.allProducts[s].productId;
            for (let h = 0; h < this._stockService.handleBackEnd.length; h++) {
              if (theProductId == this._stockService.handleBackEnd[h].productId &&
                this.theSndStockId == this._stockService.handleBackEnd[h].stockId) {
                postStockPridgeObj.productId = theProductId; // for edit and add
                postStockPridgeObj.stockId = this.theSndStockId; // for edit and add
                postStockPridgeObj.productCost = this._stockService.handleBackEnd[h].productCost;
                postStockPridgeObj.productQty = parseInt(this.invoiceInpArry[i].qty) + this._stockService.handleBackEnd[h].productQty;
                postStockPridgeObj.stockProductId = this._stockService.handleBackEnd[h].stockProductId;

                this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB

                // save stocktransactionDetails
                stockTransactionD.stockTransactionId = stockTransaction.stockTransactionId;
                stockTransactionD.productId = theProductId;
                stockTransactionD.price = parseInt(this.invoiceInpArry[i].price);
                stockTransactionD.Qty = parseInt(this.invoiceInpArry[i].qty);

                // edite Or Add
                if (BtnSubmitHtml == "تعديل الفاتورة") {
                  stockTransactionD.stockTransactionDetailsId = this.invoiceInpArry[i].stockTransactionDetailsId;
                  this._stockService.UpdateStockTransactionDetails(stockTransactionD).subscribe();
                  if (stockTransactionD.stockTransactionDetailsId == undefined) {
                    this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe(); // for invoice DB 
                  }
                  // if not productName to delete stocktransactionDetail
                  for (let d = 0; d < this.invoiceInpArry.length; d++) {
                    if (this.invoiceInpArry[d].stockTransactionDetailsId !== undefined && this.invoiceInpArry[d].product == '') {
                      this._stockService.deleteStockTransactionDetails(this.invoiceInpArry[d].stockTransactionDetailsId).subscribe();
                    }
                  }
                } else if (BtnSubmitHtml == "تسجيل") {
                  this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe(); // for invoice DB 
                }
                //this._service.clearForm();
                this.checkAllArry = 1; // reload

              }
              if (theProductId == this._stockService.handleBackEnd[h].productId &&
                this.theFstStockId == this._stockService.handleBackEnd[h].stockId) {
                postStockPridgeObj.productId = theProductId; // for edit and add
                postStockPridgeObj.stockId = this.theFstStockId; // for edit and add
                postStockPridgeObj.productCost = this._stockService.handleBackEnd[h].productCost;
                postStockPridgeObj.productQty = this._stockService.handleBackEnd[h].productQty - parseInt(this.invoiceInpArry[i].qty);
                postStockPridgeObj.stockProductId = this._stockService.handleBackEnd[h].stockProductId;
                this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB
                this.checkAllArry = 1; // reload
              }
            }

            this.checkAllArry++ // for handleBackEnd[]
            if (this.checkAllArry > this._stockService.handleBackEnd.length) {
              postStockPridgeObj.productId = theProductId;
              postStockPridgeObj.stockId = this.theSndStockId;
              postStockPridgeObj.productQty = parseInt(this.invoiceInpArry[i].qty);
              postStockPridgeObj.productCost = parseInt(this.invoiceInpArry[i].price);
              // save stocktransactionDetails
              stockTransactionD.stockTransactionId = stockTransaction.stockTransactionId;
              stockTransactionD.productId = theProductId;
              stockTransactionD.price = parseInt(this.invoiceInpArry[i].price);
              stockTransactionD.Qty = parseInt(this.invoiceInpArry[i].qty);
              this._stockService.postStockPridge(postStockPridgeObj).subscribe();
              this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB
              this.checkAllArry = 1; // reload
            }
          }
        }
      }
    }
  } // makeTranceStockPremArry

  tranceFrmStockPrem() {
    this.makeTranceStockPremArry();
    this.resetTranceinvoiceValu();
    location.reload();
  }

  testBtn() {
  }

  showDeleteTranceInvoice() {
    $('.fadeLayer').show(0);
    $('.askForDelete').addClass('animate');
  }

  deleteTranceInvoice() {
    $('.fadeLayer').hide();
    let stockTransId = $('#stockTransactionId').val();
    for (let i = 0; this.invoiceInpArry.length; i++) {
      if (this.invoiceInpArry[i].stockTransactionDetailsId == undefined) {
        break
      };
      if (this.invoiceInpArry[i].stockTransactionDetailsId != undefined) {
        this._stockService.deleteStockTransactionDetails(this.invoiceInpArry[i].stockTransactionDetailsId).subscribe();
      };
    };
    this._stockService.deleteStockTransaction(stockTransId).subscribe();
    this.editStockQtys();
  }

} // End