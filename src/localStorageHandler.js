function defaultFunc() {}
export default class LocalStorageHandler {
  constructor({ localStorageItemName, onRecordPresence = defaultFunc }) {
    this.localStorageItemName = localStorageItemName;
    this.onRecordPresence = onRecordPresence;
    this.init();
  }
  init() {
    const localStorageObj = this.getLocalStorageObj();
    if (localStorageObj && Object.keys(localStorageObj).length) {
      this.onRecordPresence();
    }
  }
  saveRecord(recordName, record) {
    const localStorageObj = this.getLocalStorageObj();
    localStorageObj[recordName] = record;
    window.localStorage.setItem(this.localStorageItemName, JSON.stringify(localStorageObj));
    this.currentRecord = { recordName, record };
    this.onRecordPresence();
  }
  deleteRecord(key) {
    const localStorageObj = this.getLocalStorageObj();
    delete localStorageObj[key];
    window.localStorage.setItem(this.localStorageItemName, JSON.stringify(localStorageObj));
  }
  deleteAllRecords() {
    window.localStorage.setItem(this.localStorageItemName, JSON.stringify({}));
  }
  getLocalStorageObj() {
    const localStorageStr = window.localStorage.getItem(this.localStorageItemName);
    return JSON.parse(localStorageStr) || {};
  }
  getRecordByKey(key) {
    const localStorageStr = window.localStorage.getItem(this.localStorageItemName);
    const localStorageObj = JSON.parse(localStorageStr);
    if (localStorageObj[key]) {
      return { recordName: key, record: localStorageObj[key] };
    }
    return null;
  }
}
