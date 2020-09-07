import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from 'src/app/services.service';
import { UnitService } from 'src/app/unit.service';
import { TowerData } from 'src/app/tower-data';
import { UnitData } from 'src/app/unit-data';
import { UnitesComponent } from '../unites.component';

@Component({
  selector: 'app-tower-enquire',
  templateUrl: './tower-enquire.component.html',
  styleUrls: ['./tower-enquire.component.scss']
})
export class TowerEnquireComponent implements OnInit {

  towerDataArr: TowerData[];
  unites: UnitData[];
  //theTowerInfo: TowerData;

  constructor(
    public router: Router,
    public _unitService: UnitService,
    public _service: ServicesService,
    _unitesComponent: UnitesComponent
  ) { }

  ngOnInit() {

    // getTowers
    this._unitService.getTowers().subscribe((data: TowerData[]) => {
      this.towerDataArr = data;
    });

    this._unitService.getUnites().subscribe((data: UnitData[]) => {
      this.unites = data;
    });
  };

  buttonEffect(max: string, min: string) {
    $(max).removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $(min).removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
  };

  showTowerDetails(tower: TowerData) {

    $('#containerLoader').show()

    const getUnites = new Promise((res) => {
      this._unitService.getUnites().subscribe((data: UnitData[]) => {
        res(data)
      })
    }).then((data: UnitData[]) => {
      this._unitService.towerUnits = data.filter(unit => unit.towerId == tower.towerId);
      $('.unitsClass').not('#towerDetails').not('#towerEnquire').hide();
      $('#towerDetails').show();
      $('#unitSearch').hide(100);
      this.buttonEffect('#mainEnquir_Towers', '#mainAdd_Towers');
      this._unitService.theTowerInfo = tower;
      $('#containerLoader').fadeOut()
    });

  };

};
