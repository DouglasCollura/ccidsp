import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authServices:AuthService,
    private formBuilder: FormBuilder,
  ){

  }

  @ViewChild('modal') modal!: TemplateRef<any>;

  form = this.formBuilder.group({
    email: [null, Validators.required],
    password: [null, Validators.required]
  })
  error: boolean = false;
  loading: boolean = false;

  login(){
    this.error =false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authServices.login(this.form.value)
    .subscribe({
      next:(e)=>{
        console.log(e)
        localStorage.setItem('token', e.token)
        localStorage.setItem('user', JSON.stringify(e.user))
        this.router.navigate(['/user'])
      },
      error:({error})=>{
        this.error = true;
        this.loading = false;
      }
    })
  }

  getFieldInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched
  }

  openModal(){
    this.dialog.open(this.modal,
      {
        maxWidth: '600px',
        maxHeight: 'max-content',
        height: 'max-content',
        width: 'max-content',
        panelClass: 'full-screen-modal'
      }).beforeClosed()
      .subscribe(e=>{
      })
  }

}
