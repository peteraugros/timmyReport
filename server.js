//requireds
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 8080;
const mainDir = path.join(__dirname, "/public");

//middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//BEGIN GET SECTION 

//sending notes html
app.get("/notes", function(req, res) {
    res.sendFile(path.join(mainDir, "notes.html"));
});

//sending db.json
app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

//sending notes id for deletion purposes
app.get("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

//send index.html
app.get("*", function(req, res) {
    res.sendFile(path.join(mainDir, "index.html"));
});
//END GET SECTION

//BEGIN POST SECTION

//posting saved and new notes
app.post("/api/notes", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body;
    let uniqueID = (savedNotes.length).toString();
    newNote.id = uniqueID;
    savedNotes.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    console.log("Note saved to db.json. Content: ", newNote);
    res.json(savedNotes);
})

//deleting route
app.delete("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })
    
    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})
//END POST SECTION

//port listening
app.listen(PORT, function() {
    console.log(`Now listening to port ${PORT}. Cuisinart!`);
})