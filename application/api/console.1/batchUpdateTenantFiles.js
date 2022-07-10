({
  access: 'public',

  async method({
    items
  }) {
    // console.log(files);
    if (!items || !Array.isArray(items)) throw new Error('No files provided');

    const sanitizePath = (path) => {
      return path.replace(/\.\./g, '');
    };
    const writeSource = async (path, source) => {
      if (typeof source === 'undefined') return false;

      await node.fsp.writeFile(path, source, {
        encoding: 'utf8',
      });
      return true;
    };

    const tenant = 'tenant' + context.accountId;

    const folders = {
      schema: './application/schemas/',
      process: './application/flow/',
      procedure: './application/domain/store/',
      rpc: './application/api/' + tenant + '.1/',
      client: './application/static/tenants/' + tenant + '/',
    };

    const saved = {};

    items.sort((a, b) => {
      if (
        (a.type === 'folder' && b.type === 'folder') ||
        (a.type !== 'folder' && b.type !== 'folder')
      )
        return a.path.length - b.path.length;
      if (a.type === 'folder') return -1;
      if (b.type === 'folder') return 1;
      return 0;
    });

    for (const item of items) {
      const rootPath = folders[item.type] || folders[item.section];
      const safePath =
        item.section === 'client' ?
        sanitizePath(item.path) :
        sanitizePath(item.name);
      if (!rootPath || !safePath) continue;
      const itemPath = rootPath + safePath;

      let success = false;

      console.log(item);

      if (item.new) {
        if (item.type === 'folder') {
          await node.fsp.mkdir(itemPath);
          success = true;
        } else {
          const source = item.source || '';
          success = await writeSource(itemPath, source);
        }
      } else if (item.deleted) {
        if (item.type === 'folder') {
          success = await node.fsp.rm(itemPath, {
            recursive: true,
          });
          success = true;
        } else {
          await node.fsp.unlink(itemPath);
          success = true;
        }
      } else if (item.newPath) {
        if (item.newPath !== item.path) {
          const safeNewPath = sanitizePath(
            item.section === 'client' ?
            item.newPath :
            item.newName || item.name,
          );
          if (!safeNewPath) continue;
          const newItemPath = rootPath + safeNewPath;
          if (item.type !== 'folder') await writeSource(itemPath, item.source);
          await node.fsp.rename(itemPath, newItemPath);
          success = true;
        }
      } else if (item.type !== 'folder' && typeof item.source !== 'undefined') {
        success = await writeSource(itemPath, item.source);
        console.log(success);
      }

      saved[item.id] = {
        success,
        id: item.id,
        section: item.section,
        deleted: item.deleted,
      };
    }

    return {
      saved,
      success: true,
    };
  },
});
