import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {ClassModel} from "../models/class.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  public classSubject = new Subject<any[]>();
  private classes: ClassModel[] = [];

  constructor(private http: HttpClient) {
  }

  getAllClasses(): void {
    this.classes = [];
    this.http.get('http://localhost:3000/classes').subscribe(
      (classes: any[]) => {
        if (classes){
          classes.forEach( (classe) => {
            console.log(classe);
            this.classes.push(classe);
            this.emitClassSubject();
          })
        }
        (err) => {
          console.error(err)
        }
      }
    )
  }

  getClassById(id: number): Promise<any>{
    return new Promise( (resolve, reject) => {
      this.http.get('http://localhost:3000/classes/'+id).subscribe(
        (classes: any[]) => {
          if (classes){
            classes.forEach( (classe) => {
              console.log(classe);
              resolve(classe);
            })
          }
          (err) => {
            console.error(err)
          }
        })
    })
    /*this.classes = [];
    this.http.get('http://localhost:3000/classes/'+id).subscribe(
      (classes: any[]) => {
        if (classes){
          classes.forEach( (classe) => {
            console.log(classe);
            this.classes.push(classe);
            this.emitClassSubject();
          })
        }
        (err) => {
          console.error(err)
        }
      }
    )*/
  }

  emitClassSubject(): void {
    this.classSubject.next(this.classes.slice());
  }




}
