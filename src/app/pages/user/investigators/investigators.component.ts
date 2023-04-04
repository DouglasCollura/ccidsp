import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-investigators',
  templateUrl: './investigators.component.html',
  styleUrls: ['./investigators.component.scss']
})
export class InvestigatorsComponent {

  constructor(
    private dialog: MatDialog,
  ){
  }

  @ViewChild('modal') modal!: TemplateRef<any>;

  displayedColumns: string[] = ['Nombres', 'Apellidos', 'Cedula', 'Expediente', 'Opt.'];
  dataSource:any = [{name:'TestName', lastname:'testLastName', ci:'3213213', exp:'2135'}]


  openModal(){
    this.dialog.open(this.modal,
      {
        maxWidth: '800px',
        maxHeight: 'max-content',
        height: 'max-content',
        width: '100%',
        panelClass: 'full-screen-modal'
      }).beforeClosed()
      .subscribe(e=>{
      })
  }
}
