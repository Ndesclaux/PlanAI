import {Subject} from "rxjs";
import {ClandarSlot} from "../models/clandarSlot.model";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ClassService} from "./class.service";
import {ClassModel} from "../models/class.model";
import SlotModel from "../models/slot.model";

@Injectable({
  providedIn: 'root'
})
export class SlotService {

  public slotSubject = new Subject<any[]>();
  private calendarSlots: ClandarSlot[] = [
    /*{ id: 0, title: 'Campagnes BDS', start: '2021-03-22T09:30:00.000Z', end: '2021-03-22T10:30:00.000Z', color: '#4d4dff'},
    { id: 1, title: 'Anniversaire Manon', start: '2021-03-23T09:30:00.000Z', end: '2021-03-23T10:30:00.000Z', color: '#4d4dff'},
    { id: 2, title: 'Anniversaire Nicolas', start: '2021-03-24T09:30:00.000Z', end: '2021-03-24T10:30:00.000Z', color: '#4d4dff'},*/
  ];

  constructor(private http: HttpClient,
              private classService: ClassService) {
  }

  /*
  class_id: 3
slots_class_id: 3
slots_endDate: "2021-03-23T14:30:00.000Z"
slots_id: 3
slots_startDate: "2021-03-23T13:30:00.000Z"
slots_title: "Piscine"
slots_type: "Sport"
   */

  getAllSlots(): void {

    this.calendarSlots = [];
    let ids = [];
    this.http.get('http://localhost:3000/slots').subscribe(
      (slots: any[]) => {
        if(slots){

          slots.forEach( (slot) => {

            let color = '';

            if (slot.slots_type === 'Sport')
              color = '#ff4d4d';
            else
              color = '#00b33c';

            let newSlot: SlotModel = {
              slots_id: null,
              slots_title: '',
              slots_startDate: '',
              slots_endDate: '',
              slots_type: '',
              slots_classes: []
            }

            newSlot.slots_id = slot.slots_id;
            newSlot.slots_title = slot.slots_title;
            newSlot.slots_startDate = slot.slots_startDate;
            newSlot.slots_endDate = slot.slots_endDate;
            newSlot.slots_type = slot.slots_type;

            let newCalendarSlot: ClandarSlot = {
              id: null,
              title: '',
              start: '',
              end: '',
              color: '',
              //classes: [],
            }
            newCalendarSlot.id = slot.slots_id;
            newCalendarSlot.title = slot.slots_title;
            newCalendarSlot.start = slot.slots_startDate;
            newCalendarSlot.end = slot.slots_endDate;
            newCalendarSlot.color = color;
            //newCalendarSlot.classes.push(classe);
            this.calendarSlots.push(newCalendarSlot)

            /*this.classService.getClassById(slot.class_id).then( (classe) => {

              let newCalendarSlot: SlotModel = {
                id: slot.slots_id,
                title: slot.slots_title,
                start: slot.slots_startDate,
                end: slot.slots_endDate,
                color: color,
                classes: [],
              }
              let newCalendarSlot: SlotModel = {
                id: null,
                title: '',
                start: '',
                end: '',
                color: '',
                //classes: [],
              }

              if(!ids.includes(slot.slots_id)){
                //console.log(slot);
                let color = '';

                if (slot.slots_type === 'Sport')
                  color = '#ff4d4d';
                else
                  color = '#00b33c';

                ids.push(slot.slots_id);

                newCalendarSlot.id = slot.slots_id;
                newCalendarSlot.title = slot.slots_title;
                newCalendarSlot.start = slot.slots_startDate;
                newCalendarSlot.end = slot.slots_endDate;
                newCalendarSlot.color = color;
                //newCalendarSlot.classes.push(classe);
                this.calendarSlots.push(newCalendarSlot)
                console.log(this.calendarSlots);
              }
              else {
                console.log("SlotModel existant at : " + slot.slots_id)
                console.log(this.calendarSlots[slot.slots_id]);
                //this.calendarSlots[slot.slots_id].classes.push(classe)
              }
            })*/


          })

          //this.calendarSlots = slots;
          console.log("Slots")
          console.log(this.calendarSlots);
          this.emitSlotSubject();
        }
        (err) => {
          console.error(err);
        }
      }
    )
  }

  emitSlotSubject(): void {
    this.slotSubject.next(this.calendarSlots.slice());
  }

  addEvent(title: string, date: string, type: string): void {

    /*const newSlot: SlotModel = {
      title: '',
      date: '',
      type: ''
    };

    newSlot.title = title;
    newSlot.date = date;
    newSlot.type = type;

    if (newSlot.type === 'Sport'){
      newSlot.color = '#66a3ff'
    }
    else
      newSlot.color = '#00b33c'

    this.calendarSlots.push(newSlot);
    this.emitSlotSubject();*/
  }
}
