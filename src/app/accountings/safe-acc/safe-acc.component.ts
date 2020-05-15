import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login.service';
import { ServicesService } from 'src/app/services.service';
import { SafeData } from './safe-data';
import { SafeDataService } from './safe-data.service';
import { CustomerService } from 'src/app/customer.service';
import { Customer } from 'src/app/customer';
import { OtherAcc } from '../other-acc';

@Component({
  selector: 'app-safe-acc',
  templateUrl: './safe-acc.component.html',
  styleUrls: ['./safe-acc.component.scss']
})
export class SafeAccComponent implements OnInit {

  customers: Customer[];
  otherAcc: OtherAcc[];

  constructor(public logService: LoginService, public _safeDataService: SafeDataService,
     public _service: ServicesService, public _custService: CustomerService) { }

  ngOnInit() {

    this.logService.logStart(); this.logService.reternlog();
    this.getSafeInfoBEnd();

  }

  getOtheAccInfo_backEnd() {
    this._service.getOtherAccSer().subscribe((data: OtherAcc[]) => {
      this.otherAcc = data;
    })
  }

  getSafeInfoBEnd() {
    this._safeDataService.getSafes().subscribe((data: SafeData[]) => {
      this._safeDataService.safeList = data;
    })
  }

  getCustomerData_backEnd() {
    this._custService.getCustomer().subscribe((data: Customer[]) => {
      data.shift();
      this.customers = data;
    })
  }

  getBackendData_Receipt() {
    this._custService.getCustomer().subscribe((data: Customer[]) => {
      data.shift();
      this.customers = data;
    })
    this._safeDataService.getSafes().subscribe((data: SafeData[]) => {
      this._safeDataService.safeList = data;
    })
  }

  safeRecClearForm() {
    $('.clearForm').val('')
  }

  showAddSafe() {
    this.getSafeInfoBEnd();
    this._service.clearForm();
    $('#addSafeHeader').html('اضافة خزنة')
    $('#addNewSafeBtn').html('اضافة')
    $('.safeClass').not('#addSafe').hide();
    $('#addSafe').show();
    $('#showAddSafeBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('.headerMainBtn').not('#showAddSafeBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
  };

  showAddSafeReceipt() {
    this.safeRecClearForm();
    $('.safeClass').not('#safeReceipt').hide();
    $('#safeReceipt').show();
    $('#add_SafeReceiptInside').hide();
    $('#header_SafeRecipt').show();
    $('#showAddSafeReceipt').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('.headerMainBtn').not('#showAddSafeReceipt').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
  };

  showSafeEnquir() {
    this.getSafeInfoBEnd();
    $('.safeClass').not('#enquireSafe').hide();
    $('#enquireSafe').show();
    $('#showSafeBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('.headerMainBtn').not('#showSafeBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
  };

} // end