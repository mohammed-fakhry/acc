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
import { ProductsClass } from '../../products-class';

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

  constructor(public _stockService: StocksService, public formBuilder: FormBuilder,
    public _service: ServicesService, public _custService: CustomerService, public _theStockComp: TheStocksComponent) { }

  ngOnInit() {

    $('#hideFadeLayerMP').click(function () {
      $('.fadeLayer').fadeOut('fast');
      $('.askForDelete').fadeOut('fast').removeClass('animate')
    })

  }

  getBackendData() {

    this._stockService.getStockTransactionList().subscribe((data: StockTransaction[]) => {
      this._stockService.stockTransactionArr = data;
    });
    this._stockService.getStockTransactionDetailsList().subscribe((data: StockTransactionD[]) => {
      this._stockService.stockTransactionDetailsArr = data;
    });

  };

  addFilds() {
    this.deleteInvTranceBtnDisabled = true;
    this.invoiceInp = new InvoiceInp();
    this.invoiceInp.total = 0;
    this.invoiceInpArry.push(this.invoiceInp);
  };

  deleteFilds(i) {
    let BtnSubmitHtml = $('#newTranceInvoicetBtn').html();

    if (BtnSubmitHtml = 'تعديل الاذن') {

      if (this.invoiceInpArry[i].stockTransactionDetailsId != undefined) {
        //console.log(this.invoiceInpArry[i].stockTransactionDetailsId);
        //$('#')
      } else {
        //console.log('undifined - test')
      };

    };
    //this.invoiceInpArry.splice(i,1)
  }

  theFstStockId: number;
  theSndStockId: number;

  getTheStockId() {

    this.deleteInvTranceBtnDisabled = true;
    // get the stockId
    let theStock = $('#fstStockNameForTrance').val();
    let sndStock = $('#sndStockNameForTrance').val();

    if (theStock == 'اذن اضافة') {
      this.theFstStockId = 1
    } else {
      let stockInfo = this._stockService.stocks.find(
        stock => stock.stockName == theStock
      );
      this.theFstStockId = stockInfo.stockId;
    };

    if (sndStock == 'اذن خصم') {
      this.theSndStockId = 1
    } else {
      let sndStockInfo = this._stockService.stocks.find(
        stock => stock.stockName == sndStock
      );
      if (sndStockInfo != undefined) {
        this.theSndStockId = sndStockInfo.stockId;
      }
      
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
    let hide1 = '#addFildsTrance'
    let hide2 = '#callTranceInvoice'
    let hide3 = '#newTranceInvoicetBtn'
    this._service.printThis(show, hide1, hide2, hide3)
    $('#trancePrimTable').css(
      { 'height': '100%' }
    );
    $('.closeBtn').show();
    $('.form-control').attr({ 'disabled': true })
  };

  openwindowPrint() {
    $('#headerTranceInv').css('width', '100%')
    $('.closeBtn').hide();
    window.print();
    location.reload();
  };

  reloadLoc() {
    location.reload();
  };

  theStockProd: any;
  theStockProds: any;
  inputDisabled: boolean = true;

  makeTheStockProds() {

    this.deleteInvTranceBtnDisabled = true;
    this._theStockComp.testBackend();
    let theStock = $('#fstStockNameForTrance').val();
    this.theStockProd = {};
    this.theStockProds = [];

    let stockInfo = this._stockService.makeStockArry.find(
      stock => stock.stockName == theStock
    );
    
    if (stockInfo != undefined) {
      this.theStockProds = stockInfo.stockProducts;
    };
    
    this.inputDisabled = false;

  };

  qtyIsOkArry: any[];

  isAddQtyVaild() {

    let fstStockNameForTrance = $('#fstStockNameForTrance').val();

    if (fstStockNameForTrance != 'اذن اضافة') {

      for (let i = 0; i < this.invoiceInpArry.length; i++) {
        if (this.invoiceInpArry[i].product != undefined) {

          let theProductQtyInfo = this.theStockProds.find(
            product => product.productName == this.invoiceInpArry[i].product
          );

          if (theProductQtyInfo != undefined) {
            if (this.invoiceInpArry[i].product == theProductQtyInfo.productName && this.invoiceInpArry[i].qty > theProductQtyInfo.productQty) {
              if (this.qtyIsOkArry == undefined) {
                this.invoiceInpArry[i].Qtyinvaild = true;
                this.invoiceInpArry[i].qtyMsg = `الرصيد المتاح ( ${theProductQtyInfo.productQty} )`
              } else if (this.qtyIsOkArry[i] == null) {
                this.invoiceInpArry[i].Qtyinvaild = true;
                this.invoiceInpArry[i].qtyMsg = `الرصيد المتاح ( ${theProductQtyInfo.productQty} )`
              } else if (this.invoiceInpArry[i].qty <= this.qtyIsOkArry[i]) {
                this.invoiceInpArry[i].Qtyinvaild = false;
              };

            } else if (this.invoiceInpArry[i].product == theProductQtyInfo.productName
              && this.invoiceInpArry[i].qty <= theProductQtyInfo.productQty
              && this.invoiceInpArry[i].inpVaild == false) {
              this.invoiceInpArry[i].Qtyinvaild = false;
            };

          } else {
            this.invoiceInpArry[i].Qtyinvaild = true;
            this.invoiceInpArry[i].qtyMsg = `لا يوجد رصيد لهذا الصنف`
          };
        };
      };

      for (let i = 0; i < this.invoiceInpArry.length; i++) {
        if (this.invoiceInpArry[i].Qtyinvaild == true) {
          this.isAddInvVaild = true;
          break
        } else {
          this.isAddInvVaild = false;
        };
      };

    };

  }; // isAddQtyVaild

  fstVaildMsg: string;
  sndVaildMsg: string;

  stockChanged() {

    this.sndStockNameVaild = false;
    this.fstStockNameVaild = false;

    let fstStockNameForTrance = $('#fstStockNameForTrance').val();
    let sndStockNameForTrance = $('#sndStockNameForTrance').val();

    this.getTheStockId();

    if (fstStockNameForTrance == 'اذن اضافة') {
      this.fstStockNameVaild = false;

      if (fstStockNameForTrance == 'اذن اضافة' && sndStockNameForTrance == 'اذن خصم') {
        this.sndStockNameVaild = true;
        this.fstStockNameVaild = true;
        this.fstVaildMsg = 'لا يمكن تنفيذ هذا الامر'
        this.sndVaildMsg = 'لا يمكن تنفيذ هذا الامر'
      } else {
        this.sndStockNameVaild = false;
        this.fstStockNameVaild = false;
      }

    } else {

      this.makeTheStockProds();

      if (this.theFstStockId == this.theSndStockId) {
        this.sndStockNameVaild = true;
        this.fstStockNameVaild = true;
        this.fstVaildMsg = 'لا يمكن تكرار نفس المخزن'
        this.sndVaildMsg = 'لا يمكن تكرار نفس المخزن'
      } else {
        this.sndStockNameVaild = false;
        this.fstStockNameVaild = false;
      }
    }

    if (this.theFstStockId != undefined && this.theSndStockId != undefined
      && this.theFstStockId != this.theSndStockId) {
      this.inptDisabled = false;
    } else {
      this.inptDisabled = true;
    };

    if (fstStockNameForTrance.includes('سيف')) {
      $('#fstStockNameForTrance').addClass('bg-info text-white')
    } else {
      $('#fstStockNameForTrance').removeClass('bg-info text-white')
    }

    if (sndStockNameForTrance != null && sndStockNameForTrance != '' ) {
      if (sndStockNameForTrance.includes('سيف')) {
        $('#sndStockNameForTrance').addClass('bg-info text-white')
      } else {
        $('#sndStockNameForTrance').removeClass('bg-info text-white')
      }
    }
  };

  productNameIdArr: any[];

  isTranceNameVaild() {

    let index: number;
    let found: boolean;

    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      let productinpt = $(`#product${i}`).val();
      if (this.productArr.includes(productinpt) || productinpt == '') {
        this.invoiceInpArry[i].inpVaild = false;
      } else {
        this.invoiceInpArry[i].inpVaild = true;
        this.invoiceInpArry[i].productVaildMsg = 'خطأ فى اسم الصنف'
      };
      if (this.invoiceInpArry[i].Qtyinvaild == true) {
        this.invoiceInpArry[i].qty = null;
        this.invoiceInpArry[i].price = null;
        this.invoiceInpArry[i].Qtyinvaild = false;
      };

      if (this.invoiceInpArry[i].product != undefined) {

        let productInfo = this._stockService.allProducts.find(product => product.productName == this.invoiceInpArry[i].product);

        let handleInfo = this._stockService.handleBackEnd.find(item => {
          item.productId == productInfo.productId && item.stockId == this.theFstStockId
        });
  
        if (handleInfo != undefined) {
          this.invoiceInpArry[i].price = handleInfo.productCost;
        };

      };

      // if productName dublicated
      let valueArr = this.invoiceInpArry.map(item => item.product);

      let filtert = valueArr.filter(product => product != undefined);

      let isDublicate = filtert.some((item, indx) => {
        index = indx
        return valueArr.indexOf(item) != indx
      });

      if (isDublicate) {
        found = true
        break
      };

    };

    if (index != null) {
      if (found == true) {
        this.invoiceInpArry[index].inpVaild = true;
        this.invoiceInpArry[index].productVaildMsg = 'لا يمكن تكرار هذا الصنف'
      };
    };

    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      if (this.invoiceInpArry[i].inpVaild == true) {
        this.isAddInvVaild = true;
        break
      } else {
        this.isAddInvVaild = false;
      };
    };

  };

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
      };
    };

    let total: any = this.sumArry(this.totalInvoice)
    this.invoiceTotal = total;
  };

  resetTranceinvoiceValu() {
    this._service.clearForm();
    //$('#invoiceTotal').html(`اجمالى الاذن : 0`);
    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      this.invoiceInpArry[i].total = 0;
    };
  };

  invNumTrance: number;

  showNewTranceInvoice() {

    this._theStockComp.testBackend();
    this.productArr = [];
    this.productNameIdArr = [];
    this.invoiceTotal = "0"

    this.productArr = this._stockService.allProducts.map(product => product.productName);
    this.productNameIdArr = this._stockService.allProducts.map(product => { product.productId, product.productName });

    let callInvoiceBtnVal: string = $('#callTranceInvoiceBtn').html();

    this.invoiceInpArry = [];
    this.ivoiceItemesForEdit = [];

    // to add 5 fildes
    for (let i = 0; i < 10; i++) {

      this.invoiceInp = new InvoiceInp()

      this.invoiceInp.total = 0;
      this.invoiceInp.inpVaild = false;
      this.invoiceInp.Qtyinvaild = false;
      this.invoiceInp.price = null;

      this.invoiceInpArry.push(this.invoiceInp);
    };

    if (callInvoiceBtnVal == "اذن جديد") {

      let currentDateNow = Date.now() //new Date()
      let currentDate = new Date(currentDateNow)

      this._service.makeTime_date(currentDate);

      $('#invNumTrance').hide();
      $('#callTranceInvoice').hide();
      $('#tranceInvoiceForm').show();
      $('#newTranceInvoicetBtn').html("تسجيل");
      $('#tranceStockTransactionId').val('');
      $('#deleteTranceInvoice').hide();

      this._service.clearForm();
      this.resetTranceinvoiceValu();

      this.inptDisabled = true;
      this.isAddInvVaild = true;

    } else if (callInvoiceBtnVal == "بحث") {

      // add fildes if the inputArry < invoiceArry
      $('#newTranceInvoicetBtn').html("تعديل الاذن");
      this.inptDisabled = false;
      $('#invNumTrance').show();

      $('#deleteTranceInvoice').show();
      this.deleteInvTranceBtnDisabled = false;

      let invoiceInfo = this._stockService.makeInvoiceArry.find(
        invoice => invoice.invoiceSearchVal == this.searchInVal
      );

      if (invoiceInfo.invoiceDetails.length > this.invoiceInpArry.length) {
        let countDif: number = invoiceInfo.invoiceDetails.length - this.invoiceInpArry.length;
        for (let c = 0; c < countDif; c++) {
          this.addFilds();
        };
      };

      this.resetTranceinvoiceValu();

      let stockInfo = this._stockService.stocks.find(stock => stock.stockId == invoiceInfo.stockId)
      let secStockInfo = this._stockService.stocks.find(stock => stock.stockId == invoiceInfo.sndStockId)

      if (invoiceInfo.stockId == 1) {
        $('#fstStockNameForTrance').val('اذن اضافة');
      } else {
        $('#fstStockNameForTrance').val(stockInfo.stockName);
      };

      if (invoiceInfo.sndStockId == 1) {
        $('#sndStockNameForTrance').val('اذن خصم');
      } else {
        $('#sndStockNameForTrance').val(secStockInfo.stockName);
      };

      $('#tranceStockTransactionId').val(invoiceInfo.stockTransactionId);
      $('#tranceInvoiceNote').val(invoiceInfo.notes);

      this.invNumTrance = invoiceInfo.invNumber;
      this._service.date_time = invoiceInfo.date_time;
      
      for (let d = 0; d < invoiceInfo.invoiceDetails.length; d++) {
        this.invoiceInpArry[d].stockTransactionDetailsId = invoiceInfo.invoiceDetails[d].stockTransactionDetailsId;
        this.invoiceInpArry[d].product = invoiceInfo.invoiceDetails[d].productName;
        this.invoiceInpArry[d].price = invoiceInfo.invoiceDetails[d].price;
        this.invoiceInpArry[d].qty = invoiceInfo.invoiceDetails[d].Qty;
      };

      this.ivoiceItemesForEdit = invoiceInfo.invoiceDetails;
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
        };
        //this.invoiceInpArry[v].Qtyinvaild = false;
      }

      this.isAddQtyVaild();

      $('#callTranceInvoice').hide();
      $('#tranceInvoiceForm').show();

      this.deleteInvTranceBtnDisabled = true;
    };
  }; // showNewTranceInvoice

  changTranceInvoiceBtn() {

    this.searchInVal = $('#invoiceTranceSearch').val();

    if (this.searchInVal == '') {
      $('#callTranceInvoiceBtn').html("اذن جديد");
    } else {
      $('#callTranceInvoiceBtn').html("بحث");
    };

  };

  checkAllArry: number;
  checkAllArrySnd: number;
  theNote: string;
  theStockTransactionId: string;

  getProductInfo: ProductsClass;
  findProduct(productName: string) {
    let ProductInfo = this._stockService.allProducts.find(
      product => product.productName == productName
    );
    return ProductInfo
  };

  getHandleInfo: HandleBackEnd;
  findHandle(theProductId: number, stockId: number) {
    let HandleInfo = this._stockService.handleBackEnd.find( // for first stock
      handleInfo => handleInfo.productId == theProductId &&
        handleInfo.stockId == stockId
    );
    return HandleInfo
  };

  editStockQtys() {

    this._stockService.getHandleBackEnd().subscribe((data: HandleBackEnd[]) => {
      this._stockService.handleBackEnd = data;
    });

    //this.getTheStockId();
    let BtnSubmitHtml = $('#newTranceInvoicetBtn').html(); // to check if invoice for update or add
    let theProductId: number;

    let fstStockNameForTrance = $('#fstStockNameForTrance').val();
    let sndStockNameForTrance = $('#sndStockNameForTrance').val();

    if (BtnSubmitHtml == "تعديل الاذن") {

      for (let v = 0; v < this.ivoiceItemesForEdit.length; v++) {

        this.getProductInfo = this.findProduct(this.ivoiceItemesForEdit[v].productName);

        theProductId = this.getProductInfo.productId;

        let postStockPridgeObj = new StockPridge();

        // for first stock
        if (fstStockNameForTrance != 'اذن اضافة') {
          this.getHandleInfo = this.findHandle(theProductId, this.ivoiceItemesForEdit[v].stockId)
          let indx = this._stockService.handleBackEnd.findIndex(
            i => i.stockProductId === this.getHandleInfo.stockProductId
          );

          postStockPridgeObj = {
            productId: theProductId,
            stockId: this.ivoiceItemesForEdit[v].stockId,
            stockProductId: this.getHandleInfo.stockProductId,
            productQty: this.getHandleInfo.productQty + parseInt(this.ivoiceItemesForEdit[v].Qty),
            productPrice: this.getHandleInfo.productPrice,
            productCost: this.getHandleInfo.productCost
          };

          this._stockService.handleBackEnd[indx].productQty = postStockPridgeObj.productQty;
          this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB
        };

        // for snd stock
        if (sndStockNameForTrance != 'اذن خصم') {

          this.getHandleInfo = this.findHandle(theProductId, this.ivoiceItemesForEdit[v].sndStockId);

          let sndIndx = this._stockService.handleBackEnd.findIndex(
            i => i.stockProductId === this.getHandleInfo.stockProductId
          );

          postStockPridgeObj = {
            productId: theProductId,
            stockId: this.ivoiceItemesForEdit[v].stockId,
            stockProductId: this.getHandleInfo.stockProductId,
            productQty: this.getHandleInfo.productQty - parseInt(this.ivoiceItemesForEdit[v].Qty),
            productPrice: this.getHandleInfo.productPrice,
            productCost: this.getHandleInfo.productCost
          };

          this._stockService.handleBackEnd[sndIndx].productQty = postStockPridgeObj.productQty;
          this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB
        };
      };
    };
  };

  makeTranceStockPremArry() {

    this.editStockQtys();
    this.getTheStockId();

    let theProductId: number;
    this.checkAllArry = 1; // check after loop on the handleArry that the product not found
    this.checkAllArrySnd = 1;
    this.theNote = $('#tranceInvoiceNote').val();
    if (this.theNote == undefined) {
      this.theNote = null;
    };

    this.theStockTransactionId = $('#tranceStockTransactionId').val();

    // mainTable
    let stockTransaction: StockTransaction = {
      stockTransactionId: Date.now().toString(),
      invNumber: this._theStockComp.newTranceInvNumber,
      stockId: this.theFstStockId,
      sndStockId: this.theSndStockId,
      customerId: 1,
      transactionType: 3,
      invoiceTotal: parseInt(this.invoiceTotal),
      date_time: this._service.date_time,
      notes: this.theNote,
    };

    // edit or add
    if (this.theStockTransactionId == '') {
      this._stockService.creatStockTransaction(stockTransaction).subscribe();
    } else {
      stockTransaction.stockTransactionId = this.theStockTransactionId;
      this._stockService.UpdateStockTransaction(stockTransaction).subscribe();
    };

    let BtnSubmitHtml = $('#newTranceInvoicetBtn').html(); // to check if invoice for update or add

    for (let i = 0; i < this.invoiceInpArry.length; i++) {

      let postStockPridgeObj = new StockPridge();

      let stockTransactionD = new StockTransactionD();

      if (this.invoiceInpArry[i].product != undefined) {

        this.getProductInfo = this.findProduct(this.invoiceInpArry[i].product);
        theProductId = this.getProductInfo.productId;

        this.getHandleInfo = this.findHandle(theProductId, this.theSndStockId);

        if (this.getHandleInfo != undefined) {

          postStockPridgeObj = {
            productId: theProductId,
            stockId: this.theSndStockId,
            productCost: this.getHandleInfo.productCost,
            productPrice: this.getHandleInfo.productPrice,
            productQty: parseInt(this.invoiceInpArry[i].qty) + this.getHandleInfo.productQty,
            stockProductId: this.getHandleInfo.stockProductId
          };

          this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB

          stockTransactionD = {
            stockTransactionDetailsId: null,
            stockTransactionId: stockTransaction.stockTransactionId,
            productId: theProductId,
            price: parseFloat(this.invoiceInpArry[i].price),
            Qty: parseInt(this.invoiceInpArry[i].qty),
          };

          // edite Or Add
          if (BtnSubmitHtml == "تعديل الاذن") {
            stockTransactionD.stockTransactionDetailsId = this.invoiceInpArry[i].stockTransactionDetailsId;

            this._stockService.UpdateStockTransactionDetails(stockTransactionD).subscribe();

            if (stockTransactionD.stockTransactionDetailsId == undefined) {
              this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe(); // for invoice DB
            }

            // if not productName to delete stocktransactionDetail
            for (let d = 0; d < this.invoiceInpArry.length; d++) {

              if (this.invoiceInpArry[d].stockTransactionDetailsId != undefined && this.invoiceInpArry[d].product == '') {
                this._stockService.deleteStockTransactionDetails(this.invoiceInpArry[d].stockTransactionDetailsId).subscribe();
              };

            };

          } else if (BtnSubmitHtml == "تسجيل") {
            this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe(); // for invoice DB
          };

          let HandleInfo = this.findHandle(theProductId, this.theFstStockId); // for the first stock (minQtys)

          if (HandleInfo != undefined) {

            postStockPridgeObj = {
              stockProductId: HandleInfo.stockProductId,
              productId: theProductId,
              stockId: this.theFstStockId,
              productCost: HandleInfo.productCost,
              productQty: HandleInfo.productQty - parseInt(this.invoiceInpArry[i].qty),
              productPrice: HandleInfo.productPrice
            };

            this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB
          };

        } else {

          postStockPridgeObj = {
            stockProductId: null,
            productId: theProductId,
            stockId: this.theSndStockId,
            productQty: parseInt(this.invoiceInpArry[i].qty),
            productCost: parseInt(this.invoiceInpArry[i].price),
            productPrice: 0,
          };

          // save stocktransactionDetails
          stockTransactionD = {
            stockTransactionDetailsId: null,
            stockTransactionId: stockTransaction.stockTransactionId,
            productId: theProductId,
            price: parseFloat(this.invoiceInpArry[i].price),
            Qty: parseInt(this.invoiceInpArry[i].qty),
          };

          this._stockService.postStockPridge(postStockPridgeObj).subscribe();

          this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB
        };
      };
    };
  }; // makeTranceStockPremArry


  showInvoiceDone() {
    this._theStockComp.ngOnInit();
    this._theStockComp.showFade_newInvoice('fade_showTranceStockPrem');
  };

  tranceFrmStockPrem() {
    this.makeTranceStockPremArry();
    this.showInvoiceDone();
  };

  testBtn() {
  };

  showDeleteTranceInvoice() {
    $('.fadeLayer').show(0);
    $('.askForDelete').addClass('animate');
  };

  deleteTranceInvoice() {
    $('.fadeLayer').hide();
    let stockTransId = $('#tranceStockTransactionId').val();

    for (let i = 0; this.invoiceInpArry.length; i++) {
      if (this.invoiceInpArry[i].stockTransactionDetailsId == undefined) {
        break
      };
      if (this.invoiceInpArry[i].stockTransactionDetailsId != undefined) {
        this._stockService.deleteStockTransactionDetails(this.invoiceInpArry[i].stockTransactionDetailsId).subscribe();
      };
    };

    // backEnd
    //this._stockService.deleteStockTransaction(stockTransId).subscribe();

    //this.editStockQtys();
    this._theStockComp.showStocksEnquiry();
  };

}; // End\
