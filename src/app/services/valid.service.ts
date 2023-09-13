import { Injectable } from '@angular/core';
import { testLogin } from '../domain/login';

class ValidCalcParams {
  outStation: boolean;
  inStation: boolean;
  Gng: boolean;
  Etsng: boolean;
  cargoWeight: boolean;
  wagCapacity: boolean;
  foot: boolean;
  contPayload: boolean;
  contCol: boolean;
  footContPayload: boolean;
};

class ErrorMsgs {
  Station: string = 'Некорректное значение станции.';
  Country: string = 'Некорректное значение страны.';
  Gng: string = 'Некорректное значение ГНГ.';
  emptyShadowEtsng: string = 'Значение ГНГ задано без кода ЕТСНГ.';
  Etsng: string = 'Некорректное значение ЕТСНГ.';
  prevCargo: string = 'Некорректное значение предыдущего груза.';
  cargoWeight: string = 'Некорректное значение веса груза.';
  cargoWeightEmptyContSvo: string = 'Для порожней контейнерной отправки вес груза равен 0.';
  wagCapacity: string = 'Некорректное значение грузоподъемности вагона.';
  Pivots: string = 'Некорректное значение осей.';
  Conductors: string = 'Некорректное значение проводников вагона.';
  Foot: string = 'Некорректное значение футовости контейнера.';
  ContPayload: string = 'Некорректное значение грузоподъемности контейнера.';
  specialMark: string = 'Тарифная отметка не найдена';
  wagType: string = 'Тип вагона не найден';
  contOwnership: string = 'Некорректное значение принадлежности контейнера';
  Ks: string = 'Некорректное значение кода собственника вагона.';
  Ks2: string = 'Не найден код собственника вагона.';
  wagPayload: string = 'Некорректное значение грузоподъемности вагона.';
  Discount: string = 'Некорректное значение скидки.';
  OutCountry: string = "Некорректное значение кода страны.";
  OutCountry2: string = 'Страна не найдена.';
  InCountry: string = 'Некорректное значение кода страны.';
  InCountry2: string = 'Страна не найдена.';
  outStation: string = 'Некорректное значение станции отправления.';
  outStation2: string = 'Не найдена введенная станция';
  inStation: string = 'Некорректное значение станции прибытия.';
  inStation2: string = 'Не найдена введенная станция.';
  contType: string = 'Не найден тип контейнера'
  invalidSymbol: string = 'Недопустимый символ.';
  contCol: string = 'Некорректное значение количества контейнеров.';
  Date: string = 'Некорректная дата.';
  emptyOwnerships: string = 'Не загружен справочник принадлежностей. Повторить загрузку НСИ ?';
  emptyKss: string = 'Не загружен справочник кодов собственника. Повторить загрузку НСИ ?';
  emptyWagTypes: string = 'Не загружен справочник типов вагонов. Повторить загрузку НСИ ?';
  emptyContTypes: string = 'Не загружен справочник типов контейнеров. Повторить загрузку НСИ ?';
  emptySvo: string = 'Не загружен справочник типов отправки. Повторить загрузку НСИ ?';
  emptySpecialMarks: string = 'Не загружен справочник специальных отметок. Повторить загрузку НСИ ?';
  emptyCountries: string = 'Не загружен справочник стран. Повторить загрузку НСИ ?';
  emptyNsi: string = 'Не удается загрузить НСИ. Повторить?';
  emptyStationNsi: string = 'Недоступен справочник станций на сервере БД.';
  emptyGngNsi: string = 'Недоступен справочник ГНГ на сервере БД.';
  emptyCountryNsi: string = 'Сбой при получении страны.';
  emptyEtsngNsi: string = 'Недоступен справочник ЕТСНГ на сервере БД.';
  emptyEtsngMasksNsi: string = 'Недоступен справочник масок ЕТСНГ на сервере БД.';
  errorRoute: string = 'Сбой при формировании маршрута.';
  emptyRoute: string = 'Маршрут не определен.';
  invalidCalc: string = 'Сбой при выполнении расчета.';
  emptyCalc: string = 'Некорректны параметры расчета, таксировка не выполнена.';
  errorSaveCacheNsi: string = 'Ошибка сохранения кэша НСИ.';
  errorSaveCacheUpdateDbDate: string = 'Ошибка сохранения даты обновления БД НСИ в кэш.';
  errorSaveCacheVersion: string = 'Ошибка сохранения версии кэша НСИ.';
  timeoutExceededRoute: string = 'Превышен таймаут ожидания результата формирования маршрута.';
  timeoutExceededCalc: string = 'Превышен таймаут ожидания результата расчета платы за перевозку груза.';
  invalidRouteQuery: string = 'Некорректные параметры запроса маршрута. Маршрут сформирован не будет';
  invalidTaxQuery: string = 'Некорректные параметры запроса таксировки груза. Таксировка груза произведена не будет';
  invalidRespAppServer: string = 'Не получен ответ от сервера приложений. Перезапустите приложение через некоторое время.';
  contPayload: string = 'Некорректная грузоподъемность контейнера';
  footContPayload: string = 'Некорректные футовость и грузоподъемность контейнера';
};

const enum StateCalcParams {
  validOutStation,
  invalidOutStation,
  validInStation,
  invalidInStation,
  validGng,
  invalidGng,
  validEtsng,
  invalidEtsng,
  validCargoWeight,
  invalidCargoWeight,
  validWagonCapacity,
  invalidWagonCapacity,
  invalidFoot,
  validFoot,
  invalidContPayload,
  validContPayload,
  invalidFootContPayload,
  validFootContPayload,
  validContCol,
  invalidContCol,
  validAll
};

@Injectable()
export class ValidService {
  delay_msg: number = 3000;
  public validCalcParams: ValidCalcParams;
  public errorMsgs: ErrorMsgs;

  constructor() {
    this.validCalcParams = new ValidCalcParams();
    this.errorMsgs = new ErrorMsgs();
  }

  isNumber(n: string) { // проверка числи или нет
    return !isNaN(parseFloat(n)) && isFinite(parseFloat(n))
  }

  validDate(Date_: string): boolean {
    return /^(((0[1-9]|[12]\d|3[01])\.(0[13578]|1[02])\.((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\.(0[13456789]|1[012])\.((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\.02\.((19|[2-9]\d)\d{2}))|(29\.02\.((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/.test(Date_);
  }

  isEmptyCode(code: string) {
    return code === '' || code === undefined;
  }

  isNegative(param: string) {
    return (Number.parseFloat(param) < 0);
  }

  clearValidCalcParams() {
    this.validCalcParams.outStation = true;
    this.validCalcParams.inStation = true;
    this.validCalcParams.Gng = true;
    this.validCalcParams.Etsng = true;
    this.validCalcParams.cargoWeight = true;
    this.validCalcParams.wagCapacity = true;
    this.validCalcParams.foot = true;
    this.validCalcParams.contPayload = true;
    this.validCalcParams.footContPayload = true;
    this.validCalcParams.contCol = true;
  }

  getValidEnum(): StateCalcParams {
    let states_: StateCalcParams[] = [];
    console.log(this.validCalcParams.outStation);
    if (!this.validCalcParams.outStation) {
      states_.push(StateCalcParams.invalidOutStation);
    };
    if (!this.validCalcParams.inStation) {
      states_.push(StateCalcParams.invalidInStation);
    };
    if (!this.validCalcParams.Gng) {
      states_.push(StateCalcParams.invalidGng);
    };
    if (!this.validCalcParams.Etsng) {
      states_.push(StateCalcParams.invalidEtsng);
    };
    if (!this.validCalcParams.cargoWeight) {
      states_.push(StateCalcParams.invalidCargoWeight);
    };
    if (!this.validCalcParams.wagCapacity) {
      states_.push(StateCalcParams.invalidWagonCapacity);
    };
    if (!this.validCalcParams.foot) {
      states_.push(StateCalcParams.invalidFoot);
    };
    if (!this.validCalcParams.contPayload) {
      states_.push(StateCalcParams.invalidContPayload);
    };
    if (!this.validCalcParams.footContPayload) {
      states_.push(StateCalcParams.invalidFootContPayload);
    };
    if (!this.validCalcParams.contCol) {
      states_.push(StateCalcParams.invalidFootContPayload);
    };
    if (states_.length === 0) {
      return StateCalcParams.validAll;
    } else {
      return states_[0];
    }
  }

  isValidCalcParams(): boolean {
    return this.validCalcParams.outStation && this.validCalcParams.inStation && this.validCalcParams.Gng && this.validCalcParams.Etsng &&
      this.validCalcParams.cargoWeight && this.validCalcParams.wagCapacity && this.validCalcParams.foot && this.validCalcParams.contPayload
      && this.validCalcParams.contCol;
  }

  getErrorMsg(): string {
    let msg_: string = '';
    switch (this.getValidEnum()) {
      case StateCalcParams.invalidOutStation: { msg_ = this.errorMsgs.outStation; break };
      case StateCalcParams.invalidInStation: { msg_ = this.errorMsgs.inStation; break };
      case StateCalcParams.invalidGng: { msg_ = this.errorMsgs.Gng; break; };
      case StateCalcParams.invalidEtsng: { msg_ = this.errorMsgs.Etsng; break; };
      case StateCalcParams.invalidCargoWeight: { msg_ = this.errorMsgs.cargoWeight; break; };
      case StateCalcParams.invalidWagonCapacity: { msg_ = this.errorMsgs.wagCapacity; break };
      case StateCalcParams.invalidFoot: { msg_ = this.errorMsgs.Foot; break };
      case StateCalcParams.invalidContPayload: { msg_ = this.errorMsgs.contPayload; break };
      case StateCalcParams.invalidFootContPayload: { msg_ = this.errorMsgs.footContPayload; break };
      case StateCalcParams.invalidContCol: { msg_ = this.errorMsgs.contCol; break };
    }
    return msg_;
  }

  isEven(n: number) : boolean{
    return n % 2 === 0;
  }

}

