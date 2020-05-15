import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { WorkersComponent } from './workers/workers.component';
import { CustomerComponent } from './customer/customer.component';
import { UnitesComponent } from './unites/unites.component';
import { MainSettingComponent } from './main-setting/main-setting.component';
import { TheStocksComponent } from './accountings/stocks/the-stocks/the-stocks.component';
import { SafeAccComponent } from './accountings/safe-acc/safe-acc.component';


const routes: Routes = [
  {path:'', redirectTo:'logIn', pathMatch:'full'},
  {path:'logIn', component:LoginComponent},
  {path:'home', component:HomeComponent},
  {path:'workers', component:WorkersComponent},
  {path:'workers/:id', component:WorkersComponent},
  {path:'customers', component:CustomerComponent},
  {path:'unites', component:UnitesComponent},
  {path:'MainSetting', component:MainSettingComponent},
  {path:'stocks', component:TheStocksComponent},
  {path:'safe-acc', component:SafeAccComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
