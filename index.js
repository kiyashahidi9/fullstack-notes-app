const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET a POST are the most important methods of HTTP protocol",
    important: true
  }
];

function generateID() {
  if (notes.length === 0) return 1;
  let maxId = Math.max(...notes.map(n => Number(n.id)));

  return String(maxId + 1)
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  notes = notes.filter(note => note.id !== id);

  response.status(204).end();
})

app.post('/api/notes', (request, response) => {
  const body = request.body;
  
  if (!body.content) {
    return response.status(400).json({
      error: "content missing :(",
    })
  }

  let note = {
    id: generateID(),
    content: body.content,
    important: body.important || false,
  }

  notes = notes.concat(note);

  response.json(note);
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})