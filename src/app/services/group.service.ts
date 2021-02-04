import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth';
import { Group } from 'src/app/interfaces/group'
import { switchMap, map } from 'rxjs/operators'
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private afFirestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private afStorage: AngularFireStorage) { }

  public addGroup(groupInfo) {
    return this.afFirestore.collection('Group').add(groupInfo).then(snapshotData => {
      return snapshotData.update({id: snapshotData.id}).then(() => snapshotData.id).catch(err => err ? true : false)
    }).catch(err => err ? true: false)
  }

  public getGroup() {
    return this.afAuth.user.pipe(switchMap(user => {
      return this.afFirestore.collection<Group>('Group', ref => ref.where('owner', '==', user.uid).orderBy('modified', 'desc')).valueChanges()
    }), map(groups => groups.map(group => {
      if(!group.subscriber) { group.subscriber = [] }
      return group
    })))
  }

  public getSingleGroup(groupId) {
    return this.afFirestore.collection('Group').doc<Group>(groupId).valueChanges()
  }

  public updateGroup(groupId: string, data: any) {
    return this.afFirestore.collection('Group').doc(groupId).update(data).then(() => false).catch(err => {
      console.error(err)
      return err ? true: false
    })
  }

  public async addNews(data: any) {

    return await this.afFirestore.collection('Feed').add(data).then(() => false).catch(err => {
      console.error(err)
      return err ? true:false
    })

  }

  public async updateNews(data: any, contentId: string) {

    return await this.afFirestore.collection('Feed').doc(contentId).update(data).then(() => false).catch(err => {
      console.error(err)
      return err ? true:false
    })

  }

  public async addAnnounce(data: any) {

    return await this.afFirestore.collection('Feed').add(data).then(() => false).catch(err => {
      console.error(err)
      return err ? true:false
    })

  }

  public async deleteContent(content) {
    if (content.type === "announce") {
      if (content.filesRef && content.filesRef.length > 0) {
        for (let fileRef of content.filesRef) {
          if (!fileRef) { return }
          let storageRef = this.afStorage.ref(fileRef)
          storageRef.delete().toPromise().then(() => console.log(fileRef + ' deleted')).catch(err => console.error(err))
        }
      }
      if (content.imagesRef && content.imagesRef.length > 0) {
        for (let imageRef of content.imagesRef) {
          if (!imageRef) { return }
          let storageRef = this.afStorage.ref(imageRef)
          storageRef.delete().toPromise().then(() => console.log(imageRef + ' deleted')).catch(err => console.error(err))
        }
      }
    }
    return this.afFirestore.collection('Feed').doc(content.id).delete().then(() => false).catch(err => {
      console.error(err)
      return err ? true:false
    })
  }

  public getContent(groupId: string) {

    return this.afFirestore.collection<any>('Feed', query => query.where('group', '==', groupId).orderBy('created', 'desc')).snapshotChanges()

  }

  public async deleteGroup(groupId) {
    let subscription = await this.afFirestore.collection<any>('Feed', ref => ref.where('group', '==', groupId).orderBy('created', 'desc')).snapshotChanges().subscribe(contents => {
      contents.forEach(value => {
        console.log(value)
        let content = value.payload.doc.data()
        if (content.type === "announce") {
          if (content.filesRef && content.filesRef.length > 0) {
            for (let fileRef of content.filesRef) {
              if (!fileRef) { return }
              let storageRef = this.afStorage.ref(fileRef)
              storageRef.delete().toPromise().then(() => console.log(fileRef + ' deleted')).catch(err => console.error(err))
            }
          }
          if (content.imagesRef && content.imagesRef.length > 0) {
            for (let imageRef of content.imagesRef) {
              if (!imageRef) { return }
              let storageRef = this.afStorage.ref(imageRef)
              storageRef.delete().toPromise().then(() => console.log(imageRef + ' deleted')).catch(err => console.error(err))
            }
          }
        }
        this.afFirestore.collection('Feed').doc(value.payload.doc.id).delete()
      })
    })
    await this.afFirestore.collection('Group').doc(groupId).delete()
    return subscription
  }

}
