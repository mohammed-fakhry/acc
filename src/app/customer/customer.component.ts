import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'
import { Customer } from '../customer'
import { ServicesService } from '../services.service';
import { CustomerService } from '../customer.service';
import { Router } from '@angular/router'
import { LoginService } from '../login.service';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  customerData: FormGroup;
  customers: Customer[];
  customerDataView: Customer;
  constructor(private formBuilder: FormBuilder, private _service: ServicesService, private _custService: CustomerService,
    private router: Router,private logService: LoginService) { }

  ngOnInit() {

    if (this.logService.check) {
      this.logService.isUser = true;
      this.logService.checkIsUser();
    }
    
    if (this.logService.isUser == false) {
      this.router.navigate(['/logIn'])
    }
    this._custService.getCustomer().subscribe((data: Customer[]) => {
      this.customers = data;
    })
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

    $('#hideFadeLayer').click(function () {
      $('.fadeLayer').hide();
      $('.askForDelete').removeClass('animate')
    })
  }

  // CRUD Functions
  addNewCustomer() {
    let addBtnVal = $('#addNewCustomerBtn').html()
    if (addBtnVal == 'اضافة') {
      this._custService.creatCustomer(this.customerData.value)
        .subscribe()
      console.log(this.customerData.value)
      this._service.clearForm();
    } else if (addBtnVal == 'تعديل') {
      this._custService.updateCustomerSer(this.customerDataView).subscribe(() => {
        console.log(this.customerData.value, this.customerDataView);
        this.showCustomerEnquiry()
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
    $('#customerEnquiry').hide();
    $('#customerDetails').hide();
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
    $('#showAddCustomerBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    $('#customerEnquirybtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    $('#customerDetails').show();
    $('#customerEnquiry').hide();
    $('#addCustomer').hide();
  }

  ShowAddNewCustomer() {
    this._service.clearForm();
    this.restValues()
    $('#customerDetails').hide();
    $('#customerEnquiry').hide();
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
    $('#customerDetails').hide();
    $('#customerEnquiry').show();
    $('#addCustomer').hide();
    $('#customerEnquirybtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
    $('#showAddCustomerBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
  };
}
