import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pagination',
})
export class PaginationPipe implements PipeTransform {
    transform(array: any[], pageIndex: number, pageSize: number, length?: number): any[] {
        return array.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    }
}
