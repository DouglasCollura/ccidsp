import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { LocationService } from 'src/app/pages/services/location.service';

@Component({
  selector: 'app-parroquia',
  templateUrl: './parroquia.component.html',
  styleUrls: ['./parroquia.component.scss']
})
export class ParroquiaComponent implements OnInit, AfterViewInit{

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
    this.getEstados()
    this.getParroquia()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""

    this.form.get('name')
    .valueChanges.subscribe(()=> this.error = '')

    this.form.get('estadoId')?.valueChanges.
    subscribe((e:any)=>{
      console.log(e)
      this.municipios=[];
      this.form.get('municipioId')?.reset()
      e && this.getMunicipiosById(e)
    })
  }

  form = this.formBuilder.group({
    estadoId: [null, Validators.required],
    municipioId: [null, Validators.required],
    name: ['', Validators.required],
  })

  displayedColumns: string[] = ['Estado', 'Municipio', 'Parroquia', 'Opt.'];
  estados:any=[];
  municipios:any=[];
  parroquias:any=[];
  modalActive: any;
  edit:boolean = false;
  idEdit:number=0;
  loading:boolean = false;
  error:string = '';


  getEstados(){
    this.locationService.getEstados()
    .subscribe(e=>{
      this.estados = e;
      console.log(e)
    })
  }

  getMunicipiosById(id:number){
    this.locationService.getMunicipiosById(id)
    .subscribe(e=>{
      this.municipios = e
    })
  }

  getParroquia(){
    this.locationService.getParroquias()
    .subscribe(e=>{
      this.parroquias = e
    })
  }

  store(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    let data = this.form.value;
    delete data.estadoId;
    let name:string = this.form.get('name').value;
    this.form.get('name').setValue(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())

    this.locationService.storeParroquia(data)
    .subscribe({
      next: (e)=>{
        this.getParroquia()
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
    let data = this.form.value;
    delete data.estadoId;
    this.locationService.updateParroquia(this.idEdit,data)
    .subscribe({
      next: (e)=>{
        this.getParroquia()
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
    this.locationService.deleteParroquia(id)
    .subscribe(e=>{
      this.getParroquia()
      this.successDeleteSwal.fire()
    })
  }

  setEdit(data:any){
    this.form.get('estadoId')?.setValue(data?.municipio?.estadoId)
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
