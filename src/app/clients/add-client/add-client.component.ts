import { Component, OnInit } from '@angular/core';
import { ClientsData } from 'src/app/clients-data';
import { ClientServiceService } from 'src/app/client-service.service';
import { ServicesService } from 'src/app/services.service';
import { ClientsComponent } from '../clients.component';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {

  addClientInvalid: boolean;
  //clientData: ClientsData;

  //clients: ClientsData[];
  //clientsNames: any[];

  constructor(public _clientServiceService: ClientServiceService, public _service: ServicesService,
    public _clientsComponent: ClientsComponent) { }

  ngOnInit() {

    this.addClientInvalid = true;

    this._clientServiceService.clientData = new ClientsData();
  };

  addFormVaild() {

    this.nameChanged();
    this.tellChanged();
    this.nationNumChanged();
    this.addressChanged();

    if (this._clientServiceService.clientInptValid.clientNameValid == true || this._clientServiceService.clientInptValid.clientTellVaild == true ||
      this._clientServiceService.clientInptValid.clientAddressVaild == true || this._clientServiceService.clientInptValid.clientNationNumValid == true) {

      // inside
      this.addClientInvalid = true;
    } else {

      this.addClientInvalid = false;
    };

  };

  nameChanged() {

    let submitBtn = $('#addNewClientBtn').html();
    let stopCond: boolean;

    if (submitBtn == 'اضافة') {

      if (this._clientServiceService.clientsNames.includes(this._clientServiceService.clientData.clientName)) {

        this._clientServiceService.clientInptValid.clientNameValid = true;
        this._clientServiceService.clientInptValid.clientNameMsg = 'هذا الاسم مسجل بالفعل';
        $('#clientName').removeClass('is-valid').addClass('is-invalid');

        stopCond = true
      } else {
        stopCond = false
      };

    };

    if (stopCond == false) {

      if (this._clientServiceService.clientData.clientName == null) {

        this._clientServiceService.clientInptValid.clientNameValid = true;
        this._clientServiceService.clientInptValid.clientNameMsg = 'يجب ادخال اسم العميل'
        $('#clientName').removeClass('is-valid').addClass('is-invalid');

      } else {
        this._clientServiceService.clientInptValid.clientNameValid = false;
        $('#clientName').removeClass('is-invalid').addClass('is-valid');
      };

    };

  };

  tellChanged() {

    let TellRegex = /^[0][1]([1]|[2]|[5]|[0])[0-9]{8}$/

    if (TellRegex.test(this._clientServiceService.clientData.clientTell) == false) {

      this._clientServiceService.clientInptValid.clientTellVaild = true;
      this._clientServiceService.clientInptValid.clientTellMsg = 'رقم الهاتف غير صحيح'
      $('#clientTell').removeClass('is-valid').addClass('is-invalid');

    } else if (this._clientServiceService.clientData.clientTell == null) {

      this._clientServiceService.clientInptValid.clientTellVaild = true;
      this._clientServiceService.clientInptValid.clientNameMsg = 'يجب ادخال رقم الهاتف'

    } else {
      this._clientServiceService.clientInptValid.clientTellVaild = false;
      $('#clientTell').removeClass('is-invalid').addClass('is-valid');
    };

  };

  addressChanged() {

    if (this._clientServiceService.clientData.clientAddress == null) {
      this._clientServiceService.clientInptValid.clientAddressVaild = true;
      this._clientServiceService.clientInptValid.clientAddressMsg = 'يجب ادخال العنوان';
      $('#clientAddress').removeClass('is-valid').addClass('is-invalid');
    } else {
      this._clientServiceService.clientInptValid.clientAddressVaild = false;
      $('#clientAddress').removeClass('is-invalid').addClass('is-valid');
    };

  };

  nationNumChanged() {
    if (this._clientServiceService.clientData.clientNationNum == null) {

      this._clientServiceService.clientInptValid.clientNationNumValid = true;
      this._clientServiceService.clientInptValid.clientNationNumMsg = 'يجب ادخال الرقم القومى';
      $('#clientNationNum').removeClass('is-valid').addClass('is-invalid');

    } else if (this._clientServiceService.clientData.clientNationNum.length < 14 || this._clientServiceService.clientData.clientNationNum.length > 14) {

      this._clientServiceService.clientInptValid.clientNationNumValid = true;
      this._clientServiceService.clientInptValid.clientNationNumMsg = 'يجب ادخال 14 رقم'
      $('#clientNationNum').removeClass('is-valid').addClass('is-invalid');

    } else {
      this._clientServiceService.clientInptValid.clientNationNumValid = false;
      $('#clientNationNum').removeClass('is-invalid').addClass('is-valid');
    };
  };

  addNewClient() {

    this.addFormVaild();

    let submitBtn = $('#addNewClientBtn').html();

    if (!this.addClientInvalid) {

      if (submitBtn == 'اضافة') {

        this._clientServiceService.creatClient(this._clientServiceService.clientData).subscribe(() => {
          //console.log('added')
        },
          error => {
            //its not error (backend responce done)
            if (error.status == 201) {
              this._clientsComponent.showClientsEnquir();
              this._service.clearForm();
            }
          }
        );
      } else {
        //console.log(this._clientServiceService.clientData);
        this._clientServiceService.updateClient(this._clientServiceService.clientData).subscribe(() => {
          this._clientsComponent.showClientsEnquir();
          this._service.clearForm();
        });
      }
      //this._clientsComponent.showClientsEnquir();
    };

  };

};
