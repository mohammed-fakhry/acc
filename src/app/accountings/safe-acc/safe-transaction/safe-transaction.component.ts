import { Component, OnInit } from '@angular/core';
import { SafeAccComponent } from '../safe-acc.component';
import { SafeDataService } from '../safe-data.service';
import { ServicesService } from 'src/app/services.service';
import { SafeTransaction } from '../safe-transaction';

@Component({
  selector: 'app-safe-transaction',
  templateUrl: './safe-transaction.component.html',
  styleUrls: ['./safe-transaction.component.scss']
})
export class SafeTransactionComponent implements OnInit {

  searchSafeTrance: string;

  constructor(public _safeAccComponent: SafeAccComponent, public _safeDataService: SafeDataService, public _service: ServicesService) { }

  ngOnInit() {

    /* $(window).scroll( () => {

      let scrolling = $(this).scrollTop();

      if (scrolling >= 50) {
        $("#topArr").fadeIn();
      } else {
        $("#topArr").fadeOut()
      };

    }) */

    //topArrow
    $("#topArr").click(function () { // scrollTop Button

      let navPosition = $(".navbar").offset().top;
      $("html , body").animate({ scrollTop: 0 }, 250);
      $(this).hide();
      $('#btmArr').fadeIn();
    });

  };

  toBottom() {
    //window.scrollTo(0, document.body.scrollHeight);
    $("html , body").animate({ scrollTop: document.body.scrollHeight }, 250);
    $("#topArr").fadeIn();
    $('#btmArr').fadeOut();
  };

  printSafeTrance() {

    let show = '#headerSafeReport';
    let hide1 = '';
    let hide2 = '';
    let hide3 = '';
    this._service.printThis(show, hide1, hide2, hide3);

    $('.closeBtn').show()
    $('#SafeReportTable').animate(
      { 'height': '100%' }
    );
    $('.stickyInp').css({'right' : 0})
    $('.navHeader').addClass('sticky-top');
    $('#printSafeTrance').hide();
    $('#btmArr').fadeIn();
  };

  openwindowPrint() {
    $('.closeBtn').hide();
    $('.theHeader').hide();
    $('#headerSafeReport').css('width', '100%')
    document.documentElement.scrollTop = 0;
    window.print();
    location.reload();
  };

  reloadLoc() {
    location.reload();
  };

  fstDateInvalid: boolean;
  sndDateInvalid: boolean;

  filterdArr: SafeTransaction[];

  filterByDate() {

    $('#containerLoader').fadeIn();

    $('#searchSafeTrance').attr({ 'disabled': false });
    
    //this.searchSafeTrance = '';

    let fromDate = $('#fromDateSafeRe').val();
    let toDate = $('#toDateSafeRe').val();

    let match_fromDate = fromDate + 'T00:00';
    let match_toDate = toDate = toDate + 'T23:59';

    fromDate = new Date(fromDate);
    toDate = new Date(toDate);
    fromDate.getTime();
    toDate.getTime();

    if (this.filterdArr == undefined && fromDate == 'Invalid Date' && toDate == 'Invalid Date') {
      this.filterdArr = this._safeDataService.safeTransactionArr;
    } else {

      this.filterdArr = this._safeDataService.safeTransactionArr;

      if (fromDate == 'Invalid Date') {
        this.fstDateInvalid = true;
      } else if (toDate == 'Invalid Date') {
        this.sndDateInvalid = true;
        this.fstDateInvalid = false;
      } else {
        this.fstDateInvalid = false;
        this.sndDateInvalid = false;

        this.filterdArr = this.filterdArr.filter((date) => {
          return date.date_time > match_fromDate && date.date_time < match_toDate
        });
        
      };
    };
    $('#containerLoader').fadeOut(0,() => {
      $('#SafeReportTable').slideDown('slow');
    });
    
  };

}; // end
