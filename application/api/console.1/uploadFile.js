async ({
  path,
  name,
  data
}) => {
  const buffer = Buffer.from(data, 'base64');

  const sanitizePath = (path) => {
    return path.replace(/\.\./g, '')
  };
  const tenant = 'tenant' + context.accountId;
  const rootPath = './application/static/tenants/' + tenant;
  const safePath = node.path.join(sanitizePath(path), sanitizePath(name));
  if (!safePath) throw new Error('Invalid path');
  const itemPath = node.path.join(rootPath, safePath);
  console.log(path, name, data.length, itemPath);
  // const filePath = node.path.join(tmpPath, name);
  // if (itemPath.startsWith(rootPath)) {
  await node.fsp.writeFile(itemPath, buffer);
  // }
  return {
    path,
    name,
    uploaded: data.length,
    success: true
  };
};
