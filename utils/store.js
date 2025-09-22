const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '..', 'adatok', 'users.json');

let users = [];

function loadUsers() {
    if (fs.existsSync(USERS_FILE)) {
        const raw = fs.readFileSync(USERS_FILE);
        try {
            users = JSON.parse(raw);
        } catch (error) {
            console.log('Hiba az adatok beolvasása során', error);
            users = [];
        }
    } else {
        saveUsers();
    }
}

function saveUsers() {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users));
}

function initStore() {
    loadUsers();
    saveUsers();
}

function isEmailExists(email) {
    let exists = false;
    users.forEach(user => {
        if (user.email == email) {
            exists = true;
            return exists;
        }
    });
    return exists;
}

function getNextUserID() {
    const maxId = users.reduce((max, u) => {
        const id = Number(u?.id);
        return Number.isFinite(id) && id > max ? id : max;
    }, 0);
    return maxId + 1;
}

initStore();

module.exports = {
    getNextUserID,
    initStore,
    saveUsers,
    users,
    isEmailExists
}