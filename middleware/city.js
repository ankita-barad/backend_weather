const cityValidator = (str) => {
  const cityregex = new RegExp("[a-zA-z]+$");
  if (cityregex.test(str)) {
    next();
  }
};

module.exports = { cityValidator };
