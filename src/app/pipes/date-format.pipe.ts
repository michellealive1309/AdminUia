import { Pipe, PipeTransform } from '@angular/core';
import { firestore } from 'firebase'
import TimeStamp = firestore.Timestamp

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return this.dateFormat(value);
  }

  private dateFormat(date: TimeStamp) {
    if (!date) { return "Unknown date" }
    let rawDate = date.toDate()
    let day = rawDate.getDate().toString(),
    month = '',
    year = rawDate.getFullYear().toString(),
    hour = rawDate.getHours().toString(),
    minute = rawDate.getMinutes().toString()
    switch (rawDate.getMonth()) {
      case 0:
        month = 'January'
        break
      case 1:
        month = 'February'
        break
      case 2:
        month = 'March'
        break
      case 3:
        month = 'April'
        break
      case 4:
        month = 'May'
        break
      case 5:
        month = 'June'
        break
      case 6:
        month = 'July'
        break
      case 7:
        month = 'August'
        break
      case 8:
        month = 'September'
        break
      case 9:
        month = 'October'
        break
      case 10:
        month = 'November'
        break
      case 11:
        month = 'December'
    }
    return day + ' ' + month + ' ' + year + ', ' + ((hour.length == 1)?'0'+hour:hour) + ':' + ((minute.length == 1)?'0'+minute:minute)
  }

}
