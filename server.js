
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

const notes = require('./Develop/db/db.json');

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/Develop/public/notes.html'))
})

app.get('', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop/public/index.html'))
})

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();

    if (!validateNote(req.body)) {
        res.status(400).send('the note is not properly formatted');
    } else {
    const note = createNewNote(req.body, notes);
    res.json(note);
    }
})

app.listen(3001, () => {
    console.log(`Note Taker server now on port 3001`);
})

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, './Develop/db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    
    return note;
};

function validateNote(note) {
    if (!note.title || typeof note.title !== 'string') {
        return false;
    }
    if (!note.text || typeof note.text !== 'string') {
        return false;
    }
    return true;
}