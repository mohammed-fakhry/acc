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
  searchTxt:string;

  invoiceData = new FormGroup({
    theStock : new FormControl(''),
    theCustomer: new FormControl(''),
    theNote: new FormControl(''),
  })

  constructor(public _stockService: StocksService, public formBuilder: FormBuilder,
    public _service: ServicesService, public _custService: CustomerService, public _theStockComp: TheStocksComponent) { }

  ngOnInit() {

    this.addToStockPremData = this.formBuilder.group({
      stockName: [''],
    })

    this._custService.getCustomer().subscribe((data: Customer[]) => {
      this.customers = data;
    })

    this._stockService.getStockTransactionList().subscribe((data: StockTransaction[]) => {
      this._stockService.stockTransactionArr = data;
    })
    this._stockService.getStockTransactionDetailsList().subscribe((data: StockTransactionD[]) => {
      this._stockService.stockTransactionDetailsArr = data;
    })

  } // ngOnInit

  productArr: any[] = [];


  sumArry(arr: any[]) {
    let s = 0
    for (let i = 0; i < arr.length; i++) {
      s = s + arr[i]
    }
    return s
  };

  addFilds() {
    this.invoiceInp = new InvoiceInp();
    this.invoiceInp.total = 0;
    this.invoiceInpArry.push(this.invoiceInp);
    console.log(this.invoiceInpArry)
    //console.log(this.invoiceInp)
  }

  isAddInvVaild: boolean = false;

  isAddNameVaild() { // inputValidation

    for (let i = 0 ; i < this.invoiceInpArry.length ; i ++) {
      let productinpt = $(`#product${i}`).val();
      if(this.productArr.includes(productinpt) || productinpt == '') {
        this.invoiceInpArry[i].inpVaild = false;
      } else {
        this.invoiceInpArry[i].inpVaild = true;
      }
    }
    
    for (let i = 0 ; i < this.invoiceInpArry.length ; i ++) {
      if (this.invoiceInpArry[i].inpVaild == true) {
        this.isAddInvVaild = true;
        break
      } else {
        this.isAddInvVaild = false;
      }
    }
    console.log(this._stockService.allProducts)
  }

  inptDisabled: boolean = true;
  stockChanged() {
    this.inptDisabled = false;
  }

  invoiceTotal: string = '0';
  calcTotals() {
    this.totalInvoice = []
    this.invoiceTotal = '0'
    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      // Qty change
      //$(`#qty${i}`)
      if (this.invoiceInpArry[i].qty == null || this.invoiceInpArry[i].price == null) {
        this.invoiceInpArry[i].total = 0;
        //console.log(this.invoiceInpArry[i].qty)
        this.totalInvoice.push(this.invoiceInpArry[i].total)
      } else {
        this.invoiceInpArry[i].total = this.invoiceInpArry[i].qty * this.invoiceInpArry[i].price
        this.totalInvoice.push(this.invoiceInpArry[i].total)
      }
    }
    let total: any = this.sumArry(this.totalInvoice)
    this.invoiceTotal = total;
    //$('#invoiceTotal').html(`اجمالى الفاتورة : ${total}`)
    console.log(this._stockService.handleBackEnd)
  }

  theStockId: number;
  theCustomerId: number;

  getTheCustomerId() {
    let theCustomer = $('#customerNameForAdd').val();
    for (let i = 0; i < this.customers.length; i++) {
      if (theCustomer == this.customers[i].customerName) {
        this.theCustomerId = this.customers[i].customerId;
        break
      };
    };
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
    }
  }

  checkAllArry: number;

  searchInVal: string = '';
  // changAddInvoiceBtn
  changAddInvoiceBtn() {
    this.searchInVal = $('#invoiceSearch').val();
    if (this.searchInVal == '') {
      $('#callInvoiceBtn').html("فاتورة جديدة")
    } else {
      $('#callInvoiceBtn').html("بحث")
    }
    //console.log(this.searchInVal);
  };

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

  editStockQtys() {

    this.getTheStockId();
    let BtnSubmitHtml = $('#addNewInvoicetBtn').html(); // to check if invoice for update or add
    let theProductId: number;
    let postStockPridgeObj: StockPridge = {
      stockProductId: null,
      stockId: 0, //
      productId: 0, //
      productQty: 0, //
      productCost: 0, //
      productPrice: 0,
    }
    let productTotalsPriceAvr: number;
    let minOldTotal: number; // to get back the old priceAvr
    let allProductQty: number;

    if (BtnSubmitHtml == "تعديل الفاتورة") {

      for (let v = 0; v < this.ivoiceItemesForEdit.length; v++) {

        for (let sE = 0; sE < this._stockService.allProducts.length; sE++) {

          if (this.ivoiceItemesForEdit[v].productName == this._stockService.allProducts[sE].productName) {

            theProductId = this._stockService.allProducts[sE].productId;

            for (let hE = 0; hE < this._stockService.handleBackEnd.length; hE++) {

              if (theProductId == this._stockService.handleBackEnd[hE].productId &&
                this.theStockId == this._stockService.handleBackEnd[hE].stockId) {

                postStockPridgeObj.productId = theProductId; // for edit and add
                postStockPridgeObj.stockId = this.theStockId; // for edit and add

                allProductQty = this._stockService.handleBackEnd[hE].productQty - parseInt(this.ivoiceItemesForEdit[v].Qty);
                productTotalsPriceAvr = (this._stockService.handleBackEnd[hE].productCost * this._stockService.handleBackEnd[hE].productQty)
                  - (parseInt(this.ivoiceItemesForEdit[v].price) * parseInt(this.ivoiceItemesForEdit[v].Qty));

                postStockPridgeObj.productCost = Math.floor(productTotalsPriceAvr / allProductQty) // price avarage
                postStockPridgeObj.stockProductId = this._stockService.handleBackEnd[hE].stockProductId;
                postStockPridgeObj.productQty = this._stockService.handleBackEnd[hE].productQty - parseInt(this.ivoiceItemesForEdit[v].Qty);
                this._stockService.handleBackEnd[hE].productQty = postStockPridgeObj.productQty;
                this._stockService.handleBackEnd[hE].productCost = postStockPridgeObj.productCost;

                this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB
              }
            }
          }
        }
      }
    }
  } // editStockQtys

  makeAddStockPremArry() {

    this.getTheStockId();
    this.getTheCustomerId();
    this.editStockQtys(); // if edite will min all old invoice Qtys from stock Qtys

    this._stockService.getHandleBackEnd().subscribe((data: HandleBackEnd[]) => {
      this._stockService.handleBackEnd = data;
    })

    let theProductId: number;
    this.checkAllArry = 1; // check after loop on the handleArry that the product not found
    this.theNote = $('#addInvoiceNote').val()
    this.theStockTransactionId = $('#stockTransactionId').val()
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
      stockId: this.theStockId,
      customerId: this.theCustomerId,
      transactionType: 1,
      invoiceTotal: parseInt(this.invoiceTotal),
      notes: this.theNote,
    }

    // edit or add
    if (this.theStockTransactionId == '') {
      this._stockService.creatStockTransaction(stockTransaction).subscribe();
    } else {
      stockTransaction.stockTransactionId = this.theStockTransactionId;
      this._stockService.UpdateStockTransaction(stockTransaction).subscribe();
    }

    let BtnSubmitHtml = $('#addNewInvoicetBtn').html(); // to check if invoice for update or add
    let allProductQty: number;
    let productTotalsPriceAvr: number;

    for (let i = 0; i < this.invoiceInpArry.length; i++) {

      if (this.invoiceInpArry[i].product !== undefined) {

        for (let s = 0; s < this._stockService.allProducts.length; s++) {

          if (this.invoiceInpArry[i].product == this._stockService.allProducts[s].productName) {
            theProductId = this._stockService.allProducts[s].productId;

            // for the first invoice *********************************************************************************************
            if (this._stockService.handleBackEnd.length == 0) { // if the product isn't in theStock's DataBase

              console.log('newProduct');

              postStockPridgeObj.productId = theProductId;
              postStockPridgeObj.stockId = this.theStockId;
              postStockPridgeObj.productQty = parseInt(this.invoiceInpArry[i].qty);
              postStockPridgeObj.productCost = parseInt(this.invoiceInpArry[i].price);
              this._stockService.postStockPridge(postStockPridgeObj).subscribe();

              // save stocktransactionDetails
              stockTransactionD.stockTransactionId = stockTransaction.stockTransactionId;
              stockTransactionD.productId = theProductId;
              stockTransactionD.price = parseInt(this.invoiceInpArry[i].price);
              stockTransactionD.Qty = parseInt(this.invoiceInpArry[i].qty);

              this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB 

              this.checkAllArry = 1; // reload
            }
            // for the first invoice *********************************************************************************************

            for (let h = 0; h < this._stockService.handleBackEnd.length; h++) {

              if (theProductId == this._stockService.handleBackEnd[h].productId &&
                this.theStockId == this._stockService.handleBackEnd[h].stockId) {
                console.log('ok')

                postStockPridgeObj.productId = theProductId; // for edit and add
                postStockPridgeObj.stockId = this.theStockId; // for edit and add
                productTotalsPriceAvr = (this._stockService.handleBackEnd[h].productCost * this._stockService.handleBackEnd[h].productQty)
                  + (parseInt(this.invoiceInpArry[i].price) * parseInt(this.invoiceInpArry[i].qty));
                allProductQty = this._stockService.handleBackEnd[h].productQty + parseInt(this.invoiceInpArry[i].qty);
                postStockPridgeObj.productCost = Math.floor(productTotalsPriceAvr / allProductQty) // price avarage
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
                  for (let d = 0 ; d < this.invoiceInpArry.length ; d ++) {
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
              console.log(this.checkAllArry)
              //console.log(this.checkAllArry)
              if (this.checkAllArry > this._stockService.handleBackEnd.length) { // if the product isn't in theStock's DataBase

                console.log('newProduct');

                postStockPridgeObj.productId = theProductId;
                postStockPridgeObj.stockId = this.theStockId;
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
            } // thrd for _stockService.handleBackEnd

          }
        } // snd for _stockService.allProducts

      }

    } // fst for invoiceInpArry

  }; // makeAddStockPremArry

  addToStockPrem() { // the main function
    this.makeAddStockPremArry();
    this.resetAddinvoiceValu();
    location.reload();
  }

  showAddNewInvoice() {
    
    this._theStockComp.testBackend(); // to make stockArry
    this.productArr = []
    this.invoiceTotal = "0"
    console.log(this._stockService.makeStockArry)
    for (let p = 0 ; p <  this._stockService.allProducts.length ; p ++) {
      this.productArr.push(this._stockService.allProducts[p].productName)
    }

    let callInvoiceBtnVal: string = $('#callInvoiceBtn').html()
    this.invoiceInpArry = [];
    this.ivoiceItemesForEdit = [];
    // to add 5 fildes
    for (let i = 0; i < 7; i++) {
      this.invoiceInp = new InvoiceInp()
      this.invoiceInp.total = 0;
      this.invoiceInp.inpVaild = false;
      this.invoiceInp.Qtyinvaild = false;
      this.invoiceInpArry.push(this.invoiceInp);
    }

    if (callInvoiceBtnVal == "فاتورة جديدة") {
      $('#callInvoice').hide();
      $('#addInvoiceForm').show();
      $('#addNewInvoicetBtn').html("تسجيل")
      $('#stockTransactionId').val('')
      this.resetAddinvoiceValu()
      this.inptDisabled = true;
      this.isAddInvVaild = true;
    } else if (callInvoiceBtnVal == "بحث") {
      // add fildes if the inputArry < invoiceArry
      $('#addNewInvoicetBtn').html("تعديل الفاتورة")
      this.inptDisabled = false;
      //this.isAddInvVaild = true;
      for (let i = 0; i < this._stockService.makeInvoiceArry.length; i++) { // add fields if the invoice details > 7 inpts
        if (this._stockService.makeInvoiceArry[i].invoiceSearchVal == this.searchInVal) {
          //console.log(this.invoiceInpArry.length);
          if (this._stockService.makeInvoiceArry[i].invoiceDetails.length > this.invoiceInpArry.length) {
            let countDif: number = this._stockService.makeInvoiceArry[i].invoiceDetails.length - this.invoiceInpArry.length;
            for (let c = 0; c < countDif; c++) {
              this.addFilds();
            }
          }
        }
      }

      this.resetAddinvoiceValu()
      for (let i = 0; i < this._stockService.makeInvoiceArry.length; i++) {

        if (this._stockService.makeInvoiceArry[i].invoiceSearchVal == this.searchInVal) {
          console.log(this._stockService.makeInvoiceArry[i].stockTransactionId)
          $('#stockTransactionId').val(this._stockService.makeInvoiceArry[i].stockTransactionId)
          for (let d = 0; d < this._stockService.makeInvoiceArry[i].invoiceDetails.length; d++) {
            this.ivoiceItemesForEdit.push(this._stockService.makeInvoiceArry[i].invoiceDetails[d])
            this.invoiceInpArry[d].stockTransactionDetailsId = this._stockService.makeInvoiceArry[i].invoiceDetails[d].stockTransactionDetailsId;
            this.invoiceInpArry[d].product = this._stockService.makeInvoiceArry[i].invoiceDetails[d].productName;
            this.invoiceInpArry[d].price = this._stockService.makeInvoiceArry[i].invoiceDetails[d].price;
            this.invoiceInpArry[d].qty = this._stockService.makeInvoiceArry[i].invoiceDetails[d].Qty;
            $('#stockNameForAdd').val(this._stockService.makeInvoiceArry[i].stockName);
            $('#customerNameForAdd').val(this._stockService.makeInvoiceArry[i].customerName);
            $('#addInvoiceNote').val(this._stockService.makeInvoiceArry[i].notes);
          }
        }
      }
      $('#callInvoice').hide();
      $('#addInvoiceForm').show();
      this.calcTotals();

    }

  } // showAddNewInvoice



  testBtn() {

  }

} // end

