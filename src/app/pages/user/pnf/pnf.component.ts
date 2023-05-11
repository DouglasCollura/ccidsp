import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { PnfService } from 'src/app/pages/services/pnf.service';


@Component({
  selector: 'app-pnf',
  templateUrl: './pnf.component.html',
  styleUrls: ['./pnf.component.scss']
})
export class PnfComponent implements OnInit, AfterViewInit{

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private pnfServices:PnfService
  ){
  }
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;
  @ViewChild('SuccessDeleteSwal') successDeleteSwal!: SwalComponent;
  @ViewChild('SuccessUpdateSwal') SuccessUpdateSwal!: SwalComponent;

  ngOnInit(): void {
    this.getPnfs()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""
  }

  form = this.formBuilder.group({
    name: [null, Validators.required],
  })

  displayedColumns: string[] = ['Nombre', 'Opt.'];
  pnfs:any=[];
  modalActive: any;
  edit:boolean = false;
  idEdit:number=0;
  loading:boolean = false;
  error:number = 0;


  getPnfs(){
    this.pnfServices.getPnf()
    .subscribe(e=>{
      this.pnfs = e;
      console.log(e)
    })
  }

  store(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    this.pnfServices.storePnf(this.form.value)
    .subscribe({
      next: (e)=>{
        this.getPnfs()
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
        this.error = 1;
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
