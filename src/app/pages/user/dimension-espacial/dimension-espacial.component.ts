import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DimensionEspacialService } from '../../services/dimension-espacial.service';

@Component({
  selector: 'app-dimension-espacial',
  templateUrl: './dimension-espacial.component.html',
  styleUrls: ['./dimension-espacial.component.scss']
})
export class DimensionEspacialComponent  implements OnInit, AfterViewInit {

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private dimensionEspacialService:DimensionEspacialService
  ){
  }
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;
  @ViewChild('SuccessDeleteSwal') successDeleteSwal!: SwalComponent;
  @ViewChild('SuccessUpdateSwal') SuccessUpdateSwal!: SwalComponent;

  ngOnInit(): void {
    this.getLienas()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""

    this.form.get('name')
    .valueChanges.subscribe(()=> this.error = '')
  }

  form = this.formBuilder.group({
    name: ['', Validators.required],
  })

  displayedColumns: string[] = ['Nombre', 'Opt.'];
  lineas:any=[];
  modalActive: any;
  edit:boolean = false;
  idEdit:number=0;
  loading:boolean = false;
  error:string = '';


  getLienas(){
    this.dimensionEspacialService.getDimensionEspacial()
    .subscribe(e=>{
      this.lineas = e;
      console.log(e)
    })
  }

  store(){
    this.error = ''
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    let name:string = this.form.get('name').value;
    this.dimensionEspacialService.storeDimensionEspacial(this.form.value)
    .subscribe({
      next: (e)=>{
        this.getLienas()
        this.modalActive.close()
        this.loading = false;
        this.SuccessRegisterSwal.fire()
      },
      error: ({error}) => {
        console.log(error)
        this.error = error.message
        this.loading = false;
      }
    })
  }


  update(){
    this.error = ''

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.dimensionEspacialService.updateDimensionEspacial(this.idEdit,this.form.value)
    .subscribe({
      next: (e)=>{
        this.getLienas()
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
    this.dimensionEspacialService.deleteDimensionEspacial(id)
    .subscribe(e=>{
      this.getLienas()
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
