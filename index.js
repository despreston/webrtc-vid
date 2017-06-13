const app = require('http').createServer(handler);
const io  = require('socket.io')(app);
const fs  = require('fs');

app.listen(9001);

function handler (req, res) {
  fs.readFile(__dirname + '/static/index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', socket => {
  socket.on('icecandidate', candidate => {
    console.log(`Received ICE Candidate from ${socket.id}. Broadcasting to the crowd.`);
    socket.broadcast.emit('incoming_icecandidate', candidate);
  });

  socket.on('offer', offer => {
    console.log("Broadcasting offer");
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', answer => {
    console.log("Broadcasting answer");
    socket.broadcast.emit('answer', answer);
  });

  socket.on('hangup', () => {
    console.log("Broadcasting hangup");
    socket.broadcast.emit('hangup');
  });
});
