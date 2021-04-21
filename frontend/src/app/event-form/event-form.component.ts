import {Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ClassModel} from "../../models/class.model";
import {ClassService} from "../../services/class.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import {ClandarSlot} from "../../models/clandarSlot.model";
import SlotModel from "../../models/slot.model";
import {SlotService} from "../../services/slot.service";

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit, OnDestroy {

  faArrowCircleLeft = faArrowCircleLeft;

  slotForm: FormGroup;
  types: any = ['Piscine','Complexe Sportif','Sortie','Bibliothèque','Tablettes'];

  classSubscription: Subscription;
  classes: ClassModel[] = [];

  showRepetitive: boolean = false;
  isModifying: boolean = false;

  slot: SlotModel;

  @ViewChildren('checkBoxes') checkBoxes: QueryList<ElementRef>;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private classService: ClassService,
              private slotService: SlotService,
              private route: ActivatedRoute) {
    this.slot = {
      slots_id: null,
      slots_title: "",
      slots_startDate: "",
      slots_endDate: "",
      slots_type: "",
      slots_classes: [],
      slots_description: "",
    };

  }

  ngOnInit(): void {

    this.initForm();
    this.classSubscription = this.classService.classSubject.subscribe((classes: any[]) => {
      this.classes = classes
    })
    this.classService.getAllClasses();
    let id = this.route.snapshot.params['id'];

    if( id != null){
      this.isModifying = true;
      this.slotService.getSlotByID(id).then( (slot) => {
        console.log(slot)
        this.slot.slots_id = slot.slots_id;
        this.slot.slots_title = slot.slots_title;
        this.slot.slots_startDate = slot.slots_startDate;
        this.slot.slots_endDate = slot.slots_endDate;
        this.slot.slots_type = slot.slots_type;
        this.slot.slots_description = slot.slots_description;

        slot.class_id.forEach(c => {
          this.slot.slots_classes.push(c)
        })

        let startDate = new Date(this.slot.slots_startDate);
        let endDate = new Date(this.slot.slots_endDate);

        startDate.setHours(startDate.getHours() +2);
        endDate.setHours(endDate.getHours() +2);

        this.slot.slots_startDate = startDate.toISOString();
        this.slot.slots_endDate = endDate.toISOString();


        //startDate.setHours(startDate.getHours()+2)

        console.log(this.slot);
        //Set default value form
        this.slotForm.get('title').setValue(this.slot.slots_title);
        this.slotForm.get('description').setValue(this.slot.slots_description);
        this.slotForm.get('startDate').setValue(this.slot.slots_startDate.slice(0,-8));
        this.slotForm.get('endDate').setValue(this.slot.slots_endDate.slice(0,-8));
        this.slotForm.get('type').setValue(this.slot.slots_type);

        const checkArray: FormArray = this.slotForm.get('classes') as FormArray;

        this.slot.slots_classes.forEach( c => {
          checkArray.push(new FormControl(c))
        })

      })
    }
  }

  initForm(): void{

    this.slotForm = this.formBuilder.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['', Validators.required],
      description: [''],
      classes: this.formBuilder.array([],Validators.required),
      repetitive: [''],
      nbWeeks:[''],
    })
  }

  onSubmitForm() {
    const formValue = this.slotForm.value;

    let id = null;
    if (this.isModifying){
      id = this.slot.slots_id
    }

    const newSlot: SlotModel = {
      slots_id: id,
      slots_title: formValue['title'],
      slots_startDate: formValue['startDate'],
      slots_endDate: formValue['endDate'],
      slots_type: formValue['type'],
      slots_description: formValue['description'],
      slots_classes: formValue['classes'] ? formValue['classes'] : []
    }

    if(this.showRepetitive){

      let startDate: Date = new Date(formValue['startDate']);
      let endDate: Date = new Date(formValue['endDate']);

      startDate.setHours(startDate.getHours() +2);
      endDate.setHours(endDate.getHours() +2);

      for(let i = 0; i <formValue['nbWeeks']; i++ ){

        this.slotService.saveSlot(newSlot).then( () => {
          console.log("Slot ajouté")

          if (i == formValue['nbWeeks']-1){
            this.navigateBack();
          }
        })

        startDate.setDate(startDate.getDate() + 7);
        endDate.setDate(endDate.getDate() + 7);

        newSlot.slots_startDate = startDate.toISOString();
        newSlot.slots_endDate = endDate.toISOString();
      }

    }
    else{
      if (this.isModifying){
        console.log(newSlot);
        this.slotService.updateSlot(newSlot).then( () => {
          this.navigateBack();
        })
      }
      else {
        this.slotService.saveSlot(newSlot).then( () => {
          this.navigateBack();
        });
      }

    }
  }

  onCheckboxChange(e) {
    const checkArray: FormArray = this.slotForm.get('classes') as FormArray;

    if (e.target.checked) {
      let val: number = +e.target.value;
      console.log(typeof val)
      checkArray.push(new FormControl(val));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  showRepetitiveForm(e) {
    this.showRepetitive = e.target.checked;
    console.log(this.showRepetitive);
  }

  ngOnDestroy() {
    this.classSubscription.unsubscribe();
  }

  navigateBack() {
    this.router.navigate(['']);
  }

  changeType(e) {
    this.slotForm.controls['type'].setValue(e.target.value.toString().slice(3));
  }

  onChangedStartDate(e) {
      this.slotForm.controls['endDate'].setValue(e.target.value);
  }
}
