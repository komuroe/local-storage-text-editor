export default class SelectRecordMenu {
  constructor({
    onEdit,
    onCreate,
    onShowRecord,
    onDelete,
  }) {
    this.select = document.querySelector('#selectRecord');
    this.editRecordBtn = document.querySelector('#editRecord');
    this.newRecordBtn = document.querySelector('#newRecord');
    this.deleteAllRecordsBtn = document.querySelector('#deleteAllRecords');
    this.page = document.querySelector('#pageInput');
    this.onEdit = onEdit;
    this.onCreate = onCreate;
    this.onDelete = onDelete;
    this.onShowRecord = onShowRecord;
    this.init();
  }
  init() {
    this.initEditRecordBtnHandler();
    this.initNewRecordBtn();
    this.initSelectHandler();
    this.initDeleteAllRecordsHandler();
  }
  initDeleteAllRecordsHandler() {
    this.deleteAllRecordsBtn.addEventListener('click', () => {
      const confirmDelete = confirm('Удалить все записи?');
      if (confirmDelete) {
        this.onDelete();
      }
    });
  }
  initSelectHandler() {
    this.select.addEventListener('change', () => {
      this.showRecord();
    });
  }
  initEditRecordBtnHandler() {
    this.editRecordBtn.addEventListener('click', () => {
      const selectedItemVal = this.select.options[this.select.selectedIndex].value;
      this.onEdit({ key: selectedItemVal });
    });
  }
  initNewRecordBtn() {
    this.newRecordBtn.addEventListener('click', () => {
      this.onCreate();
    });
  }
  showRecord() {
    const selectedItemVal = this.select.options[this.select.selectedIndex].value;
    this.page.setAttribute('contenteditable', false);
    // немного путано тут получилось :/
    this.onShowRecord(selectedItemVal);
  }
  initOptions(optionsHash) {
    this.select.innerHTML = '';
    for (const key in optionsHash) {
      const option = document.createElement('option');
      option.innerHTML = key;
      option.value = key;
      this.select.append(option);
    }
  }
}
