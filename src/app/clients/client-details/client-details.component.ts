import { Component, OnInit } from '@angular/core';
import { ClientServiceService } from 'src/app/client-service.service';
import { ClientsComponent } from '../clients.component';
import { ServicesService } from 'src/app/services.service';
import { UnitService } from 'src/app/unit.service';
import { ClientsData } from 'src/app/clients-data';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit {

  constructor(
    public _clientService: ClientServiceService,
    public _service: ServicesService,
    public _clientsComponent: ClientsComponent,
    public _unitService: UnitService
  ) { }

  ngOnInit() {
    this._clientService.clientData = new ClientsData()
  }

  print() {
    this._service.printThis();
  }

}
