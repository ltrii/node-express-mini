const express = require('express');
const db = require('./data/db');

const server = express(); 

server.use(express.json());

server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({error: "The users information could not be retrieved."});
        });
});

server.post('/api/users', (req, res) => {
    let user = req.body;
    if(!user.name || !user.bio) {
        res.status(400).json({error: "Please provide name and bio for the user."});
        return;
    }
    db.insert(user)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json({error: "There was an error while saving the user to the database"});
        });
});

server.get('/api/users/:id', (req, res) => {
    db.findById(req.params.id)
        .then(user => {
            if(!user) {
                res.status(404).json({message: "The user with the specified ID does not exist."});
            } else {
                res.status(200).json(user);
            }
        })
        .catch(err => {
            res.status(500).json({error: "The user information could not be retrieved."});
        });
});

server.delete('/api/users/:id', (req, res) => {
    db.remove(req.params.id)   
        .then(user => {
            if(!user) {
                res.status(404).json({error: "The user with the specified ID does not exist."});
            } else {
                res.end();
            }
        })
        .catch(err => {
            res.status(500).json({error: "The user could not be removed"});
        })
});

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  if(!changes.name || !changes.bio) {
    res.status(400).json({error: "Please provide name and bio for the user."});
    return;
  }

  db
    .update(id, changes)
    .then(user => {
        if(!user) {
            res.status(404).json({message: "The user with the specified ID does not exist."});
        } else {
            db.findById(id)
                .then(updated => res.status(200).json(updated))
                .catch(err => res.status(404).json({error: "User not found after updating."}))
            ;
        }
    })
    .catch(err => {
        res.status(500).json({error: "The user information could not be modified."});
    })
});

server.listen(5220, () => {
  console.log('\n*** Running on port 5220 ***\n');
});