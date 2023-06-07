import { Component, TemplateRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { PnfService } from '../../services/pnf.service';
import { TrayectoService } from '../../services/trayecto.service';
import { SeccionService } from '../../services/seccion.service';
import { TeacherService } from '../../services/teacher.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterViewInit {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authServices: AuthService,
    private formBuilder: FormBuilder,
    private rutaActiva: ActivatedRoute,
    private pnfServices: PnfService,
    private trayectoServices: TrayectoService,
    private seccionService: SeccionService,
    private teacherService: TeacherService,
  ) { }

  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessSwal') SuccessSwal!: SwalComponent;

  ngOnInit(): void {
    this.rutaActiva.queryParams
      .subscribe((e: any) => {
        this.type = parseInt(e?.type)
        this.form.get('role')?.setValue(this.type == 1 ? 'teacher' : 'student')
        this.type == 1 && (this.disableInputs = true)
        this.getPnfs()
        this.getTrayectos()
      })
  }

  ngAfterViewInit(): void {
    this.formTeacher.get('trayectosId')
      .valueChanges.subscribe(e => {
        this.formTeacher.get('seccionesId').reset()
        e && this.getSecciones()
      })

    this.formTeacher.get('pnfId')
      .valueChanges.subscribe(e => {
        this.formTeacher.get('seccionesId').reset()
        this.formTeacher.get('trayectosId').reset()
      })

    this.formTeacher.get('seccionesId')
      .valueChanges.subscribe(e => {
        this.error = false;
        e ? this.canAdd = true : this.canAdd = false
      })

    this.formInvestigator.get('trayectoId')
      .valueChanges.subscribe(e => {
        this.formInvestigator.get('seccionId').reset()
        e && this.getSecciones()
      })

    this.formInvestigator.get('pnfId')
      .valueChanges.subscribe(e => {
        this.formInvestigator.get('seccionId').reset()
        this.formInvestigator.get('trayectoId').reset()
      })

    this.formInvestigator.get('seccionId')
      .valueChanges.subscribe(e => {
        this.error = false;
        e ? this.canAdd = true : this.canAdd = false
      })
  }

  form = this.formBuilder.group({
    role: ['', Validators.required],
    email: [null, Validators.required],
    password: [null, Validators.required],
    people: this.formBuilder.group({
      name: [null, Validators.required],
      lastname: [null, Validators.required],
      nationality: [1],
      cedula: [null, Validators.required],
    }),
  })

  formInvestigator = this.formBuilder.group({
    exp: [null, Validators.required],
    trayectoId: [null, Validators.required],
    pnfId: [null, Validators.required],
    seccionId: [null, Validators.required],
    people: this.formBuilder.group({
      name: [null, Validators.required],
      lastname: [null, Validators.required],
      nationality: [1],
      cedula: [null, Validators.required],
    }),
    user: this.formBuilder.group({
      role: ['student', Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
    })
  })

  formTeacher = this.formBuilder.group({
    idTeacher: ['', Validators.required],
    pnfId: [null, Validators.required],
    trayectosId: [null, Validators.required],
    seccionesId: [null, Validators.required],
  })

  trayectos: any = [];
  secciones: any = [];
  pnfs: any = [];

  asignaturas: any = []
  deleteAsignaturas: any = [];

  trayectoId = null;
  seccionId = null;
  peopleId: number = 0;
  dataTeacher: any;

  type: number = 0
  error: boolean = false;
  errorT: number = 0;
  loading: boolean = false;
  viewPass: boolean = false;
  step: number = 0
  canAdd: boolean = false;
  disableInputs: boolean = false;

  getPnfs() {
    this.pnfServices.getPnf()
      .subscribe(e => {
        this.pnfs = e;
        console.log(e)
      })
  }

  getTrayectos() {
    this.trayectoServices.getTrayecto()
      .subscribe(e => {
        this.trayectos = e;
        console.log(e)
      })
  }

  findTeacherCi() {
    this.errorT = 0
    this.dataTeacher = null;
    const ci = this.form.value.people.cedula;

    this.form.reset({ role: 'teacher', people: { nationality: 1, cedula: ci } })

    if (!ci) {
      return
    }
    this.loading = true;

    this.teacherService.findTeacherCi(this.form.value.people.cedula)
      .subscribe(e => {

        this.loading = false;

        if (e.data?.user !== null && e.data?.teacher.length > 0) {
          this.errorT = 1;
          return
        }

        if (e.data?.user !== null && e.data?.teacher.length == 0) {
          this.errorT = 2;
          return
        }
        this.disableInputs = false;
        if (e.data) {
          this.dataTeacher = e.data;
          this.peopleId = e.data.id;
          this.form.patchValue({ people: e.data })
          this.asignaturas = e.data.teacher
        }
        console.log(e)
      })
  }

  signup() {
    this.error = false;
    console.log(this.form.value)
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    let formData: any = this.form.value;

    if (this.dataTeacher) {
      delete formData.people;
      formData.peopleId = this.peopleId
    }


    this.authServices.signUp(formData)
      .subscribe({
        next: ({ data }) => {
          if (this.type == 2) {
            this.SuccessSwal.fire()
            this.router.navigate(['/'])
          } else {
            this.loading = false;
            this.step = 1
            data?.people?.id && (this.peopleId = data?.people?.id)
          }
        },
        error: ({ error }) => {
          this.error = true;
          this.loading = false;
        }
      })
  }

  signupInvestigator(){
    if (this.formInvestigator.invalid) {
      this.formInvestigator.markAllAsTouched();
      return;
    }
    this.loading = true;
    let formData: any = this.formInvestigator.value;
    this.authServices.signUpInvestigator(formData)
    .subscribe({
      next: ({ data }) => {
        this.SuccessSwal.fire()
        this.router.navigate(['/'])
      },
      error: ({ error }) => {
        this.error = true;
        this.loading = false;
      }
    })
  }

  storeSignatures() {
    this.loading = true;
    let data = this.asignaturas.map((e: any) => {
      const col = {
        seccionId: e.seccion.id,
        trayectoId: e.trayecto.id,
        pnfId: e.pnf.id,
        peopleId: this.peopleId,
        id: e?.id
      };
      return col
    })
    console.log('data delete', this.deleteAsignaturas.length)
    if (this.deleteAsignaturas.length > 0) {
      this.teacherService.deleteTeacher(this.deleteAsignaturas)
        .subscribe()
    }

    this.teacherService.storeTeacher(data)
      .subscribe({
        next: e => {
          this.SuccessSwal.fire()
          this.router.navigate(['/'])
          this.loading = false;
        },
        error: (e) => {
          this.loading = false;
        }
      })
  }

  setList() {
    const asignatura = {
      pnf: this.pnfs.data.find(e => e.id == this.formTeacher.get('pnfId').value),
      trayecto: this.trayectos.data.find(e => e.id == this.formTeacher.get('trayectosId').value),
      seccion: this.secciones.data.find(e => e.id == this.formTeacher.get('seccionesId').value)
    }
    console.log()
    if (this.asignaturas.findIndex(e => e.seccion.id === asignatura.seccion.id) == 0) {
      this.error = true;
      return
    }
    this.asignaturas.push(asignatura)
    this.formTeacher.get('trayectosId').reset()
    this.formTeacher.get('seccionesId').reset()
    console.log(this.asignaturas)
  }

  removeList(index) {
    if (this.asignaturas[index]?.id) {
      console.log('sisa')
      this.deleteAsignaturas.push({ id: this.asignaturas[index]?.id });
    }
    this.asignaturas.splice(index, 1)
  }

  getSecciones() {

    if (this.getFieldTeacher('pnfId')) {
      this.seccionService.getSeccionesById(this.getFieldTeacher('pnfId'), this.getFieldTeacher('trayectosId'))
        .subscribe(e => {
          this.secciones = e
        })
    } else {
      this.seccionService.getSeccionesById(this.getFieldValueInv('pnfId'), this.getFieldValueInv('trayectoId'))
        .subscribe(e => {
          this.secciones = e
        })
    }

  }

  getFieldInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched
  }

  getFieldInvalidInv(field: string) {
    return this.formInvestigator.get(field)?.invalid && this.formInvestigator.get(field)?.touched
  }

  getFieldValueInv(field: string) {
    return this.formInvestigator.get(field).value;
  }


  getFieldTeacher(field: string) {
    return this.formTeacher.get(field)?.value
  }

  getFieldValue(field: string) {
    return this.form.get(field).value;
  }

  openModal() {
    this.dialog.open(this.modal,
      {
        maxWidth: '600px',
        maxHeight: 'max-content',
        height: 'max-content',
        width: 'max-content',
        panelClass: 'full-screen-modal'
      }).beforeClosed()
      .subscribe(e => {
      })
  }


}
