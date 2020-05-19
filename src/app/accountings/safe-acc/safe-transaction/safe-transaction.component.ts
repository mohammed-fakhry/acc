import { Component, OnInit } from '@angular/core';
import { SafeAccComponent } from '../safe-acc.component';
import { SafeDataService } from '../safe-data.service';

@Component({
  selector: 'app-safe-transaction',
  templateUrl: './safe-transaction.component.html',
  styleUrls: ['./safe-transaction.component.scss']
})
export class SafeTransactionComponent implements OnInit {

  constructor(public _safeAccComponent: SafeAccComponent, public _safeDataService: SafeDataService) { }

  ngOnInit() {
  }

}
