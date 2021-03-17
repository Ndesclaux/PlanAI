import {Subject} from "rxjs";
import {Slot} from "../models/slot.model";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ClassService} from "./class.service";
import {ClassModel} from "../models/class.model";

@Injectable({
  providedIn: 'root'
})
export class SlotService {

  public slotSubject = new Subject<any[]>();
  private calendarSlots: Slot[] = [
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

            let newSlot: Slot = {
              id: null,
              title: '',
              start: '',
              end: '',
              color: '',
              //classes: [],
            }
            newSlot.id = slot.slots_id;
            newSlot.title = slot.slots_title;
            newSlot.start = slot.slots_startDate;
            newSlot.end = slot.slots_endDate;
            newSlot.color = color;
            //newSlot.classes.push(classe);
            this.calendarSlots.push(newSlot)

            /*this.classService.getClassById(slot.class_id).then( (classe) => {

              let newSlot: Slot = {
                id: slot.slots_id,
                title: slot.slots_title,
                start: slot.slots_startDate,
                end: slot.slots_endDate,
                color: color,
                classes: [],
              }
              let newSlot: Slot = {
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

                newSlot.id = slot.slots_id;
                newSlot.title = slot.slots_title;
                newSlot.start = slot.slots_startDate;
                newSlot.end = slot.slots_endDate;
                newSlot.color = color;
                //newSlot.classes.push(classe);
                this.calendarSlots.push(newSlot)
                console.log(this.calendarSlots);
              }
              else {
                console.log("Slot existant at : " + slot.slots_id)
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

    /*const newSlot: Slot = {
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
