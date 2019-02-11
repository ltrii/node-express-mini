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
  const userId = req.params.id;

  db
    .remove(userId)
    .then(deleted => {
      res.status(204).end();
    })
    .catch(({ code, message }) => {
      res.status(code).json({ success: false, message });
    });
});

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db
    .update(id, changes)
    .then(updated => {
      if (updated) {
        res.status(200).json({ success: true, updated });
      } else {
        res.status(404).json({
          success: false,
          message: 'I cannot find the user you are looking for',
        });
      }
    })
    .catch(({ code, message }) => {
      res.status(code).json({ success: false, message });
    });
});

server.listen(5220, () => {
  console.log('\n*** Running on port 5220 ***\n');
});