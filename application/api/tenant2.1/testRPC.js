({
  access: 'public',

  async method({
    name
  }) {
    return {
      name,
      success: true
    };
  },
});
