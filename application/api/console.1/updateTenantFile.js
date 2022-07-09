({
  access: 'public',

  async method({ type, path, source }) {
    console.log(type, path);
    const tenant = 'tenant' + context.accountId;
    const safePath = path.replace(/\.\./g, '');

    const folders = {
      schema: './application/schemas/',
      process: './application/flow/',
      procedure: './application/domain/store/',
      rpc: './application/api/' + tenant + '.1/',
      client: './application/static/tenants/' + tenant + '/',
    };

    const filePath = folders[type] + safePath;
    const success = await node.fsp.writeFile(filePath, source, {
      encoding: 'utf8',
    });
    return {
      type,
      path,
      success: !!success,
    };
  },
});
