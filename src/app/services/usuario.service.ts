import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

const base_url = environment.base_url;
declare const gapi : any;
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) {
    this.googleInit();
  }

  googleInit() {

    return new Promise<void>(resolve => {
      gapi.load('auth2', ()=>{
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '264620843277-eovjbc2uch4t16ogqdh7lc5rbb04s6di.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });

    })
  }

  logout() {
    localStorage.removeItem('token');
    
    
    this.auth2.signOut().then(()=> {
      this.ngZone.run(()=> {
        this.router.navigateByUrl('/login');

      })
    });
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${base_url}/login/renew`,{
      headers: {
        'x-token': token
      }
    }).pipe(
      tap((resp: any)=> {
        localStorage.setItem('token',resp.token);
      }),
      map(resp => true),
      catchError(error=> of(false))
    );
  }

  crearUsuario(formData: RegisterForm){
    return this.http.post(`${base_url}/usuarios`, formData)
            .pipe(
              tap((resp: any)=> {
                localStorage.setItem('token',resp.token);
              })
            );
  }

  login(formData: LoginForm){
    return this.http.post(`${base_url}/login`, formData)
            .pipe(
              tap((resp: any)=> {
                localStorage.setItem('token',resp.token);
              })
            );
  }

  loginGoogle(token: string){
    return this.http.post(`${base_url}/login/google`, {token})
            .pipe(
              tap((resp: any)=> {
                localStorage.setItem('token',resp.token);
              })
            );
  }
}
