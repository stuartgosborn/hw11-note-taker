const notes = require('express').Router();
const fs = require('fs');

// Helper function to generate unique ids
const uuid = require('../helpers/uuid');

const { readFromFile, readAndAppend } = require('../helpers/fsUtils');

notes.get('/', (req, res)=> {
    console.log(`${req.method} request received to retrieve notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
})

// GET route that returns any specific term
notes.get('/:id', (req, res) => {
    // Coerce the specific search id to lowercase
    const requestedid = req.params.id.toLowerCase();
  
    // Iterate through the notes name to check if it matches `req.params.id`
    for (let i = 0; i < idData.length; i++) {
      if (requestedid === idData[i].id.toLowerCase()) {
        return res.json(idData[i]);
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

  notes.delete('/:id', (req, res) => {
    // Extract 'id' parameter from request URL
    const id = req.params.id;
  
    // Read existing notes from db.json file
    readFromFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading db.json file:', err);
        return res.status(500).send('Error reading data');
      }
  
      // Parse existing notes from JSON
      let notes = JSON.parse(data);
  
      // Find index of note with matching 'id'
      const index = notes.findIndex(note => note.id === id);
  
      // If note with 'id' found, remove it
      if (index !== -1) {
        notes.splice(index, 1); // Remove note from array
        // Write updated notes back to db.json file
        fs.writeFile('./db/db.json', JSON.stringify(notes), err => {
          if (err) {
            console.error('Error writing to db.json file:', err);
            return res.status(500).send('Error writing data');
          }
          // Send success response
          res.status(200).send('Note deleted successfully');
        });
      } else {
        // If note with 'id' not found, send 404 Not Found response
        res.status(404).send('Note not found');
      }
    });
  });


module.exports = notes;