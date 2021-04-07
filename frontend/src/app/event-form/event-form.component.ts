import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ClassModel} from "../../models/class.model";
import {ClassService} from "../../services/class.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
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

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private classService: ClassService,
              private slotService: SlotService) {
    this.initForm();
  }

  ngOnInit(): void {
    this.classSubscription = this.classService.classSubject.subscribe((classes: any[]) => {
      this.classes = classes
    })
    this.classService.getAllClasses();
  }

  initForm(): void{
    this.slotForm = this.formBuilder.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['', Validators.required],
      classes: this.formBuilder.array([],Validators.required)
    })
  }

  onSubmitForm() {
    const formValue = this.slotForm.value;
    const newSlot: SlotModel = {
      slots_id: null,
      slots_title: formValue['title'],
      slots_startDate: formValue['startDate'],
      slots_endDate: formValue['endDate'],
      slots_type: formValue['type'],
      slots_classes: formValue['classes'] ? formValue['classes'] : []
    }
    this.slotService.saveSlot(newSlot).then( () => {
      this.navigateBack();
    });
  }

  onCheckboxChange(e) {
    const checkArray: FormArray = this.slotForm.get('classes') as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
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
