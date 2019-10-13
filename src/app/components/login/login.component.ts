import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  activated:boolean = false ;

  ngOnInit() {
  }

  rightPanelActive(){
    this.activated = true;
  }

  rightPanelNotActive(){
    this.activated = false;
  }

}
