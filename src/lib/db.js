import pg from 'pg';

const { Pool } = pg;

let pool = null;
let ready = false;

function getPool() {
	if (!pool) {
		const url = process.env.DATABASE_URL;
		if (!url) return null;
		pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
	}
	return pool;
}

async function init(p) {
	if (ready) return;
	await p.query(`
		CREATE TABLE IF NOT EXISTS conversations (
			id SERIAL PRIMARY KEY,
			session_id TEXT NOT NULL,
			opponent TEXT NOT NULL,
			weil_statement TEXT,
			messages JSONB NOT NULL DEFAULT '[]',
			message_count INTEGER DEFAULT 0,
			created_at TIMESTAMPTZ DEFAULT NOW(),
			updated_at TIMESTAMPTZ DEFAULT NOW()
		);
		CREATE UNIQUE INDEX IF NOT EXISTS conv_session_idx ON conversations(session_id);
	`);
	ready = true;
}

export async function saveConversation({ sessionId, opponent, weil, messages }) {
	const p = getPool();
	if (!p) return;
	try {
		await init(p);
		const userCount = messages.filter((m) => m.role === 'user').length;
		await p.query(
			`INSERT INTO conversations (session_id, opponent, weil_statement, messages, message_count, updated_at)
			 VALUES ($1, $2, $3, $4, $5, NOW())
			 ON CONFLICT (session_id) DO UPDATE SET
			   messages = $4, message_count = $5, updated_at = NOW()`,
			[sessionId, opponent, weil, JSON.stringify(messages), userCount]
		);
	} catch {
		// DB errors sollten nie die App brechen
	}
}
