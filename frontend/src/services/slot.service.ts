import {Subject} from "rxjs";
import {ClandarSlot} from "../models/clandarSlot.model";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ClassService} from "./class.service";
import {ClassModel} from "../models/class.model";
import SlotModel from "../models/slot.model";
import {rejects} from "assert";

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

  emitSlotSubject(): void {
    this.slotSubject.next(this.calendarSlots.slice());
  }

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

            let newCalendarSlot: ClandarSlot = {
              id: null,
              title: '',
              start: '',
              end: '',
              color: '',
              classes: [],
              type: '',
            };

            this.classService.getClassById(slot.class_id).then( (classe) => {

              if(!ids.includes(slot.slots_id)){

                let color = '';

                switch (slot.slots_type) {
                  case 'Piscine':
                    color = '#66b3ff';
                    break;

                  case 'Complexe Sportif':
                    color = '#ff9966';
                    break;

                  case 'Sortie':
                    color = '#00cc00';
                    break;

                  case 'Biblioth??que':
                    color = '#ff6699';
                    break;

                  case 'Tablettes':
                    color = '#a3c2c2';
                    break;

                  default:
                    color = '#000000';
                    break;
                }

                ids.push(slot.slots_id);

                newCalendarSlot.id = slot.slots_id;
                newCalendarSlot.title = slot.slots_title;
                newCalendarSlot.start = slot.slots_startDate;
                newCalendarSlot.end = slot.slots_endDate;
                newCalendarSlot.color = color;
                newCalendarSlot.type = slot.slots_type;
                newCalendarSlot.description = slot.slots_description;
                newCalendarSlot.classes.push(classe);
                this.calendarSlots.push(newCalendarSlot);
              }
              else {
                let index = this.calendarSlots.findIndex((c) => c.id == slot.slots_id);
                /*console.log(index);
                console.log(this.calendarSlots[index]);*/
                this.calendarSlots[index].classes.push(classe);
                /*console.log(this.calendarSlots);*/
              }

              this.emitSlotSubject();
            })

          })

          //this.calendarSlots = slots;

        }
        (err) => {
          console.error(err);
        }
      }
    )
  }

  getSlotByID(id: string): Promise<any>{

    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/slot/'+id).subscribe( (response) => {
        resolve(response);
      }, (error) => {
        reject(error);
      })
    })
  }

  saveSlot(slot: SlotModel){
    return new Promise( (resolve, reject) => {
      this.http.post('http://localhost:3000/slot', slot).subscribe( (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        })
    })
  }

  updateSlot(slot: SlotModel){
    return new Promise( (resolve, reject) => {
      this.http.put('http://localhost:3000/slot/'+slot.slots_id, slot).subscribe( (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        })
    })
  }

  deleteSlot(id: number){
    return new Promise( (resolve, reject) => {
      this.http.delete('http://localhost:3000/slot/'+ id).subscribe( (response) => {
        resolve(response);
      },
        (error) => {
        reject(error);
        })
    })
  }
}
