import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Customer } from '../customer'
import { ServicesService } from '../services.service';
import { CustomerService } from '../customer.service';
import { Router } from '@angular/router'
import { LoginService } from '../login.service';
import { CustomerInvArry } from '../accountings/customer-inv-arry';
import { StocksService } from '../accountings/stocks/the-stocks/stocks.service';
import { HandleAddPrimBE } from '../accountings/stocks/handle-add-prim-be';
import { StockTransaction } from '../accountings/stocks/stock-transaction';

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


  constructor(public formBuilder: FormBuilder, public _service: ServicesService, public _custService: CustomerService,
    public router: Router, public logService: LoginService, public _stockService: StocksService) { }

  ngOnInit() {

    this.logService.logStart(); this.logService.reternlog();

    this._custService.getCustomer().subscribe((data: Customer[]) => {
      data.shift();
      this.customers = data;
      console.log(this.customers)
    })

    this._stockService.getHandleAddtoStockPrimList().subscribe((data: HandleAddPrimBE[]) => { // get the details to make customerInvArry
      this._stockService.HandleAddtoStockPrimArry = data;
    })

    this._stockService.getStockTransactionList().subscribe((data: StockTransaction[]) => {
      this._stockService.stockTransactionArr = data;
    })

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
    })

    $("#hideInvDet").click(function () {
      $(".fadeLayer").hide();
      $('.askForDelete').removeClass('animate').hide();
      $('#customerInvDetail').hide();
    })

  }

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

  customerRemain: number;

  makeCustomerInvArry() {
    this.customerInvArry = []

    console.log(this._stockService.stockTransactionArr)
    for (let i = 0; i < this._stockService.stockTransactionArr.length; i++) {

      if (this._stockService.stockTransactionArr[i].customerId == this.customerData.value.customerId) {

        let customerInvDetail: any = {
          stockTransactionId: 0,
          invoiceNum:0,
          invoiceKind: '',
          transactionType: 0,
          invoiceTotalMin: 0,
          invoiceTotalAdd: 0,
          netTotal: 0,
        }

        customerInvDetail.stockTransactionId = this._stockService.stockTransactionArr[i].stockTransactionId;
        customerInvDetail.transactionType = this._stockService.stockTransactionArr[i].transactionType;
        customerInvDetail.invoiceNum = this._stockService.stockTransactionArr[i].invNumber;
        customerInvDetail.date_time = this._stockService.stockTransactionArr[i].date_time;
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

    console.log(this.customerInvArry)

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


  showCustomerInvoice(invoice) {

    //let sectionPosition = $("#customerInvDetail").offset().top;
    //$("html , body").animate({ scrollTop: sectionPosition }, 150);

    this._custService.customerInv = [];
    this._custService.invTotalArry = [];
    //console.log(invoice)
    for (let i = 0; i < this._stockService.HandleAddtoStockPrimArry.length; i++) {

      let customerInvDetail = {
        productName: '',
        price: 0,
        Qty: 0,
        total: 0
      }

      if (this._stockService.HandleAddtoStockPrimArry[i].stockTransactionId == invoice.stockTransactionId) {
        customerInvDetail.productName = this._stockService.HandleAddtoStockPrimArry[i].productName;
        customerInvDetail.price = this._stockService.HandleAddtoStockPrimArry[i].price;
        customerInvDetail.Qty = this._stockService.HandleAddtoStockPrimArry[i].Qty;
        customerInvDetail.total = this._stockService.HandleAddtoStockPrimArry[i].Qty * this._stockService.HandleAddtoStockPrimArry[i].price;
        this._custService.customerInv.push(customerInvDetail)
        this._custService.invTotalArry.push(customerInvDetail.total)
      }
    }
    this._custService.invoiceKind = invoice.invoiceKind;
    this._custService.date_time = invoice.date_time
    this._custService.invoiceNum = invoice.invoiceNum
    this._custService.invTotal = this._service.sumArry(this._custService.invTotalArry);
    console.log(this._custService.invTotal)
    $('.fadeLayer').show(0);
    $('#customerInvDetail').show()
  }

  // CRUD Functions
  addNewCustomer() {
    let addBtnVal = $('#addNewCustomerBtn').html()
    if (addBtnVal == 'اضافة') {
      this._custService.creatCustomer(this.customerData.value)
        .subscribe()
      console.log(this.customerData.value)
      this._service.clearForm();
      location.reload();
    } else if (addBtnVal == 'تعديل') {
      this._custService.updateCustomerSer(this.customerData.value).subscribe(() => {
        console.log(this.customerData.value);
        this.showCustomerEnquiry();
        location.reload();
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
  }

  showUpdateCustomer(customer: Customer) {
    $('.customerClass').not('#addCustomer').hide();
    $('#addCustomer').show();
    $('#addNewCustomerBtn').html('تعديل');
    $('#addCustomer h2:first').html('تعديل بيانات عميل');
    this.putCustomerDataValue(customer);
    //this.customerDataView = customer;
    // console.log(customer, this.customerDataView);
    $('#showAddCustomerBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    $('#customerEnquirybtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
  }

  showCustomerCard(customer: Customer) {
    this.putCustomerDataValue(customer);
    //this.customerDataView = customer;
    this.makeCustomerInvArry();
    $('#showAddCustomerBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    $('#customerEnquirybtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    $('.customerClass').not('#customerDetails').hide();
    $('#customerDetails').show();
    $('#customerInvDetails').show();
  }

  ShowAddNewCustomer() {
    this._service.clearForm();
    this.restValues()
    $('.customerClass').not('#addCustomer').hide();
    $('#addCustomer').show();
    $('#addNewCustomerBtn').html('اضافة');
    $('#addCustomer h2:first').html('اضافة بيانات عميل');
    $('#showAddCustomerBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('#customerEnquirybtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
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
    $('.customerClass').not('#customerEnquiry').hide();
    $('#customerEnquiry').show();
    $('#customerEnquirybtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('#showAddCustomerBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
  };
}
