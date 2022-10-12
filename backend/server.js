//Appel de la variable du fichier .env
require('dotenv').config();

const http = require('http');
const app = require('./app');

//fonction normalize qui renvoi un port valide 
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const PORT = normalizePort(`${process.env.PORT}`);
app.set('port', PORT);

//gestion des erreurs 
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + PORT;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};


const server = http.createServer(app);
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + PORT;
  console.log('Listening on ' + bind);
});

//ecouter le server 
server.listen(PORT, () => { console.log(`Server is listening on port: ${PORT}`); });
