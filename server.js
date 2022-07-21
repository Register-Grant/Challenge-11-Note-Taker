const express = require('express');
const path = require('path');
const db = require('./db/db.json');

const PORT = process.env.PORT || 3001
const app = express();

//app.use = middleware - this is for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('/publc'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    res.json(db.slice(1))
});

const createNote = (body, notesArray) => {
    const newNote = body;
    if(!Array.isArray(notesArray)) {
        notesArray = [];
    }
    if(notesArray.length === 0) {
        notesArray.push(0)
    }
    body.id = notesArray.length;
    notesArray[0]++;
    notesArray.push(newNote);

    fs.writeFileSync(
        path.join(__dirname, '../../../db/db.json'),
        JSON.stringify(notesArray, null, 2)
    )
    return newNote;
}

const deleteNote = (id, notesArray) => {
    for(var i = 0; i < notesArray.length; i++) {
      let note = notesArray[i];
      if(note.id == id) {
        notesArray.splice(i, 1);
        fs.writeFileSync(
          path.join(__dirname, '../../../db/db.json'),
          JSON.stringify(notesArray, null, 2)
        );
        break;
      }
    }
  };

  app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, db);
    res.json(true);
  }) 