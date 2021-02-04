import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore'
import { switchMap, map, tap } from 'rxjs/operators';
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: firebase.User

  constructor(private afAuth: AngularFireAuth,
    private afFirestore: AngularFirestore) {
      this.afAuth.authState.subscribe(userInfo => this.user = userInfo)
  }

  public getUserRegisterStatus(email) {
    return this.afFirestore.collection<any>('User', ref => ref.where('email', '==', email).where('isRegister', '==', false).orderBy('created', 'desc')).valueChanges().toPromise()
  }

  public registerUser(data) {
    console.log(data)
    return this.afAuth.auth.createUserWithEmailAndPassword(data.email, data.password)
    .then(async (user) => {
      let userProfile = await this.afFirestore.collection<any>('User', ref => ref.where('email', '==', data.email).where('isRegister', '==', false).orderBy('created', 'desc'))
      .snapshotChanges()
      // .pipe(tap(snapShot => {
      //   snapShot.forEach(snap => {
      //     let data = snap.payload.doc.data()
      //     data.isRegister = true
      //     this.afFirestore.collection('User').doc(user.user.uid).set(data).then(() => {
      //       snap.payload.doc.ref.delete()
      //     })
      //   })
      // }))
      .subscribe(snapShot => {
        snapShot.forEach(snap => {
          let data = snap.payload.doc.data()
          data.isRegister = true
          this.afFirestore.collection('User').doc(user.user.uid).set(data).then(() => {
            snap.payload.doc.ref.delete()
          })
        })
      })
      return { error: false, code: "success" }
    })
    // .then(snapShot => {
    //   console.log(snapShot.data)
    //   let result = snapShot.data.map(snap => {
    //     let data = snap.payload.doc.data()
    //     data.isRegister = true
    //     return this.afFirestore.collection('User').doc(snapShot.user.user.uid).set(data)
    //   })
    //   return { snapShot: snapShot.data[0],  result: result[0]}
    // })
    // .then(res => {
    //   res.snapShot.payload.doc.ref.delete()
    //   return res.result.then(() => {
    //     return {error: false, code: 'success'}
    //   })
    //   .catch(err => {
    //     console.log(err)
    //     return { error: true, code: 'fail' }
    //   })
    // })
    .catch(err => {
      return { error: true, code: 'create/' + err.code }
    })
  }

  public signInUser(email,password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      return userCredential.user ? { success: true, code: "" } : { success: false, code: "Signin failed" }
    })
    .catch(err => {
      console.log(err.message)
      let errCode = (err.code === "auth/invalid-email") ? "Invalid email." : (err.code === "auth/wrong-password") ? "Wrong password." : 
      (err.code === "auth/user-disabled") ? "This user is unavailable for now." : "User not found."
      return { success: false, code: errCode }
    })
  }

  public getUserProfile() {
    return this.afAuth.authState.pipe(switchMap(user => this.afFirestore.collection('User').doc<any>(user.uid).valueChanges()))
  }

  public updateUserProfile(tag) {
    let data = {
      tag: tag
    }
    return this.afFirestore.collection('User').doc(this.user.uid).update(data).then(() => true).catch(err => err ? false : true)
  }

  public addGroup(group) {
    return this.afFirestore.collection('User').doc(this.user.uid).update({group: firebase.firestore.FieldValue.arrayUnion(...[group])})
    .then(() => true).catch(err => err ? false : true)
    .catch(err => err ? false : true)
  }

  public addUser(user, data) {
    return this.afFirestore.collection('User').add(data)
    .then(() => {
      return { error: false, code: 'success' }
    })
    .catch(err => {
      console.log(err)
      return { error: true, code: 'fail' }
    })
    //Main logic but have a problem, auto sign-in after sign-up an account.
    // return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
    // .then((user) => {
    //   return this.afAuth.auth.sendPasswordResetEmail(user.user.email)
    //   .then(() => {
    //     return this.afFirestore.collection('User').doc(user.user.uid).set(data)
    //     .then(() => {
    //       return { error: false, code: 'success' }
    //     })
    //     .catch(err => {
    //       console.log(err)
    //       return { error: true, code: 'fail' }
    //     })
    //   })
    //   .catch(err => {
    //     return { error: true, code: 'reset/' + err.code }
    //   })
    // })
    // .catch(err => {
    //   return { error: true, code: 'create/' + err.code }
    // })
  }

  public getAnnouncerUser() {
    return this.afFirestore.collection<any>('User', ref => ref.where('isStudent', '==', false).orderBy('created', 'desc').limit(10)).snapshotChanges()
    .pipe( map(announcer => {
      return announcer.map(user => {
        let userInfo = user.payload.doc.data()
        return {
          id: user.payload.doc.id,
          email: userInfo.email,
          name: userInfo.name,
          created: userInfo.created
        }
      })
    }) )
  }

  public addStudentUser(data) {
    return this.afFirestore.collection('User').add(data).then((doc) => {
      return doc.update({id:doc.id}).then(() => false).catch(err => {
        console.log(err)
        return err ? true : false
      })
    }).catch(err => {
      console.log(err)
      return err ? true : false
    })
    //Main logic has a problem auto sign-in after sign-up an account.
    //Main logic will goes here after has a solution.
  }

  public async signOutUser() {
    this.afAuth.auth.signOut()
  }

  // emailAndPasswordSignIn(email: string, password: string) {
  //   this.afAuth.auth.signInWithEmailAndPassword(email, password).catch(error => {
  //     var errorCode = error.code
  //     var errorMessage = error.message
  //   })
  // }

}
