function getUserFromToken() {
  const token = getToken();

  return token ? JSON.parse(atob(token.split('.')[1])).user : null;
}

function removeToken() {
  localStorage.removeItem('token');
}

function getToken() {
  let token = localStorage.getItem('token');

  if (token) {
    // Check if expired, remove if it is
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp < Date.now() / 1000) {
      // token is expired
      localStorage.removeItem('token');
      token = null;
    }
  }
  return token;
}

function setToken(token) {
  // token is a string
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

// eslint-disable-next-line
export default {
  setToken,
  getToken,
  removeToken,
  getUserFromToken,
};