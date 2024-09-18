import { JSONFilePreset } from 'lowdb/node'
const db = await JSONFilePreset('db.json', { contacts: [], password: [] })
await db.read();
db.data ||= { contacts: [] };
db.data ||= { password: [] };

db.data.password ||= []
db.data.contacts ||= []

export default db