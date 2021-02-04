import { Pipe, PipeTransform } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Pipe({
  name: 'groupName'
})
export class GroupNamePipe implements PipeTransform {
  constructor(private afFirestore: AngularFirestore) { }
  transform(value: any, ...args: any[]): any {
    let group = this.afFirestore.collection('Group').doc<any>(value).valueChanges()
    return group;
  }

}
