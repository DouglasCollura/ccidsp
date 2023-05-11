import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit{

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authServices:AuthService,
    private formBuilder: FormBuilder,
    private rutaActiva: ActivatedRoute
  ){}

  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessSwal') SuccessSwal!: SwalComponent;

  ngOnInit(): void {
    this.rutaActiva.queryParams
    .subscribe((e:any)=>{
      this.type = parseInt(e?.type)
      this.form.get('role')?.setValue(this.type == 1 ? 'teacher' : 'student')
    })
  }

  form = this.formBuilder.group({
    role: ['', Validators.required],
    email: [null, Validators.required],
    password: [null, Validators.required],
    people:this.formBuilder.group({
      name: [null, Validators.required],
      lastname: [null, Validators.required],
      nationality: [1],
      cedula: [null, Validators.required],
    })
  })

  type:number=0
  error: boolean = false;
  loading: boolean = false;
  viewPass:boolean = false;

  signup(){
    this.error =false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authServices.signUp(this.form.value)
    .subscribe({
      next:(e)=>{
        this.SuccessSwal.fire()
        this.router.navigate(['/'])
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
