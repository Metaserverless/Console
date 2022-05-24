const tenant = {
  data: [],
  trees: {},

  init() {
    this.trees = {
      database: [],
      external: [],
      files: [],
      mail: [],
      versioning: [],
      debugging: [],
      templates: [],
    };

  },

  async loadData() {
    const data = await this.modules.transport.send('getTenantStructure', {});
    if (!data) return;
    return console.log(data);
  }

};

export default tenant;
