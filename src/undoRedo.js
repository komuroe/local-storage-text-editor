function defaultOnUpdate() {}
export default class UndoRedo {
  constructor({ maxLength = 100, onUpdate = defaultOnUpdate, initialItem = '' } = {}) {
    this.maxLength = maxLength;
    this.onUpdate = onUpdate;
    this.reset(initialItem);
  }
  reset(initialItem) {
    this.initialItem = initialItem;
    this.stack = [initialItem];
    this.position = 0;
  }
  record(current) {
    this.truncate();
    this.position = Math.min(this.position, this.stack.length - 1);
    this.stack.push(current);
    this.position += 1;
    this.onUpdate();
  }
  undo(callback) {
    if (this.canUndo()) {
      this.position -= 1;
      const item = this.stack[this.position];
      this.onUpdate();
      if (callback) callback(item);
    }
  }
  canUndo() {
    return this.position > 0;
  }
  redo(callback) {
    if (this.canRedo()) {
      this.position += 1;
      const item = this.stack[this.position];
      this.onUpdate();
      if (callback) callback(item);
    }
  }
  canRedo() {
    return this.position < this.stack.length - 1;
  }
  truncate() {
    while (this.stack.length > this.maxLength) {
      this.stack.shift();
    }
  }
}
