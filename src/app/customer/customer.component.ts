import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'
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
  customerDataView: Customer;
  customerInvArry: any[];
  //customerInvDetail:CustomerInvArry;


  constructor(private formBuilder: FormBuilder, private _service: ServicesService, private _custService: CustomerService,
    private router: Router, private logService: LoginService, private _stockService:StocksService) { }

  ngOnInit() {

    this.logService.logStart(); this.logService.reternlog();
    /*if (this.logService.isUser == false) {
      this.router.navigate(['/logIn'])
    }*/
    this._custService.getCustomer().subscribe((data: Customer[]) => {
      this.customers = data;
    })

    this._stockService.getHandleAddtoStockPrimList().subscribe((data: HandleAddPrimBE[]) => { // get the details to make customerInvArry
      this._stockService.HandleAddtoStockPrimArry = data;
    })

    this._stockService.getStockTransactionList().subscribe((data: StockTransaction[]) => {
      this._stockService.stockTransactionArr = data;
    })

    this.customerDataView = {
      customerId: null,
      customerName: null,
      customerTell: null,
      customerUnit: null,
      customerPaid: null,
      customerRemain: null,
      customerAdd: null,
      customerDateIN: null,
    }

    this.customerData = this.formBuilder.group({
      customerId: [''],
      customerName: [''],
      customerTell: [''],
      customerUnit: [''],
      customerPaid: [''],
      customerRemain: [''],
      customerAdd: [''],
      customerDateIN: [''],
    })

    $('#hideFadeLayer').click(function () {
      $('.fadeLayer').hide();
      $('.askForDelete').removeClass('animate')
    })
  }

  makeCustomerInvArry() {
    this.customerInvArry = []

    for (let i = 0 ; i < this._stockService.stockTransactionArr.length ; i ++) {

      if(this._stockService.stockTransactionArr[i].customerId == this.customerDataView.customerId) {

        let customerInvDetail: any = {
          stockTransactionId:0,
          transactionType:0,
          invoiceTotal:0,
          netTotal:0,
        }

        customerInvDetail.stockTransactionId = this._stockService.stockTransactionArr[i].stockTransactionId;
        customerInvDetail.transactionType = this._stockService.stockTransactionArr[i].transactionType;
        customerInvDetail.invoiceTotal = this._stockService.stockTransactionArr[i].invoiceTotal;
        this.customerInvArry.push(customerInvDetail)
      };
    };

    for (let c = 0 ; c < this.customerInvArry.length; c++) {
      if (c == 0) {
        this.customerInvArry[c].netTotal = parseInt(this.customerInvArry[c].invoiceTotal);
      } else {
        this.customerInvArry[c].netTotal = parseInt(this.customerInvArry[c-1].netTotal) + parseInt(this.customerInvArry[c].invoiceTotal)
      }
    }

  };

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
      this._custService.updateCustomerSer(this.customerDataView).subscribe(() => {
        console.log(this.customerData.value, this.customerDataView);
        this.showCustomerEnquiry();
        location.reload();
      },
        error => {
          // alert(error);
          console.log(this.customerDataView);
        });
    };
  };

  askForDelete(customer: Customer) {
    $('.fadeLayer').show(0)
    $('.askForDelete').addClass('animate')
    this.customerDataView = customer;
    console.log(this.customerDataView)
  }
  deletCustomer() {
    $('.fadeLayer').hide()
    this._custService.deleteCustomerSer(this.customerDataView.customerId)
      .subscribe(data => {
        this.customers = this.customers.filter(u => u !== this.customerDataView)
      });
  }

  showUpdateCustomer(customer: Customer) {
    $('.customerClass').not('#addCustomer').hide();
    $('#addCustomer').show();
    $('#addNewCustomerBtn').html('تعديل');
    $('#addCustomer h2:first').html('تعديل بيانات عميل');
    this.customerDataView = customer;
    // console.log(customer, this.customerDataView);
    $('#showAddCustomerBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    $('#customerEnquirybtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
  }

  showCustomerCard(customer: Customer) {
    this.customerDataView = customer;
    this.makeCustomerInvArry();
    $('#showAddCustomerBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    $('#customerEnquirybtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
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
    $('#showAddCustomerBtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
    $('#customerEnquirybtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
  };

  restValues() {
    this.customerDataView = {
      customerId: null,
      customerName: null, //
      customerTell: null, //
      customerUnit: null, //
      customerPaid: null, //
      customerRemain: null, //
      customerAdd: null, //
      customerDateIN: null, //
    }

    this.customerData = this.formBuilder.group({
      customerId: [''],
      customerName: [''],
      customerTell: [''],
      customerUnit: [''],
      customerPaid: [''],
      customerRemain: [''],
      customerAdd: [''],
      customerDateIN: [''],
    })
  };

  showCustomerEnquiry() {
    $('.customerClass').not('#customerEnquiry').hide();
    $('#customerEnquiry').show();
    $('#customerEnquirybtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
    $('#showAddCustomerBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
  };
}
