import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UnitData } from './unit-data';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  constructor(private http: HttpClient) { }

  getUnites() {
    return this.http.get<UnitData[]>('http://localhost/accounting/unitList.php');
  }

  creatUnit(unit: UnitData) {
    return this.http.post('http://localhost/accounting/postUnit.php', unit)
  }

  updateUnit(unit: UnitData) {
    return this.http.put('http://localhost/accounting/updateEmployee.php?id=' + unit.unitId, unit )
  }

  deleteUnitSer(id: number) {
    return this.http.delete<UnitData[]>('http://localhost/accounting/deleteUnit.php?id=' + id)
  }

}
