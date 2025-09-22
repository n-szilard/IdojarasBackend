const express = require('express');
const router = express.Router();
const {users, saveUsers, isEmailExists, getNextUserID} = require('../utils/store')

// GET all users
router.get('/', (req, res) => {
    res.send(users)
});

// POST new user
router.post('/', (req, res) => {
    let data = req.body;
    if (isEmailExists(data.email)) {
        return res.status(400).send({msg: 'Ez az email cím már regisztálva!'});
    }
    users.push(data);
    data.id = getNextUserID();
    saveUsers();
    res.status(200).send({msg: 'Felhasználó regisztrálva'});
});

// GET user by id
router.get('/:id', (req, res) => {
    let id = req.params.id;
    let idx = users.findIndex(user => user.id == id);
    if (idx > -1) {
        return res.status(200).send(users[idx]);
    }
    return res.status(400).send({msg: "Nincs ilyen azonosítójú felhasználó!"})
});

// POST user check login
router.post('/login', (req, res) => {
    let { email, password } = req.body;
    let loggedUser = {};
    users.forEach(user => {
        if (user.email == email && user.password == password) {
            loggedUser = user;
            return;
        }
    });
    res.send(loggedUser);
});

// UPDATE user email and name
router.patch('/profile', (req, res) => {
    let { id, email, name} = req.body;
    let idx = users.findIndex(user => user.id == id);
    if (idx === -1) {
        return res.status(400).send({msg: "Nincs ilyen azonosítójú felhasználó!"});
    }

    if (email !== users[idx].email) {
        if (isEmailExists(email)) {
            return res.status(400).send({msg: 'Ez az email már regisztrálva van.'});
        }
        users[idx].email = email;
    }

    if (name) {
        users[idx].name = name;
    }

    saveUsers();
    res.status(200).send({msg: 'A felhasználó módosítva'});
});

module.exports = router;