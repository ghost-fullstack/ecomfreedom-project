module.exports = {
  label: "Name or Email doesn't contain",
  type: 'string',
  order: 0,
  filter(inclusion) {
    const re = new RegExp(`^((?!${inclusion}).)*$`);
    return inclusion ? { $or: [{ firstname: re }, { lastname: re }, { email: re }] } : false;
  }
};
