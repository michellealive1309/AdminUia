import { Pipe, PipeTransform } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage'

@Pipe({
  name: 'fileName'
})
export class FileNamePipe implements PipeTransform {
  constructor(private afStorage: AngularFireStorage) {}
  transform(value: any, ...args: any[]): any {
    let fileRef = this.afStorage.ref(value)
    let metadata = fileRef.getMetadata()
    return metadata;
  }

}
