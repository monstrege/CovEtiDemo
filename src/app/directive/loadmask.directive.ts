import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
    selector: '[load-mask]'
})
export class LoadMaskDirective{
    @Input('load-mask') loading: boolean;
    @HostBinding('class.load-mask') loadMask = true;
    @HostBinding('class.load-mask-loading') get loadMaskLoading(){return this.loading;};
}