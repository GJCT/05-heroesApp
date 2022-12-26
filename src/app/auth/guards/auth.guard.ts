import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate,  CanLoad {
  constructor(private authServices: AuthService,
              private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.authServices.verificaAutenticacion()
              .pipe(
                tap(estaAutenticado => {
                  if(!estaAutenticado){
                    this.router.navigate(['./auth/login']);
                  }
                })
              );

      // if(this.authServices.auth.id){
      //   return true;
      // }
      // return false
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
      return this.authServices.verificaAutenticacion()
              .pipe(
                tap(estaAutenticado => {
                  if(!estaAutenticado){
                    this.router.navigate(['./auth/login']);
                  }
                })
              );
      
      // if(this.authServices.auth.id){
      //   return true;
      // }
      // return false
      
  }
}
