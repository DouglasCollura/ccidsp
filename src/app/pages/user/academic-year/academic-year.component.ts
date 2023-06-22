import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import * as dayjs from 'dayjs';
import { MatDateFormats } from '@angular/material/core';
import { AcademicYearService } from '../../services/academic-year.service';


@Component({
  selector: 'app-academic-year',
  templateUrl: './academic-year.component.html',
  styleUrls: ['./academic-year.component.scss'],

})
export class AcademicYearComponent implements OnInit, AfterViewInit {


  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private academicYearService:AcademicYearService
  ){

  }
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;
  @ViewChild('SuccessDeleteSwal') successDeleteSwal!: SwalComponent;
  @ViewChild('SuccessUpdateSwal') SuccessUpdateSwal!: SwalComponent;


  ngOnInit(): void {
    this.getAcademicYears()
  }

  ngAfterViewInit(): void {
    this.paginator.itemsPerPageLabel = ""

  }

  form = this.formBuilder.group({
    academicYear: ['', Validators.required],
  })

  displayedColumns: string[] = ['Nombre', 'Opt.'];
  academicYears:any=[];
  modalActive: any;
  edit:boolean = false;
  idEdit:number=0;
  loading:boolean = false;
  error:string = null;


  getAcademicYears(){
    this.academicYears =[];
    this.academicYearService.getAcademicYear()
    .subscribe(e=>{
      this.academicYears = e;
      console.log(e)
    })
  }

  store(){
    this.error = null
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    // this.form.get('name').setValue(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
    this.academicYearService.storeAcademicYear({year:this.getAcademicYear()})
    .subscribe({
      next: (e)=>{
        this.getAcademicYears()
        this.modalActive.close()
        this.loading = false;
        this.SuccessRegisterSwal.fire()
      },
      error: ({error:{error}}) => {
        this.loading = false;
        this.error = error.mensaje;
      }
    })
  }


  update(){
    this.error = null

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.academicYearService.updateAcademicYear(this.idEdit,{year:this.getAcademicYear()})
    .subscribe({
      next: (e)=>{
        this.getAcademicYears()
        this.modalActive.close()
        this.loading = false;
        this.SuccessUpdateSwal.fire()
      },
      error: ({error:{error}}) => {
        this.loading = false;
        this.error = error.mensaje;
      }
    })
  }

  remove(id:number){
    this.academicYearService.deleteAcademicYear(id)
    .subscribe(e=>{
      this.getAcademicYears()
      this.successDeleteSwal.fire()
    })
  }

  setEdit(data:any){
    this.form.get('academicYear').setValue(dayjs(data.year.split('-',1)).format())
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
    this.error = null;
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

  getAcademicYear(){
    const year = this.form.get('academicYear').value;
    return  year && `${dayjs(year).format('YYYY')} - ${dayjs(year).add(1,'year').format('YYYY')}`
  }

  setYear(event: any, datepicker: any) {
    this.form.get('academicYear').setValue(event)
    datepicker.close();
  }
}
