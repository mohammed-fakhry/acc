import { Component, OnInit } from '@angular/core';
import { ClientsComponent } from '../clients.component';
import { ClientServiceService } from 'src/app/client-service.service';
import { ServicesService } from 'src/app/services.service';
import { ClientsData } from 'src/app/clients-data';
import { UnitService } from 'src/app/unit.service';
import { UnitData } from 'src/app/unit-data';
import { ClientPayment } from 'src/app/client-payment';
import { ClientPaymentService } from 'src/app/client-payment.service';

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
    public _unitService: UnitService,
    public _clientPaymentService: ClientPaymentService
  ) { }

  ngOnInit() {
    this._clientService.clientData = new ClientsData()
  };

  editClientDetails(client: ClientsData) {
    this._clientsComponent.showAddClient(client);
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

    $('#containerLoader').fadeIn()

    let clientPayments: ClientPayment[] = [];
    let clientUnites: UnitData[] = [];
    this._clientService.unitPaymentsArr = [];

    const getUnites = new Promise((res) => {
      this._unitService.getUnites().subscribe((data: UnitData[]) => res(data.filter(unit => unit.clientId == client.clientId)))
    })

    const getPayments = new Promise((res) => {
      this._clientPaymentService.getClientPayment().subscribe((data: ClientPayment[]) => {
        // clientPayments = data;
        res(data)
      });
    });

    const calcUnitVals = (paymentArr: ClientPayment[], unites: UnitData[]) => {

      clientPayments = paymentArr.filter(payment => payment.clientId == client.clientId); //.map(payment => payment.paymentVal);

      for (let i = 0; i < unites.length; i++) {

        let unitDet = {

          name: unites[i].unitNum,

          payments: {
            arr: clientPayments.filter(payment => payment.unitId == unites[i].unitId),
            arrTotals: () => unitDet.payments.arr.map(payment => payment.paymentVal),
            totalVal: () => {
              if (unitDet.payments.arrTotals().length == 0) {
                return 0
              }
              return this._service.sumArry(unitDet.payments.arrTotals())
            },
          },

          totalPrice: unites[i].unitExtent * unites[i].unitPrice,

          remain: () => parseInt((unitDet.totalPrice - unitDet.payments.totalVal()).toFixed(0))

        };

        if (unites[i].remainVal != unitDet.remain()) {
          unites[i].remainVal = unitDet.remain();
          unites[i].paidVal = unitDet.payments.totalVal();
          this._unitService.updateUnit(unites[i]).subscribe();
        };

        unites[i].remainVal = unitDet.remain();
        unites[i].paidVal = unitDet.payments.totalVal();

        clientUnites = [...clientUnites, unites[i]];
        this._clientService.unitPaymentsArr = [...this._clientService.unitPaymentsArr, unitDet]
      };
    };

    Promise.all([getUnites, getPayments])
      .then((res: any[]) => calcUnitVals(res[1], res[0]))
      .then(() => {
        this._clientService.clientData = client;
        this._clientService.clientUnites = clientUnites;
        this._clientService.clientTotalRemain = this._service.sumArry(clientUnites.map(unit => unit.remainVal));
        this.divEffect();
        $('#containerLoader').fadeOut()
      });

  };

};
