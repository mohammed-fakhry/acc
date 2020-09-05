import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { SafeDataService } from '../accountings/safe-acc/safe-data.service';
import { ServicesService } from '../services.service';
import { UnitService } from '../unit.service';
import { UnitData } from '../unit-data';
import { TowerData } from '../tower-data';
import { ClientsData } from '../clients-data';
import { ClientServiceService } from '../client-service.service';
import { ClientPaymentService } from '../client-payment.service';
import { ClientPayment } from '../client-payment';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  unites: UnitData[];
  towerDataArr: any[];

  constructor(
    public logService: LoginService,
    public _safeDataService: SafeDataService,
    public _unitService: UnitService,
    public _service: ServicesService,
    public _clientServiceService: ClientServiceService,
    public _clientPaymentService: ClientPaymentService
  ) { }

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

    this.showClientsEnquir();
  };

  buttonEffect(max: string) {
    $(max).removeClass("btn-light").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('.headerMainBtn').not(max).removeClass('btn-outline-secondary').addClass('btn-light').animate({ fontSize: '1em' }, 50);
    $(max).attr({ 'disabled': true });
    $('.headerMainBtn').not(max).attr({ 'disabled': false });
  };

  switchEffect(elementId: String) {
    $('.clientsClass').not(`${elementId}`).hide();
    $(elementId).show();
  };

  showClientsPayments = () => {
    this.buttonEffect('#showClientsPaymentsBtn');
    this.switchEffect('#clientsPayments');
    $('#header_ClientPayment').show();
    $('#add_clientPaymentInside').hide();
  }

  showAddClient(statu) {

    let getClients = new Promise((res) => {
      this._clientServiceService.getClients().subscribe((data: ClientsData[]) => {
        res(data)
        //this._clientServiceService.clients = data;
      });
    })

    getClients.then((data: ClientsData[]) => this._clientServiceService.clients = data).then(() => {

      this._clientServiceService.clientsNames = this._clientServiceService.clients.map(client => client.clientName);

      this.buttonEffect('#showAddClientBtn');
      this.switchEffect('#addClient');
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

    $('#containerLoader').fadeIn()

    this._clientServiceService.clientsEnquireArr = [];

    let getClients = new Promise((res) => {
      this._clientServiceService.getClients().subscribe((data: ClientsData[]) => {
        res(data)
      });
    });

    let getUnites = new Promise((res) => {
      this._unitService.getUnites().subscribe((data: UnitData[]) => {
        res(data)
      });
    });

    let getClientPayments = new Promise((res) => {
      this._clientPaymentService.getClientPayment().subscribe((data: ClientPayment[]) => {
        res(data)
      });
    });

    const theMethod = (clients: ClientsData[], unites: UnitData[], clientPayments: ClientPayment[]) => {

      for (let i = 0; i < clients.length; i++) {

        let clientDetails = {
          clientId: clients[i].clientId,
          clientName: clients[i].clientName,
          clientTell: clients[i].clientTell,
          clientAddress: clients[i].clientAddress,
          clientNationNum: clients[i].clientNationNum,

          payments: {
            arr: clientPayments.filter(payment => payment.clientId == clients[i].clientId).map(paymet => paymet.paymentVal),
            total: () => this._service.sumArry(clientDetails.payments.arr)
          },

          unites: {
            arr: unites.filter(unit => unit.clientId == clients[i].clientId).map(unit => unit.unitExtent * unit.unitPrice),
            total: () => this._service.sumArry(clientDetails.unites.arr),
            unitesQts: () => clientDetails.unites.arr.length
          },

          remain: () => (clientDetails.unites.total() - clientDetails.payments.total()).toFixed(0)
        }

        this._clientServiceService.clientsEnquireArr = [...this._clientServiceService.clientsEnquireArr, clientDetails];

      }

    };

    Promise.all([getClients, getUnites, getClientPayments])
      .then((res: any[]) => theMethod(res[0], res[1], res[2]))
      .then(() => {
        this.switchEffect('#enquireClient');
        this.buttonEffect('#showClientsBtn');
        $('#containerLoader').fadeOut();
      })

    /* getClients.then((data: ClientsData[]) => this._clientServiceService.clients = data).then(() => {
      this.switchEffect('#enquireClient');
      this.buttonEffect('#showClientsBtn');

      $('#containerLoader').fadeOut();
    }) */

  };

};
