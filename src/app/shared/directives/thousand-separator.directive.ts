import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
    selector: '[appThousandSeparator]',
})
export class ThousandSeparatorDirective {
    constructor(private ele: ElementRef) {}

    
    

    @HostListener('keyup') onKeyUp() {
        
        let value = this.ele.nativeElement.value.split("")
        let index = 0;
        let hasComma = value.indexOf(",")
        while (hasComma !== -1) {
            value.splice(hasComma, 1)
            hasComma = value.indexOf(",")
        }
        for (let i = value.length - 1; i >= 0; i--) {
            // console.log(index, value[i])
            if (index === 3 && value[i] !== ',') {
                value.splice(i + 1, 0, ',');
                index = 0;
            }
            index++;
        }
        this.ele.nativeElement.value = value.join("")
    }
}
