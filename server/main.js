const WebSocketServer = require('ws').Server;
const Session = require('./Session');
const Client = require('./Client');

const server = new WebSocketServer({port: 9000});

const sessions = new Map();

function createId(len = 6, chars = 'abcdefghjkmnopqrstvwxyz0123456789') {
    let id = '';
    while (len--) {
        id += chars[Math.random() * chars.length | 0];
    }
    return id;
}

function createSession(id = createId()) {
    if (sessions.has(id)) {
        throw new Error('Session ' + id + ' already exists');
    }
    const session = new Session(id);
    console.log(session);

    sessions.set(id, session);
    return session;
}

function getSession(id) {
    return sessions.get(id);
}

function broadcastSession(session) {
    const clients = [...session.clients];
    clients.forEach(client => {
        client.send({
            type: 'session-broadcast',
            peers: {
                you: client.id,
                clients: clients.map(client => client.id)
            }
        });
    })
}

function createClient(conn, id = createId()) {
    return new Client(conn, id);
}


server.on('connection', conn => {
    console.log('Connection opened');

    const client = createClient(conn);

    conn.on('message', msg => {
        console.log('Got message:' + msg);
        const data = JSON.parse(msg);

        switch (data.type) {
            case 'create-session': {
                const session = createSession();
                session.join(client);

                client.send({type: 'session-created', id: session.id});
            }
                break;
            case 'join-session': {
                const session = getSession(data.id) || createSession(data.id);
                session.join(client);
                broadcastSession(session);
            }
                break;
        }
        console.log('Sessions', sessions);
    });

    conn.on('close', () => {
        console.log('Connection closed');

        const session = client.session;
        if (session) {
            session.leave(client);
            if (session.clients.size === 0) {
                sessions.delete(session.id);
            }
        }

        broadcastSession(session);
    });
});
