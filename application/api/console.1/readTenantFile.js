({
  access: 'public',

  async method({ type, path }) {
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
    const source = await node.fsp.readFile(filePath, 'utf8');
    return {
      type,
      path,
      source,
    };
  },
});
