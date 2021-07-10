import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {
  public titulo: String ;
  public tituloSubs$: Subscription;

  constructor( private router: Router) {
    this.tituloSubs$ = this.getArgumentosRuta()
      .subscribe(({titulo} )=> {
      this.titulo = titulo
      document.title = `AdminPro - ${titulo}` 
    });

  }
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  getArgumentosRuta() {
    return this.router.events
    .pipe(
      filter((event:ActivationEnd)=> event instanceof ActivationEnd),
      filter((event:ActivationEnd) => event.snapshot.firstChild === null),
      map((event:ActivationEnd) => event.snapshot.data)
    )
    
  }


}
