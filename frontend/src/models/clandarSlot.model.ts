import {ClassModel} from "./class.model";

export class ClandarSlot {
  id:  number;
  title: string;
  start: string;
  end: string;
  type: string;
  classes : ClassModel[];
  description?: string;
  color?: string;
}
