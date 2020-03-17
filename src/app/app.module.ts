import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { CustomerComponent } from './customer/customer.component';
import { WorkersComponent } from './workers/workers.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { ContractorComponent } from './contractor/contractor.component';
import { UnitesComponent } from './unites/unites.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {  HttpClientModule } from '@angular/common/http';
import { SideBarComponent } from './side-bar/side-bar.component';
import { SearchPipe } from './search.pipe';
import { SearchCustomerPipe } from './search-customer.pipe';
import { MainSettingComponent } from './main-setting/main-setting.component';
import { UnitSearchPipe } from './unit-search.pipe';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    CustomerComponent,
    WorkersComponent,
    SuppliersComponent,
    ContractorComponent,
    UnitesComponent,
    NavBarComponent,
    SideBarComponent,
    SearchPipe,
    SearchCustomerPipe,
    MainSettingComponent,
    UnitSearchPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
