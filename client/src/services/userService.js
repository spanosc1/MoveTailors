import tokenService from './tokenService';

const BASE_URL = '/api/users/';

function login(creds) {
    return fetch(BASE_URL + 'login', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(creds)
    })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('Bad Credentials!');
        })
        .then(({ token }) => tokenService.setToken(token));
}

function signup(user) {
    return fetch(BASE_URL + 'signup', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(user)
    })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('Email already taken!');
        })
        .then(({ token }) => tokenService.setToken(token));
}

function getUser() {
    return tokenService.getUserFromToken();
}

function logout() {
    tokenService.removeToken();
}

function sendResetLink(email) {
    return fetch(BASE_URL + 'reset-link', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ "email": email })
    })
        .then(res => {
            return res.json();
        })
}

function resetNewPassword(password, token) {
    return fetch(BASE_URL + 'reset-link/update-password', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ "token": token, "password": password })
    })
        .then(res => {
            return res.json();
        })
}

// eslint-disable-next-line
export default {
    signup,
    getUser,
    logout,
    login,
    sendResetLink,
    resetNewPassword
};