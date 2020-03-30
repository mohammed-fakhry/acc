import { Component, OnInit } from '@angular/core';
import { ServicesService } from 'src/app/services.service';
import { StocksService } from '../../the-stocks/stocks.service';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  invoiceInpArry: any[] = [];
  totalInvoice: any[];
  //temp: string = "";
  // get all inputs Arr by ID
  //qty1: number;
  //price1: number;
  //total1: number;

  constructor(private _stockService: StocksService, private formBuilder: FormBuilder,
    private _service: ServicesService, private _custService: CustomerService, private _theStockComp: TheStocksComponent) { }

  ngOnInit() {

    // to add 5 fildes
    for (let i = 0; i < 7; i++) {
      this.invoiceInp = new InvoiceInp()
      this.invoiceInp.total = 0;
      this.invoiceInpArry.push(this.invoiceInp);
    }
    //[this.invoiceInp, this.invoiceInp, this.invoiceInp, this.invoiceInp, this.invoiceInp, this.invoiceInp]

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
    //console.log(this.invoiceInp)
  }

  calcTotals() {
    this.totalInvoice = []
    for (let i = 0; i < this.invoiceInpArry.length; i++) {
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
    $('#invoiceTotal').html(`اجمالى الفاتورة : ${total}`)
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
        //console.log(this.theStockId)
        break
      };
    };
  };

  resetAddinvoiceValu() {
    this._service.clearForm();
    $('#invoiceTotal').html(`اجمالى الفاتورة : 0`);
    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      this.invoiceInpArry[i].total = 0;
    }
  }

  checkAllArry: number;

  searchInvVal: string = '';
  // changAddInvoiceBtn
  changAddInvoiceBtn() {
    this.searchInvVal = $('#invoiceSearch').val();
    if (this.searchInvVal == '') {
      $('#callInvoiceBtn').html("فاتورة جديدة")
    } else {
      $('#callInvoiceBtn').html("بحث")
    }
    console.log(this.searchInvVal);
  };


  theNote:string;
  makeAddStockPremArry() {
    this.getTheStockId();
    this.getTheCustomerId();

    this._stockService.getHandleBackEnd().subscribe((data: HandleBackEnd[]) => {
      this._stockService.handleBackEnd = data;
    })

    let theProductId: number;
    this.checkAllArry = 1; // check after loop on the handleArry that the product not found
    this.theNote = $('#addInvoiceNote').val()

    let postStockPridgeObj: StockPridge = {
      stockProductId: null,
      stockId: 0, //
      productId: 0, //
      productQty: 0, //
      productCost: 0, //
      productPrice: 0,
    }

    let stockTransactionD: StockTransactionD = {
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
      notes: this.theNote,
    }

    console.log(stockTransaction.stockTransactionId)
    this._stockService.creatStockTransaction(stockTransaction).subscribe();

    for (let i = 0; i < this.invoiceInpArry.length; i++) {

      //console.log(this.checkAllArry + " : checkAllArry")
      if (this.invoiceInpArry[i].product !== undefined) {
        //console.log(this.invoiceInpArry[i].product)
        for (let s = 0; s < this._stockService.allProducts.length; s++) {

          //console.log(this.invoiceInpArry[i].product + ' : i')
          if (this.invoiceInpArry[i].product == this._stockService.allProducts[s].productName) {
            theProductId = this._stockService.allProducts[s].productId;

            for (let h = 0; h < this._stockService.handleBackEnd.length; h++) {

              if (theProductId == this._stockService.handleBackEnd[h].productId &&
                this.theStockId == this._stockService.handleBackEnd[h].stockId) {
                console.log('ok')

                let productTotalsPriceAvr: number =
                  (this._stockService.handleBackEnd[h].productCost * this._stockService.handleBackEnd[h].productQty)
                  + (parseInt(this.invoiceInpArry[i].price) * parseInt(this.invoiceInpArry[i].qty));
                // --
                let allProductQty: number = this._stockService.handleBackEnd[h].productQty + parseInt(this.invoiceInpArry[i].qty);
                postStockPridgeObj.productCost = Math.floor(productTotalsPriceAvr / allProductQty) // price avarage
                postStockPridgeObj.productId = theProductId;
                postStockPridgeObj.stockId = this.theStockId;
                postStockPridgeObj.productQty = parseInt(this.invoiceInpArry[i].qty) + this._stockService.handleBackEnd[h].productQty;
                postStockPridgeObj.stockProductId = this._stockService.handleBackEnd[h].stockProductId;

                // save stocktransactionDetails
                stockTransactionD.stockTransactionId = stockTransaction.stockTransactionId;
                stockTransactionD.productId = theProductId;
                stockTransactionD.price = parseInt(this.invoiceInpArry[i].price);
                stockTransactionD.Qty = parseInt(this.invoiceInpArry[i].qty);

                this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB
                this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB
                console.log(stockTransaction.stockTransactionId)
                this._service.clearForm();
                this.checkAllArry = 1; // reload
                break
              }

              this.checkAllArry++
              //console.log(this.checkAllArry)
              if (this.checkAllArry > this._stockService.handleBackEnd.length) { // if the product isn't in theStock's DataBase

                console.log('newProduct');

                postStockPridgeObj.productId = theProductId;
                postStockPridgeObj.stockId = this.theStockId;
                postStockPridgeObj.productQty = parseInt(this.invoiceInpArry[i].qty);
                postStockPridgeObj.productCost = parseInt(this.invoiceInpArry[i].price);
                this._stockService.postStockPridge(postStockPridgeObj).subscribe();

                //break
                // save stocktransactionDetails
                stockTransactionD.stockTransactionId = stockTransaction.stockTransactionId;
                stockTransactionD.productId = theProductId;
                stockTransactionD.price = parseInt(this.invoiceInpArry[i].price);
                stockTransactionD.Qty = parseInt(this.invoiceInpArry[i].qty);

                this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB
                this.checkAllArry = 1; // reload
                //console.log(this.checkAllArry)

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
    //location.reload();
    //this.genRandomId()
    //console.log(this.randomId)
  }

  /*  changAddInvoiceBtn() {
    this.searchInvVal = $('#invoiceSearch').val();
    if (this.searchInvVal == '') {
      $('#callInvoiceBtn').html("فاتورة جديدة")
    } else {
      $('#callInvoiceBtn').html("بحث")
    }
    console.log(this.searchInvVal);
  };
 */

  showAddNewInvoice() {
    let callInvoiceBtnVal:string = $('#callInvoiceBtn').html()

    if (callInvoiceBtnVal == "فاتورة جديدة") {
      $('#callInvoice').hide();
      $('#addInvoiceForm').show();
      this.resetAddinvoiceValu()
      //document.getElementById('addNewProductBtn').innerHTML = "تسجيل"
      $('#addNewInvoicetBtn').html("تسجيل")
    } else if(callInvoiceBtnVal == "بحث") {
      // add fildes if the inputArry < invoiceArry
      $('#addNewInvoicetBtn').html("تعديل الفاتورة")
      if (this._stockService.makeInvoiceArry.length > this.invoiceInpArry.length) {
        let countDif:number = this._stockService.makeInvoiceArry.length - this.invoiceInpArry.length;
        for (let c = 0 ; c < countDif ; c++) {
          this.addFilds();
        }
      }

      for (let i = 0 ; i < this._stockService.makeInvoiceArry.length ; i ++) {
        if (this._stockService.makeInvoiceArry[i].invoiceSearchVal == this.searchInvVal) {
          for (let d = 0 ; d < this._stockService.makeInvoiceArry[i].invoiceDetails.length ; d++) {
            this.invoiceInpArry[d].product = this._stockService.makeInvoiceArry[i].invoiceDetails[d].productName;
            this.invoiceInpArry[d].price = this._stockService.makeInvoiceArry[i].invoiceDetails[d].price;
            this.invoiceInpArry[d].qty = this._stockService.makeInvoiceArry[i].invoiceDetails[d].Qty;
            $('#stockNameForAdd').val(this._stockService.makeInvoiceArry[i].stockName);
            $('#customerNameForAdd').val(this._stockService.makeInvoiceArry[i].customerName);
            $('#addInvoiceNote').val(this._stockService.makeInvoiceArry[i].notes) ;
            console.log(this._stockService.makeInvoiceArry[i].invoiceDetails[d]);
          }
        }
      }
      console.log($('#addNewProductBtn').html())
      $('#callInvoice').hide();
      $('#addInvoiceForm').show();
      this.calcTotals();
    }


  } // showAddNewInvoice

} // end

