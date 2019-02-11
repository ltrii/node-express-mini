const express = require('express');
const db = require('./data/db.js');

const server = express(); 

server.use(express.json());

server.get('/api/users', (req, res) => {
  db.users
    .find()
    .then(users => {
      res.status(200).json({ success: true, users });
    })
    .catch(err => {
      res.status(err.code).json({ success: false, message: err.message });
    });
});

server.post('/api/users', (req, res) => {
  const user = req.body;

  db.users
    .add(user)
    .then(user => {
      res.status(201).json({ success: true, user });
    })
    .catch(({ code, message }) => {
      res.status(code).json({ success: false, message });
    });
});

// server.delete('/hubs/:id', (req, res) => {
//   const hubId = req.params.id;
//   // for a route defined as /hubs/:id/messages/:messageId
//   // making a request to /hubs/123/messages/234
//   // will make req.params be: { id: 123 , messageId: 234}
//   db.hubs
//     .remove(hubId)
//     .then(deleted => {
//       res.status(204).end();
//     })
//     .catch(({ code, message }) => {
//       res.status(code).json({ success: false, message });
//     });
// });

// server.put('/hubs/:id', (req, res) => {
//   const { id } = req.params;
//   const changes = req.body;

//   db.hubs
//     .update(id, changes)
//     .then(updated => {
//       if (updated) {
//         res.status(200).json({ success: true, updated });
//       } else {
//         res.status(404).json({
//           success: false,
//           message: 'I cannot find the hub you are looking for',
//         });
//       }
//     })
//     .catch(({ code, message }) => {
//       res.status(code).json({ success: false, message });
//     });
// });

server.listen(5220, () => {
  console.log('\n*** Running on port 5220 ***\n');
});