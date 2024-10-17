'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.TRegistrationOption =
  exports.TRole =
  exports.BrowserFamily =
  exports.TGender =
    void 0;
var TGender;
(function (TGender) {
  TGender['MALE'] = 'Male';
  TGender['FEMALE'] = 'Female';
  TGender['OTHER'] = 'Other';
})(TGender || (exports.TGender = TGender = {}));
var BrowserFamily;
(function (BrowserFamily) {
  BrowserFamily['Chrome'] = 'Chrome';
  BrowserFamily['Firefox'] = 'Firefox';
  BrowserFamily['Safari'] = 'Safari';
  BrowserFamily['Edge'] = 'Edge';
  BrowserFamily['Opera'] = 'Opera';
  BrowserFamily['InternetExplorer'] = 'Internet Explorer';
  BrowserFamily['Other'] = 'Other';
})(BrowserFamily || (exports.BrowserFamily = BrowserFamily = {}));
var TRole;
(function (TRole) {
  TRole['CUSTOMER'] = 'Customer';
  TRole['MODERATOR'] = 'Moderator';
  TRole['ADMIN'] = 'Admin';
})(TRole || (exports.TRole = TRole = {}));
var TRegistrationOption;
(function (TRegistrationOption) {
  TRegistrationOption['GOOGLE_AUTH'] = 'google_auth';
  TRegistrationOption['EMAIL'] = 'email';
})(
  TRegistrationOption ||
    (exports.TRegistrationOption = TRegistrationOption = {}),
);
