import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { NavComponent } from './pages/nav/nav.component';
import { InvestigatorsComponent } from './pages/user/investigators/investigators.component';
import { EstadoComponent } from './pages/user/location/estado/estado.component';
import { MunicipioComponent } from './pages/user/location/municipio/municipio.component';
import { ParroquiaComponent } from './pages/user/location/parroquia/parroquia.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { UnAuthGuard } from './guards/un-auth.guard';
import { HomeComponent } from './pages/user/home/home.component';
import { PnfComponent } from './pages/user/pnf/pnf.component';
import { TrayectoComponent } from './pages/user/trayecto/trayecto.component';
import { SeccionComponent } from './pages/user/seccion/seccion.component';
import { BulkImportComponent } from './pages/user/bulk-import/bulk-import.component';

const routes: Routes = [
  {
    path: '',
    canActivate:[UnAuthGuard],
    component:LoginComponent,
  },
  {
    path: 'signup',
    canActivate:[UnAuthGuard],
    component:SignupComponent,
  },

  {
    path: 'user',
    canActivate:[AuthGuard],
    component:NavComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'investigator', component: InvestigatorsComponent },
      { path: 'location/state', component: EstadoComponent },
      { path: 'location/municipio', component: MunicipioComponent },
      { path: 'location/parroquia', component: ParroquiaComponent },
      { path: 'institution/pnf', component: PnfComponent },
      { path: 'institution/trayecto', component: TrayectoComponent },
      { path: 'institution/seccion', component: SeccionComponent },
      { path: 'bulk-import', component: BulkImportComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
