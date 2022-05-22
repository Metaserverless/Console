({
  access: 'public',

  async method() {
    const dirPath = './application/schemas/';
    const files = await node.fsp.readdir(dirPath);
    const names = files.filter((file) => file.indexOf('.') !== 0 && file.slice(-3) === '.js');
    return {
      names
    };
  },
});
