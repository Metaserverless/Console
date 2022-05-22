({
  access: 'public',

  async method({
    name
  }) {
    const filePath = `./application/schemas/${name}.js`;
    const source = await node.fsp.readFile(filePath, 'utf8');
    return {
      name,
      source
    };
  },
});
