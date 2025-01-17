import { Component, OnInit } from '@angular/core';
import { IngresoService  } from '../../services/ingreso.service';
import { PdfMakeWrapper, Txt } from 'pdfmake-wrapper';
import { jsPDF } from 'jspdf'
import 'jspdf-autotable';
import {UserOptions} from 'jspdf-autotable';
import { devOnlyGuardedExpression } from '@angular/compiler';
import { TablaIngreso } from '../../interfaces/tablaIngreso';
import { Marca } from '../../interfaces/Marca';

import { DetalleIngresoService } from '../../services/detalle-ingreso.service';
import { PersonaService } from '../../services/persona.service';
import { TableUtil } from "./tableUtil";
@Component({
  selector: 'app-list-ingreso',
  templateUrl: './list-ingreso.component.html',
  styleUrls: ['./list-ingreso.component.css']
})
export class ListIngresoComponent implements OnInit {

  tipoDoc: any = [
    {text:"Seleccionar", value:""},
    {text:"Factura", value:"1"},
    {text:"Boleta", value:"2"},
    {text:"Nota de Venta", value:"3"},
  ];

  tablaIngreso:TablaIngreso = {
    producto: '',
    cantidad: 0,
    precioCompra: 0,
    subTotal: 0,
    total: 0,
  }
  
  arrayPdf:any=[];

  ingreso:any = [];
  detalleIngreso:any = [];

  filterNumComp = "";
  filterNumDoc = "";
  filterRazonSocial = "";
  filterTotal = "";
  filterFecha = "";

  select: any = [
    {text:"Activos", value:"true"},
    {text:"Inactivos", value:"false"},
    {text:"Resetear", value:""}
  ];
  titulo1 ="";
  titulo2 ="";
  titulo3 ="";
  titulo4 ="";
  idPersona = "";
  filtroPersona : any = [];
  totalVenta = "";
  constructor(private personaService: PersonaService, private ingresoService:IngresoService, private detalleIngresoService:DetalleIngresoService) { }

  ngOnInit(): void {
      this.getProveedor();
      this.getIngreso();
      this.getDetalleIngreso();
  }

  header = [[ 'Producto', 'Cantidad', 'Precio','Sub-Total', 'Total']]

    tableData = [
        [1, 'John', 'john@yahoo.com', 'HR'],
        [2, 'Angel', 'angel@yahoo.com', 'Marketing'],
        [3, 'Harry', 'harry@yahoo.com', 'Finance'],
        [4, 'Anne', 'anne@yahoo.com', 'Sales'],
        [5, 'Hardy', 'hardy@yahoo.com', 'IT'],
        [6, 'Nikole', 'nikole@yahoo.com', 'Admin'],
        [7, 'Sandra', 'Sandra@yahoo.com', 'Sales'],
        [8, 'Lil', 'lil@yahoo.com', 'Sales']
    ]
    arrayP : any = [];

  generatePdf(numeroComprobante:string){
        this.arrayPdf =[]
        this.arrayP=[]
        this.getDetalleIngreso();
        
        const nuevoNumero = Number(numeroComprobante);

        this.detalleIngreso = this.detalleIngreso.filter(function(ele: any){
          return ele.fk_id_ingreso == nuevoNumero;
        });

        let tamañoArray = this.probar();

        tamañoArray =  80 + 10 + tamañoArray + 5;
        let idPersonaN: any;
        idPersonaN = this.idPersona;
        this.filtroPersona = this.persona.filter(function(ele: any){
          return ele.id_Persona == idPersonaN;
        });

        var pdf = new jsPDF();
        
        let tipoCompro = "";
        for(let i=0; i<this.tipoDoc.length;i++){
          if(this.tipoDoc[i].value == this.idTipoCompro){
            tipoCompro = this.tipoDoc[i].text; 
            this.titulo1 = tipoCompro;
            break;
          }
        }
        
        pdf.line(13, 35, 197, 35);
        pdf.addImage("https://tse2.mm.bing.net/th?id=OIP.cYWQK9OSoxIMGgIkBwl9GgHaHa&pid=Api&P=0&w=300&h=300", "jpg", 
        170, 10, 23, 23);

        pdf.setFontSize(12);
        pdf.setTextColor(99);

        (pdf as any).autoTable({
        columnStyles: { Cantidad: { halign: 'center' } },
        margin:{top:80},
        head: this.header,
        body: this.arrayP,
        theme: 'grid',
        didDrawCell: () => {
            
        }
        });

        this.titulo4 = this.filtroPersona[0].per_razonSocial;

        pdf.roundedRect(15, 40, 180, 33, 1, 1, 'S');
        pdf.setFontSize(10);
        pdf.text("Tipo Com.: ", 17, 45);
        pdf.text(this.titulo1, 50, 45);
        pdf.setFontSize(10);
        pdf.text("Serie-Num.Doc.: ", 17, 53);
        pdf.text(this.titulo2, 50, 53);
        pdf.setFontSize(10);
        pdf.text("Fecha: ", 17, 61);
        pdf.text(this.titulo3, 50, 61);
        pdf.setFontSize(10);
        pdf.text("Proveedor: ", 17, 69);
        pdf.text(this.titulo4, 50, 69);

        pdf.setFontSize(10);
        pdf.text("Total: ", 160, tamañoArray);
        pdf.text('S/.'+this.totalVenta, 175, tamañoArray );

    
        pdf.save(`${this.titulo2}.pdf` );

        // Download PDF pdf  
  }

  idTipoCompro= "";
  probar(){
        let tamañoArray = 0;
        
        let segundaLinea ="";
        let nuevoDato = "";

        for(let i=0; i<this.detalleIngreso.length;i++){
            this.idPersona = this.detalleIngreso[i].Ingresos.fk_id_persona;

            this.idTipoCompro = this.detalleIngreso[i].Ingresos.ing_tipoComprobante;
            this.titulo2 = this.detalleIngreso[i].Ingresos.ing_serieComprobante + " - " +this.detalleIngreso[i].Ingresos.ing_numeroComprobante;

            this.tablaIngreso.producto = this.detalleIngreso[i].Productos.prod_modelo;
            this.tablaIngreso.cantidad = this.detalleIngreso[i].deti_cantidad;
            this.tablaIngreso.precioCompra = Number((Number(this.detalleIngreso[i].deti_precioCompra)*1.00).toFixed(3));
            this.tablaIngreso.subTotal = this.detalleIngreso[i].deti_subTotal;
            this.tablaIngreso.total = this.detalleIngreso[i].deti_total;
            this.arrayP.push([this.tablaIngreso.producto, this.tablaIngreso.cantidad,'S/.'+this.tablaIngreso.precioCompra,'S/.'+this.tablaIngreso.subTotal, 'S/.'+this.tablaIngreso.total]);
            this.arrayPdf.push(this.tablaIngreso);

            const now = new Date(this.detalleIngreso[i].createdAt);
            var months = ['Jan', 'Feb', 'Mar','Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
            nuevoDato = now.getFullYear() + '-' + months[now.getMonth()] + '-' + now.getDate();
            this.titulo3 = nuevoDato;
            tamañoArray = this.arrayPdf.length*8;

            this.totalVenta = this.detalleIngreso[i].Ingresos.ing_totalCompra ;
        }

        return tamañoArray;
  }

  getDetalleIngreso(){
    this.detalleIngresoService.getIngresos().subscribe(
      res => {
        this.detalleIngreso = res;
        this.detalleIngreso = this.detalleIngreso.detalleIngreso;

      },
      err => console.error(err)
    );
  }

  persona:any = [];
  getProveedor(){
    this.personaService.getPersonas().subscribe(
      res => {
        this.persona = res;
        this.persona = this.persona.persona;
        //const personasFiltradas = this.persona.filter((x: { TipoPersonas: { tipoper_descripcion: string; }; }) => x.TipoPersonas.tipoper_descripcion == 'Proveedor');
        
         this.persona = this.persona.filter(function(ele: any){
          return ele.TipoPersonas.tipoper_descripcion == 'Proveedor';
        });
      },
      err => console.error(err)
    );
  }


  getIngreso(){
    this.ingresoService.getIngresos().subscribe(
      res => {
        this.ingreso = res;
        this.ingreso = this.ingreso.ingreso;

        for(let i=0; i<this.ingreso.length; i++){
            const now = new Date(this.ingreso[i].createdAt);
            var months = ['Jan', 'Feb', 'Mar','Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            let numMes:any = "";
              let mesPrueba =  Number([now.getMonth()+1]);
              if( mesPrueba <= 9){
                  numMes = "0"+ mesPrueba;
              }
              else{
                  numMes =  mesPrueba;
              }
            let formatted = now.getDate()+ '/' + numMes + '/' + now.getFullYear()   
            

            this.ingreso[i].createdAt = formatted;
        }
      },
      err => console.error(err)
    );
  }

  generarExcel(numeroComprobante:string){
    this.obtenerTablas(numeroComprobante);
    this.exportarTabla();
  }

  dataSourceDetalle = ELEMENT_DATA_DETALLE;
  dataSourceTotal = ELEMENT_DATA_TOTAL;
  filterIngreso:any = [];
  obtenerTablas(numeroComprobante:string){
    this.dataSourceDetalle = [];
    this.dataSourceTotal = [];
    const nuevoNumero = Number(numeroComprobante);

    // Obtener datos para la tabla totales
    this.filterIngreso= this.ingreso.filter(function(ele: any){
      return ele.id_ingreso == nuevoNumero;
    });

    this.dataSourceTotal.push({
      Igv:      this.filterIngreso[0].ing_igv, 
      Gravada:  this.filterIngreso[0].ing_gravada, 
      Total:    this.filterIngreso[0].ing_totalCompra
    });

    //Obtener datos para la tabla detalle 
    this.getProductos(numeroComprobante);
    
    for(let i=0 ; i<this.dataSourcePro.length; i++){
      this.dataSourceDetalle.push({ 
        Cliente:      this.filterIngreso[0].Personas.per_razonSocial,
        Ruc:          this.filterIngreso[0].Personas.per_numeroDocumento,
        Direccion:    this.filterIngreso[0].Personas.per_direccion,
        FechaEmision: this.filterIngreso[0].createdAt,
        ModeloProd:   this.dataSourcePro[i].modeloProd,
        Descripcion:  this.dataSourcePro[i].descripcion,
        Cantidad:     this.dataSourcePro[i].cantidad,
        PUnit:        this.dataSourcePro[i].pUnit,
        SubTotal:     this.dataSourcePro[i].subTotal,
        Total:        this.dataSourcePro[i].tota });
    }
  
  }

  exportarTabla(){
    const arrayDetalles: Partial<DetalleIngreso>[] = this.dataSourceDetalle.map(x => ({
      Cliente:      x.Cliente,
      Ruc:          x.Ruc,
      Direccion:    x.Direccion,
      FechaEmision: x.FechaEmision,
      ModeloProd:   x.ModeloProd,
      Descripcion:  x.Descripcion,
      Cantidad:     x.Cantidad,
      PUnit:        x.PUnit,
      SubTotal:     x.SubTotal,
      Total:        x.Total
    }));

    const arrayTotales: Partial<TotalIngreso>[] = this.dataSourceTotal.map(x => ({
      Igv:     x.Igv,
      Gravada: x.Gravada,
      Total:   x.Total
    }));

    TableUtil.exportArrayToExcel(arrayDetalles,arrayTotales,`${this.filterIngreso[0].ing_serieComprobante}-${this.filterIngreso[0].ing_numeroComprobante}`);
  }

  filterDetalle:any=[];
  dataSourcePro = ELEMENT_DATA_PRO;
  getProductos(numeroComprobante:string){
    this.dataSourcePro = [];
    this.arrayPdf = [];
    const nuevoNumero = Number(numeroComprobante);

    this.filterDetalle = this.detalleIngreso.filter(function(ele: any){
      return ele.fk_id_ingreso == nuevoNumero;
    });

    for(let i=0; i<this.filterDetalle.length;i++){

      this.dataSourcePro.push({
        modeloProd: this.filterDetalle[i].Productos.prod_modelo,
        descripcion:this.filterDetalle[i].Productos.prod_descripcion,
        cantidad:this.filterDetalle[i].deti_cantidad,
        pUnit:this.filterDetalle[i].deti_precioCompra,
        subTotal:this.filterDetalle[i].deti_subTotal,
        tota:this.filterDetalle[i].deti_total
      })
     
    }

  }

    
  

}


const ELEMENT_DATA_TOTAL: TotalIngreso[] = [];
export interface TotalIngreso {
  Igv: number;
  Gravada : number;
  Total: number;
}
const ELEMENT_DATA_DETALLE: DetalleIngreso[] = [];
export interface DetalleIngreso {
  Cliente: string;
  Ruc:string;
  Direccion:string;
  FechaEmision:string;
  ModeloProd:string;
  Descripcion:string;
  Cantidad:number;
  PUnit:number;
  SubTotal:number;
  Total:number
}

const ELEMENT_DATA_PRO: ArrayProducto[] = [];
export interface ArrayProducto {
  modeloProd:string;
  descripcion:string;
  cantidad:number;
  pUnit:number;
  subTotal:number;
  tota:number
}