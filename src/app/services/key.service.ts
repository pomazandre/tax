import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class KeyService {

	constructor() { }

  getKeyCode(event : any) : number{
      if (event.which == null) { // IE
        return event.keyCode;
      }
      else{
        if (event.which != 0 && event.charCode != 0) { // все кроме IE
        return event.which;
        }
      }
    }

    keyIsEnter(event) : boolean {
      if (this.getKeyCode(event) === 13)  // окончание ввода - enter
        return true;
        else false;
    }

    nonDigitPressed(event : any){
      let ch : number;
      if (event.which == null) { // IE
        ch = event.keyCode;
      }
      else{
        if (event.which != 0 && event.charCode != 0) { // все кроме IE
        ch = event.which;
        }
      }
      if (ch < 48 || ch > 57) // ввели не цифру
        return true;
        else false;
    }

    keyIsUp(event : any){
      if (event.keyCode == 38 || event.which == 38)
        return true;
      else
        return false;
    }

    keyIsDown(event : any){
      if (event.keyCode == 40 || event.which == 40)
        return true;
      else
        return false;
    }

   keyIsEsc(event : any){
      if (event.keyCode == 27 || event.which == 27)
        return true;
      else
        return false;
    }

    keyIsPoint(event : any){
      console.log(event.keyCode); // 46 - точка
      console.log(event.which);  // 63 - запятая
      if (event.keyCode == 46 || event.which == 46)
        return true;
      else
        return false;
    }

}

