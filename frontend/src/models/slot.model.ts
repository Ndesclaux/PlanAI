import {ClassModel} from "./class.model";

export default class SlotModel {
  slots_id: number;
  slots_title: string;
  slots_startDate: string;
  slots_endDate: string;
  slots_type: string;
  slots_classes: ClassModel[];
  slots_description: string;
}
