import { Directive, Input, HostListener, HostBinding } from '@angular/core';

@Directive({
    selector: '[appBtnSelected]'
})
export class BotonSeleccionadoDirective {

    @HostBinding('style.backgroundColor') backgroundColor: string;
    @Input() defaultColor: string = 'white';
    @Input() highlightColor: string = '#6e9de4';

    constructor() {
    }

    @HostListener('mouseenter') mouseover(eventData: Event) {
        this.backgroundColor = this.highlightColor;
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.backgroundColor = this.defaultColor;
    }
}
