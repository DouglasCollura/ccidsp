import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { PnfService } from 'src/app/pages/services/pnf.service';
import { TrayectoService } from '../../services/trayecto.service';
import { SeccionService } from '../../services/seccion.service';
import { TeacherService } from '../../services/teacher.service';
import { PeopleService } from '../../services/people.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit, AfterViewInit{

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private pnfServices:PnfService,
    private trayectoServices:TrayectoService,
    private seccionService: SeccionService,
    private teacherService: TeacherService,
    private peopleService:PeopleService
  ){
  }
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;
  @ViewChild('SuccessDeleteSwal') successDeleteSwal!: SwalComponent;
  @ViewChild('SuccessUpdateSwal') SuccessUpdateSwal!: SwalComponent;

  ngOnInit(): void {
    this.getPnfs()
    this.getTrayectos()
    this.getTeachers()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""
    this.formTeacher.get('trayectosId')
    .valueChanges.subscribe(e=>{
      this.formTeacher.get('seccionesId').reset()
      e && this.getSecciones()
    })

    this.formTeacher.get('pnfId')
    .valueChanges.subscribe(e=>{
      this.formTeacher.get('seccionesId').reset()
      this.formTeacher.get('trayectosId').reset()
    })

    this.formTeacher.get('seccionesId')
    .valueChanges.subscribe(e=>{
      this.error = '';
      e ? this.canAdd = true : this.canAdd = false
    })
  }


  form = this.formBuilder.group({
    name: [null, Validators.required],
    lastname: [null, Validators.required],
    nationality: [1],
    cedula: [null, Validators.required],
  })

  formTeacher = this.formBuilder.group({
    idTeacher: ['', Validators.required],
    pnfId: [null, Validators.required],
    trayectosId: [null, Validators.required],
    seccionesId: [null, Validators.required],
  })

  teachers:any=[];
  trayectos:any=[];
  secciones:any=[];
  pnfs:any=[];

  asignaturas:any = []
  peopleId:number = 0;

  displayedColumns: string[] = ['Cedula','Nombre', 'Apellido', 'Opt.'];
  modalActive: any;
  edit:boolean = false;
  idEdit:number=0;
  loading:boolean = false;
  error:string = '';
  step:number = 0
  canAdd:boolean=false

  getPnfs(){
    this.pnfServices.getPnf()
    .subscribe(e=>{
      this.pnfs = e;
      console.log(e)
    })
  }

  getTrayectos(){
    this.trayectoServices.getTrayecto()
    .subscribe(e=>{
      this.trayectos = e;
      console.log(e)
    })
  }
  getSecciones(){
    this.seccionService.getSeccionesById(this.getFieldTeacher('pnfId'),this.getFieldTeacher('trayectosId'))
    .subscribe(e=>{
      this.secciones = e
    })
  }

  getTeachers(){
    this.teacherService.getTeachers()
    .subscribe(e=>{
      this.teachers = e;
      console.log('teacher ',e)
    })
  }

  storePeople(){
    this.error = ''
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.peopleService.storePeople(this.form.value)
    .subscribe(({data})=>{
      console.log(data.id)
      this.peopleId =data.id
      console.log('peopleid', this.peopleId)
      this.step=1
    })
  }

  store(){
    this.error = ''
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    // this.authServices.signUp(this.form.value)
    // .subscribe({
    //   next:({data})=>{

    //     this.loading = false;
    //     this.step = 1
    //     this.peopleId = data.people.id
    //   },
    //   error:({error})=>{
    //     this.error = true;
    //     this.loading = false;
    //   }
    // })
  }



  update(){
    this.error = ''

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.pnfServices.updatePnf(this.idEdit,this.form.value)
    .subscribe({
      next: (e)=>{
        this.getPnfs()
        this.modalActive.close()
        this.loading = false;
        this.SuccessUpdateSwal.fire()
      },
      error: (error) => {
        this.loading = false;
      }
    })
  }

  remove(id:number){
    this.pnfServices.deletePnf(id)
    .subscribe(e=>{
      this.getPnfs()
      this.successDeleteSwal.fire()
    })
  }

  setEdit(data:any){
    this.form.patchValue(data)
    this.asignaturas = data.teacher
    this.idEdit = data?.id;
    this.edit = true;
    this.openModal()
  }

  paginate(event:any){
    console.log(event)
  }

  getFieldInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched
  }

  storeSignatures(){
    this.loading = true;
    let data = this.asignaturas.map((e:any)=> {
      const col = {
        seccionId: e.seccion.id,
        trayectoId:e.trayecto.id,
        pnfId: e.pnf.id,
        peopleId: this.peopleId
      };
      return col
    })
    this.teacherService.storeTeacher(data)
    .subscribe({
      next:e=>{
        this.SuccessRegisterSwal.fire()
        this.loading = false;
      },
      error:(e)=>{
        this.loading = false;
      }
    })
  }

  setList(){
    const asignatura ={
      pnf:this.pnfs.data.find(e=> e.id == this.formTeacher.get('pnfId').value),
      trayecto:this.trayectos.data.find(e=> e.id == this.formTeacher.get('trayectosId').value),
      seccion:this.secciones.data.find(e=> e.id == this.formTeacher.get('seccionesId').value)
    }
    console.log()
    if(this.asignaturas.findIndex(e=> e.seccion.id === asignatura.seccion.id) ==0){
      this.error = '';
      return
    }
    this.asignaturas.push(asignatura)
    this.formTeacher.get('trayectosId').reset()
    this.formTeacher.get('seccionesId').reset()
    console.log(this.asignaturas)
  }

  removeList(index){
    this.asignaturas.splice(index,1)
  }




  getFieldTeacher(field: string) {
    return this.formTeacher.get(field)?.value
  }

  openModal(){
    this.modalActive = this.dialog.open(this.modal,
      {
        maxWidth: 'max-content',
        maxHeight: 'max-content',
        height: 'max-content',
        width: '100%',
        panelClass: 'full-screen-modal'
      })
    this.modalActive.afterClosed().subscribe(()=>{
      this.edit = false;
      this.form.reset({nationality:1})
      this.formTeacher.reset()
      this.step = 0
    })
  }
}
