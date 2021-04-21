import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import {RouterModule, Routes} from "@angular/router";

import {FullCalendarModule} from "@fullcalendar/angular";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {SlotService} from "../services/slot.service";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import { EventFormComponent } from './event-form/event-form.component';
import {ClassService} from "../services/class.service";

import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin
]);

const appRoutes: Routes = [
  {path: '', component: CalendarComponent},
  {path: 'addSlot', component: EventFormComponent},
  {path: 'editSlot/:id', component: EventFormComponent},
];


@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    EventFormComponent
  ],
  imports: [
    BrowserModule,
    FullCalendarModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule.forRoot(appRoutes),
    SweetAlert2Module.forRoot(),
  ],
  providers: [
    SlotService,
    ClassService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
