const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://kiyashahidi9:${encodeURIComponent(password)}@cluster0.tj2em4c.mongodb.net/noteApp?appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

Note.find({important: true}).then(result => {
  result.forEach(note => {
    console.log(note);
  })
  mongoose.connection.close();
})
