import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UnitData } from './unit-data';
import { TowerData } from './tower-data';
import { ContractData } from './contract-data';
import { ContractVaildInpts } from './contract-vaild-inpts';
import { ClientsData } from './clients-data';
import { ContractInpts } from './contract-inpts';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  url: string = localStorage.getItem('tmpDB'); //'http://localhost/accountings_ali/'
  // units vars
  towerUnits: any[];
  theTowerInfo: TowerData = new TowerData();
  todayName: string;

  // contract vars
  contractData: ContractData;
  contractVaildInpts: ContractVaildInpts;
  contractInpts: ContractInpts;
  // disable or enable inpts
  lockedInputs = {
    unitLocked: true,
    prepaidPercLocked: true,
  };
  days = ['الجمعة', 'الخميس', 'الاربعاء', 'الثلاثاء', 'الاثنين', 'الاحد', 'السبت',];
  TodayDate: string;
  
  towerInfoArr: any[];

  constructor(private http: HttpClient) { }

  getUnites() {
    return this.http.get<UnitData[]>(`${this.url}unitList.php`);
  };

  creatUnit(unit: UnitData) {
    return this.http.post(`${this.url}postUnit.php`, unit)
  };

  updateUnit(unit: UnitData) {
    return this.http.put(`${this.url}updateUnit.php?id=` + unit.unitId, unit )
  };

  deleteUnitSer(id: number) {
    return this.http.delete<UnitData[]>(`${this.url}deleteUnit.php?id=` + id)
  };

  getTowers() {
    return this.http.get<TowerData[]>(`${this.url}towerList.php`);
  };

  getClients() {
    return this.http.get<ClientsData[]>(`${this.url}clientsList.php`);
  };

}
