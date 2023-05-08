const express = require('express');
const path = require('path');
const notesData = require('./db/notes.json');
const fs = require("fs");
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Middleware
app.use(express.static('public'));

// GET request
app.get('/api/notes', function(req, res) {
    readFileAsync("./db/notes.json", "utf8").then(function(data) {
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    })
});

// POST request
app.post("/api/notes", function(req, res) {
    const note = req.body; // adds this note into the array of notes that existed
    readFileAsync("./db/notes.json", "utf8").then(function(data){
        const notes = [].concat(JSON.parse(data));
        note.id=notes.length +1
        notes.push(note);
        console.log(notes)
        return notes })
        .then(function(notes){
            writeFileAsync("./db/notes.json", JSON.stringify(notes))
            res.json(note);
        })
    });

// DELETE request
app.delete("/api/notes/:id", function(req, res){
    const idDelete = parseInt(req.params.id);
    readFileAsync("./db/notes.json", "utf8").then(function(data){
        const notes = [].concat(JSON.parse(data));
        const newNotesData = []
        // Push notes that we want to keep into new array newNotesData
        for (let i = 0; i<notes.length; i++) {
            if(idDelete !== notes[i].id){
                newNotesData.push(notes[i])
            }
        }
        return newNotesData
    }).then(function(notes){
        writeFileAsync("./db/notes.json", JSON.stringify(notes))
        res.send('sucessful save');
    })
})

// HTML Routes
app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname,
        "./public/notes.html"));
});
app.get("*", function(req, res){
    res.sendFile(path.join(__dirname,
        "./public/index.html"));
});
app.get("/", function(req, res){
    console.log('hello')
    res.sendFile(path.join(__dirname,
        "./public/index.html"));
});

// Setting the location of our port and using it in my app.listen function
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`app listening at http://localhost:${PORT}`);
});

// app.listen(process.env.PORT 3001);