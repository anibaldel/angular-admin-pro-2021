import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;
  public auth2: any;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || 'test10@gmail.com',[Validators.required,Validators.email]],
    password: ['123456',[Validators.required, Validators.minLength(3)]],
    remember: [false]
  })

  constructor( private router: Router,
              private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private ngZone: NgZone  ) { }
  ngOnInit(): void {
    this.renderButton();
  }


  login() {
    // console.log(this.loginForm.value);
    // this.router.navigateByUrl('/');

    this.usuarioService.login(this.loginForm.value)
      .subscribe(resp=> {
        if(this.loginForm.get('remember').value) {
          localStorage.setItem('email',this.loginForm.get('email').value);
        } else {
          localStorage.removeItem('email');
        }
        // Navegar al Dashboard
        this.router.navigateByUrl('/');
      }, (err) => {
        Swal.fire('Error',err.error.msg,'error')
      })
  }

  onSuccess(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token);
  }

  onFailure(error) {
    console.log(error);
  }
  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });
    this.startApp();

  }
  async startApp() {

    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
    
    this.attachSignin(document.getElementById('my-signin2'));
    
  }

  attachSignin(element) {
    
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {
          var id_token = googleUser.getAuthResponse().id_token;
          //console.log(id_token);
          this.usuarioService.loginGoogle(id_token)
            .subscribe(resp=> {
              // Navegar al Dashboard
              this.ngZone.run(()=> {
                this.router.navigateByUrl('/');
        
              })
            });
        }, (error)=> {
          alert(JSON.stringify(error, undefined, 2));
        });
  }
  

}
