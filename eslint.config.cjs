module.exports = async () => {
  const { default: config } = await import("./eslint.config.js");
  return config;
};
