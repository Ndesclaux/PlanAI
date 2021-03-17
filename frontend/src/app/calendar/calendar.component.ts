import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {SlotService} from "../../services/slot.service";
import {CalendarOptions, EventAddArg, FullCalendarComponent} from '@fullcalendar/angular';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {Router} from "@angular/router";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  calendarEvents = [];
  slotSubscription: Subscription;

  calendarOptions: CalendarOptions = {
    plugins: [ dayGridPlugin, timeGridPlugin, listPlugin ],
    locale: 'fr',
    buttonText: {
      today: 'Aujourd\'hui',
      month: 'mois',
      week : 'semaine',
      day: 'jour',
    },
    initialView: 'dayGridMonth',
    headerToolbar: {
      right: 'prev,next today',
      center: 'title',
      left: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    events: [],
  };

  constructor(private slotService : SlotService,
              private router: Router,) {
    const name = Calendar.name;
  }

  handleDateClick(arg): void {
    this.calendarComponent.getApi().changeView('timeGridDay',arg.dateStr);
  }

  handleEventClick(arg): void{
    alert(arg.event.title);
  }

  ngOnInit(): void {
    this.slotSubscription = this.slotService.slotSubject.subscribe( (slots: any[]) => {
      console.log("Subscribe events")
      slots.forEach( (slot) => {
      })
      this.calendarOptions.events = slots
      //console.log(this.calendarEvents);
    });
    this.slotService.getAllSlots();
    //this.slotService.emitSlotSubject();

  }

  addEventButtonClicked() {
    this.router.navigate(['/addSlot'])
  }

  ngOnDestroy(): void {
    this.slotSubscription.unsubscribe();
  }
}
