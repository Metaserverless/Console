({
  access: 'public',

  async method({ name }) {
    const filePath = `./application/flow/${name}.md`;
    const source = await node.fsp.readFile(filePath, 'utf8');
    return { name, source };
  },
});
