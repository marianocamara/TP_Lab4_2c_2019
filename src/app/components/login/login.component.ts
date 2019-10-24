import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  email = 'admin@admin.com';
  pass= 'adminpass';
  newEmail;
  newPass;
  newName;
  isLoading = false;
  
  constructor(public authService:AuthService) { }
  
  @ViewChild('recaptcha', {static: true }) recaptchaElement: ElementRef;
  activated:boolean = false ;
  
  ngOnInit() {
    this.addRecaptchaScript();
  }
  
  Enter() {
    this.isLoading = true;
    this.authService.SignIn(this.email, this.pass).then((result) => {
      this.isLoading = false;
    }).catch((error) => {
      this.isLoading = false;
      console.info(error);
    });
  }
  
  Register(){
    this.isLoading = true;
    this.authService.SignUp(this.newEmail, this.newPass, this.newName).then((result) => {
      this.isLoading = false;
    }).catch((error) => {
      this.isLoading = false;
      console.info(error);
    });
  }
  
  rightPanelActive(){
    this.activated = true;
  }
  
  rightPanelNotActive(){
    this.activated = false;
  }
  
  addRecaptchaScript() {
 
    window['grecaptchaCallback'] = () => {
      this.renderReCaptcha();
    }
   
    (function(d, s, id, obj){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { obj.renderReCaptcha(); return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&amp;render=explicit";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'recaptcha-jssdk', this));
   
  }

  renderReCaptcha() {
    window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
      'sitekey' : '6LdVZr8UAAAAAGUuINv5OIeNIoBm1Sh1FltfVneo ',
      'callback': (response) => {
          console.log(response);
      }
    });
  }
  
}
