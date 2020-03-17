import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UnitData } from '../unit-data';
import { UnitService } from '../unit.service';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-unites',
  templateUrl: './unites.component.html',
  styleUrls: ['./unites.component.scss']
})
export class UnitesComponent implements OnInit {

  // calculator vars
  metrPrice: number;
  apartWidth: number;
  preMoney: number;
  years: number;
  totalPrice: number;
  remainPrice: number;
  remainPaid: number;
  preMoneyResult: number;

  // addUnit vars
  unitData: FormGroup;
  unitDataView: UnitData;
  unites: UnitData[];
  addBtnVal:string;

  calcRemain() {
    this.totalPrice = this.metrPrice * this.apartWidth;
    this.preMoneyResult = (this.totalPrice * this.preMoney) / 100;
    this.remainPrice = this.totalPrice - this.preMoneyResult;
    this.remainPaid = Math.ceil(this.remainPrice / this.years / 12);
  }
  constructor(private router: Router, private logService: LoginService,
     private formBuilder: FormBuilder , private unitService: UnitService,
     private _service: ServicesService) { }

  ngOnInit() {
    if (this.logService.check) {
      this.logService.isUser = true;
      this.logService.checkIsUser();
    }

    if (this.logService.isUser == false) {
      this.router.navigate(['/logIn'])
    }

    // getUnites
    this.unitService.getUnites().subscribe((data: UnitData[]) => {
      this.unites = data;
    })

    // unitData Model
    this.unitDataView = {
      unitId: null,
      unitNum: null,
      unitBuildingNum: null,
      unitExtent: null,
      unitPrice: null,
      unitCompany: null,
      unitDate: null,
    }

    // unitData FormGroup
    this.unitData = this.formBuilder.group({
      unitId: [''],
      unitNum: [''],
      unitBuildingNum: [''],
      unitExtent: [''],
      unitPrice: [''],
      unitCompany: [''],
      unitDate: [''],
    });

    // Methods
    $('#hideFadeLayer').click(function () {
      $('.fadeLayer').hide()
      $('.askForDelete').removeClass('animate')
    })

  } // ngOnInit

  // show Methods
  showAddUnit() {
    this._service.clearForm();
    this.resetValues();
    $('.unitsClass').not('#addUnit').hide();
    $('#addUnit').show();
    $('#unitSearch').hide(100);
    $('#addNewUnitBtn').html('اضافة');
    $('#addUnit h2:first').html('اضافة بيانات وحدة');
    $('#showAddUnitBtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
    $('#unitEnquirybtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
  }

  showUnitEnquiry() {
    $('.unitsClass').not('#unitEnquiry').hide();
    $('#unitEnquiry').show();
    $('#unitSearch').show(100);
    $('#unitEnquirybtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
    $('#showAddUnitBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
  }

  showUpdateUnit(unit) {
    $('.unitsClass').not('#addUnit').hide();
    $('#addUnit').show();
    $('#unitSearch').hide(100);
    $('#addNewUnitBtn').html('تعديل');
    $('#addUnit h2:first').html('تعديل بيانات وحدة');
    this.unitDataView = unit;
    $('#showAddUnitBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
    $('#unitEnquirybtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
  }


  resetValues() {
    this.unitData = this.formBuilder.group({
      unitId: [''],
      unitNum: [''],
      unitBuildingNum: [''],
      unitExtent: [''],
      unitPrice: [''],
      unitCompany: [''],
      unitDate: [''],
    });
    this.unitDataView = {
      unitId: null,
      unitNum: null,
      unitBuildingNum: null,
      unitExtent: null,
      unitPrice: null,
      unitCompany: null,
      unitDate: null,
    };
  }
  // crud
  addNewUnit() {
    this.addBtnVal = $('#addNewUnitBtn').html()
    if(this.addBtnVal = 'اضافة') {
      this.unitService.creatUnit(this.unitData.value).subscribe();
      this._service.clearForm()
    } else if (this.addBtnVal = 'تعديل') {
      this.unitService.updateUnit(this.unitDataView).subscribe(() => {
      })
    }
  }

  askForDeleteUnit(unit: UnitData) {
    $('.fadeLayer').show(0)
    $('.askForDelete').addClass('animate')
    this.unitDataView = unit;
  };

  deletUnit() {
    $('.fadeLayer').hide()
    this.unitService.deleteUnitSer(this.unitDataView.unitId)
      .subscribe(data => {
        this.unites = this.unites.filter(u => u !== this.unitDataView)
      });
  };
} // end
