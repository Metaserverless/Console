({
  access: 'public',

  async method({
    type,
    path,
    newPath
  }) {

    console.log(type, path, newPath);



    const tenant = 'tenant' + context.accountId;
    const safePath = path.replace(/\.\./g, '');
    const safeNewPath = newPath.replace(/\.\./g, '');

    const folders = {
      'schema': './application/schemas/',
      'flow': './application/flow/',
      'store': './application/domain/store/',
      'api': './application/api/' + tenant + '.1/',
      'client': './application/static/tenants/' + tenant + '/'
    };

    const assetPath = folders[type] + safePath;
    const newAssetPath = folders[type] + safeNewPath;
    const success = await node.fsp.rename(assetPath, newAssetPath);
    return {
      type,
      path,
      newPath,
      success: true,
    };
  },
});
