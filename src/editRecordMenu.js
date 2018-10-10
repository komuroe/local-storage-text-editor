import UndoRedo from './undoRedo';

export default class EditRecordMenu {
  constructor({
    onSave, onCancel, onDelete,
  }) {
    this.onSave = onSave;
    this.onCancel = onCancel;
    this.onDelete = onDelete;
    this.undoBtn = document.querySelector('#undo');
    this.redoBtn = document.querySelector('#redo');
    this.saveBtn = document.querySelector('#saveBtn');
    this.cancelBtn = document.querySelector('#cancelBtn');
    this.deleteRecordBtn = document.querySelector('#deleteRecord');
    this.page = document.querySelector('#pageInput');
    this.recordNameElement = document.querySelector('#recordName');
    this.init();
  }
  static createCounter() {
    let counter = 0;
    return () => {
      counter += 1;
      return counter;
    };
  }
  init() {
    this.clickCounter = EditRecordMenu.createCounter();
    const self = this;
    this.history = new UndoRedo({
      maxLength: 100,
      initialItem: '',
      onUpdate: () => {
        if (!self.history) return;
        self.toggleUndoRedoBtns();
      },
    });
    this.initUndoRedoBtns();
    this.initKeydownHandler();
    this.initSaveBtnHandler();
    this.initCancelBtnHandler();
    this.initDeleteBtnHandler();
  }
  toggleUndoRedoBtns() {
    this.undoBtn.disabled = !this.history.canUndo();
    this.redoBtn.disabled = !this.history.canRedo();
  }
  initDeleteBtnHandler() {
    this.deleteRecordBtn.addEventListener('click', () => {
      const confirmDelete = confirm(`Удалить запись "${this.recordName}"?`);
      if (confirmDelete) {
        this.onDelete(this.recordName);
      }
    });
  }
  initKeydownHandler() {
    this.page.addEventListener('keydown', (e) => {
      const key = e.keyCode || e.charCode;
      if (this.contentsOutsidePage()) {
        if (key !== 8 && key !== 46) e.preventDefault();
      } else {
        if (this.clickCounter() % 3 === 0) this.history.record(this.page.innerHTML);
        this.toggleSaveBtn();
      }
    });
  }
  contentsOutsidePage() {
    return this.page.scrollHeight - 50 > this.page.offsetHeight - 50;
  }
  toggleSaveBtn() {
    if (this.page.innerHTML === this.record || this.page.innerHTML === '') {
      this.saveBtn.disabled = true;
    } else {
      this.saveBtn.disabled = false;
    }
  }
  toggleDeleteBtn(newRecord) {
    if (newRecord) {
      this.deleteRecordBtn.disabled = true;
    } else {
      this.deleteRecordBtn.disabled = false;
    }
  }
  toggleCancelBtn(canBeBack) {
    if (canBeBack) {
      this.cancelBtn.classList.remove('hidden');
    } else {
      this.cancelBtn.classList.add('hidden');
    }
  }
  initUndoRedoBtns() {
    const setEditorContentsFunc = this.setEditorContents();
    this.undoBtn.addEventListener('click', () => {
      this.history.undo(setEditorContentsFunc);
      this.toggleSaveBtn();
    });
    this.redoBtn.addEventListener('click', () => {
      this.history.redo(setEditorContentsFunc);
      this.toggleSaveBtn();
    });
  }
  setEditorContents() {
    const { page } = this;
    return (contents) => {
      page.innerHTML = contents;
    };
  }
  initCancelBtnHandler() {
    this.cancelBtn.addEventListener('click', () => {
      if (this.record !== this.page.innerHTML) {
        const confirmCancel = confirm('Вы уверены, что хотите выйти из редактора не сохранив изменений?');
        if (confirmCancel) {
          this.onCancel();
        }
      } else {
        this.onCancel();
      }
    });
  }
  initSaveBtnHandler() {
    this.saveBtn.addEventListener('click', () => {
      const currentRecordName = this.recordName || new Date().toLocaleString();
      const record = this.page.innerHTML;
      if (record.trim() === '') {
        alert('Нельзя сохранить пустую запись.');
      } else {
        const recordName = prompt('Сохранить запись как', currentRecordName);
        if (recordName.trim() !== '') {
          this.onSave(recordName, record);
        } else {
          alert('Имя записи не может быть пустым.');
        }
      }
    });
  }
  updateHistory(record) {
    this.history.reset(record);
    this.clickCounter = EditRecordMenu.createCounter();
  }
  show({
    recordName = '', record = '', newRecord = false, canBeBack = false,
  } = {}) {
    this.page.setAttribute('contenteditable', true);
    this.page.innerHTML = record;
    this.record = record;
    this.recordName = recordName;
    if (newRecord) {
      this.recordNameElement.innerHTML = 'Новая запись';
    }
    this.toggleDeleteBtn(newRecord);
    this.toggleCancelBtn(canBeBack);
    this.toggleSaveBtn();
    this.updateHistory(record);
  }
}
