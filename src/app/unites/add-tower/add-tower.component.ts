import { Component, OnInit } from '@angular/core';
import { TowerData } from 'src/app/tower-data';

@Component({
  selector: 'app-add-tower',
  templateUrl: './add-tower.component.html',
  styleUrls: ['./add-tower.component.scss']
})
export class AddTowerComponent implements OnInit {

  towerData: TowerData;
  addTowerInvalid: boolean;

  constructor() { }

  ngOnInit() {
    this.towerData = new TowerData();
  };

  addNewTower = () => { }


}
