import { Injectable, ElementRef } from '@angular/core';
import textMetrics from 'text-metrics/dist';

@Injectable()
export class HintService {

  constructor() {
  }

  getHint(ref: ElementRef, hint: string): string {
    let outHint = '';
    if (hint !== undefined) {
      if (hint.length > 0) {
        const clientWidth = ref.nativeElement.clientWidth + 1;
        const styles = getComputedStyle(ref.nativeElement);
        const textWidth1 = clientWidth - parseInt(styles.paddingLeft, 10) - parseInt(styles.paddingRight, 10);
        const textWidth2 = textMetrics(ref.nativeElement).width(hint);
        if (textWidth2 - textWidth1 >= 3) {
          outHint = hint;
        }
      }
    }
    return outHint;
  }

  split(param: string): string {
    if (param === undefined) {
      return '';
    }
    param = param;
    const BLOCK_LENGTH = 30;
    let length: number = param.length;
    let block_count: number = Math.trunc(length / BLOCK_LENGTH);
    let all_block_length: number = block_count * BLOCK_LENGTH;
    let res_string: string = '';
    if (all_block_length === length) {
      block_count--;
    }
    for (let i = 0; i < block_count; i++) {
      res_string = res_string + param.substr(i * BLOCK_LENGTH, BLOCK_LENGTH);// + '\n\r';
    }
    if ((length - all_block_length) > 0) {
      res_string = res_string + param.substr(all_block_length, length - all_block_length);
    }
    return res_string;
  }

}
