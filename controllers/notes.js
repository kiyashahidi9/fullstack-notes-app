const jwt = require('jsonwebtoken')
const notesRouter = require('express').Router();
const Note = require('../models/note')
const User = require('../models/user')

// HELPER FUNCTIONS
function getTokenFrom(request) {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

// GET ALL NOTES
notesRouter.get('/', async (request, response) => {
  let notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

// GET SPECIFIC NOTE
notesRouter.get('/:id', async (request, response, next) => {
  let note = await Note.findById(request.params.id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// DELETE NOTE
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// POST A NOTE
notesRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) return response.status(400).json({ error: 'userId missing or not valid'})

  
  let note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id
  })

  let savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})

// UPDATE NOTE
notesRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findById(request.params.id)
    .then(note => {
      if (!note) return response.status(404).end()

      note.content = content
      note.important = important

      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})

module.exports = notesRouter