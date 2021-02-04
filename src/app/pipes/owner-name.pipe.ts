import { Pipe, PipeTransform } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Pipe({
  name: 'ownerName'
})
export class OwnerNamePipe implements PipeTransform {
  constructor(private afFirestore: AngularFirestore) { }
  transform(value: any, ...args: any[]): any {
    let user = this.afFirestore.collection('User').doc<any>(value).valueChanges()
    return user;
  }

}
