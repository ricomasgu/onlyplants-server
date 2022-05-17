const app = require('./app');
const server = require('./config/socketio.config')(app);

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 5005;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
