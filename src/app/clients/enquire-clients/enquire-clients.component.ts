import { Component, OnInit } from '@angular/core';
import { ClientsComponent } from '../clients.component';
import { ClientServiceService } from 'src/app/client-service.service';
import { ServicesService } from 'src/app/services.service';
import { ClientsData } from 'src/app/clients-data';
import { UnitService } from 'src/app/unit.service';
import { UnitData } from 'src/app/unit-data';

@Component({
  selector: 'app-enquire-clients',
  templateUrl: './enquire-clients.component.html',
  styleUrls: ['./enquire-clients.component.scss']
})
export class EnquireClientsComponent implements OnInit {

  searchClient: string;

  constructor(
    public _clientService: ClientServiceService,
    public _service: ServicesService,
    public _clientsComponent: ClientsComponent,
    public _unitService: UnitService
  ) { }

  ngOnInit() {
    this._clientService.clientData = new ClientsData()
  };

  editClientDetails(client: ClientsData) {
    this._clientsComponent.showAddClient(client);
    //console.log('client : ' + this._clientServiceService.clientData);
  };

  divEffect() {
    $('.headerMainBtn')
      .removeClass('btn-outline-secondary')
      .addClass('btn-light')
      .attr({ 'disabled': false })
      .animate({ fontSize: '1em' }, 50);
    $('.clientsClass').not('#clientDetails').hide();
    $('#clientDetails').show()
  }

  showClientDetails = (client: ClientsData) => {
    const getUnites = new Promise((res) => {
      this._unitService.getUnites().subscribe((data: UnitData[]) => res(data) )
    }).then((data: UnitData[]) => {
      this._clientService.clientData = client;
      this._clientService.clientUnites = data.filter(unit => unit.clientId == client.clientId);
      this.divEffect();
      console.log(this._clientService.clientUnites)
    })
  };

};
