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
import { TheStocksComponent } from './accountings/stocks/the-stocks/the-stocks.component';
import { AddStocksComponent } from './accountings/stocks/the-stocks/add-stocks/add-stocks.component';
import { EnquireStocksComponent } from './accountings/stocks/the-stocks/enquire-stocks/enquire-stocks.component';
import { StockDetailsComponent } from './accountings/stocks/the-stocks/stock-details/stock-details.component';
import { AddProductsComponent } from './accountings/stocks/the-stocks/add-products/add-products.component';
import { AddToStockPermissionComponent } from './accountings/stocks/stockPermission/add-to-stock-permission/add-to-stock-permission.component';
import { MinFrmStockPermissionComponent } from './accountings/stocks/stockPermission/min-frm-stock-permission/min-frm-stock-permission.component';

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
    TheStocksComponent,
    AddStocksComponent,
    EnquireStocksComponent,
    StockDetailsComponent,
    AddProductsComponent,
    AddToStockPermissionComponent,
    MinFrmStockPermissionComponent,
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
