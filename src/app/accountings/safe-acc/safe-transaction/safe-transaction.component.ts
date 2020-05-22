import { Component, OnInit } from '@angular/core';
import { SafeAccComponent } from '../safe-acc.component';
import { SafeDataService } from '../safe-data.service';
import { ServicesService } from 'src/app/services.service';

@Component({
  selector: 'app-safe-transaction',
  templateUrl: './safe-transaction.component.html',
  styleUrls: ['./safe-transaction.component.scss']
})
export class SafeTransactionComponent implements OnInit {

  searchSafeTrance: string;

  constructor(public _safeAccComponent: SafeAccComponent, public _safeDataService: SafeDataService, public _service: ServicesService) { }

  ngOnInit() {

  }

  printSafeTrance() {
    let show = '#headerSafeReport';
    let hide1 = '';
    let hide2 = '';
    let hide3 = '';
    this._service.printThis(show, hide1,hide2,hide3);
    $('.closeBtn').show()
    $('#SafeReportTable').css(
      { 'height': '100%' }
    );
    $('.navHeader').addClass('sticky-top');
    $('#printSafeTrance').hide();
  };

  openwindowPrint() {
    $('.closeBtn').hide();
    $('.theHeader').hide();
    $('#headerSafeReport').css('width', '100%')
    document.documentElement.scrollTop = 0;
    window.print();
    location.reload();
  }

  reloadLoc() {
    location.reload();
  }

}
