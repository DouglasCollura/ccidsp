import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  role:any = null;

  ngOnInit(): void {
    this.role = JSON.parse(localStorage.getItem('user') || '')?.role
  }
}
