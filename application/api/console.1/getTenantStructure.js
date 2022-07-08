({
  access: 'public',

  async method() {
    const load = async (targetPath) => {
      const tree = [];
      try {
        const files = await node.fsp.readdir(targetPath, {
          withFileTypes: true,
        });
        for (const file of files) {
          if (file.name.startsWith('.')) continue;
          const filePath = node.path.join(targetPath, file.name);
          if (file.isDirectory()) {
            tree.push({
              name: file.name,
              children: await load(filePath),
            });
          } else {
            tree.push({
              name: file.name,
            });
          }
        }
      } catch (err) {
        console.error(err.stack);
      }
      return tree;
    };

    console.log(context.accountId);
    const tenant = 'tenant' + context.accountId;

    let dirPath, files;

    dirPath = './application/schemas/';
    files = await node.fsp.readdir(dirPath);
    const schemas = files.filter(
      (file) => file.indexOf('.') !== 0 && file.slice(-3) === '.js',
    );

    dirPath = './application/flow/';
    files = await node.fsp.readdir(dirPath);
    const flows = files.filter(
      (file) => file.indexOf('.') !== 0 && file.slice(-3) === '.md',
    );

    dirPath = './application/domain/store/';
    files = await node.fsp.readdir(dirPath);
    const store = files.filter(
      (file) => file.indexOf('.') !== 0 && file.slice(-3) === '.js',
    );

    dirPath = './application/api/' + tenant + '.1/';
    files = await node.fsp.readdir(dirPath);
    const apis = files.filter(
      (file) => file.indexOf('.') !== 0 && file.slice(-3) === '.js',
    );

    dirPath = './application/static/tenants/' + tenant + '/';
    const client = await load(dirPath);

    return {
      apis,
      flows,
      schemas,
      store,
      client,
    };
  },
});
