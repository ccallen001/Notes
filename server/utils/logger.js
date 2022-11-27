const isTestEnv = process.env.NODE_ENV === 'test';

const info = (...params) => {
  if (isTestEnv) return;
  console.log(...params);
};

const error = (...params) => {
  if (isTestEnv) return;
  console.error(...params);
};

module.exports = {
  info,
  error
};
