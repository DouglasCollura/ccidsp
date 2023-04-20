import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { LocationService } from 'src/app/pages/services/location.service';

@Component({
  selector: 'app-municipio',
  templateUrl: './municipio.component.html',
  styleUrls: ['./municipio.component.scss']
})
export class MunicipioComponent implements OnInit, AfterViewInit{

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private locationService:LocationService
  ){
  }
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;
  @ViewChild('SuccessDeleteSwal') successDeleteSwal!: SwalComponent;
  @ViewChild('SuccessUpdateSwal') SuccessUpdateSwal!: SwalComponent;


  ngOnInit(): void {
    this.getMunicipios()
    this.getEstados()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""
  }

  form = this.formBuilder.group({
    estadoId: [null, Validators.required],
    name: [null, Validators.required],
  })

  displayedColumns: string[] = ['Estado', 'Municipio', 'Opt.'];
  estados:any=[];
  municipios:any=[];
  modalActive: any;
  edit:boolean = false;
  idEdit:number=0;
  loading:boolean = false;
  error:number = 0;


  getEstados(){
    this.locationService.getEstados()
    .subscribe(e=>{
      this.estados = e;
      console.log(e)
    })
  }

  getMunicipios(){
    this.locationService.getMunicipios()
    .subscribe(e=>{
      this.municipios = e
    })
  }

  store(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    this.locationService.storeMunicipio(this.form.value)
    .subscribe({
      next: (e)=>{
        this.getMunicipios()
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


  update(){
    this.error = 0

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.locationService.updateMunicipio(this.idEdit,this.form.value)
    .subscribe({
      next: (e)=>{
        this.getMunicipios()
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

  remove(id:number){
    this.locationService.deleteMunicipio(id)
    .subscribe(e=>{
      this.getMunicipios()
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
