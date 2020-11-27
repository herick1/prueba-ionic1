import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from  "@angular/router";
import { ActivatedRoute } from '@angular/router';
import {ViewChild, ElementRef} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient , HttpHeaders} from  '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { MenuController } from '@ionic/angular';
import { TranzabilidadService } from '../services/tranzabilidad.service';

const  options = { headers: new HttpHeaders({'Content-Type':'application/json'}) };

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {

  @ViewChild("modalVer", {static:true}) modalVer: ElementRef;
  @ViewChild("modalCrear", {static:true}) modalCrear: ElementRef;
  @ViewChild("modalConfirmarCrear", {static:true}) modalConfirmarCrear: ElementRef;
  @ViewChild("modalActualizar", {static:true}) modalActualizar: ElementRef;
  @ViewChild("modalConfirmarActualizar", {static:true}) modalConfirmarActualizar: ElementRef;
  @ViewChild("modalEliminar", {static:true}) modalEliminar: ElementRef;
  @ViewChild("modalExito", {static:true}) modalExito: ElementRef;
  @ViewChild("modalFracaso", {static:true}) modalFracaso: ElementRef;


  constructor(public menuCtrl: MenuController, private activatedRoute: ActivatedRoute, 
    private  httpClient:  HttpClient, private modalService: NgbModal, private  authService:  AuthService,
    private  router:  Router, private tranzabilidadService:TranzabilidadService) {}

  toggleMenu() {
    this.menuCtrl.toggle(); //Add this method to your button click function
  }
  focus:any;
  focus1:any;
  prueba:any;
  //variable con todas las partidas en el front 
  eventos = []

  idSeleccionada = 0;
  nombreSelecionado="";
  fechainicioSeleccionado ="";
  fechaFinSeleccionado="";
  descripcionSeleccionado="";
  direccionSeleccionado="";

  //SERVER_ADDRESS:  string  =  'http://localhost:5000';
  SERVER_ADDRESS:  string  =  'https://manos-que-dejan-huella.herokuapp.com';
  ngOnInit() {
    // this.errores.push("jajajja")
    //this.modalService.open(this.modalFracaso,{centered:true});
  }
  ngAfterViewInit(){
    this.tranzabilidadService.EnviarTranzabilidad("Usuario")
    this.getEvento()
    this.authService.storage.get("LOGIN_ESTATUS").then(
      (res:any)=>{
        if(res==true)
          this.prueba=true
        else
          this.prueba=false
      })
  }

  logout(){
    this.authService.logout().then(
      (res:any)=>{
        if(res){
          this.prueba=true
        }
        else{
          this.authService.emitChange('logout');
          this.router.navigateByUrl('/es/home');
        }
      })  
  }

  
  //funcion para obtener los Eventos
  headerEventos=[]
  getEvento() {
    this.eventos=[]
    this.headerEventos=[]
    this.httpClient.get(`${this.SERVER_ADDRESS}/evento`).subscribe( 
      //TODO esto te devulve todos los jugadores hacer uno que te duvuelva solo un jugador /jugador
      (response: any)=>{    
        this.headerEventos= Object.keys(response[0]);
        for(var i=0; i<this.headerEventos.length; i++){
          this.headerEventos[i]=this.headerEventos[i].replace(/_/g, " ")
        }

        for(var i=0; i< response.length; i++)
        {
          this.eventos.push(Object.values(response[i]));
        }
        this.tablaOriginal=this.eventos
      }
      );
  }

  //funcion para llenar el formulario de actualizar
  actualizarEvento(id){
    console.log(id)
    this.idSeleccionada= id;
    console.log( this.eventos)
    for(var i=0;i < this.eventos.length; i++){
      if(id == this.eventos[i][0]){
        this.nombreSelecionado= this.eventos[i][1];
        let Arraydate = this.eventos[i][2].split("-")
        this.fechainicioSeleccionado = Arraydate[2]+ "-"+Arraydate[1]+"-"+Arraydate[0]
        Arraydate = this.eventos[i][3].split("-")
        this.fechaFinSeleccionado= Arraydate[2]+ "-"+Arraydate[1]+"-"+Arraydate[0]
        this.descripcionSeleccionado=this.eventos[i][4];
        this.direccionSeleccionado= this.eventos[i][5]; 			
      }
    }
    this.modalService.open(this.modalActualizar,{centered:true});
  }

  //funcion para que abra el modal de confirmar
  confirmarActualizar(nombre,fecha_inicio, fecha_fin, direccion, descripcion){
    this.nombreSelecionado= nombre;
    this.fechainicioSeleccionado = fecha_inicio;
    this.fechaFinSeleccionado= fecha_fin;
    this.descripcionSeleccionado= direccion;
    this.direccionSeleccionado= descripcion;
    this.modalService.open(this.modalConfirmarActualizar,{centered:true});
  }

  //funcion para que haga el actualizar bien y haga la peticion al backend para actualizar
  Actualizar(){
    let evento={
      "nombre": this.nombreSelecionado,
      "fechaini":this.fechainicioSeleccionado,
      "fechafin":this.fechaFinSeleccionado,
      "descripcion":this.descripcionSeleccionado,
      "direccion":this.direccionSeleccionado
    }
    this.httpClient.put(`${this.SERVER_ADDRESS}/evento/actualizar/${this.idSeleccionada}`,evento,options).subscribe(res=>{
      this.getEvento()
      this.modalService.dismissAll();	
      this.modalService.open(this.modalExito,{centered:true});
    },
    error => {
      this.errores=[]
      this.errores.push(error.error)
      this.modalService.open(this.modalFracaso,{centered:true});
    })


  }

  //funcion para abrr el modal de Eventos
  eliminarEvento(id){
    console.log(id)
    this.idSeleccionada= id;
    this.modalService.open(this.modalEliminar,{centered:true});
  }

  eliminar(){
    this.httpClient.delete(`${this.SERVER_ADDRESS}/evento/eliminar/${this.idSeleccionada}`,options).subscribe(res=>{
      this.getEvento()
      this.modalService.dismissAll();  
      this.modalService.open(this.modalExito,{centered:true});
    },
    error => {
      this.errores=[]
      this.errores.push(error)
      this.modalService.open(this.modalFracaso,{centered:true});
    })
  }

  verEvento(id){
    this.idSeleccionada= id;
    for(var i=0;i < this.eventos.length; i++){
      if(id == this.eventos[i][0]){
        this.nombreSelecionado= this.eventos[i][1];
        this.fechainicioSeleccionado = this.eventos[i][2];
        this.fechaFinSeleccionado= this.eventos[i][3];
        this.descripcionSeleccionado=this.eventos[i][4];
        this.direccionSeleccionado= this.eventos[i][5]; 			
      }
    }
    this.modalService.open(this.modalVer,{centered:true});
  }


  //funcion para llenar el formulario de mostrar
  crearUsuario(){
    this.modalService.open(this.modalCrear,{centered:true});
  }

  //funcion para que abra el modal de confirmar
  confirmarCrear(nombre,fecha_inicio, fecha_fin, descripcion, direccion){
    console.log(fecha_inicio, fecha_fin)
    this.nombreSelecionado= nombre;
    this.fechainicioSeleccionado = fecha_inicio;
    this.fechaFinSeleccionado= fecha_fin;
    this.descripcionSeleccionado= descripcion;
    this.direccionSeleccionado= direccion;
    this.modalService.open(this.modalConfirmarCrear,{centered:true});
  }

  //funcion para que haga el actualizar bien y haga la peticion al backend para actualizar

  formularioCrear: FormData;
  Crear(){
    this.formularioCrear.append('nombre', this.nombreSelecionado);
    this.formularioCrear.append('fechaini', this.fechainicioSeleccionado);
    this.formularioCrear.append('fechafin', this.fechaFinSeleccionado);
    this.formularioCrear.append('descripcion', this.descripcionSeleccionado);
    this.formularioCrear.append('direccion', this.direccionSeleccionado);

    this.httpClient.post(`${this.SERVER_ADDRESS}/evento/crear`, this.formularioCrear).subscribe(
      (res:any )=> {
        this.modalService.dismissAll();
        this.modalService.open(this.modalExito,{centered:true})
        this.getEvento();
        this.formularioCrear.delete('nombre');
        this.formularioCrear.delete('fechaini');
        this.formularioCrear.delete('fechafin');
        this.formularioCrear.delete('descripcion');
        this.formularioCrear.delete('direccion');
      },
      error => {
        this.errores=[]
        this.errores.push(error)
        this.modalService.open(this.modalFracaso,{centered:true});
        this.formularioCrear.delete('nombre');
        this.formularioCrear.delete('fechaini');
        this.formularioCrear.delete('fechafin');
        this.formularioCrear.delete('descripcion');
        this.formularioCrear.delete('direccion');
        
      })

  }
  errores=[]
  onFileChange(evt: any) {
    var target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files')

      let fileList: FileList = target.files;
    let file = fileList[fileList.length-1]
    
    this.formularioCrear = new FormData();
    this.formularioCrear.append('foo', file, file.name);
    console.log("llegueeee"+ file.name)
/*    
   // this.httpClient.post(`${this.SERVER_ADDRESS}/back/cliente/import`, this.formularioCrear).subscribe(
   this.httpClient.post(`http://localhost:5000/evento/crear`, this.formularioCrear).subscribe(
      
      (res:any )=> {
        location.reload(true);
      },
      error => {
        this.errores=[]
        this.errores.push(error.error.message)
        this.modalService.open(this.modalFracaso,{centered:true});
        
      })
      */    
    }
/**
  * Show the search results based in the faqs
  * @function showSearchResults
  * @param {any} event
  * @return {void}
  */
  tablaOriginal=[]
  public showSearchResults(event: any): void {
    if (event.target.value.length > 0) {
      this.eventos=[]

      for(var i=0; i< this.tablaOriginal.length; i++){
        if(this.tablaOriginal[i][0]==event.target.value ||
          this.eliminarDiacriticos(this.tablaOriginal[i][1]).toLowerCase().indexOf(this.eliminarDiacriticos(event.target.value).toLowerCase())>=0 || 
          this.eliminarDiacriticos(this.tablaOriginal[i][2]).toLowerCase().indexOf(this.eliminarDiacriticos(event.target.value).toLowerCase())>=0 || 
          this.eliminarDiacriticos(this.tablaOriginal[i][3]).toLowerCase().indexOf(this.eliminarDiacriticos(event.target.value).toLowerCase())>=0 ||
          this.eliminarDiacriticos(this.tablaOriginal[i][4]).toLowerCase().indexOf(this.eliminarDiacriticos(event.target.value).toLowerCase())>=0||
          this.eliminarDiacriticos(this.tablaOriginal[i][5]).toLowerCase().indexOf(this.eliminarDiacriticos(event.target.value).toLowerCase())>=0)
          this.eventos.push(this.tablaOriginal[i])
      }
    }
    if (event.target.value.length == 0) {
      this.eventos=this.tablaOriginal;
    }
  }

  eliminarDiacriticos(texto) {
    if(texto!=null)
      return texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
    else
      return "";
  }


}
