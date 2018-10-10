import LocalStorageHandler from './localStorageHandler';
import EditRecordMenu from './editRecordMenu';
import SelectRecordMenu from './selectRecordMenu';
import './assets/main.css';

export default class App {
  constructor(){
    this.editRecordMenuElement = document.querySelector('#editRecordMenu');
    this.page = document.querySelector('#pageInput');
    this.cancelBtn = document.querySelector('#cancelBtn');
    this.selectRecordMenuElement = document.querySelector('#selectRecordMenu');
    this.storageHandler = new LocalStorageHandler({
      localStorageItemName: 'text-editor-local-storage',
      onRecordPresence: this.enableCancelBtn.bind(this),
    });
    this.selectRecordMenu = new SelectRecordMenu({
      onEdit: this.showEditRecordMenu.bind(this),
      onShowRecord: this.showRecordOnPage.bind(this),
      onCreate: this.showEditNewRecord.bind(this),
      onDelete: this.deleteAllRecordsAndQuit.bind(this),
    });
    this.editMenu = new EditRecordMenu({
      onSave: this.saveRecordAndQuit.bind(this),
      onCancel: this.showSelectRecordMenu.bind(this),
      onDelete: this.deleteRecordAndQuit.bind(this),
    });
  };
  init() {
    window.addEventListener('resize', this.setMainContentHeight);
    this.setMainContentHeight();
    this.initMenu();
  };
  initMenu() {
    if (this.isLocalStorageEmpty()) {
      this.showEditRecordMenu({ key: null, newRecord: true, canBeBack: false });
    } else {
      this.showSelectRecordMenu();
    }
  };
  enableCancelBtn() {
    this.cancelBtn.disabled = false;
  };
  deleteRecordAndQuit(key) {
    this.storageHandler.deleteRecord(key);
    this.initMenu();
  };
  showRecordOnPage(key) {
    const recordObj = this.storageHandler.getRecordByKey(key);
    this.page.innerHTML = recordObj.record;
  };
  showSelectRecordMenu() {
    const optionsHash = this.storageHandler.getLocalStorageObj();
    this.selectRecordMenu.initOptions(optionsHash);
    this.selectRecordMenu.showRecord();
    // show the right menu
    this.selectRecordMenuElement.classList.remove('hidden');
    this.editRecordMenuElement.classList.add('hidden');
  };
  showEditRecordMenu({ key, newRecord, canBeBack }) {
    this.selectRecordMenuElement.classList.add('hidden');
    this.editRecordMenuElement.classList.remove('hidden');
    if (key) {
      const recordObj = this.storageHandler.getRecordByKey(key);
      recordObj.newRecord = false;
      recordObj.canBeBack = true;
      this.editMenu.show(recordObj);
    } else {
      this.editMenu.show({ newRecord, canBeBack });
    }
  };
  showEditNewRecord() {
    this.showEditRecordMenu({
      key: null,
      newRecord: true,
      canBeBack: true,
    });
  };
  isLocalStorageEmpty() {
    const recordsHash = this.storageHandler.getLocalStorageObj();
    return !recordsHash ||
      (Object.keys(recordsHash).length === 0 && recordsHash.constructor === Object);
  };
  deleteAllRecordsAndQuit() {
    this.storageHandler.deleteAllRecords();
    this.initMenu();
  };
  saveRecordAndQuit(recordName, record) {
    this.storageHandler.saveRecord(recordName.trim(), record);
    this.showSelectRecordMenu();
  };
  setMainContentHeight() {
    const headerHeight = document.querySelector('#header').clientHeight;
    const mainContentElement = document.querySelector('#main-content');
    mainContentElement.style.height = `${window.innerHeight - headerHeight}px`;
  };
}
