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

  sumArry(arr: any[]) {
    let s = 0
    for (let i = 0; i < arr.length; i++) {
      s = s + arr[i]
    }
    return s
  };

  minAddFilds() {
    this.invoiceInp = new InvoiceInp();
    this.invoiceInp.total = 0;
    this.invoiceInpArry.push(this.invoiceInp);
    //console.log(this.invoiceInp)
  };
  theStockProd: any;
  theStockProds: any;
  inputDisabled: boolean = true;

  makeTheStockProds() {
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
    }
    this.inputDisabled = false;
  }

  stockNameVaild: boolean;
  isAddInvVaild: boolean = false;
  productArr: any[] = [];
  isMinInvInvaild: boolean = false;

  isMinNameVaild() { // inputValidation

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
    }

    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      if (this.invoiceInpArry[i].inpVaild == true) {
        this.isMinInvInvaild = true;
        break
      } else {
        this.isMinInvInvaild = false;
      }

    }

  }

  isAddQtyVaild() {

    let loopCount = 1;
    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      if (this.invoiceInpArry[i].product != undefined) {

        for (let t = 0; t < this.theStockProds.length; t++) {
          
          if (this.invoiceInpArry[i].product == this.theStockProds[t].productName && this.invoiceInpArry[i].qty > this.theStockProds[t].productQty) {
            this.invoiceInpArry[i].Qtyinvaild = true;
            loopCount = 1;
            break
          } else if (this.invoiceInpArry[i].product == this.theStockProds[t].productName
             && this.invoiceInpArry[i].qty <= this.theStockProds[t].productQty
             && this.invoiceInpArry[i].inpVaild == false) {
            this.invoiceInpArry[i].Qtyinvaild = false;
            loopCount = 1;
            break
          }
          loopCount ++
          if (loopCount > this.theStockProds.length) {
            this.invoiceInpArry[i].Qtyinvaild = true;
          }
        }
        console.log(loopCount)
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
    console.log(this.theStockProds)
  }

  invoiceTotal: string = '0';
  calcTotals() {
    this.isAddQtyVaild();
    this.totalInvoice = []
    this.invoiceTotal = '0'
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
    this.invoiceTotal = total;
    //$('#invoiceTotal').html(`اجمالى الفاتورة : ${total}`)
  }

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
  };

  getTheStockId() {
    // get the stockId
    let theStock = $('#stockNameForMin').val();
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
  changMinInvoiceBtn() {
    this.searchInVal = $('#minInvoiceSearch').val();
    if (this.searchInVal == '') {
      $('#minCallInvoiceBtn').html("فاتورة جديدة")
    } else {
      $('#minCallInvoiceBtn').html("بحث")
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

  ShowMinNewInvoice() {

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
      $('#minCallInvoice').hide();
      $('#minInvoiceForm').show();
      $('#minNewInvoicetBtn').html("تسجيل")
      $('#stockTransactionId').val('')
      this.inputDisabled = true;
      this.isMinInvInvaild = true;
      this.resetAddinvoiceValu()
    } else if (callInvoiceBtnVal == "بحث") {
      $('#minNewInvoicetBtn').html("تعديل الفاتورة");
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
            $('#stockNameForMin').val(this._stockService.makeInvoiceArry[i].stockName);
            $('#customerNameForMin').val(this._stockService.makeInvoiceArry[i].customerName);
            $('#minInvoiceNote').val(this._stockService.makeInvoiceArry[i].notes);
          }
        }
      }

      $('#minCallInvoice').hide();
      $('#minInvoiceForm').show();
      this.calcTotals();
    }

  } // ShowMinNewInvoice

  editStockQtys() {
    this.getTheStockId();
    this.getTheStockId();
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
      for (let v = 0; v < this.ivoiceItemesForEdit.length; v++) {
        for (let sE = 0; sE < this._stockService.allProducts.length; sE++) {
          if (this.ivoiceItemesForEdit[v].productName == this._stockService.allProducts[sE].productName) {
            theProductId = this._stockService.allProducts[sE].productId;
            for (let hE = 0; hE < this._stockService.handleBackEnd.length; hE++) {
              if (theProductId == this._stockService.handleBackEnd[hE].productId &&
                this.theStockId == this._stockService.handleBackEnd[hE].stockId) {
                postStockPridgeObj.productId = theProductId;
                postStockPridgeObj.stockId = this.theStockId;
                postStockPridgeObj.stockProductId = this._stockService.handleBackEnd[hE].stockProductId;
                postStockPridgeObj.productQty = this._stockService.handleBackEnd[hE].productQty + parseInt(this.ivoiceItemesForEdit[v].Qty);
                this._stockService.handleBackEnd[hE].productQty = postStockPridgeObj.productQty;
                this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB
              }
            }
          }
        }
      }
    }

  } // editStockQtys

  makeMinStockPremArry() {
    this.getTheStockId();
    this.getTheCustomerId();
    this.editStockQtys(); // if edite will min all old invoice Qtys from stock Qtys 

    this._stockService.getHandleBackEnd().subscribe((data: HandleBackEnd[]) => {
      this._stockService.handleBackEnd = data;
    })

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
      stockId: this.theStockId,
      customerId: this.theCustomerId,
      transactionType: 2,
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

    let BtnSubmitHtml = $('#minNewInvoicetBtn').html(); // to check if invoice for update or add

    for (let i = 0; i < this.invoiceInpArry.length; i++) {

      if (this.invoiceInpArry[i].product !== undefined) {

        for (let s = 0; s < this._stockService.allProducts.length; s++) {

          if (this.invoiceInpArry[i].product == this._stockService.allProducts[s].productName) {
            theProductId = this._stockService.allProducts[s].productId;

            // for the first invoice *********************************************************************************************
            if (this._stockService.handleBackEnd.length == 0) {
              console.log('newProduct');

              postStockPridgeObj.productId = theProductId;
              postStockPridgeObj.stockId = this.theStockId;
              postStockPridgeObj.productQty = parseInt(this.invoiceInpArry[i].qty);
              postStockPridgeObj.productPrice = parseInt(this.invoiceInpArry[i].price);
              //this._stockService.postStockPridge(postStockPridgeObj).subscribe(); /////////////////////////////////////////////////////

              // save stocktransactionDetails
              stockTransactionD.stockTransactionId = stockTransaction.stockTransactionId;
              stockTransactionD.productId = theProductId;
              stockTransactionD.price = parseInt(this.invoiceInpArry[i].price);
              stockTransactionD.Qty = parseInt(this.invoiceInpArry[i].qty);

              //this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB /////////////////////////////////////////////////////

              this.checkAllArry = 1; // reload
            }
            // for the first invoice *********************************************************************************************

            for (let h = 0; h < this._stockService.handleBackEnd.length; h++) {

              if (theProductId == this._stockService.handleBackEnd[h].productId &&
                this.theStockId == this._stockService.handleBackEnd[h].stockId) {
                console.log('ok')

                postStockPridgeObj.productId = theProductId; // for edit and add
                postStockPridgeObj.stockId = this.theStockId; // for edit and add
                postStockPridgeObj.productCost = this._stockService.handleBackEnd[h].productCost;
                postStockPridgeObj.productPrice = parseInt(this.invoiceInpArry[i].price);
                postStockPridgeObj.productQty = this._stockService.handleBackEnd[h].productQty - parseInt(this.invoiceInpArry[i].qty);
                postStockPridgeObj.stockProductId = this._stockService.handleBackEnd[h].stockProductId;

                console.log(this.invoiceInpArry[i].qty)
                this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB 

                // save stocktransactionDetails
                stockTransactionD.stockTransactionId = stockTransaction.stockTransactionId;
                stockTransactionD.productId = theProductId;
                stockTransactionD.price = parseInt(this.invoiceInpArry[i].price);
                stockTransactionD.Qty = parseInt(this.invoiceInpArry[i].qty);

                // edite Or Add
                if (BtnSubmitHtml == "تعديل الفاتورة") {
                  stockTransactionD.stockTransactionDetailsId = this.invoiceInpArry[i].stockTransactionDetailsId;
                  //console.log(stockTransactionD)
                  if (stockTransactionD.stockTransactionDetailsId == undefined) {
                    this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB 
                  }
                  // if not productName to delete stocktransactionDetail
                  for (let d = 0; d < this.invoiceInpArry.length; d++) {
                    if (this.invoiceInpArry[d].stockTransactionDetailsId !== undefined && this.invoiceInpArry[d].product == '') {
                      this._stockService.deleteStockTransactionDetails(this.invoiceInpArry[d].stockTransactionDetailsId).subscribe();
                    }
                  }
                  this._stockService.UpdateStockTransactionDetails(stockTransactionD).subscribe();

                } else if (BtnSubmitHtml == "تسجيل") {
                  this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB 

                }

                this._service.clearForm();
                this.checkAllArry = 1; // reload
                break
              }
              console.log(this.checkAllArry)
              this.checkAllArry++ // for handleBackEnd[]
              if (this.checkAllArry > this._stockService.handleBackEnd.length) { // if the product isn't in theStock's DataBase
                console.log('newProduct');

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
                this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB 
                this.checkAllArry = 1; // reload
              }
            } // this._stockService.handleBackEnd loop

          }
        } // snd loop

      }
    } // fst loop

  } // makeMinStockPremArry

  minFrmStockPrem() {
    this.makeMinStockPremArry();
    this.resetAddinvoiceValu();
    location.reload();
  }

  minTestBtn() {
    console.log(this._stockService.allProducts)
  }

} // End
