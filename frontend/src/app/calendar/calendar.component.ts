import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {SlotService} from "../../services/slot.service";
import {CalendarOptions, EventAddArg, FullCalendarComponent} from '@fullcalendar/angular';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {Router} from "@angular/router";
import Swal from 'sweetalert2';
import {logger} from "codelyzer/util/logger";
import {ClassService} from "../../services/class.service";
import {ClassModel} from "../../models/class.model";

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
  classSubscription: Subscription;
  classes: ClassModel[] = [];

  constructor(private slotService : SlotService,
              private classService: ClassService,
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
    let classes = arg.event._def.extendedProps.classes;

    console.log(arg.event.extendedProps);

    //region Construction du contenu de la modale
    let innerhtml: string = "<div>";
    innerhtml += "<hr><p>";
    classes.forEach((c,index) => {

      if(index !== classes.length-1)
        innerhtml += c.class_name + " / ";
      else
        innerhtml += c.class_name + "</p>";

    });
    innerhtml += "<p>Début : " + arg.event.start.toLocaleTimeString().slice(0,-3) + " / Fin : "
      + arg.event.end.toLocaleTimeString().slice(0,-3) + "</p>"

    if(arg.event._def.extendedProps.description != null){
      innerhtml += "<hr>"
      innerhtml += "<p>" + arg.event._def.extendedProps.description + "</p>"
    }
    innerhtml += "</div>"
    //endregion

    Swal.fire({
      title: arg.event.title,
      html: innerhtml,
      showCloseButton: true,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: '<i class="fas fa-pen"></i> Modifier',
      denyButtonText: '<i class="fas fa-times"></i> Supprimer',
    }).then((result) => {
      if (result.isConfirmed){
        console.log("Modifier clicked : ", arg.event.id);
        this.router.navigate(['/editSlot', arg.event.id]);
      }
      else if (result.isDenied){
        Swal.fire({
          title: 'Supprimer cet événement ?',
          //text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Confirmer'
        }).then((result) => {
          if (result.isConfirmed) {
            console.log("Supprimer clicked");
            this.slotService.deleteSlot(arg.event.id).then( () => {
              Swal.fire({
                position: 'top-end',
                icon:'success',
                title: 'Evénement supprimé !',
                showConfirmButton: false,
                timer: 2000
                }
              ).then( () => {
                this.slotService.getAllSlots();
              })
            })

          }
        })

      }
    })
  }


  ngOnInit(): void {
    this.slotSubscription = this.slotService.slotSubject.subscribe( (slots: any[]) => {

      this.calendarOptions.events = slots
    });
    this.slotService.getAllSlots();
    this.classSubscription = this.classService.classSubject.subscribe((classes: any[]) => {
      this.classes = classes
    })
    this.classService.getAllClasses();

  }

  addEventButtonClicked() {
    this.router.navigate(['/addSlot'])
  }

  ngOnDestroy(): void {
    this.slotSubscription.unsubscribe();
  }
}

