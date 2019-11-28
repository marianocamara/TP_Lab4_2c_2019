import { Directive, Input, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[appActivacion]'
})
export class ActivacionDirective {

  activo: number;
  @Input() set appActivacion(activo: number) {
    this.activo = activo;
  }
  constructor(public el: ElementRef,
    public rederer: Renderer) { }


    ngOnInit() {
      if (this.activo) {
        this.rederer.setElementStyle(this.el.nativeElement, 'background-color', 'aquamarine');
      } 
      else{
        this.rederer.setElementStyle(this.el.nativeElement, 'background-color', 'antiquewhite');
      }
    }

}
