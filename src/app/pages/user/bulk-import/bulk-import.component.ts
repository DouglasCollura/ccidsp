import { Component, OnInit, ViewChild } from '@angular/core';
import { BulkImportService } from '../../services/bulk-import.service';
import { ActivatedRoute } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-bulk-import',
  templateUrl: './bulk-import.component.html',
  styleUrls: ['./bulk-import.component.scss']
})
export class BulkImportComponent implements OnInit{

  @ViewChild('SuccessRegisterSwal') SuccessRegisterSwal!: SwalComponent;

  constructor(
    private bulkImportService:BulkImportService,
    private activeRoute:ActivatedRoute
  ){}

  ngOnInit(): void {
    this.activeRoute.queryParams
    .subscribe((e:any)=>{
      console.log(e)
      this.type = parseInt(e?.type)
    })
  }

  file:any=null;
  file_name=null;
  type:number = 1;
  error = null;
  loading:boolean=false;

  selectFile(fileInput: HTMLInputElement){
    fileInput.click();
    fileInput.value = ''
    console.log(fileInput.files)
  }

  addFile(event: any) {
    this.file = event.target.files[0];
    this.file_name = this.file.name
    event.target.files = null;
    this.sendExcel()
  }

  sendExcel(){
    this.error = null
    this.loading = true;
    let formData = new FormData();
    formData.append('file', this.file);
    this.bulkImportService.importExcel(formData)
    .subscribe({
      next:(e:any)=>{
        console.log(e)
        this.loading = false;
        this.SuccessRegisterSwal.fire()
      },
      error:({error})=>{
        this.error = error.message
        console.log(error)
        this.loading = false;
      },
    })
  }
}
