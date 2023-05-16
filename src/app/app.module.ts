import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material/material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './pages/nav/nav.component';
import { InvestigatorsComponent } from './pages/user/investigators/investigators.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EstadoComponent } from './pages/user/location/estado/estado.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MunicipioComponent } from './pages/user/location/municipio/municipio.component';
import { ParroquiaComponent } from './pages/user/location/parroquia/parroquia.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { OnlyLetterDirective } from './directives/only-letter.directive';
import { HomeComponent } from './pages/user/home/home.component';
import { PnfComponent } from './pages/user/pnf/pnf.component';
import { TrayectoComponent } from './pages/user/trayecto/trayecto.component';
import { SeccionComponent } from './pages/user/seccion/seccion.component';
import { BulkImportComponent } from './pages/user/bulk-import/bulk-import.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    InvestigatorsComponent,
    LoginComponent,
    OnlyNumbersDirective,
    EstadoComponent,
    MunicipioComponent,
    ParroquiaComponent,
    SignupComponent,
    OnlyLetterDirective,
    HomeComponent,
    PnfComponent,
    TrayectoComponent,
    SeccionComponent,
    BulkImportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
