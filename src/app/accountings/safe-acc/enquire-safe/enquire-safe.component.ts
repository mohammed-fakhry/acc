import { Component, OnInit } from '@angular/core';
import { SafeDataService } from '../safe-data.service';

@Component({
  selector: 'app-enquire-safe',
  templateUrl: './enquire-safe.component.html',
  styleUrls: ['./enquire-safe.component.scss']
})
export class EnquireSafeComponent implements OnInit {

  constructor(public _safeDataService: SafeDataService) { }

  ngOnInit() {
    
  }

  fillData(safe) {
    this._safeDataService.safeInpts.safeId = safe.safeId;
    this._safeDataService.safeInpts.safeEmployee = safe.safeEmployee;
    this._safeDataService.safeInpts.safeName = safe.safeName;
    this._safeDataService.theWorkerId = safe.workerId
  }

  showEditSafe(safe) {
    this.fillData(safe);
    console.log(safe)
    $('#addSafeHeader').html('تعديل بيانات خزنة')
    $('#addNewSafeBtn').html('تعديل')
    $('.safeClass').not('#addSafe').hide();
    $('#addSafe').show();
    $('#showAddSafeBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('.headerMainBtn').not('#showAddSafeBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
  }

}
