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
    events: this.calendarEvents,
    eventContent: this.renderEventContent,

  };

  constructor(private slotService : SlotService,
              private router: Router,) {
    const name = Calendar.name;
  }

  renderEventContent(eventInfo, createElement) {
    var innerHtml;
    var classes = eventInfo.event._def.extendedProps.classes;
    var color = eventInfo.event._def.ui.backgroundColor;

    var fontColor = ''
    if (classes) {
      // Store custom html code in variable
      innerHtml = "<p style='color: whitesmoke; margin-bottom: 1px'><b>"+eventInfo.event._def.title + "</b></p>";
        classes.forEach( classe => {
          innerHtml += "<p style='margin-bottom: 1px; color: whitesmoke'>"+classe.class_name+"</p>"
        });

      //Event with rendering html
      createElement = {html: "<div style='width: 100%!important; height: 100%!important; background-color: "+ color+ "'>" + innerHtml + "</div>"}
      return createElement;
    }
  }

  handleDateClick(arg): void {
    this.calendarComponent.getApi().changeView('timeGridDay',arg.dateStr);
  }

  handleEventClick(arg): void{
    alert(arg.event.title);
  }

  ngOnInit(): void {
    this.slotSubscription = this.slotService.slotSubject.subscribe( (slots: any[]) => {

      this.calendarOptions.events = slots
      /*console.log(this.calendarEvents);*/
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

