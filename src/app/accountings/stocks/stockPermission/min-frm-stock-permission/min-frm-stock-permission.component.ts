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
import { Stock } from 'src/app/accountings/stock';

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
  stockDetailsIdArr: any;

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
      $('.askForDelete').removeClass('animate');
      $('#fadeLayerMP').hide();
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

    this._service.printThis();
  };

  reloadLoc() {
    location.reload();
  };

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

  minAddFilds() {
    this.invoiceInp = new InvoiceInp();
    this.invoiceInp.total = 0;
    this.invoiceInpArry.push(this.invoiceInp);
    this.deleteMinInvBtnDisabled = true;
  };
  //theStockProd: any;
  theStockProds: any;
  inputDisabled: boolean = true;

  customerInpArry: Customer[];

  createCustomerInpArry = () => {

    if (this.stockNameInpt != undefined) {
      if (this.stockNameInpt.includes('حسام')) {
        this.customerInpArry = this.customers.filter(customer => customer.customerName.includes('- حسام'))
      } else if (this.stockNameInpt.includes('سيف')) {
        this.customerInpArry = this.customers.filter(customer => customer.customerName.includes('- سيف'))
      } else {
        this.customerInpArry = this.customers
      }
    } else {
      this.customerInpArry = this.customers
    }

  };

  makeTheStockProds() {

    this.makeCustomerCss();

    let stockInfo: Stock = this._stockService.stocks.find(stock => stock.stockName == this.stockNameInpt);

    this._theStockComp.getStockTrance.then((data: any[]) => {
      this.theStockProds = this._theStockComp.stockProdFactory(stockInfo)
    });

    // stockNameForMin
    if (this.stockNameInpt.includes('سيف')) {
      $('#stockNameForMin').addClass('bg-info text-white')
    } else {
      $('#stockNameForMin').removeClass('bg-info text-white')
    }

    this.inputDisabled = false;

    if (this.custNameInpt) {
      this.isCustNameInvaild();
    };
  }

  stockNameVaild: boolean;
  isAddInvVaild: boolean = false;
  productArr: any[] = [];
  isMinInvInvaild: boolean = false;

  stockNameInpt: string;
  custNameInpt: string;

  isMinNameVaild(i) { // inputValidation

    this.deleteMinInvBtnDisabled = true;
    let index: number;
    let found: boolean;

    if (this.invoiceInpArry[i].price != undefined || this.invoiceInpArry[i].qty != undefined) {

      if (this.invoiceInpArry[i].product != undefined || this.invoiceInpArry[i].product != '') {

        if (this.productArr.includes(this.invoiceInpArry[i].product)) {
          this.invoiceInpArry[i].inpVaild = false;
          $(`#product${i}`).removeClass('is-invaild');
        } else {
          this.invoiceInpArry[i].inpVaild = true;
          this.invoiceInpArry[i].productVaildMsg = 'خطأ فى اسم الصنف'
          // product{{i}}
          $(`#product${i}`).addClass('is-invaild');
        };

        if (this.invoiceInpArry[i].Qtyinvaild == true) {
          this.invoiceInpArry[i].qty = null;
          this.invoiceInpArry[i].Qtyinvaild = false;
          $(`#product${i}`).removeClass('is-invaild');
        };

      };

    };

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
    } else {
      found = false
    }

    if (index) {
      if (found == true) {
        this.invoiceInpArry[index].inpVaild = true;
        this.invoiceInpArry[index].productVaildMsg = 'لا يمكن تكرار هذا الصنف'
        $(`#product${index}`).addClass('is-invaild');
      } else if (found == false) {
        this.invoiceInpArry[index].inpVaild = false;
        $(`#product${index}`).removeClass('is-invaild');
      }
    }

    if (this.invoiceInpArry[i].inpVaild == true) {
      this.isMinInvInvaild = true;
    } else if (this.invoiceInpArry[i].inpVaild == false) {
      this.isMinInvInvaild = false;
    }

    if (this.invoiceInpArry[i].product == '') {

      //if (this.invoiceInpArry[i].price > 0 || this.invoiceInpArry[i].qty >= 0) {

      //if (this.invoiceInpArry[i + 1] != undefined) {
      let subBtn = $('#minNewInvoicetBtn').html()
      if (subBtn == 'تعديل الفاتورة') {
        if (this.invoiceInpArry[i + 1].product != undefined || this.invoiceInpArry[i + 1].product != '' || this.invoiceInpArry[i + 1].product != null) {
          this.stockDetailsIdArr.push(this.invoiceInpArry[i].stockTransactionDetailsId)
          this.invoiceInpArry.splice(i, 1)
          //console.log(this.stockDetailsIdArr)
          this.calcTotals(null)
        } else {
          this.invoiceInpArry[i].price = null;
          this.invoiceInpArry[i].qty = null;
          this.invoiceInpArry[i].total = 0;
          this.calcTotals(null)
        };
      } else {
        if (this.invoiceInpArry[i + 1].product != undefined || this.invoiceInpArry[i + 1].product != '' || this.invoiceInpArry[i + 1].product != null) {
          this.invoiceInpArry.splice(i, 1)
        } else {
          this.invoiceInpArry[i].price = null;
          this.invoiceInpArry[i].qty = null;
          this.invoiceInpArry[i].total = 0;
        }
      }
      //};
      //};
    };

  } // isMinNameVaild

  qtyIsOkArry: any[];

  //theProductQtyInfo: any;
  getTheProdQty(productName) {
    let productQtyInfo = this.theStockProds.find(
      product => product.productName == productName
    )
    return productQtyInfo
  }

  isAddQtyVaild(i) {

    this.deleteMinInvBtnDisabled = true;

    if (this.invoiceInpArry[i].product != undefined && this.invoiceInpArry[i].product != '') {
      if (this.theStockProds.length == 0) {
        this.invoiceInpArry[i].Qtyinvaild = true;
        this.invoiceInpArry[i].qtyMsg = `لا يوجد رصيد لهذا الصنف`
      } else {
        let theProductQtyInfo = this.getTheProdQty(this.invoiceInpArry[i].product);

        if (theProductQtyInfo != undefined) {

          if (this.invoiceInpArry[i].product == theProductQtyInfo.productName &&
            this.invoiceInpArry[i].qty > theProductQtyInfo.productQty) {

            if (this.qtyIsOkArry == undefined) {
              this.invoiceInpArry[i].Qtyinvaild = true;
              this.invoiceInpArry[i].qtyMsg = `الرصيد المتاح ( ${theProductQtyInfo.productQty} )`
            } else if (this.qtyIsOkArry[i] == 0) {
              this.invoiceInpArry[i].Qtyinvaild = true;
              this.invoiceInpArry[i].qtyMsg = `الرصيد المتاح ( ${theProductQtyInfo.productQty} )`
            } else if (this.invoiceInpArry[i].qty <= this.qtyIsOkArry[i]) {
              this.invoiceInpArry[i].Qtyinvaild = false;
            } else if (this.invoiceInpArry[i].product == theProductQtyInfo.productName
              && this.invoiceInpArry[i].qty <= theProductQtyInfo.productQty
              && this.invoiceInpArry[i].inpVaild == false) {
              this.invoiceInpArry[i].Qtyinvaild = false;
            };

          } else {
            this.invoiceInpArry[i].Qtyinvaild = false;
          }

        } else {
          this.invoiceInpArry[i].Qtyinvaild = true;
          this.invoiceInpArry[i].qtyMsg = 'لا يوجد رصيد لهذا الصنف'

        };
      };
    };

    for (let i = 0; i < this.invoiceInpArry.length; i++) {
      if (this.invoiceInpArry[i].Qtyinvaild == true) {
        this.isMinInvInvaild = true;
        break
      } else {
        this.isMinInvInvaild = false;
      };
    };

  } // isAddQtyVaild

  custNameInvaild: boolean;
  custVaildMsg: string;

  customerCss: any[]

  makeCustomerCss() {

    this.createCustomerInpArry();

    this.custClass = ''
    this.customerCss = this.customerInpArry.map((cust) => {
      return {
        name: cust.customerName,
        css: () => {
          if (cust.customerName.includes('- سيف')) {
            return 'font-weight-bolder text-light bg-info'
          } else {
            return ''
          };
        },
      };
    });
  };

  custClass: string = '';

  isCustNameInvaild() {
    //this.custNameInpt //$('#customerNameForMin').val()

    //this.makeCustomerCss();

    for (let i = 0; i < this.customerCss.length; i++) {
      if (this.custNameInpt == this.customerCss[i].name) {
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
    };

    if (!this.custNameInvaild) {
      let cCss = this.customerCss.find(cust => cust.name == this.custNameInpt)
      if (cCss) {
        this.custClass = cCss.css();
      }
    };

  };

  invoiceTotal: string = '0';
  calcTotals(i) {

    this.deleteMinInvBtnDisabled = true;
    this.totalInvoice = []
    this.invoiceTotal = '0'

    if (i != null) {
      this.isAddQtyVaild(i);
      if (this.invoiceInpArry[i].price > 0 && this.checkENU(this.invoiceInpArry[i].qty, 'and', 'equal')) {
        this.invoiceInpArry[i].Qtyinvaild = true;
        this.invoiceInpArry[i].qtyMsg = `لا يمكن ترك الكمية فارغة`
      } else {
        this.invoiceInpArry[i].Qtyinvaild = false;
        this.isAddInvVaild = false;
      }
      if (this.invoiceInpArry[i].Qtyinvaild == false) {
        if (this.invoiceInpArry[i].price > 0) {
          this.invoiceInpArry[i].total = this.invoiceInpArry[i].qty * this.invoiceInpArry[i].price
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
  } // calcTotals

  theStockId: number;
  theCustomerId: number;

  getTheCustomerId() {
    let theCustomer = this.custNameInpt
    let custInfo = this.customers.find(customer => customer.customerName == theCustomer);
    if (custInfo != undefined) {
      this.theCustomerId = custInfo.customerId;
    }
  }; // getTheCustomerId

  getTheStockId() {
    let stockInfo: Stock = this._stockService.stocks.find(stock => stock.stockName == this.stockNameInpt);
    if (stockInfo != undefined) {
      this.theStockId = stockInfo.stockId;
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

  ivoiceItemesForEdit: any[] = [];

  invNumMin: number;

  date_time: string;

  ShowMinNewInvoice() {

    this.makeCustomerCss();

    this.getTheStockId()
    //this.makeTheStockProds()
    this.productArr = this._stockService.allProducts.map(prod => prod.productName);

    let callInvoiceBtnVal: string = $('#minCallInvoiceBtn').html();
    this.invoiceInpArry = [];
    this.ivoiceItemesForEdit = [];

    for (let i = 0; i < 10; i++) {
      this.invoiceInp = new InvoiceInp();
      this.invoiceInp.total = 0;
      this.invoiceInpArry.push(this.invoiceInp);
    };

    if (callInvoiceBtnVal == "فاتورة جديدة") {
      let currentDateNow = Date.now() //new Date()
      let currentDate = new Date(currentDateNow)
      this._service.makeTime_date(currentDate);

      $('#invNumMin').hide();
      $('#minCallInvoice').hide();
      $('#minInvoiceForm').slideDown('fast');
      $('#minNewInvoicetBtn').html("تسجيل")
      $('#deleteMinInvoice').hide();
      $('#minStockTransactionId').val('');

      this.inputDisabled = true;
      this.isMinInvInvaild = true;
      this.custNameInvaild = false;

      this._service.clearForm();
      this.resetAddinvoiceValu();

    } else if (callInvoiceBtnVal == "بحث") {
      $('#minNewInvoicetBtn').html("تعديل الفاتورة");
      $('#deleteMinInvoice').show();
      $('#invNumMin').show();
      $('#stockNameForAdd').removeClass('bg-info text-white');

      this.inputDisabled = false;

      //this.isMinInvInvaild = true;
      let theInvoiceInfo = this._stockService.makeInvoiceArry.find(invoice => invoice.invoiceSearchVal == this.searchInVal);

      this.invoiceInpArry = [];

      for (let i = 0; i < theInvoiceInfo.invoiceDetails.length; i++) {
        this.minAddFilds()
      };

      //this.resetAddinvoiceValu();

      $('#minStockTransactionId').val(theInvoiceInfo.stockTransactionId);
      for (let d = 0; d < theInvoiceInfo.invoiceDetails.length; d++) {
        //this.ivoiceItemesForEdit.push(theInvoiceInfo.invoiceDetails[d]);
        this.invoiceInpArry[d].stockTransactionDetailsId = theInvoiceInfo.invoiceDetails[d].stockTransactionDetailsId;
        this.invoiceInpArry[d].product = theInvoiceInfo.invoiceDetails[d].productName;
        this.invoiceInpArry[d].price = theInvoiceInfo.invoiceDetails[d].price;
        this.invoiceInpArry[d].qty = theInvoiceInfo.invoiceDetails[d].Qty;
      };

      this.ivoiceItemesForEdit = theInvoiceInfo.invoiceDetails

      this._service.date_time = theInvoiceInfo.date_time;
      this.stockNameInpt = theInvoiceInfo.stockName;
      $('#stockNameForMin').val(theInvoiceInfo.stockName);
      this.custNameInpt = theInvoiceInfo.customerName
      $('#customerNameForMin').val(theInvoiceInfo.customerName);
      $('#minInvoiceNote').val(theInvoiceInfo.notes);
      this.invNumMin = theInvoiceInfo.invNumber;

      this.makeTheStockProds()
      this.calcTotals(null);
      this.qtyIsOkArry = [];
      for (let v = 0; v < this.invoiceInpArry.length; v++) {
        this.invoiceInpArry[v].inpVaild = false;
        if (this.invoiceInpArry[v].Qtyinvaild != true) {
          let theQtyIsOk = this.invoiceInpArry[v].qty;
          this.qtyIsOkArry.push(theQtyIsOk)
        } else {
          this.qtyIsOkArry.push(0)
        }
      }
      //this.isAddQtyVaild();
      $('#minCallInvoice').hide();
      $('#minInvoiceForm').slideDown('fast');

      let cCss = this.customerCss.find(cust => cust.name == theInvoiceInfo.customerName)
      this.custClass = cCss.css();

      this.stockDetailsIdArr = [];

    }
    this.deleteMinInvBtnDisabled = false;

  }; // ShowMinNewInvoice

  theCustomerInfo: Customer;

  editStockQtysPre() {

    this._stockService.getHandleBackEnd().subscribe((data: HandleBackEnd[]) => {
      this._stockService.handleBackEnd = data;
    })

    //this.getTheStockId();
    let BtnSubmitHtml = $('#minNewInvoicetBtn').html(); // to check if invoice for update or add
    let theProductId: number;
    let postStockPridgeObj = new StockPridge();

    if (BtnSubmitHtml == "تعديل الفاتورة") {

      this.theCustomerInfo = this.getCustomerInfo(this.ivoiceItemesForEdit[0].customerId)
      this.theCustomerInfo.customerRemain = this.theCustomerInfo.customerRemain - this.ivoiceItemesForEdit[0].invoiceTotal;
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

        postStockPridgeObj = {
          productId: theProductId,
          stockId: this.ivoiceItemesForEdit[v].stockId,
          stockProductId: getHandleInfo.stockProductId,
          productQty: getHandleInfo.productQty + parseInt(this.ivoiceItemesForEdit[v].Qty),
          productCost: getHandleInfo.productCost,
          productPrice: getHandleInfo.productPrice,
        };

        this._stockService.handleBackEnd[indx].productQty = postStockPridgeObj.productQty;
        this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB

      };
    };

  }; // editStockQtys

  editStockQtys() {

    //this.getTheStockId();
    let BtnSubmitHtml = $('#minNewInvoicetBtn').html(); // to check if invoice for update or add
    let theProductId: number;
    let postStockPridgeObj = new StockPridge();

    if (BtnSubmitHtml == "تعديل الفاتورة") {

      this.theCustomerInfo = this.getCustomerInfo(this.ivoiceItemesForEdit[0].customerId);

      this.theCustomerInfo.customerRemain = this.theCustomerInfo.customerRemain - this.ivoiceItemesForEdit[0].invoiceTotal;
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

        postStockPridgeObj = {
          productId: theProductId,
          stockId: this.ivoiceItemesForEdit[v].stockId,
          stockProductId: getHandleInfo.stockProductId,
          productQty: getHandleInfo.productQty + parseInt(this.ivoiceItemesForEdit[v].Qty),
          productCost: getHandleInfo.productCost,
          productPrice: getHandleInfo.productPrice,
        };

        postStockPridgeObj = new StockPridge()

        this._stockService.handleBackEnd[indx].productQty = postStockPridgeObj.productQty;
        this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB
      };
    };

    //return Promise.resolve('qtyEdited')

  }; // editStockQtys

  makeMinStockPremArry() {

    const getHandle = new Promise((res) => {
      this._stockService.getHandleBackEnd().subscribe((data: HandleBackEnd[]) => {
        this._stockService.handleBackEnd = data;
        res(data)
      })
    }).then(() => this.editStockQtys())
      .then(() => {

        this.getTheStockId();
        this.getTheCustomerId();

        let theProductId: number;
        this.checkAllArry = 1; // check after loop on the handleArry that the product not found
        this.theNote = $('#minInvoiceNote').val();
        this.theStockTransactionId = $('#minStockTransactionId').val();

        // mainTable
        let stockTransaction: StockTransaction = {
          stockTransactionId: Date.now().toString(),
          invNumber: this._theStockComp.newMinInvNumber,
          stockId: this.theStockId,
          sndStockId: 1,
          customerId: this.theCustomerId,
          transactionType: 2,
          invoiceTotal: parseFloat(this.invoiceTotal),
          date_time: this._service.date_time,
          notes: this.theNote,
        };

        this.theCustomerInfo = this.getCustomerInfo(this.theCustomerId);
        this.theCustomerInfo.customerRemain = this.theCustomerInfo.customerRemain + parseInt(this.invoiceTotal);
        this._custService.updateCustomerSer(this.theCustomerInfo).subscribe();

        // edit or add
        if (this.theStockTransactionId == '') {

          this._stockService.creatStockTransaction(stockTransaction).subscribe();

        } else {

          stockTransaction.stockTransactionId = this.theStockTransactionId;
          this._stockService.UpdateStockTransaction(stockTransaction).subscribe();
        };

        let BtnSubmitHtml = $('#minNewInvoicetBtn').html(); // to check if invoice for update or add

        for (let i = 0; i < this.invoiceInpArry.length; i++) {

          // if not productName to delete stocktransactionDetail
          if (this.invoiceInpArry[i].stockTransactionDetailsId != undefined && this.invoiceInpArry[i].product == '') {
            this._stockService.deleteStockTransactionDetails(this.invoiceInpArry[i].stockTransactionDetailsId).subscribe();
          };

          let postStockPridgeObj = new StockPridge();
          let stockTransactionD = new StockTransactionD();

          if (this.invoiceInpArry[i].product != undefined && this.invoiceInpArry[i].product != '') {

            let getProductInfo = this._stockService.allProducts.find(
              product => product.productName === this.invoiceInpArry[i].product
            );

            theProductId = getProductInfo.productId;

            // for the first invoice
            if (this._stockService.handleBackEnd.length == 0) {

              postStockPridgeObj = {
                stockProductId: null,
                productId: theProductId,
                stockId: this.theStockId,
                productQty: parseInt(this.invoiceInpArry[i].qty),
                productPrice: parseFloat(this.invoiceInpArry[i].price),
                productCost: 0,
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

            }; // for the first invoice

            let getHandleInfo = this._stockService.handleBackEnd.find(
              handleInfo => handleInfo.productId == theProductId &&
                handleInfo.stockId == this.theStockId
            );

            if (getHandleInfo != undefined) {

              postStockPridgeObj = {
                productId: theProductId,
                stockId: this.theStockId,
                productCost: getHandleInfo.productCost,
                productPrice: parseFloat(this.invoiceInpArry[i].price),
                productQty: getHandleInfo.productQty - parseInt(this.invoiceInpArry[i].qty),
                stockProductId: getHandleInfo.stockProductId
              };

              this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB

              // save stocktransactionDetails
              stockTransactionD = {
                stockTransactionDetailsId: null,
                stockTransactionId: stockTransaction.stockTransactionId,
                productId: theProductId,
                price: parseFloat(this.invoiceInpArry[i].price),
                Qty: parseInt(this.invoiceInpArry[i].qty)
              };

              // edite Or Add
              if (BtnSubmitHtml == "تعديل الفاتورة") {

                stockTransactionD.stockTransactionDetailsId = this.invoiceInpArry[i].stockTransactionDetailsId;

                if (stockTransactionD.stockTransactionDetailsId == undefined) {
                  this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB

                };

                this._stockService.UpdateStockTransactionDetails(stockTransactionD).subscribe();

              } else if (BtnSubmitHtml == "تسجيل") {
                this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB

              };

            } else {

              postStockPridgeObj = {
                stockProductId: null,
                productId: theProductId,
                stockId: this.theStockId,
                productQty: parseInt(this.invoiceInpArry[i].qty),
                productCost: getHandleInfo.productCost,
                productPrice: parseFloat(this.invoiceInpArry[i].price),
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

            };
          };
        }; // fst loop
      })

  }; // makeMinStockPremArry

  makeMinStockPremArryPre() {

    this.getTheStockId();
    this.getTheCustomerId();
    this.editStockQtys(); // if edite will min all old invoice Qtys from stock Qtys 

    let theProductId: number;
    this.checkAllArry = 1; // check after loop on the handleArry that the product not found
    this.theNote = $('#minInvoiceNote').val();
    this.theStockTransactionId = $('#minStockTransactionId').val();

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
    };

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

    };

    let BtnSubmitHtml = $('#minNewInvoicetBtn').html(); // to check if invoice for update or add

    for (let i = 0; i < this.invoiceInpArry.length; i++) {

      let postStockPridgeObj = new StockPridge();
      let stockTransactionD = new StockTransactionD();

      if (this.invoiceInpArry[i].product !== undefined || this.invoiceInpArry[i].product !== '') {

        let getProductInfo = this._stockService.allProducts.find(
          product => product.productName === this.invoiceInpArry[i].product
        );

        theProductId = getProductInfo.productId;

        // for the first invoice
        if (this._stockService.handleBackEnd.length == 0) {

          postStockPridgeObj = {
            stockProductId: null,
            productId: theProductId,
            stockId: this.theStockId,
            productQty: parseInt(this.invoiceInpArry[i].qty),
            productPrice: parseInt(this.invoiceInpArry[i].price),
            productCost: 0,
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

        }; // for the first invoice

        let getHandleInfo = this._stockService.handleBackEnd.find(
          handleInfo => handleInfo.productId == theProductId &&
            handleInfo.stockId == this.theStockId
        );

        if (getHandleInfo != undefined) {

          postStockPridgeObj = {
            productId: theProductId,
            stockId: this.theStockId,
            productCost: getHandleInfo.productCost,
            productPrice: parseInt(this.invoiceInpArry[i].price),
            productQty: getHandleInfo.productQty - parseInt(this.invoiceInpArry[i].qty),
            stockProductId: getHandleInfo.stockProductId
          };

          this._stockService.updateStockPridge(postStockPridgeObj).subscribe() // for stocks DB

          // save stocktransactionDetails
          stockTransactionD = {
            stockTransactionDetailsId: null,
            stockTransactionId: stockTransaction.stockTransactionId,
            productId: theProductId,
            price: parseInt(this.invoiceInpArry[i].price),
            Qty: parseInt(this.invoiceInpArry[i].qty)
          };

          // edite Or Add
          if (BtnSubmitHtml == "تعديل الفاتورة") {

            stockTransactionD.stockTransactionDetailsId = this.invoiceInpArry[i].stockTransactionDetailsId;

            if (stockTransactionD.stockTransactionDetailsId == undefined) {
              this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB

            };
            // if not productName to delete stocktransactionDetail
            for (let d = 0; d < this.invoiceInpArry.length; d++) {
              if (this.invoiceInpArry[d].stockTransactionDetailsId !== undefined && this.invoiceInpArry[d].product == '') {
                this._stockService.deleteStockTransactionDetails(this.invoiceInpArry[d].stockTransactionDetailsId).subscribe();
              };
            };
            this._stockService.UpdateStockTransactionDetails(stockTransactionD).subscribe();

          } else if (BtnSubmitHtml == "تسجيل") {
            this._stockService.creatStockTransactionDetails(stockTransactionD).subscribe() // for invoice DB

          };
        } else {
          postStockPridgeObj = {
            stockProductId: null,
            productId: theProductId,
            stockId: this.theStockId,
            productQty: parseInt(this.invoiceInpArry[i].qty),
            productCost: getHandleInfo.productCost,
            productPrice: parseInt(this.invoiceInpArry[i].price),
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

        };
      };
    }; // fst loop

  }; // makeMinStockPremArry

  showInvoiceDone() {
    this._theStockComp.ngOnInit();
    this._stockService.invoiceDoneMsg = {
      invoiceKind: 'فاتورة البيع',
      from: $('#stockNameForMin').val(),
      to: this.custNameInpt,
      invoiceVal: parseInt(this.invoiceTotal),
      invoiceNote: $('#minInvoiceNote').val(),
    }
    this._theStockComp.showFade_newInvoice('fade_minNewApBtn');
  };

  minFrmStockPrem() {
    this.makeMinStockPremArry();
    this.showInvoiceDone();

    // delete invDetail when delete the productName
    if (this.stockDetailsIdArr != undefined) {
      if (this.stockDetailsIdArr.length != 0) {
        for (let i = 0; i < this.stockDetailsIdArr.length; i++) {
          this._stockService.deleteStockTransactionDetails(this.stockDetailsIdArr[i]).subscribe();
          console.log('detail id deleted')
        };
      }
    }
  }; // minFrmStockPrem

  showDeleteMinInvoice() {
    $('#fadeLayerMP').show(0);
    $('.askForDelete').addClass('animate');
    let stockTransId = $('#minStockTransactionId').val();
  };

  deleteMinInvoice() {

    $('.askForDelete').removeClass('animate');
    $('#fadeLayerMP').hide();

    let stockTransId = $('#minStockTransactionId').val();

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
      };
       */
    };

    this._stockService.deleteStockTransaction(stockTransId).subscribe();
    this.editStockQtys();
    //location.reload();
    this._theStockComp.showStocksEnquiry();
    //this.refreshBackendData();

  };


  minTestBtn() {
  } // minTestBtn

} // End