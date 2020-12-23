import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import{ FormsModule,ReactiveFormsModule } from  '@angular/forms';
import { HttpClientModule  } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouteComponents } from './app-routing.module';



@NgModule({
  declarations: [
    AppComponent,
    RouteComponents
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC5wzEBHV_vzzybukHvJDqp0XsglftJvUY'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
