import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationComponent } from "./registration/registration.component";

const routes: Routes = [
  {path: '', redirectTo:'registration' , pathMatch: 'full'},
  {path: 'registration', component: RegistrationComponent},
  {path: '**', redirectTo:'registration'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const RouteComponents = [
  RegistrationComponent
];
