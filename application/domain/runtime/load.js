async ({ name }) => {
  const filePath = `./application/flow/${name}.md`;
  const src = await node.fsp.readFile(filePath, 'utf8');
  const processes = npm.lowscript.parseMarkdown(src);
  for (const proc of processes) {
    domain.runtime.processes[proc.name] = proc;
  }
};
