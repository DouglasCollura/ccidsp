import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { SeccionService } from 'src/app/pages/services/seccion.service';
import { PnfService } from 'src/app/pages/services/pnf.service';
import { TrayectoService } from '../../services/trayecto.service';

@Component({
  selector: 'app-seccion',
  templateUrl: './seccion.component.html',
  styleUrls: ['./seccion.component.scss']
})
export class SeccionComponent implements OnInit, AfterViewInit{

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private pnfService:PnfService,
    private seccionService: SeccionService,
    private trayectoServices:TrayectoService
  ){
  }
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;
  @ViewChild('SuccessDeleteSwal') successDeleteSwal!: SwalComponent;
  @ViewChild('SuccessUpdateSwal') SuccessUpdateSwal!: SwalComponent;


  ngOnInit(): void {
    this.getSecciones()
    this.getPnf()
    this.getTrayectos()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""
  }

  form = this.formBuilder.group({
    pnfId: [null, Validators.required],
    trayectoId: [null, Validators.required],
    name: [null, Validators.required],
  })

  status:any = null;

  displayedColumns: string[] = ['PNF', 'Trayecto', 'Seccion', 'Opt.'];
  pnfs:any=[];
  trayectos:any=[];
  secciones:any=[];
  modalActive: any;
  edit:boolean = false;
  idEdit:number=0;
  loading:boolean = false;
  error:string = '';


  getPnf(){
    this.pnfService.getPnf()
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
    this.seccionService.getSecciones()
    .subscribe(e=>{
      this.secciones = e
    })
  }

  store(){
    this.error = ''
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    this.seccionService.storeSeccion(this.form.value)
    .subscribe({
      next: (e)=>{
        this.getSecciones()
        this.modalActive.close()
        this.loading = false;
        this.SuccessRegisterSwal.fire()
      },
      error: ({error}) => {
        this.error = error.message

        this.loading = false;
      }
    })
  }


  update(){

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.seccionService.updateSeccion(this.idEdit,this.form.value)
    .subscribe({
      next: (e)=>{
        this.getSecciones()
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
    this.seccionService.deleteSeccion(id)
    .subscribe(e=>{
      this.getSecciones()
      this.successDeleteSwal.fire()
    })
  }

  setEdit(data:any){
    this.form.patchValue(data)
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

  openModal(){
    this.modalActive = this.dialog.open(this.modal,
      {
        maxWidth: '500px',
        maxHeight: 'max-content',
        height: 'max-content',
        width: '100%',
        panelClass: 'full-screen-modal'
      })
    this.modalActive.afterClosed().subscribe(()=>{
      this.edit = false;
      this.form.reset()
    })
  }
}
