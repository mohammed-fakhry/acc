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

  invoiceData = new FormGroup({
    theStock: new FormControl(''),
    theCustomer: new FormControl(''),
    theNote: new FormControl(''),
  });

  deleteInvBtnDisabled: boolean;

  date_time: string;

  constructor(public _stockService: StocksService, public formBuilder: FormBuilder,
    public _service: ServicesService, public _custService: CustomerService, public _theStockComp: TheStocksComponent) { }

  ngOnInit() {

    this.addToStockPremData = this.formBuilder.group({
      stockName: [''],
    });

    this.getBackendData();

    $('#hideFadeLayerAP').click(function () {
      $('#fadeLayerAP').fadeOut('fast');
      $('.askForDelete').fadeOut('fast').removeClass('animate')
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

  isAddNameVaild() { // inputValidation
    this.deleteInvBtnDisabled = true;
    let found: boolean;
    let index: number;

    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      let productinpt = $(`#product${i}`).val();
      if (this.productArr.includes(productinpt) || productinpt == '') {
        this.invoiceInpArry[i].inpVaild = false;
      } else {
        this.invoiceInpArry[i].inpVaild = true;
        this.invoiceInpArry[i].productVaildMsg = 'خطأ فى اسم الصنف'
      };

      //map[this.invoiceInpArry[i]] = true;
      let valueArr = this.invoiceInpArry.map((item) => { return item.product });
      let filtert = valueArr.filter((product) => {
        return product != undefined
      })
      let isDublicate = filtert.some((item, indx) => {
        //console.log(indx + ' : indx')
        index = indx
        return valueArr.indexOf(item) != indx
      })
      if (isDublicate) {
        found = true
        break
      }
      //console.log(isDublicate)
    }

    //console.log(index)
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

      if (this.invoiceInpArry[i].product == '') {
        if (this.invoiceInpArry[i].price > 0 || this.invoiceInpArry[i].qty > 0) {
          this.invoiceInpArry[i].price = null;
          this.invoiceInpArry[i].qty = null;
        };
      };
    };

  } // isAddNameVaild

  stockNameVaild: boolean;
  inptDisabled: boolean = true;

  stockChanged() {
    this.deleteInvBtnDisabled = true;
    if ($('#stockNameForAdd').val() == '-') {
      this.stockNameVaild = true;
      this.inptDisabled = true;
    } else {
      this.stockNameVaild = false;
      this.inptDisabled = false;
    }
  };

  customerVaild: boolean;
  custVaildMsg: string;

  isCustomerVaild() {

    let customerNameForAddVal = $('#customerNameForAdd').val()
    if (this.customers.length == 0) {
      this.customerVaild = true
      this.custVaildMsg = "لا يوجد هذا الاسم"
    } else {
      for (let i = 0; i < this.customers.length; i++) {
        if (customerNameForAddVal == this.customers[i].customerName) {
          this.customerVaild = false;
          break
        } else {
          this.customerVaild = true;
          this.custVaildMsg = "لا يوجد هذا الاسم"
          //console.log('false')
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

    //console.log(customerNameForAddVal)
  };

  invoiceTotal: string = '0';
  calcTotals() {
    this.deleteInvBtnDisabled = true;
    this.inptDisabled = false;
    this.totalInvoice = [];
    this.invoiceTotal = '0';

    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      // Qty change
      if (this.invoiceInpArry[i].qty == null || this.invoiceInpArry[i].price == null) {
        this.invoiceInpArry[i].total = 0;
        //this.totalInvoice.push(this.invoiceInpArry[i].total)
      } else {
        this.invoiceInpArry[i].total = this.invoiceInpArry[i].qty * this.invoiceInpArry[i].price;
        //this.totalInvoice.push(this.invoiceInpArry[i].total)
      };
    };
    this.totalInvoice = this.invoiceInpArry.map(inv => inv.total);

    let total: any = this.sumArry(this.totalInvoice)
    this.invoiceTotal = total;
    //$('#invoiceTotal').html(`اجمالى الفاتورة : ${total}`)
  };

  theStockId: number;
  theCustomerId: number;

  getTheCustomerId() {
    let theCustomer = $('#customerNameForAdd').val();
    let customerInfo = this.customers.find(cust => cust.customerName == theCustomer)
    this.theCustomerId = customerInfo.customerId;
    /* for (let i = 0; i < this.customers.length; i++) {
      if (theCustomer == this.customers[i].customerName) {
        this.theCustomerId = this.customers[i].customerId;
        break
      };
    }; */
  };

  getTheStockId() {
    // get the stockId
    let theStock = $('#stockNameForAdd').val();
    for (let i = 0; i < this._stockService.stocks.length; i++) {
      if (theStock == this._stockService.stocks[i].stockName) {
        this.theStockId = this._stockService.stocks[i].stockId;
        break
      };
    };
  };

  resetAddinvoiceValu() {
    this._service.clearForm();
    //$('#invoiceTotal').html(`اجمالى الفاتورة : 0`);
    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      this.invoiceInpArry[i].total = 0;
    };
  };

  checkAllArry: number;

  searchInVal: string = '';
  // changAddInvoiceBtn
  changAddInvoiceBtn() {
    this.searchInVal = $('#invoiceSearch').val();
    if (this.searchInVal == '') {
      $('#callInvoiceBtn').html("فاتورة جديدة");
    } else {
      $('#callInvoiceBtn').html("بحث");
    }
  };

  theNote: string;
  theStockTransactionId: string;

  ivoiceItemesForEdit: any[];

  editStockQtysPre() {

    this._stockService.getHandleBackEnd().subscribe((data: HandleBackEnd[]) => {
      this._stockService.handleBackEnd = data;
    });

    //this.getTheStockId();
    let BtnSubmitHtml = $('#addNewInvoicetBtn').html(); // to check if invoice for update or add
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

    if (BtnSubmitHtml == "تعديل الفاتورة") {

      this.theCustomerInfo = this.getCustomerInfo(this.ivoiceItemesForEdit[0].customerId);

      //console.log(this.theCustomerInfo.customerRemain + ' : befor')
      this.theCustomerInfo.customerRemain = this.theCustomerInfo.customerRemain + this.ivoiceItemesForEdit[0].invoiceTotal;
      this._custService.updateCustomerSer(this.theCustomerInfo).subscribe();
      //console.log(this.theCustomerInfo.customerRemain + ' : after')

      for (let v = 0; v < this.ivoiceItemesForEdit.length; v++) {

        let getProductInfo = this._stockService.allProducts.find(
          product => product.productName === this.ivoiceItemesForEdit[v].productName);

        theProductId = getProductInfo.productId;

        let getHandleBackEndInfo = this._stockService.handleBackEnd.find(handleInfo =>
          handleInfo.productId === theProductId && handleInfo.stockId === this.ivoiceItemesForEdit[v].stockId);

        let indx = this._stockService.handleBackEnd.findIndex(
          i => i.stockProductId === getHandleBackEndInfo.stockProductId
        );
        //console.log(getHandleBackEndInfo)
        //console.log(this._stockService.handleBackEnd[indx])

        if (getHandleBackEndInfo != undefined) {
          postStockPridgeObj.productId = theProductId; // for edit and add
          postStockPridgeObj.stockId = this.ivoiceItemesForEdit[v].stockId; // for edit and add

          allProductQty = getHandleBackEndInfo.productQty - parseInt(this.ivoiceItemesForEdit[v].Qty);
          productTotalsPriceAvr = (getHandleBackEndInfo.productCost * getHandleBackEndInfo.productQty)
            - (parseInt(this.ivoiceItemesForEdit[v].price) * parseInt(this.ivoiceItemesForEdit[v].Qty));
          if (allProductQty == 0) {
            postStockPridgeObj.productCost = getHandleBackEndInfo.productCost;
          } else {
            postStockPridgeObj.productCost = Math.floor(productTotalsPriceAvr / allProductQty) // price avarage
          };
          postStockPridgeObj.stockProductId = getHandleBackEndInfo.stockProductId;
          postStockPridgeObj.productQty = getHandleBackEndInfo.productQty - parseInt(this.ivoiceItemesForEdit[v].Qty);

          this._stockService.handleBackEnd[indx].productQty = postStockPridgeObj.productQty;
          this._stockService.handleBackEnd[indx].productCost = postStockPridgeObj.productCost;

          this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB
        };
      };
    };
  }; // editStockQtys

  editStockQtys() {

    this._stockService.getHandleBackEnd().subscribe((data: HandleBackEnd[]) => {
      this._stockService.handleBackEnd = data;
    });

    //this.getTheStockId();
    let BtnSubmitHtml = $('#addNewInvoicetBtn').html(); // to check if invoice for update or add
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

    if (BtnSubmitHtml == "تعديل الفاتورة") {

      this.theCustomerInfo = this.getCustomerInfo(this.ivoiceItemesForEdit[0].customerId);

      //console.log(this.theCustomerInfo.customerRemain + ' : befor')
      this.theCustomerInfo.customerRemain = this.theCustomerInfo.customerRemain + this.ivoiceItemesForEdit[0].invoiceTotal;
      this._custService.updateCustomerSer(this.theCustomerInfo).subscribe();
      //console.log(this.theCustomerInfo.customerRemain + ' : after')

      for (let v = 0; v < this.ivoiceItemesForEdit.length; v++) {

        let getProductInfo = this._stockService.allProducts.find(
          product => product.productName === this.ivoiceItemesForEdit[v].productName);

        theProductId = getProductInfo.productId;

        let getHandleBackEndInfo = this._stockService.handleBackEnd.find(handleInfo =>
          handleInfo.productId === theProductId && handleInfo.stockId === this.ivoiceItemesForEdit[v].stockId);

        let indx = this._stockService.handleBackEnd.findIndex(
          i => i.stockProductId === getHandleBackEndInfo.stockProductId
        );
        //console.log(getHandleBackEndInfo)
        //console.log(this._stockService.handleBackEnd[indx])

        if (getHandleBackEndInfo != undefined) {
          postStockPridgeObj.productId = theProductId; // for edit and add
          postStockPridgeObj.stockId = this.ivoiceItemesForEdit[v].stockId; // for edit and add

          allProductQty = getHandleBackEndInfo.productQty - parseInt(this.ivoiceItemesForEdit[v].Qty);
          productTotalsPriceAvr = (getHandleBackEndInfo.productCost * getHandleBackEndInfo.productQty)
            - (parseInt(this.ivoiceItemesForEdit[v].price) * parseInt(this.ivoiceItemesForEdit[v].Qty));
          if (allProductQty == 0) {
            postStockPridgeObj.productCost = getHandleBackEndInfo.productCost;
          } else {
            postStockPridgeObj.productCost = Math.floor(productTotalsPriceAvr / allProductQty) // price avarage
          };
          postStockPridgeObj.stockProductId = getHandleBackEndInfo.stockProductId;
          postStockPridgeObj.productQty = getHandleBackEndInfo.productQty - parseInt(this.ivoiceItemesForEdit[v].Qty);

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
      //console.log(this.theCustomerInfo)
    } else {
      //console.log(stockTransaction)
      console.log(this.theStockTransactionId + ' : theStockTransactionId')
      stockTransaction.stockTransactionId = this.theStockTransactionId;
      this._stockService.UpdateStockTransaction(stockTransaction).subscribe();

      this.theCustomerInfo.customerRemain = this.theCustomerInfo.customerRemain - parseInt(this.invoiceTotal);

      //console.log(this.theCustomerInfo.customerRemain + ' : new')
      this._custService.updateCustomerSer(this.theCustomerInfo).subscribe();
    };

    let BtnSubmitHtml = $('#addNewInvoicetBtn').html(); // to check if invoice for update or add
    let allProductQty: number;
    let productTotalsPriceAvr: number;

    for (let i = 0; i < this.invoiceInpArry.length; i++) {

      let postStockPridgeObj = new StockPridge();
      let stockTransactionD = new StockTransactionD();

      if (this.invoiceInpArry[i].product != undefined) {

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

          console.log(stockTransactionD)
          console.log('first')
          this.checkAllArry = 1; // reload
          //console.log('firstInvoice')
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
          //console.log(postStockPridgeObj)

          // save stocktransactionDetails
          stockTransactionD = {
            stockTransactionDetailsId: null,
            stockTransactionId: stockTransaction.stockTransactionId,
            productId: theProductId,
            price: parseFloat(this.invoiceInpArry[i].price),
            Qty: parseInt(this.invoiceInpArry[i].qty),
          };

          // edite Or Add
          if (BtnSubmitHtml == "تعديل الفاتورة") {
            stockTransactionD.stockTransactionDetailsId = this.invoiceInpArry[i].stockTransactionDetailsId;
            this._stockService.UpdateStockTransactionDetails(stockTransactionD).subscribe();
            console.log(stockTransactionD)
            console.log('secound')
            if (stockTransactionD.stockTransactionDetailsId == undefined) {
              this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe(); // for invoice DB
              console.log(stockTransactionD)
              console.log('third')
            }
            // if not productName to delete stocktransactionDetail
            for (let d = 0; d < this.invoiceInpArry.length; d++) {
              if (this.invoiceInpArry[d].stockTransactionDetailsId !== undefined && this.invoiceInpArry[d].product == '') {
                this._stockService.deleteStockTransactionDetails(this.invoiceInpArry[d].stockTransactionDetailsId).subscribe();
                console.log(stockTransactionD)
                console.log('fourth')
              }
            }
          } else if (BtnSubmitHtml == "تسجيل") {
            this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe(); // for invoice DB
            console.log(stockTransactionD)
            console.log('fifth')
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
          console.log(stockTransactionD);
          console.log('six');
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
      //console.log(this.theCustomerInfo)
    } else {
      //console.log(stockTransaction)
      console.log(this.theStockTransactionId + ' : theStockTransactionId')
      stockTransaction.stockTransactionId = this.theStockTransactionId;
      this._stockService.UpdateStockTransaction(stockTransaction).subscribe();

      this.theCustomerInfo.customerRemain = this.theCustomerInfo.customerRemain - parseInt(this.invoiceTotal);

      //console.log(this.theCustomerInfo.customerRemain + ' : new')
      this._custService.updateCustomerSer(this.theCustomerInfo).subscribe();
    };

    let BtnSubmitHtml = $('#addNewInvoicetBtn').html(); // to check if invoice for update or add
    let allProductQty: number;
    let productTotalsPriceAvr: number;

    for (let i = 0; i < this.invoiceInpArry.length; i++) {

      let postStockPridgeObj = new StockPridge();
      let stockTransactionD = new StockTransactionD();

      if (this.invoiceInpArry[i].product != undefined) {

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

          console.log(stockTransactionD)
          console.log('first')
          this.checkAllArry = 1; // reload
          //console.log('firstInvoice')
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
          //console.log(postStockPridgeObj)

          // save stocktransactionDetails
          stockTransactionD = {
            stockTransactionDetailsId: null,
            stockTransactionId: stockTransaction.stockTransactionId,
            productId: theProductId,
            price: parseInt(this.invoiceInpArry[i].price),
            Qty: parseInt(this.invoiceInpArry[i].qty),
          };

          // edite Or Add
          if (BtnSubmitHtml == "تعديل الفاتورة") {
            stockTransactionD.stockTransactionDetailsId = this.invoiceInpArry[i].stockTransactionDetailsId;
            this._stockService.UpdateStockTransactionDetails(stockTransactionD).subscribe();
            console.log(stockTransactionD)
            console.log('secound')
            if (stockTransactionD.stockTransactionDetailsId == undefined) {
              this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe(); // for invoice DB
              console.log(stockTransactionD)
              console.log('third')
            }
            // if not productName to delete stocktransactionDetail
            for (let d = 0; d < this.invoiceInpArry.length; d++) {
              if (this.invoiceInpArry[d].stockTransactionDetailsId !== undefined && this.invoiceInpArry[d].product == '') {
                this._stockService.deleteStockTransactionDetails(this.invoiceInpArry[d].stockTransactionDetailsId).subscribe();
                console.log(stockTransactionD)
                console.log('fourth')
              }
            }
          } else if (BtnSubmitHtml == "تسجيل") {
            this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe(); // for invoice DB
            console.log(stockTransactionD)
            console.log('fifth')
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
          console.log(stockTransactionD);
          console.log('six');
        };
      };
    }; // fst for invoiceInpArry
  }; // makeAddStockPremArry

  showInvoiceDone() {
    this._theStockComp.ngOnInit();
    this._theStockComp.showFade_newInvoice('fade_addNewApBtn');
  };

  addToStockPrem() { // the main function
    this.makeAddStockPremArry();
    this.showInvoiceDone();
  };


  printThis() {
    let show = '#headerAddInv'
    let hide1 = '#deleteAddInvoice'
    let hide2 = '#callInvoice'
    let hide3 = '#addNewInvoicetBtn'
    this._service.printThis(show, hide1, hide2, hide3)
    $('#addPrimTable').css(
      { 'height': '100%' }
    );
    $('.closeBtn').show();
    $('#printAddPremBtn').hide(),
      $('#addFilds').hide();
    $('.form-control').attr({ 'disabled': true })
    //window.print()
    //location.reload()
  }

  openwindowPrint() {
    $('#headerAddInv').css('width', '100%')
    $('.closeBtn').hide();
    window.print();
    location.reload();
  }

  reloadLoc() {
    location.reload();
  };

  invNum: number;

  showAddNewInvoice() {

    this._theStockComp.testBackend(); // to make stockArry
    this.productArr = []
    this.invoiceTotal = "0"

    for (let p = 0; p < this._stockService.allProducts.length; p++) {
      this.productArr.push(this._stockService.allProducts[p].productName)
    };

    let callInvoiceBtnVal: string = $('#callInvoiceBtn').html();
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

    if (callInvoiceBtnVal == "فاتورة جديدة") {

      let currentDateNow = Date.now() //new Date()
      let currentDate = new Date(currentDateNow)
      this._service.makeTime_date(currentDate);
      this.date_time = this._service.date_time;
      console.log(this.date_time)
      $('#invNum').hide();
      //console.log(currentDate)
      $('#callInvoice').hide();
      $('#addInvoiceForm').show();
      $('#addNewInvoicetBtn').html("تسجيل");
      $('#deleteAddInvoice').hide();
      $('#stockTransactionId').val('')

      this.resetAddinvoiceValu()
      this._service.clearForm();
      this.inptDisabled = true;
      this.isAddInvVaild = true;

    } else if (callInvoiceBtnVal == "بحث") {
      // add fildes if the inputArry < invoiceArry
      $('#addNewInvoicetBtn').html("تعديل الفاتورة");
      //console.log(this._stockService.makeInvoiceArry)
      $('#deleteAddInvoice').show();
      $('#invNum').show();
      this.inptDisabled = false;

      for (let i = 0; i < this._stockService.makeInvoiceArry.length; i++) { // add fields if the invoice details > 7 inpts
        if (this._stockService.makeInvoiceArry[i].invoiceSearchVal == this.searchInVal) {
          if (this._stockService.makeInvoiceArry[i].invoiceDetails.length > this.invoiceInpArry.length) {
            let countDif: number = this._stockService.makeInvoiceArry[i].invoiceDetails.length - this.invoiceInpArry.length;
            for (let c = 0; c < countDif; c++) {
              this.addFilds();
            };
          };
        };
      };

      this.resetAddinvoiceValu();

      let theInvoice = this._stockService.makeInvoiceArry.find(
        invoice => invoice.invoiceSearchVal == this.searchInVal
      );

      $('#stockTransactionId').val(theInvoice.stockTransactionId)
      $('#stockNameForAdd').val(theInvoice.stockName);
      $('#customerNameForAdd').val(theInvoice.customerName);
      $('#addInvoiceNote').val(theInvoice.notes);
      //console.log(JSON.stringify( theInvoice) + ' : theInvoice')
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
      console.log(this.ivoiceItemesForEdit);
    };
    $('#callInvoice').hide();
    $('#addInvoiceForm').show();
    //console.log(this.ivoiceItemesForEdit)

  }; // showAddNewInvoice

  showDeleteAddInvoice() {
    $('#fadeLayerAP').show(0);
    $('.askForDelete').show().addClass('animate');
  };

  deleteAddInvoice() {
    $('#fadeLayerAP').hide();
    let stockTransId = $('#stockTransactionId').val();
    for (let i = 0; this.invoiceInpArry.length; i++) {
      if (this.invoiceInpArry[i].stockTransactionDetailsId == undefined) {
        break
      }
      if (this.invoiceInpArry[i].stockTransactionDetailsId != undefined) {
        this._stockService.deleteStockTransactionDetails(this.invoiceInpArry[i].stockTransactionDetailsId).subscribe();
      }
    }
    this._stockService.deleteStockTransaction(stockTransId).subscribe();
    this.editStockQtys();
    //location.reload();
    this._theStockComp.showStocksEnquiry();
    //this.refreshBackendData();
  };

  testBtn() {
    this.makeAddStockPremArry();
  };

}; // end

// makeAddStockPremArry (oldMethod)
/*
if (this.invoiceInpArry[i].product !== undefined) { *** Done

  for (let s = 0; s < this._stockService.allProducts.length; s++) { *** Done

    if (this.invoiceInpArry[i].product == this._stockService.allProducts[s].productName) {
      theProductId = this._stockService.allProducts[s].productId; *** Done

      // for the first invoice *********************************************************************************************
      if (this._stockService.handleBackEnd.length == 0) { // if the product isn't in theStock's DataBase

        postStockPridgeObj.productId = theProductId; *** Done
        postStockPridgeObj.stockId = this.theStockId; *** Done
        postStockPridgeObj.productQty = parseInt(this.invoiceInpArry[i].qty); *** Done
        postStockPridgeObj.productCost = parseInt(this.invoiceInpArry[i].price); *** Done
        this._stockService.postStockPridge(postStockPridgeObj).subscribe();

        // save stocktransactionDetails
        stockTransactionD.stockTransactionId = stockTransaction.stockTransactionId; *** Done
        stockTransactionD.productId = theProductId; *** Done
        stockTransactionD.price = parseInt(this.invoiceInpArry[i].price); *** Done
        stockTransactionD.Qty = parseInt(this.invoiceInpArry[i].qty); *** Done

        this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB

        this.checkAllArry = 1; // reload
        //console.log('firstInvoice')
      }
      // for the first invoice *********************************************************************************************
      *** Done

      for (let h = 0; h < this._stockService.handleBackEnd.length; h++) {

        if (theProductId == this._stockService.handleBackEnd[h].productId &&
          this.theStockId == this._stockService.handleBackEnd[h].stockId) {  *** Done

          postStockPridgeObj.productId = theProductId; // for edit and add
          postStockPridgeObj.stockId = this.theStockId; // for edit and add
          productTotalsPriceAvr = (this._stockService.handleBackEnd[h].productCost * this._stockService.handleBackEnd[h].productQty)
            + (parseInt(this.invoiceInpArry[i].price) * parseInt(this.invoiceInpArry[i].qty)); *** Done
          allProductQty = this._stockService.handleBackEnd[h].productQty + parseInt(this.invoiceInpArry[i].qty); *** Done
          postStockPridgeObj.productCost = Math.floor(productTotalsPriceAvr / allProductQty) // price avarage *** Done
          postStockPridgeObj.productQty = parseInt(this.invoiceInpArry[i].qty) + this._stockService.handleBackEnd[h].productQty; *** Done
          postStockPridgeObj.stockProductId = this._stockService.handleBackEnd[h].stockProductId; *** Done

          this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB

          // save stocktransactionDetails
          stockTransactionD.stockTransactionId = stockTransaction.stockTransactionId;
          stockTransactionD.productId = theProductId;
          stockTransactionD.price = parseInt(this.invoiceInpArry[i].price); *** Done
          stockTransactionD.Qty = parseInt(this.invoiceInpArry[i].qty); *** Done

          // edite Or Add
          if (BtnSubmitHtml == "تعديل الفاتورة") { *** Done
            stockTransactionD.stockTransactionDetailsId = this.invoiceInpArry[i].stockTransactionDetailsId; *** Done
            this._stockService.UpdateStockTransactionDetails(stockTransactionD).subscribe(); *** Done
            if (stockTransactionD.stockTransactionDetailsId == undefined) { *** Done
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

          this._service.clearForm();
          this.checkAllArry = 1; // reload
          break
        }

        this.checkAllArry++ // for handleBackEnd[]
        if (this.checkAllArry > this._stockService.handleBackEnd.length) { // if the product isn't in theStock's DataBase

          postStockPridgeObj.productId = theProductId; *** Done
          postStockPridgeObj.stockId = this.theStockId; *** Done
          postStockPridgeObj.productQty = parseInt(this.invoiceInpArry[i].qty); *** Done
          postStockPridgeObj.productCost = parseInt(this.invoiceInpArry[i].price); *** Done

          // save stocktransactionDetails
          stockTransactionD.stockTransactionId = stockTransaction.stockTransactionId; *** Done
          stockTransactionD.productId = theProductId; *** Done
          stockTransactionD.price = parseInt(this.invoiceInpArry[i].price); *** Done
          stockTransactionD.Qty = parseInt(this.invoiceInpArry[i].qty); *** Done
          this._stockService.postStockPridge(postStockPridgeObj).subscribe(); *** Done
          this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB *** Done
          this.checkAllArry = 1; // reload
        }
      } // thrd for _stockService.handleBackEnd
    }
  } // snd for _stockService.allProducts
}*/

// editStockQty (oldMethod)

/*
for (let sE = 0; sE < this._stockService.allProducts.length; sE++) { *** Done

  if (this.ivoiceItemesForEdit[v].productName == this._stockService.allProducts[sE].productName) { *** Done

    theProductId = this._stockService.allProducts[sE].productId; *** Done

    for (let hE = 0; hE < this._stockService.handleBackEnd.length; hE++) { *** Done

      if (theProductId == this._stockService.handleBackEnd[hE].productId &&
        this.ivoiceItemesForEdit[v].stockId == this._stockService.handleBackEnd[hE].stockId) { *** Done

        postStockPridgeObj.productId = theProductId; // for edit and add *** Done
        postStockPridgeObj.stockId = this.ivoiceItemesForEdit[v].stockId; // for edit and add *** Done

        allProductQty = this._stockService.handleBackEnd[hE].productQty - parseInt(this.ivoiceItemesForEdit[v].Qty); *** Done
        productTotalsPriceAvr = (this._stockService.handleBackEnd[hE].productCost * this._stockService.handleBackEnd[hE].productQty)
          - (parseInt(this.ivoiceItemesForEdit[v].price) * parseInt(this.ivoiceItemesForEdit[v].Qty)); *** Done
        if (allProductQty == 0) {
          postStockPridgeObj.productCost = this._stockService.handleBackEnd[hE].productCost; *** Done
        } else {
          postStockPridgeObj.productCost = Math.floor(productTotalsPriceAvr / allProductQty) // price avarage *** Done
        }
        postStockPridgeObj.stockProductId = this._stockService.handleBackEnd[hE].stockProductId; *** Done
        postStockPridgeObj.productQty = this._stockService.handleBackEnd[hE].productQty - parseInt(this.ivoiceItemesForEdit[v].Qty); *** Done

        this._stockService.handleBackEnd[hE].productQty = postStockPridgeObj.productQty; *** Done
        this._stockService.handleBackEnd[hE].productCost = postStockPridgeObj.productCost;
        this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB
      }
    }
  }
}*/