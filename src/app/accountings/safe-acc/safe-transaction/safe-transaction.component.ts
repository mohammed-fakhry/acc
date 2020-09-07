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
  balance: number;
  balanceContain: HTMLElement;

  constructor(
    public _safeAccComponent: SafeAccComponent,
    public _safeDataService: SafeDataService,
    public _service: ServicesService
  ) { }

  ngOnInit() {

    this.balanceContain = document.querySelector('#balanceContain') as HTMLElement;
    this._safeDataService.cellArry = []
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
    $('#safeNamePrint').show();
    $('#transactionExplain').removeClass('col-md-10').addClass('container-fluid')
    window.print();
    $('#safeNamePrint').hide()
    $('#transactionExplain').addClass('col-md-10').removeClass('container-fluid')
  };

  markCell = (i, cell: string) => {

    this.balanceContain.style.display = 'block'
    const element = document.querySelector(`#${cell}${i}`);
    $(`#${cell}${i}`).toggleClass('lightBg');

    let dirIn = 'receiptValIn'
    let dirOut = 'receiptValOut'

    let num = 0;

    let cond = element.classList.contains("lightBg")

    if (cond) {

      if (dirIn == cell) {
        num = - this.filterdArr[i].receiptValIn
        this._safeDataService.cellArry.push(num)
      } else if (dirOut == cell) {
        num = this.filterdArr[i].receiptValOut
        this._safeDataService.cellArry.push(num)
      };
      $(`#${cell}${i}`).css('cursor', 'grabbing')

    } else {

      let index: number;

      if (dirIn == cell) {
        num = - this.filterdArr[i].receiptValIn
        index = this._safeDataService.cellArry.findIndex(theCell => theCell == num);
        this._safeDataService.cellArry.splice(index, 1)
      } else if (dirOut == cell) {
        num = this.filterdArr[i].receiptValOut;
        index = this._safeDataService.cellArry.findIndex(theCell => theCell == num);
        this._safeDataService.cellArry.splice(index, 1)
      };
      $(`#${cell}${i}`).css('cursor', 'grab')

    };

    if (this._safeDataService.cellArry.length == 0) {
      this.balance = 0
    } else {
      this.balance = this._service.sumArry(this._safeDataService.cellArry)
    };

    if (this.balance < 0) {
      $('#balance').css('color', 'red')
    } else {
      $('#balance').css('color', 'black')
    };

  }

  fstDateInvalid: boolean;
  sndDateInvalid: boolean;

  filterdArr: SafeTransaction[];

  filterByDate() {

    this._safeDataService.cellArry = []
    this.balanceContain.style.display = 'none'

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

      $('#containerLoader').fadeOut(0, () => {
        $('#SafeReportTable').slideDown('slow');
      });

    } else {

      this.filterdArr = this._safeDataService.safeTransactionArr;

      if (fromDate == 'Invalid Date' && toDate == 'Invalid Date') {

        this.filterdArr = this._safeDataService.safeTransactionArr;

        $('#containerLoader').fadeOut(0, () => {
          $('#SafeReportTable').slideDown('slow');
        });

      } else if (fromDate == 'Invalid Date') {

        this.fstDateInvalid = true;
        $('#containerLoader').fadeOut(0, () => {
          $('#SafeReportTable').slideUp('fast');
        });

      } else if (toDate == 'Invalid Date') {

        this.sndDateInvalid = true;
        this.fstDateInvalid = false;
        $('#containerLoader').fadeOut(0, () => {
          $('#SafeReportTable').slideUp('fast');
        });

      } else {
        this.fstDateInvalid = false;
        this.sndDateInvalid = false;

        this.filterdArr = this.filterdArr.filter((date) => {
          return date.date_time > match_fromDate && date.date_time < match_toDate
        });

        $('#containerLoader').fadeOut(0, () => {
          $('#SafeReportTable').slideDown('slow');
        });

      };

    }

    /* $('#containerLoader').fadeOut(0, () => {
      //$('#SafeReportTable').slideDown('slow');
    }); */

  };

}; // end
