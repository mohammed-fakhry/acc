import { Component, OnInit } from '@angular/core';
import { UnitService } from 'src/app/unit.service';
import { ServicesService } from 'src/app/services.service';
import { TowerData } from 'src/app/tower-data';
import { UnitData } from 'src/app/unit-data';
import { UnitesComponent } from '../unites.component';

@Component({
  selector: 'app-tower-details',
  templateUrl: './tower-details.component.html',
  styleUrls: ['./tower-details.component.scss']
})
export class TowerDetailsComponent implements OnInit {

  towerDataArr: TowerData[];
  unites: UnitData[] = [];
  searchTxt: string;

  constructor(public _unitService: UnitService,
    public _service: ServicesService,public _unitesComponent: UnitesComponent) { }

  ngOnInit() {

    this._unitService.getTowers().subscribe((data: TowerData[]) => {
      this.towerDataArr = data;
    });

    this._unitService.getUnites().subscribe((data: UnitData[]) => {
      this.unites = data;
    });

  };

  editUnit(unit) {
    this._unitesComponent.showUpdateUnit(unit);
  };

};
