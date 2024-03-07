const notes = require('express').Router();

// Helper function to generate unique ids
const uuid = require('../helpers/uuid');

const { readFromFile, readAndAppend } = require('../helpers/fsUtils');

notes.get('/', (req, res)=> {
    console.log(`${req.method} request received to retrieve notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
})

// GET route that returns any specific term
notes.get('/api/notes/:note_Id', (req, res) => {
    // Coerce the specific search note_Id to lowercase
    const requestednote_Id = req.params.note_Id.toLowerCase();
  
    // Iterate through the notes name to check if it matches `req.params.note_Id`
    for (let i = 0; i < note_IdData.length; i++) {
      if (requestednote_Id === note_IdData[i].note_Id.toLowerCase()) {
        return res.json(note_IdData[i]);
      }
    }
  
    // Return a message if the term doesn't exist in our DB
    return res.json('No match found');
  });

// POST Route for submitting note
notes.post('/', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to save note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        id: uuid(),
      };
  
      readAndAppend(newNote, './db/db.json');
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      res.json(response);
    } else {
      res.json('Error in posting note');
    }
  });


module.exports = notes;