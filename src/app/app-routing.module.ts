import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { NavComponent } from './pages/nav/nav.component';
import { InvestigatorsComponent } from './pages/user/investigators/investigators.component';
import { EstadoComponent } from './pages/user/location/estado/estado.component';
import { MunicipioComponent } from './pages/user/location/municipio/municipio.component';
import { ParroquiaComponent } from './pages/user/location/parroquia/parroquia.component';

const routes: Routes = [
  {
    path: '',
    component:LoginComponent,
  },

  {
    path: 'user',
    component:NavComponent,
    children: [
      { path: 'investigator', component: InvestigatorsComponent },
      { path: 'location/state', component: EstadoComponent },
      { path: 'location/municipio', component: MunicipioComponent },
      { path: 'location/parroquia', component: ParroquiaComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
