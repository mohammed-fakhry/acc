import { Component, OnInit } from '@angular/core';
import { SafeInpts } from '../safe-inpts';
import { ServicesService } from 'src/app/services.service';
import { Worker } from '../../../worker'
import { SafeData } from '../safe-data';
import { SafeDataService } from '../safe-data.service';
import { SafeAccComponent } from '../safe-acc.component';

@Component({
  selector: 'app-add-safe',
  templateUrl: './add-safe.component.html',
  styleUrls: ['./add-safe.component.scss']
})

export class AddSafeComponent implements OnInit {

  workers: Worker[];
  addSafeInvalid: boolean;
  safeData: SafeData;


  constructor(public _service: ServicesService, public _safeDataService: SafeDataService,
    public _safeAccComponent: SafeAccComponent) { }

  ngOnInit() {

    this._service.getWorker().subscribe((data: Worker[]) => {
      this.workers = data;
    })

    this._safeDataService.safeInpts = {
      safeId: null,
      safeName: '',
      safeNameinvaild: false,
      safeEmployee: '',
      opendVal: null,
      safeEmployeeInvaild: false,
    }

    this.addSafeInvalid = true;

  } // ngOnInit

  isSafeEmployeeVaild() {

    for (let i = 0; i < this.workers.length; i++) {
      if (this._safeDataService.safeInpts.safeEmployee == this.workers[i].workerName) {
        this._safeDataService.safeInpts.safeEmployeeInvaild = false;
        this.addSafeInvalid = false;
        this._safeDataService.theWorkerId = this.workers[i].workerId;
        $('#safeEmployee').addClass('is-valid').removeClass('is-invalid');
        break
      } else {
        this._safeDataService.safeInpts.safeEmployeeInvaild = true;
        $('#safeEmployee').addClass('is-invalid').removeClass('is-valid');
        this.addSafeInvalid = true;
        this._safeDataService.theWorkerId = null;
      }
    }
    if (this._safeDataService.safeInpts.safeName == '') {
      this.addSafeInvalid = true;
    }

  }

  safeNameVaildMsg: string;

  isSafeNameVaild() {

    if (this._safeDataService.safeList == undefined) {
      this._safeDataService.safeInpts.safeNameinvaild = false;
      this.addSafeInvalid = false;
    } else {
      for (let i = 0; i < this._safeDataService.safeList.length; i++) {
        if (this._safeDataService.safeList[i].safeName == this._safeDataService.safeInpts.safeName) {
          this._safeDataService.safeInpts.safeNameinvaild = true;
          this.addSafeInvalid = true;
          this.safeNameVaildMsg = 'اسم الخزنة موجود بالفعل'
          $('#safeName').addClass('is-invalid').removeClass('is-valid');
          break
        } else if (this._safeDataService.safeInpts.safeName == '') {
          this._safeDataService.safeInpts.safeNameinvaild = true;
          this.addSafeInvalid = true;
          this.safeNameVaildMsg = 'يجب ادخال اسم الخزنة'
          $('#safeName').addClass('is-invalid').removeClass('is-valid');
          break
        } else {
          this._safeDataService.safeInpts.safeNameinvaild = false;
          this.addSafeInvalid = false;
          $('#safeName').addClass('is-valid').removeClass('is-invalid');
        }
      }
    }
    if (this._safeDataService.safeInpts.safeEmployee == '') {
      this.addSafeInvalid = true;
    }

  }

  addNewSafe() {

    this._safeAccComponent.getOtheAccInfo_backEnd();

    let safeInfo = this._safeDataService.safeList.find(
      safe => safe.safeId == this._safeDataService.safeInpts.safeId
    )
    console.log(safeInfo)

    let addSafeBtnVal = $('#addNewSafeBtn').html();

    if (addSafeBtnVal == 'تعديل') {
      this.safeData = {
        safeId: this._safeDataService.safeInpts.safeId,
        safeName: this._safeDataService.safeInpts.safeName,
        workerId: this._safeDataService.theWorkerId,
        safeEmployee: this._safeDataService.safeInpts.safeEmployee,
        opendVal: this._safeDataService.safeInpts.opendVal,
        currentSafeVal: safeInfo.currentSafeVal
      }
      this._safeDataService.updateSafeData(this.safeData).subscribe()
      console.log(this.safeData)
    } else if (addSafeBtnVal == 'اضافة') {
      this.safeData = {
        safeId: null,
        safeName: this._safeDataService.safeInpts.safeName,
        workerId: this._safeDataService.theWorkerId,
        safeEmployee: this._safeDataService.safeInpts.safeEmployee,
        opendVal: this._safeDataService.safeInpts.opendVal,
        currentSafeVal: this._safeDataService.safeInpts.opendVal
      }
      this._safeDataService.creatSafe(this.safeData).subscribe();
      //console.log(this.safeData.workerId)
    }

    this._safeAccComponent.getSafeInfo_backEnd();
    this._safeAccComponent.showSafeEnquir();
    this._service.clearForm();
    $('#safeEmployee').removeClass('is-valid').removeClass('is-invalid');
    $('#safeName').removeClass('is-valid').removeClass('is-invalid');
  } // addNewSafe

}
