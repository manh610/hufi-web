import Cookies from 'universal-cookie';

const keyStorageUser = 'userStorageCookies';
const cookies = new Cookies();

export const userService = {
    get() {
        return cookies.get(keyStorageUser);
    },
    set(user) {
        cookies.set(keyStorageUser, user, { path: '/' })
    },
    logout() {
        cookies.remove(keyStorageUser, { path: '/' })
    }
}