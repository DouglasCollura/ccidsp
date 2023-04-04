import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { NavComponent } from './pages/nav/nav.component';
import { InvestigatorsComponent } from './pages/user/investigators/investigators.component';

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
    //   // { path: 'details', component: BuyerDetailsComponent },
    //   // { path: 'search', component: BuyerSearchComponent },
    //   // { path: 'rental', component: BuyerRentalComponent },
    //   // { path: 'garage', component: BuyerGarageComponent },
    //   // { path: 'replacement', component: BuyerReplacementComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
