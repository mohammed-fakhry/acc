import { Component, OnInit } from '@angular/core';
import { ServicesService } from 'src/app/services.service';
import { StocksService } from '../../the-stocks/stocks.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HandleBackEnd } from 'src/app/handle-back-end';
import { StockPridge } from '../../stock-pridge';
import { CustomerService } from 'src/app/customer.service';
import { Customer } from '../../../../../app/customer'
import { InvoiceInp } from 'src/app/accountings/invoice-inp';
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
    private _service: ServicesService, private _custService: CustomerService) { }

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
  makeAddStockPremArry() {
    this.getTheStockId();
    let theProductId: number;
    this.checkAllArry = 1; // check after loop on the handleArry that the product not found
    //let updateStockPridgeQty: HandleBackEnd;
    let postStockPridgeObj: StockPridge = {
      stockProductId: null,
      stockId: 0, //
      productId: 0, //
      productQty: 0, //
      productCost: 0, //
      productPrice: 0,
    }

    for (let i = 0; i < this.invoiceInpArry.length; i++) {

      console.log(this.checkAllArry + " : checkAllArry")
      if (this.invoiceInpArry[i].product) {

        for (let s = 0; s < this._stockService.allProducts.length; s++) {

          //console.log(this.invoiceInpArry[i].product + ' : i')
          //console.log(this._stockService.allProducts[s].productName + " : s")
          //console.log(this._stockService.allProducts[s].productId + " : s | id")
          if (this.invoiceInpArry[i].product == this._stockService.allProducts[s].productName) {
            theProductId = this._stockService.allProducts[s].productId;

            for (let h = 0; h < this._stockService.handleBackEnd.length; h++) {
              //console.log(this.theStockId + " : theSId")
              //console.log(this._stockService.handleBackEnd[h].stockId + " : [h].stockId")
              //console.log(theProductId + " : theProductId")
              //console.log(this._stockService.handleBackEnd[h].productId + " : [h].productId")
              if (theProductId == this._stockService.handleBackEnd[h].productId &&
                this.theStockId == this._stockService.handleBackEnd[h].stockId) {
                //console.log(this._stockService.handleBackEnd[h].stockId + " : h | id")

                console.log('ok')

                //updateStockPridgeQty = this._stockService.handleBackEnd[h];
                //updateStockPridgeQty.productQty = this._stockService.handleBackEnd[h].productQty + parseInt(this.invoiceInpArry[i].qty);
                // price avarage
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

                this._stockService.updateStockPridge(postStockPridgeObj).subscribe()
                console.log(postStockPridgeObj)
                this._service.clearForm();
                break
              }

              this.checkAllArry++

              if (this.checkAllArry > this.invoiceInpArry.length) { // if the product isn't in theStock's DataBase

                console.log('newProduct');
                console.log('this.invoiceInpArry.length : ' + this.invoiceInpArry.length);

                postStockPridgeObj.productId = theProductId;
                postStockPridgeObj.stockId = this.theStockId;
                postStockPridgeObj.productQty = parseInt(this.invoiceInpArry[i].qty);
                postStockPridgeObj.productCost = parseInt(this.invoiceInpArry[i].price);
                this._stockService.postStockPridge(postStockPridgeObj).subscribe();
                //console.log(postStockPridgeObj)
              }

            } // thrd for
          }
        } // snd for
        //console.log(this.invoiceInpArry[i].product)
      }

    } // fst for


  }

  addToStockPrem() {
    this.makeAddStockPremArry();
    this.resetAddinvoiceValu();
  }



  showAddNewInvoice() {
    $('#callInvoice').hide();
    $('#addInvoiceForm').show();
    this.resetAddinvoiceValu()
  }


} // end

