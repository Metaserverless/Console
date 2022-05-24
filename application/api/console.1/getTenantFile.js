({
  access: 'public',

  async method({
    type,
    path
  }) {

    console.log(type, path);
    const tenant = 'tenant' + context.accountId;
    const savePath = path.replace(/\.\./g, '');

    const folders = {
      'schema': './application/schemas/',
      'flow': './application/flow/',
      'store': './application/domain/store/',
      'api': './application/api/' + tenant + '.1/',
      'client': './application/static/tenants/' + tenant + '/'
    };

    const filePath = folders[type] + savePath;
    const source = await node.fsp.readFile(filePath, 'utf8');
    return {
      type,
      path,
      source,
    };
  },
});
