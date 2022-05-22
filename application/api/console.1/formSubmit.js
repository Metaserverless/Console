({
  access: 'public',

  async method({ name, data }) {
    const flow = domain.runtime.flows.get(context.client);
    if (!flow) throw new Error('No running "flow" present');
    console.log({ name, data });
    flow.emit('form/submit', data);
    return { success: true };
  },
});
