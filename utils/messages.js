const generateMessage = (message, username) => {
  return {
    text: message,
    username,
    createdAt: new Date().getTime(),
  };
};

const generateLocation = (message, username) => {
  return {
    url: message,
    username,
    createdAt: new Date().getTime(),
  };
};

module.exports = { generateMessage, generateLocation };
