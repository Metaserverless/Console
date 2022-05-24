({
  access: 'public',

  async method({
    type,
    path,
    source
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
    const success = await node.fsp.writeFile(filePath, source, {
      encoding: 'utf8'
    });
    return {
      type,
      path,
      success: true,
    };
  },
});
