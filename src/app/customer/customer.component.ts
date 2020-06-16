import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Customer } from '../customer'
import { ServicesService } from '../services.service';
import { CustomerService } from '../customer.service';
import { Router } from '@angular/router'
import { LoginService } from '../login.service';
import { CustomerInvArry } from '../accountings/customer-inv-arry';
import { StocksService } from '../accountings/stocks/the-stocks/stocks.service';
import { StockTransaction } from '../accountings/stocks/stock-transaction';
import { SafeDataService } from '../accountings/safe-acc/safe-data.service';
import { CustomerReceipt } from '../accountings/customer-receipt';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  customerData: FormGroup;
  customers: Customer[];
  //customerDataView: Customer;
  customerInvArry: any[];
  searchCust: string;
  //customerInvDetail:CustomerInvArry;
  customersInvoices: CustomerInvArry[];
  customerReceiptArr: CustomerReceipt[];
  custRemainArry: any[];

  constructor(public formBuilder: FormBuilder, public _service: ServicesService, public _custService: CustomerService,
    public router: Router, public logService: LoginService, public _stockService: StocksService, public _safeDataService: SafeDataService) { }

  ngOnInit() {

    this.logService.logStart(); this.logService.reternlog();

    this.customers = []

    this.getCustomerData_BackEnd();

    this.customerData = new FormGroup({
      customerId: new FormControl(''),
      customerName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      customerTell: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
      customerUnit: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      customerPaid: new FormControl(''),
      customerRemain: new FormControl(''),
      customerAdd: new FormControl('', [Validators.required]),
      customerDateIN: new FormControl('', [Validators.required]),
    });

    $('#hideFadeLayer').click(function () {
      $('.fadeLayer').hide();
      $('.askForDelete').removeClass('animate').hide()
    });

    //$("#customerEnquirybtn").attr("disabled", 'true');

    $("#hideInvDet").click(function () {
      $("#customerFadeLayer").hide();
      $('.fadeLayer').hide();
      $('.askForDelete').removeClass('animate').hide();
      $('#customerInvDetail').hide();
    });

    //this.setCustomerRemain()

  };

  getCustomerData_BackEnd() {

    this._custService.getCustomer().subscribe((data: Customer[]) => {
      this.customers = data;
      //console.log(this.customers)
    });

    /*this._stockService.getHandleAddtoStockPrimList().subscribe((data: HandleAddPrimBE[]) => { // get the details to make customerInvArry
      this.customersInvoices = data;
    })*/

    this._stockService.getStockTransactionList().subscribe((data: StockTransaction[]) => {
      this._stockService.stockTransactionArr = data;
    })

    this._custService.getCustomerInvArr().subscribe((data: CustomerInvArry[]) => {
      this.customersInvoices = data
    });

    this._custService.getCustomerReceipts().subscribe((data: CustomerReceipt[]) => {
      this.customerReceiptArr = data
    })

  };

  printThis() {
    let show = "#customerInvDetails";
    let hide1 = '#customerDetails';
    let hide2 = '#customerHeader';
    let hide3 = '';
    this._service.printThis(show, hide1, hide2, hide3);
    $('#printCustomerInvArr').css(
      { 'height': '100%' }
    );
    $('.navHeader').addClass('sticky-top');
    $('.date_time').show();
    $('.closeBtn').show();
  }

  getCurrentDate() {
    let currentDateNow = Date.now() //new Date()
    let currentDate = new Date(currentDateNow)
    this._service.makeTime_date(currentDate);
  }

  printThisCustomerList() {

    for (let i = 0; i < this.customers.length; i++) {
      if (this.customers[i].customerRemain < 0) {
        $(`#remain${i}`).css('color', 'red');
      } else {
        $(`#remain${i}`).css('color', 'black');
      }
    };

    let Newcustomers = this.custRemainArry.filter((customer) => {
      return customer.customerRemain != 0 && customer.customerName != 'حساب المحل - حسام' && customer.customerName != 'تست'
    });

    Newcustomers.sort(function (a, b) {
      return a.remain - b.remain;
    });
    this.custRemainArry = Newcustomers

    let show = "#customerEnquiry";
    let hide1 = '#customerHeader';
    let hide2 = '';
    let hide3 = '';
    this._service.printThis(show, hide1, hide2, hide3);
    $('#customerListTable').css(
      { 'height': '100%' }
    );
    $('.date_time').show();
    $('.closeBtn').show();
    $('.HideCol').hide();
    $('.navHeader').addClass('sticky-top');
    //window.print();
    this.getCurrentDate();

    //location.reload();
    //this.customers.sort(this._service.sortArry('customerRemain'))
  }

  openwindowPrint() {
    document.documentElement.scrollTop = 0;
    $('.closeBtn').hide();
    //custDet
    $('.custDet').hide();
    $(`.printable`).css('width', '100%');
    window.print();
    location.reload();
  }

  reloadLoc() {
    location.reload();
  };

  putCustomerDataValue(customer) {
    this.customerData = new FormGroup({
      customerId: new FormControl(customer.customerId),
      customerName: new FormControl(customer.customerName, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      customerTell: new FormControl(customer.customerTell, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
      customerUnit: new FormControl(customer.customerUnit, [Validators.required]),
      customerPaid: new FormControl(customer.customerPaid),
      customerRemain: new FormControl(customer.customerRemain),
      customerAdd: new FormControl(customer.customerAdd, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      customerDateIN: new FormControl(customer.customerDateIN, [Validators.required]),
    });
  };

  theCustomerInfo: Customer;
  getCustomerInfo(customerId: number) {
    let customerInfo = this.customers.find(
      customer => customer.customerId == customerId
    );
    return customerInfo;
  };

  customerRemain: number;

  // replaced (stockTransactionArr to _stockService.stockTransactionArr)

  makeCustomerInvArry() {

    this.customerInvArry = []

    //console.log(this._stockService.stockTransactionArr)

    this.theCustomerInfo = this.getCustomerInfo(this.customerData.value.customerId)

    if (this.theCustomerInfo.customerPaid < 0) {
      let customerInvDetail: any = {
        stockTransactionId: 0,
        invoiceNum: 0,
        invoiceKind: '',
        hideBtn: 'd-none',
        transactionType: 0,
        invoiceTotalMin: 0,
        invoiceTotalAdd: 0,
        netTotal: 0,
        notes: ''
      }
      customerInvDetail.invoiceTotalAdd = -1 * this.theCustomerInfo.customerPaid;
      customerInvDetail.invoiceKind = 'رصيد اول'
      customerInvDetail.invoiceTotalMin = 0;
      customerInvDetail.invKindColor = 'text-dark'

      this.customerInvArry.push(customerInvDetail)
    } else if (this.theCustomerInfo.customerPaid > 0) {
      let customerInvDetail: any = {
        stockTransactionId: 0,
        invoiceNum: 0,
        hideBtn: 'd-none',
        invoiceKind: '',
        transactionType: 0,
        invoiceTotalMin: 0,
        invoiceTotalAdd: 0,
        netTotal: 0,
        notes: ''
      }
      customerInvDetail.invoiceTotalAdd = 0;
      customerInvDetail.invoiceKind = 'رصيد اول'
      customerInvDetail.invoiceTotalMin = this.theCustomerInfo.customerPaid;
      customerInvDetail.invKindColor = 'text-danger'
      this.customerInvArry.push(customerInvDetail)
    }


    for (let i = 0; i < this._stockService.stockTransactionArr.length; i++) {

      if (this._stockService.stockTransactionArr[i].customerId == this.customerData.value.customerId) {

        let customerInvDetail: any = {
          stockTransactionId: 0,
          invoiceNum: 0,
          invoiceKind: '',
          hideBtn: '',
          transactionType: 0,
          invoiceTotalMin: 0,
          invoiceTotalAdd: 0,
          netTotal: 0,
          notes: ''
        }

        customerInvDetail.stockTransactionId = this._stockService.stockTransactionArr[i].stockTransactionId;
        customerInvDetail.transactionType = this._stockService.stockTransactionArr[i].transactionType;
        customerInvDetail.invoiceNum = this._stockService.stockTransactionArr[i].invNumber;
        customerInvDetail.date_time = this._stockService.stockTransactionArr[i].date_time;
        customerInvDetail.notes = this._stockService.stockTransactionArr[i].notes
        //customerInvDetail.hideBtn = 'رصيد اول'
        //date_time
        if (this._stockService.stockTransactionArr[i].transactionType == 1) {
          customerInvDetail.invoiceTotalAdd = this._stockService.stockTransactionArr[i].invoiceTotal;
          customerInvDetail.invoiceKind = 'فاتورة شراء'
          customerInvDetail.invoiceTotalMin = 0;
          customerInvDetail.invKindColor = 'text-dark'
        } else if (this._stockService.stockTransactionArr[i].transactionType == 2) {
          customerInvDetail.invoiceTotalMin = this._stockService.stockTransactionArr[i].invoiceTotal;
          customerInvDetail.invoiceKind = 'فاتورة بيع'
          customerInvDetail.invoiceTotalAdd = 0;
          customerInvDetail.invKindColor = 'text-danger'
        }
        this.customerInvArry.push(customerInvDetail)
      };
    };

    for (let r = 0; r < this.customerReceiptArr.length; r++) {

      if (this.customerReceiptArr[r].customerId == this.customerData.value.customerId) {

        let customerInvDetail: any = {
          stockTransactionId: 0,
          invoiceNum: 0,
          invoiceKind: '',
          hideBtn: 'd-none',
          transactionType: 0,
          invoiceTotalMin: 0,
          invoiceTotalAdd: 0,
          netTotal: 0,
        };

        customerInvDetail.date_time = this.customerReceiptArr[r].date_time;
        customerInvDetail.invoiceNum = this.customerReceiptArr[r].safeReceiptId;
        customerInvDetail.notes = this.customerReceiptArr[r].recieptNote;

        if (this.customerReceiptArr[r].receiptKind == 'ايصال استلام نقدية') {
          customerInvDetail.invoiceKind = `دفعة الى ${this.customerReceiptArr[r].safeName}`;
          customerInvDetail.invoiceTotalAdd = this.customerReceiptArr[r].receiptVal;
          customerInvDetail.invoiceTotalMin = 0;
          customerInvDetail.invKindColor = 'text-dark';
        } else {
          customerInvDetail.invoiceKind = `دفعة من ${this.customerReceiptArr[r].safeName}`;
          customerInvDetail.invoiceTotalMin = this.customerReceiptArr[r].receiptVal;
          customerInvDetail.invoiceTotalAdd = 0;
          customerInvDetail.invKindColor = 'text-danger';
        }
        this.customerInvArry.push(customerInvDetail);
        //console.log(this.customerData.value.customerName)
      }
    }

    //console.log(this.theCustomerInfo)
    this.customerInvArry.sort(this._service.sortArry('date_time'))

    for (let c = 0; c < this.customerInvArry.length; c++) {

      if (c == 0) {
        this.customerInvArry[c].netTotal = parseInt(this.customerInvArry[c].invoiceTotalMin) - parseInt(this.customerInvArry[c].invoiceTotalAdd);
        if (this.customerInvArry[c].netTotal < 0) {
          this.customerInvArry[c].netTotalColor = 'text-danger'
        } else {
          this.customerInvArry[c].netTotalColor = 'text-dark'
        }
      } else {
        this.customerInvArry[c].netTotal = parseInt(this.customerInvArry[c - 1].netTotal) - parseInt(this.customerInvArry[c].invoiceTotalAdd) + parseInt(this.customerInvArry[c].invoiceTotalMin)
        if (this.customerInvArry[c].netTotal < 0) {
          this.customerInvArry[c].netTotalColor = 'text-danger'
        } else {
          this.customerInvArry[c].netTotalColor = 'text-dark'
        }
      }
    }

  };


  setCustomerRemain() {

    $('#containerLoader').fadeIn();

    let invoices: StockTransaction[];
    let reciepts: CustomerReceipt[];
    this.custRemainArry = [];

    const getInvoices = new Promise((res, rej) => {
      this._stockService.getStockTransactionList().subscribe((data: StockTransaction[]) => {
        invoices = data;
        res('done')
      });
    });

    const getRecipts = new Promise((res) => {
      this._custService.getCustomerReceipts().subscribe((data: CustomerReceipt[]) => {
        reciepts = data
        res('getRecipts')
      })
      //console.log(reciepts)

    })

    const makeCustRem = () => {
      return new Promise((res) => {

        for (let i = 0; i < this.customers.length; i++) {

          let custInfo = this.getCustomerInfo(this.customers[i].customerId);

          let fstPaid: number = 0;

          if (custInfo.customerPaid != 0) { fstPaid = custInfo.customerPaid };

          let cust = {
            customerName: custInfo.customerName,
            customerId: custInfo.customerId,
            customerTell: custInfo.customerTell,
            customerUnit: custInfo.customerUnit,
            customerPaid: custInfo.customerPaid,
            customerAdd: custInfo.customerAdd,
            customerDateIN: custInfo.customerDateIN,
            customerRemain: 0,
            paid: fstPaid,
            addValsInvoices: [],
            minValsInvoices: [],
            addValsReciept: [],
            minValsReciept: [],
            remain: 0,
          };

          let plusValInv = invoices
            .filter(invoice => invoice.transactionType == 2 && invoice.customerId == custInfo.customerId)
            .map(invoice => invoice.invoiceTotal);

          let minValInv = invoices
            .filter(invoice => invoice.transactionType == 1 && invoice.customerId == custInfo.customerId)
            .map(invoice => invoice.invoiceTotal);

          let plusValRec = reciepts
            .filter(reciept => reciept.customerId == custInfo.customerId && reciept.receiptKind == 'ايصال صرف نقدية')
            .map(reciept => reciept.receiptVal);

          let minValRec = reciepts
            .filter(reciept => reciept.customerId == custInfo.customerId && reciept.receiptKind == 'ايصال استلام نقدية')
            .map(reciept => reciept.receiptVal);

          //console.log(plusVal)
          cust.addValsInvoices = plusValInv; //.push(plusVal);
          cust.minValsInvoices = minValInv; //.push(minVal);
          cust.addValsReciept = plusValRec;
          cust.minValsReciept = minValRec;
          cust.remain =
            (this._service.sumArry(cust.addValsInvoices) + this._service.sumArry(cust.addValsReciept) + cust.paid) -
              (this._service.sumArry(cust.minValsInvoices) + this._service.sumArry(cust.minValsReciept))
            /* (this._service.sumArry(cust.addValsInvoices) - this._service.sumArry(cust.minValsInvoices)) +
            (this._service.sumArry(cust.addValsReciept) - this._service.sumArry(cust.minValsReciept)); */
          cust.customerRemain = cust.remain;

          this.custRemainArry.push(cust);

          custInfo.customerRemain = cust.remain;

          //this.syncBackend(custInfo);
        };

        res('makeCustRem')
      })

    };

    Promise.all([getInvoices, getRecipts]).then(makeCustRem).then(() => {
      //console.log(this.custRemainArry);
      $('#containerLoader').fadeOut();
      this.showCustomerEnquiry();
      //console.log(reciepts);
    });

  };

  syncBackend(cust: Customer) {
    this._custService.updateCustomerSer(cust).subscribe();
  }

  showCustomerInvoice(invoice) {

    this._custService.customerInv = [];
    this._custService.invTotalArry = [];
    //console.log(invoice)
    for (let i = 0; i < this.customersInvoices.length; i++) {

      let customerInvDetail = {
        productName: '',
        price: 0,
        Qty: 0,
        total: 0
      }

      if (this.customersInvoices[i].stockTransactionId == invoice.stockTransactionId) {
        customerInvDetail.productName = this.customersInvoices[i].productName;
        customerInvDetail.price = this.customersInvoices[i].price;
        customerInvDetail.Qty = this.customersInvoices[i].Qty;
        customerInvDetail.total = this.customersInvoices[i].Qty * this.customersInvoices[i].price;
        this._custService.customerInv.push(customerInvDetail);
        this._custService.invTotalArry.push(customerInvDetail.total);
      }
    };

    this._custService.invoiceKind = invoice.invoiceKind;
    this._custService.date_time = invoice.date_time
    this._custService.invoiceNum = invoice.invoiceNum
    this._custService.invTotal = this._service.sumArry(this._custService.invTotalArry);
    //console.log(invoice)
    $('#customerFadeLayer').show(0);
    $('#customerInvDetail').show()
  }



  // CRUD Functions
  addNewCustomer() {
    let addBtnVal = $('#addNewCustomerBtn').html()
    if (addBtnVal == 'اضافة') {

      this.customerData.value.customerRemain = this.customerData.value.customerPaid;
      this._custService.creatCustomer(this.customerData.value)
        .subscribe()
      //console.log(this.customerData.value)
      this._service.clearForm();
      //location.reload();

    } else if (addBtnVal == 'تعديل') {

      //this.customerData.value.customerRemain = this.customerData.value.customerPaid;
      this._custService.updateCustomerSer(this.customerData.value).subscribe(() => {
        //console.log(this.customerData.value);
        this.showCustomerEnquiry();
        //location.reload();
      },
        error => {
          // alert(error);
          //console.log(this.customerDataView);
        });
    };

  };

  askForDelete(customer: Customer) {
    $('.fadeLayer').show(0)
    $('.askForDelete').show().addClass('animate')
    this.putCustomerDataValue(customer);
    //this.customerDataView = customer;
    //console.log(this.customerDataView)
  }
  deletCustomer() {
    $('.fadeLayer').hide()
    this._custService.deleteCustomerSer(this.customerData.value.customerId)
      .subscribe(data => {
        this.customers = this.customers.filter(u => u !== this.customerData.value)
      });
  };

  buttonEffect(max: string, min: string) {
    $(max).removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $(max).attr({ "disabled": true });

    $(min).removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    $(min).attr({ "disabled": false });
  };

  showUpdateCustomer(customer: Customer) {
    $('#printCustomerList').hide(150)
    $('.customerClass').not('#addCustomer').hide();
    $('#addCustomer').show();
    $('#addNewCustomerBtn').html('تعديل');
    $('#addCustomer h2:first').html('تعديل بيانات عميل');
    this.putCustomerDataValue(customer);
    //this.customerDataView = customer;
    // //console.log(customer, this.customerDataView);
    this.buttonEffect('#showAddCustomerBtn', '#customerEnquirybtn');
  };

  customerRemainColor: string
  showCustomerCard(customer: Customer) {

    $('#printCustomerList').hide(150)
    this.putCustomerDataValue(customer);
    //this.customerDataView = customer;
    this.makeCustomerInvArry();
    if (customer.customerRemain < 0) {
      this.customerRemainColor = 'text-danger'
      //$('#customerRemainCard').css('color', 'red')
    } else {
      this.customerRemainColor = 'text-dark'
    }
    //console.log(this.customerRemainColor)
    //this.buttonEffect('#showAddCustomerBtn','#customerEnquirybtn');
    $('#showAddCustomerBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    $('#customerEnquirybtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    $("#customerEnquirybtn").attr({ "disabled": false });
    $("#showAddCustomerBtn").attr({ "disabled": false });

    $('.customerClass').not('#customerDetails').hide();
    //$('#customerDetails').show();
    $('#customerInvDetails').show();
  }

  ShowAddNewCustomer() {
    this._service.clearForm();
    $('#printCustomerList').hide(150)
    this.restValues()
    $('.customerClass').not('#addCustomer').hide();
    $('#addCustomer').show();
    $('#addNewCustomerBtn').html('اضافة');
    $('#addCustomer h2:first').html('اضافة بيانات عميل');
    this.buttonEffect('#showAddCustomerBtn', '#customerEnquirybtn');
  };

  restValues() {
    this.customerData = new FormGroup({
      customerId: new FormControl(''),
      customerName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      customerTell: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
      customerUnit: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      customerPaid: new FormControl(''),
      customerRemain: new FormControl(''),
      customerAdd: new FormControl('', [Validators.required]),
      customerDateIN: new FormControl('', [Validators.required]),
    });
  };

  showCustomerEnquiry() {
    this.searchCust = null;
    //this.getCustomerData_BackEnd();
    $('#printCustomerList').show(150)
    $('.customerClass').not('#customerEnquiry').hide();
    $('#customerEnquiry').show();
    this.buttonEffect('#customerEnquirybtn', '#showAddCustomerBtn');
  };
}
