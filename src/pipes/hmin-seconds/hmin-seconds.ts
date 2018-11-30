import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'hminSeconds',
})
export class HminSecondsPipe implements PipeTransform {
//  import { padStart } from "lodash";
// padStart(value.toString()),2,0)


  transform(value: number):string {
    const minutes:number=Math.floor(value/60);
    const hours: number=Math.floor(minutes/60);
    return hours.toString()+" h "+this.pad((minutes -hours*60),2) + " min " + this.pad((value -minutes*60),2) + " sec";
  }

  pad(num:number, size:number): string {
    let s:string = num.toString();
    while (s.length < size) s = " " + s;
    
    return s;
}

}
