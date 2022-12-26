import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Heroe, Publisher } from '../../interfaces/heroes.interfaces';
import { HeroesService } from '../../services/heroes.service';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
    img{
      width: 100%;
      border-radius: 10px;
    }
  `]
})
export class AgregarComponent implements OnInit{

  heroe: Heroe = {
    superhero:'',
    alter_ego:'',
    publisher: Publisher.DCComics,
    first_appearance: '',
    characters:'',
    alt_img:''
  }

  publishers = [
    {
      id:'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id:'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ]

  constructor(private heroesService: HeroesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              public dialog: MatDialog){}

  ngOnInit(): void {
    
    if(!this.router.url.includes('editar')){
      return;
    }
    
    this.activatedRoute.params
        .pipe(
          switchMap(({id})=> this.heroesService.getHeroeId(id))
        )
        .subscribe(heroe => this.heroe = heroe);
  }

  guardar(){
    if(this.heroe.superhero.trim().length === 0){
      return;
    }
    if(this.heroe.id){
      //ACTUALIZAR
      this.heroesService.actualizarHeroe(this.heroe)
          .subscribe(heroe=>this.Mensaje('Héroe actualizado'));
    }else{
      //CREAR
      this.heroesService.agregarHeroe(this.heroe)
          .subscribe(heroe=>{
            this.router.navigate(['/heroes/editar', heroe.id]);
            this.Mensaje('Héroe creado')
          })
    }
  }

  eliminar(){
    const dialog = this.dialog.open(ConfirmarComponent, {
      width: '50%',
      height: '40%',
      data: this.heroe
    });
    dialog.afterClosed().subscribe(
      (result) =>{
        if(result){
          this.heroesService.BorrarHeroe(this.heroe.id!)
          .subscribe(resp=>{
            this.router.navigate(['/heroes']);
            this.Mensaje('Héroe eliminado');
          })
        }
      }
    )

    
  }

  Mensaje( mensaje: string){
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 2500
    });
  }

}
