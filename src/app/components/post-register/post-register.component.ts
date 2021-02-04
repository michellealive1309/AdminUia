import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post-register',
  templateUrl: './post-register.component.html',
  styleUrls: ['./post-register.component.scss'],
})
export class PostRegisterComponent implements OnInit {

  registerForm: FormGroup
  registerError: boolean = false
  registerErrorMessage: string = ""

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private modalController: ModalController) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      repassword: ['', [Validators.required]]
    }, { updateOn: 'change', validators: this.passwordMatch })
  }

  back() {
    this.modalController.dismiss()
  }

  registerAnnouncer() {
    let data = {
      email: this.registerForm.get('email').value,
      password: this.registerForm.get('password').value
    }
    this.userService.registerUser(data).then(res => {
      if (!res.error) {
        this.registerError = false
        console.log('Create success')
      }
      else {
        this.registerError = true
        console.log(res.code)
        switch (res.code) {
          case "fail":
            this.registerErrorMessage = "Failed to add data to firestore database."
            break
          case "reset/auth/invalid-email":
            this.registerErrorMessage = "Invalid email."
            break
          case "reset/auth/missing-android-pkg-name" :
            this.registerErrorMessage = "An Android package name must be provided if the Android app is required to be installed."
            break
          case "reset/auth/missing-continue-uri" :
            this.registerErrorMessage = "A continue URL must be provided in the request."
            break
          case "reset/auth/missing-ios-bundle-id" :
            this.registerErrorMessage = "An iOS Bundle ID must be provided if an App Store ID is provided."
            break
          case "reset/auth/invalid-continue-uri" :
            this.registerErrorMessage = "The continue URL provided in the request is invalid."
            break
          case "reset/auth/unauthorized-continue-uri" :
            this.registerErrorMessage = "The domain of the continue URL is not whitelisted. Whitelist the domain in the Firebase console."
            break
          case "reset/auth/user-not-found" :
            this.registerErrorMessage = "User not found."
            break
          case "create/auth/email-already-in-use" :
            this.registerErrorMessage = "This email has been registered."
            break
          case "create/auth/invalid-email" :
            this.registerErrorMessage = "Invalid email."
            break
          case "create/auth/operation-not-allowed" :
            this.registerErrorMessage = "Register via Email/Password accounts are not enabled."
            break
          case "create/auth/weak-password" :
            this.registerErrorMessage = "The password is not strong enough."
            break
        }
      }
    }).catch(err => {
      console.log(err)
    })
  }

  passwordMatch(form: FormGroup) {
    let pass = form.get('password').value
    let repass = form.get('repassword').value

    return pass === repass ? null : { notSame: true }
  }

}
