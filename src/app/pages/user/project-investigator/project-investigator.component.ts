import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { PnfService } from 'src/app/pages/services/pnf.service';
import { TrayectoService } from '../../services/trayecto.service';
import { SeccionService } from '../../services/seccion.service';
import { AcademicYearService } from '../../services/academic-year.service';
import { InvestigatorService } from '../../services/investigator.service';
import { AreaPrioritariaService } from '../../services/area-prioritaria.service';
import { DimensionEspacialService } from '../../services/dimension-espacial.service';
import { LineaInvestigacionService } from '../../services/linea-investigacion.service';
import { SujetoSocialService } from '../../services/sujeto-social.service';

@Component({
  selector: 'app-project-investigator',
  templateUrl: './project-investigator.component.html',
  styleUrls: ['./project-investigator.component.scss']
})
export class ProjectInvestigatorComponent  implements OnInit, AfterViewInit{
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private pnfServices:PnfService,
    private trayectoServices:TrayectoService,
    private seccionService: SeccionService,
    private academicYearService: AcademicYearService,
    private investigatorService: InvestigatorService,
    private areaPrioritariaService:AreaPrioritariaService,
    private dimensionEspacialService:DimensionEspacialService,
    private lineaInvestigacionService:LineaInvestigacionService,
    private sujetoSocialService:SujetoSocialService,

  ){
  }
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;
  @ViewChild('SuccessDeleteSwal') successDeleteSwal!: SwalComponent;
  @ViewChild('SuccessUpdateSwal') SuccessUpdateSwal!: SwalComponent;

  ngOnInit(): void {
    this.getPnfs()
    this.getTrayectos()
    this.getAcademicYear()
    this.getAreas()
    this.getDimension()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""

    this.form.get('trayectoId').valueChanges.subscribe(e=>{
      e ? this.getSecciones() : this.secciones = [];
      this.form.get('seccionId').reset()
      console.log(e)
    })

    this.form.get('seccionId').valueChanges.subscribe(e=>{
      e ? this.getIvestigators() : this.investigators = [];
    })

    this.form.get('AreaPrioritariaId').valueChanges.subscribe(e=>{
      e && this.getLineaById(e);
    })

    this.form.get('DimensionEspacialId').valueChanges.subscribe(e=>{
      e && this.getSulejoById(e);
    })
  }

  form = this.formBuilder.group({
    name: ['', Validators.required],
    trayectoId: [null, Validators.required],
    pnfId: [null, Validators.required],
    seccionId: [null, Validators.required],
    academicYearId: [null, Validators.required],
    AreaPrioritariaId: [null, Validators.required],
    lineaInvestigacionId: [null, Validators.required],
    DimensionEspacialId: [null, Validators.required],
    sujetoSocialId: [null, Validators.required],
  })

  displayedColumns: string[] = ['Nombres', 'Apellidos', 'Cedula', 'Expediente', 'Opt.'];
  pnfs:any=[];
  investigators:any = [];
  trayectos:any=[];
  secciones:any=[];
  academicYears:any =[];
  areas:any=[];
  dimeniones:any = [];
  lineas:any = []
  inv_selected:any = []
  sujetos:any=[];

  modalActive: any;
  edit:boolean = false;
  idEdit:number=0;
  loading:boolean = false;
  error:string = '';

  // getInvestigators(){
  //   this.investigators = []
  //   this.investigatorService.getInvestigators()
  //   .subscribe(res=>{
  //     this.investigators = res;
  //     console.log('user', res)
  //   })
  // }

  getAreas(){
    this.areaPrioritariaService.getAreaPrioritaria()
    .subscribe(e=>{
      this.areas = e;
      console.log('area ',e)
    })
  }

  getDimension(){
    this.dimensionEspacialService.getDimensionEspacial()
    .subscribe(e=>{
      this.dimeniones = e;
      console.log(e)
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

  getAcademicYear(){
    this.academicYearService.getAcademicYear()
    .subscribe(e=>{
      this.academicYears = e;
      console.log(e)
    })
  }

  getSecciones(){

    this.seccionService.getSeccionesById(this.getFieldValue('pnfId'),this.getFieldValue('trayectoId'))
    .subscribe(e=>{
      this.secciones = e
    })
  }

  getIvestigators(){
    this.error = ''
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    // let name:string = this.form.get('name').value;
    // this.form.get('name').setValue(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
    this.investigatorService.getInvestigatorList(this.form.value)
    .subscribe({
      next: (e)=>{
        // this.modalActive.close()
        console.log(e)
        this.loading = false;
        this.investigators = e.data
        // this.SuccessRegisterSwal.fire()
      },
      error: ({error}) => {
        console.log(error)
        this.error = error.message
        this.loading = false;
      }
    })
  }

  getLineaById(id:number){
    this.lineaInvestigacionService.getLineaInvestigacionById(id)
    .subscribe(e=>{
      this.lineas = e;
      console.log(e)
    })

  }

  getSulejoById(id:number){
    this.sujetoSocialService.getSujetoSocialById(id)
    .subscribe(e=>{
      this.sujetos = e
      console.log(e)
    })
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
    this.idEdit = data?.id;
    this.edit = true;
    this.openModal()
  }

  paginate(event:any){
    console.log(event)
  }

  checkStudent(id:number){
    const index = this.inv_selected.findIndex(e=> e == id);
    console.log(index)
    if(index != -1){
      this.inv_selected.splice(index, 1)
    }else{
      this.inv_selected.push(id)
    }
  }

  isChecked(id:number){
    return this.inv_selected.findIndex(e=> e == id) != -1
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
      this.form.reset()
    })
  }
}
