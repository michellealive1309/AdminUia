import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { AngularFireAuth } from '@angular/fire/auth';
import { ModalController } from '@ionic/angular';
import { PostRegisterComponent } from 'src/app/components/post-register/post-register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup
  submitted: boolean = false
  loginError: boolean = false
  loginErrorMessage: string

  constructor(private formBuilder: FormBuilder,
    private modalController: ModalController,
    private afAuth: AngularFireAuth,
    private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    }, { updateOn: 'change' })
  }

  ngOnInit() {
  }

  login() {
    let email = this.loginForm.get('email')
    let password = this.loginForm.get('password')
    if (email.invalid || password.invalid) {
      return this.submitted = true
    }
    this.afAuth.auth.signInWithEmailAndPassword(email.value, password.value)
    .then(userCredential => {
      var user = userCredential.user
      this.router.navigate(['home'])
    })
    .catch(err => {
      var errorCode = err.code
      var errorMessage = err.message
      this.loginError = true
      this.loginErrorMessage = (errorCode === "auth/invalid-email") ? "Invalid email." : (errorCode === "auth/wrong-password") ? "Wrong password." : 
      (errorCode === "auth/user-disabled") ? "This user is unavailable for now." : "User not found."
      console.log(errorMessage)
    })
    // this.userService.getUserRegisterStatus(email.value).then(profiles => {
    //   profiles.forEach(profile => {
    //     if (!profile.isRegister) {
    //       this.userService.registerUser(email.value, profile.id).then(result => {
    //         this.loginError = result.error
    //         this.loginErrorMessage = ""
    //         if (result.error) {this.loginErrorMessage = "Failed to post register."}
    //       }).catch(err => {
    //         console.log(err)
    //         this.loginError = true
    //         this.loginErrorMessage = "Signin failed with an unknown error."
    //       })
    //     }
    //     else {
    //       this.userService.signInUser(email.value,password.value).then(result => {
    //         this.loginError = !(result.success)
    //         this.loginErrorMessage = result.code
    //       }).catch(err => {
    //         console.log(err)
    //         this.loginError = true
    //         this.loginErrorMessage = "Signin failed with an unknown error."
    //       })
    //     }
    //   })
    // })
  }

  resetSubmitted() {
    this.submitted = false
    this.loginError = false
  }

  postRegister() {
    const modal = this.modalController.create({
      component: PostRegisterComponent,
      backdropDismiss: false
    })
    modal.then(postRegister => postRegister.present())
  }

}
