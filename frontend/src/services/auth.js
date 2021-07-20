export const TOKEN_KEY = 'token';
export const COOKIE_KEY = 'name';
export const USERNAME_KEY = 'username'
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const login = token => {
    localStorage.setItem(TOKEN_KEY, token);
};
export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
};
export const loginName = name => {
    localStorage.setItem(USERNAME_KEY, name);
}
export const getName = () => localStorage.getItem(USERNAME_KEY);

