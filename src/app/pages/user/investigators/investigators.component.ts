import { Component, TemplateRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InvestigatorService } from '../../services/investigator.service';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { PnfService } from '../../services/pnf.service';
import { TrayectoService } from '../../services/trayecto.service';
import { SeccionService } from '../../services/seccion.service';

@Component({
  selector: 'app-investigators',
  templateUrl: './investigators.component.html',
  styleUrls: ['./investigators.component.scss']
})
export class InvestigatorsComponent implements OnInit, AfterViewInit {

  constructor(
    private dialog: MatDialog,
    private investigatorService: InvestigatorService,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private pnfServices:PnfService,
    private trayectoServices:TrayectoService,
    private seccionService: SeccionService,
  ){
  }

  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessDeleteSwal') successDeleteSwal!: SwalComponent;
  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;
  @ViewChild('SuccessUpdateSwal') SuccessUpdateSwal!: SwalComponent;

  ngOnInit(): void {
    this.getInvestigators()
    this.getPnfs()
    this.getTrayectos()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""

    this.form.get('trayectoId').valueChanges.subscribe(e=>{
      e ? this.getSecciones() : this.secciones = [];
      this.form.get('seccionId').reset()
      console.log(e)
    })
  }

  displayedColumns: string[] = ['Nombres', 'Apellidos', 'Cedula', 'Expediente', 'Opt.'];
  investigators:any = [];
  trayectos:any=[];
  secciones:any=[];
  pnfs:any=[];

  form = this.formBuilder.group({
    exp: [null, Validators.required],
    trayectoId: [null, Validators.required],
    pnfId: [null, Validators.required],
    seccionId: [null, Validators.required],
    people:this.formBuilder.group({
      name: [null, Validators.required],
      lastname: [null, Validators.required],
      nationality: [1],
      cedula: [null, Validators.required],
    })
  })
  modalActive: any;
  loading:boolean = false;
  error:number = 0;
  edit:boolean = false;
  idEdit:number=0;

  getInvestigators(){
    this.investigators = []
    this.investigatorService.getInvestigators()
    .subscribe(res=>{
      this.investigators = res;
      console.log('user', res)
    })
  }

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

    this.seccionService.getSeccionesById(this.getFieldValue('pnfId'),this.getFieldValue('trayectoId'))
    .subscribe(e=>{
      this.secciones = e
    })
  }

  paginate(event:any){
    console.log(event)
  }

  store(){
    this.error = 0

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    let formData:any = this.form.value;
    formData.people.nationality = parseInt(formData.people.nationality)
    this.loading = true;
    this.investigatorService.storeInvestigators(formData)
    .subscribe({
      next: (e)=>{
        this.getInvestigators()
        this.modalActive.close()
        this.loading = false;
        this.SuccessRegisterSwal.fire()
      },
      error: (error) => {
        this.loading = false;
        this.error = 1;
      }
    })

  }

  remove(id:number){
    this.investigatorService.deleteInvestigator(id)
    .subscribe(e=>{
      this.getInvestigators()
      this.successDeleteSwal.fire()
    })
  }

  update(){
    this.error = 0

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let formData:any = this.form.value;
    formData.people.nationality = parseInt(formData.people.nationality)
    this.loading = true;

    this.investigatorService.updateInvestigator(this.idEdit,formData)
    .subscribe({
      next: (e)=>{
        this.getInvestigators()
        this.modalActive.close()
        this.loading = false;
        this.SuccessUpdateSwal.fire()
      },
      error: (error) => {
        this.loading = false;
        this.error = 1;
      }
    })
  }

  setEdit(data:any){
    this.form.patchValue(data)
    this.getSecciones()
    this.idEdit = data?.id;
    this.edit = true;
    this.openModal()
  }

  getFieldInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched
  }

  getFieldValue(field:string){
    return this.form.get(field).value;
  }

  openModal(){
    this.modalActive = this.dialog.open(this.modal,
      {
        maxWidth: '800px',
        maxHeight: 'max-content',
        height: 'max-content',
        width: '100%',
        panelClass: 'full-screen-modal'
      })
    this.modalActive.afterClosed().subscribe(()=>{
      this.edit = false;
      this.form.reset({people:{nationality:1}})
    })
  }
}
