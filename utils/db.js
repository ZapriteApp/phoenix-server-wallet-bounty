import { JSONFilePreset } from 'lowdb/node'
const db = await JSONFilePreset('db.json', { contacts: [] })
await db.read();
db.data ||= { contacts: [] };

export default db