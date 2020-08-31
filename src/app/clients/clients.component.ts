import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { SafeDataService } from '../accountings/safe-acc/safe-data.service';
import { ServicesService } from '../services.service';
import { UnitService } from '../unit.service';
import { UnitData } from '../unit-data';
import { TowerData } from '../tower-data';
import { ClientsData } from '../clients-data';
import { ClientServiceService } from '../client-service.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  unites: UnitData[];
  towerDataArr: any[];

  constructor(public logService: LoginService, public _safeDataService: SafeDataService,
    public _unitService: UnitService, public _service: ServicesService, public _clientServiceService: ClientServiceService) { }

  ngOnInit() {
    // log
    this.logService.logStart(); this.logService.reternlog();

    // getUnites
    this._unitService.url = localStorage.getItem('tmpDB');
    this._unitService.getUnites().subscribe((data: UnitData[]) => {
      this.unites = data;
    });

    // getTowers
    
    this._unitService.getTowers().subscribe((data: TowerData[]) => {
      this.towerDataArr = data;
    });

    // getClients
    this._clientServiceService.url = localStorage.getItem('tmpDB');
    this._clientServiceService.getClients().subscribe(data => {
      this._clientServiceService.clients = data;
    });

    this._service.handleTableHeight();
  };

  buttonEffect(max: string, min: string) {
    $(max).removeClass("btn-light").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $(min).removeClass('btn-outline-secondary').addClass('btn-light').animate({ fontSize: '1em' }, 50);
    $(max).attr({ 'disabled': true });
    $(min).attr({ 'disabled': false });
  };

  showAddClient(statu) {

    let getClients = new Promise((res) => {
      this._clientServiceService.getClients().subscribe((data: ClientsData[]) => {
        res(data)
        //this._clientServiceService.clients = data;
      });
    })

    getClients.then((data: ClientsData[]) => this._clientServiceService.clients = data).then(() => {

      this._clientServiceService.clientsNames = this._clientServiceService.clients.map(client => client.clientName);

      $('.clientsClass').not('#addClient').hide();
      $('#addClient').show();
      this.buttonEffect('#showAddClient', '#showClientsBtn');
      //this._service.clearForm();
      $('.form-control').removeClass('is-invalid is-valid');
      this._clientServiceService.clientInptValid = {
        // name
        clientNameValid: false,
        clientNameMsg: '',
        // tell
        clientTellVaild: false,
        clientTellMsg: '',
        // adress
        clientAddressVaild: false,
        clientAddressMsg: '',
        // nationNum
        clientNationNumValid: false,
        clientNationNumMsg: '',
      };

      if (statu == 'new') {
        this._clientServiceService.clientData = new ClientsData();
        $('#addNewClientBtn').html('اضافة');
        $('#addClientHeader').html('اضافة بيانات عميل');
      } else {
        this._clientServiceService.clientData = statu
        $('#addNewClientBtn').html('تعديل');
        $('#addClientHeader').html('تعديل بيانات عميل');
        //console.log(this._clientServiceService.clientData)
      };

    })



  };

  showClientsEnquir() {
    let getClients = new Promise((res) => {
      this._clientServiceService.getClients().subscribe((data: ClientsData[]) => {
        res(data)
        //this._clientServiceService.clients = data;
      });
    })

    getClients.then((data: ClientsData[]) => this._clientServiceService.clients = data).then(() => {
      $('.clientsClass').not('#enquireClient').hide();
      $('#enquireClient').show();
      this.buttonEffect('#showClientsBtn', '#showAddClient');
    })

  };

};
