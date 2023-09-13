export const enum Target {
  KTC, // тестировый полигон КТЦ
  PORTAL,  // для портала - бэк на серверах ИРЦ
};

export const enum TargetBackend {
  TEST, // gcsapod
  DEMO  // gbsapod
};

export const environment = {
  production: false,
  version: "1.0.915",
  build: "07.10.20 dev",
  target: Target.KTC,
  testMode: false
};
