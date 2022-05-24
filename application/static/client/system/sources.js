const sources = {

  currentFile: null,

  init(modules) {
    this.modules = modules;
    this.modules.events.listen('open:source:file', file => this.currentFile = file);
    this.modules.events.listen('Ctrl+s', this.saveSourceFile.bind(this));
  },

  storePath(file, original = true) {
    return `codeEditor.${original ? 'original' : 'editing'}.${file.type}.${file.path}`;
  },

  async saveSourceFile() {
    if (!this.currentFile) return;
    const originalPath = this.storePath(this.currentFile, true);
    const editingPath = this.storePath(this.currentFile, false);
    const original = this.modules.store.get(originalPath);
    const editing = this.modules.store.get(editingPath);
    if (original === editing) return;
    const data = {
      type: this.currentFile.type,
      path: this.currentFile.path,
      source: editing
    };
    const res = await this.modules.transport.send('setTenantFile', data);
    if (!res.success) return console.log(res.error);
    this.modules.store.set(originalPath, editing);
    this.modules.events.emit('source:file:saved', this.currentFile);
  },
};

export default sources;
