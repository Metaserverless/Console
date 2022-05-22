({
  access: 'public',

  async method() {
    const dirPath = './application/flow/';
    const files = await node.fsp.readdir(dirPath);
    const names = files.map((file) => node.path.basename(file, '.md'));
    return { names };
  },
});
