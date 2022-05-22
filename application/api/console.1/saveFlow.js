({
  access: 'public',

  async method({ name, source }) {
    const filePath = `./application/flow/${name}.md`;
    await node.fsp.writeFile(filePath, source);
    await domain.runtime.load({ name: filePath });
    return { success: true };
  },
});
