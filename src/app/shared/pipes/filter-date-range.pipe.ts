import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterDateRange',
})
export class FilterDateRangePipe implements PipeTransform {
    transform(dates: number[], fromDate: Date | null, toDate: Date | null): number[] {
        if (!fromDate || !toDate) return dates;

        const from = fromDate.getTime()
        const to = toDate.getTime()
        console.log(from, to)
        return dates.filter((date) => date >= from && date <= to);
    }
}
