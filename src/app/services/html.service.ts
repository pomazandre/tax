import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';

@Injectable()
export class HtmlService {

  perform(data: any) {
    let now: Date = new Date();
    let month: number = now.getMonth() + 1;
    let month_format: string = String(now.getMonth() + 1);
    if (month <= 9) {
      month_format = '0' + month_format;
    }
    let today: string = `${now.getDate()}_${month_format}_${now.getFullYear()}`;
    let footerToday: string = `${now.getDate()}.${month_format}.${now.getFullYear()}`;
    let _doc: string[] = [];
    _doc.push('<!doctype html>');
    _doc.push('<html lang="ru">');
    _doc.push('<head>');
    _doc.push('<meta charset="utf-8">');
    _doc.push('<title>вебСАПОД</title>');
    _doc.push('</head>');
    _doc.push('<style>');
    _doc.push('table { border-collapse: collapse; border: 1px solid #ddd; }');
    _doc.push('th, td { border-bottom: 1px solid #ddd; }');
    _doc.push('</style>');
    _doc.push('<body>');
    _doc.push('<style> table { border-bottom: 1px solid black; }</style>');
    _doc.push('<h1>вебСАПОД</h1>');
    _doc.push('<h2>Детальная таксировка</h2>');
    _doc.push('<table style="width:60%">');
    data.forEach((item: any) => {
      _doc.push('<tr>');
      _doc.push(`<td width="40%">${item.label}</td>`);
      _doc.push(`<td width="60%">${item.value}</td>`);
      _doc.push('</tr>');
    })
    _doc.push('</table>');
    _doc.push(`<p style="font-size:10pt; font-style: italic; ">дата формирования ${footerToday}</p>`);
    _doc.push('</body>');
    _doc.push('</html>');
    let blob = new Blob(_doc, { type: "text/html;charset=utf-8" });
    FileSaver.saveAs(blob, `webSAPOD_${today}.html`);
  }

}
