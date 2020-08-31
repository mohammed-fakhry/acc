import { Injectable } from '@angular/core';
import { ClientsData } from './clients-data';
import { HttpClient } from '@angular/common/http';
import { UnitData } from './unit-data';

@Injectable({
  providedIn: 'root'
})
export class ClientServiceService {

  url = sessionStorage.getItem('y');

  clients: ClientsData[];
  clientsNames: any[];
  clientData: ClientsData;
  clientUnites: UnitData[];

  clientInptValid = {
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

  constructor(public http: HttpClient) { }

  getClients() {
    return this.http.get<ClientsData[]>(`${this.url}clientsList.php`);
  };

  creatClient(client: ClientsData) {
    return this.http.post(`${this.url}postClient.php`, client)
  };

  updateClient(client: ClientsData) {
    return this.http.put(`${this.url}editeClient.php?id=` + client.clientId, client )
  };

  deleteUnitSer(id: number) {
    return this.http.delete<ClientsData[]>(`${this.url}deleteClient.php?id=` + id)
  };

}
