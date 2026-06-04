import Anthropic from '@anthropic-ai/sdk';
import { OPPONENTS } from '$lib/system-prompt.js';
import { ANTHROPIC_API_KEY } from '$env/static/private';

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const MAX_INPUT_CHARS = 500;
const MAX_HISTORY = 10;

// In-memory rate limiter: 30 req / IP / hour
const rlMap = new Map();
const RL_MAX = 30;
const RL_WINDOW = 60 * 60 * 1000;

function checkRateLimit(ip) {
	const now = Date.now();
	const entry = rlMap.get(ip);
	if (!entry || now - entry.t > RL_WINDOW) {
		rlMap.set(ip, { count: 1, t: now });
		if (rlMap.size > 5000) {
			for (const [k, v] of rlMap) {
				if (now - v.t > RL_WINDOW) rlMap.delete(k);
			}
		}
		return false;
	}
	if (entry.count >= RL_MAX) return true;
	entry.count++;
	return false;
}

function getIP(request) {
	return (
		request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
		request.headers.get('x-real-ip') ||
		'unknown'
	);
}

export async function POST({ request }) {
	const ip = getIP(request);
	if (checkRateLimit(ip)) {
		return new Response('Zu viele Anfragen. Bitte warte eine Stunde.', { status: 429 });
	}

	const body = await request.json().catch(() => null);
	if (!body?.messages || !Array.isArray(body.messages)) {
		return new Response('Invalid request', { status: 400 });
	}

	const opponent = OPPONENTS[body.opponent] ?? OPPONENTS.kevin;
	const weil = typeof body.weil === 'string' ? body.weil.slice(0, 200) : '';
	const systemPrompt = opponent.systemPrompt + (weil
		? `\n\nDEIN EINSTIEGSSATZ IN DIESEM GESPRÄCH: "Ich stimme Nein, weil ${weil}. Überzeug mich vom Gegenteil." — Du erinnerst dich daran. Wenn der andere darauf eingeht, frag nicht so zurück als ob du es nicht wüsstest. Greif es auf und stell die nächste logische Frage.`
		: '');
	const history = body.messages.slice(-MAX_HISTORY);
	const messages = history.map((m, i) => ({
		role: m.role === 'user' ? 'user' : 'assistant',
		content: String(m.content).slice(0, i === history.length - 1 && m.role === 'user' ? MAX_INPUT_CHARS : 2000)
	}));

	const firstUser = messages.findIndex((m) => m.role === 'user');
	if (firstUser === -1) return new Response('Invalid messages', { status: 400 });

	const stream = client.messages.stream({
		model: 'claude-sonnet-4-6',
		max_tokens: 512,
		system: systemPrompt,
		messages: messages.slice(firstUser)
	});

	const encoder = new TextEncoder();
	const readable = new ReadableStream({
		async start(controller) {
			try {
				for await (const chunk of stream) {
					if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
						controller.enqueue(encoder.encode(chunk.delta.text));
					}
				}
			} catch {
				controller.error(new Error('Stream error'));
			} finally {
				controller.close();
			}
		}
	});

	return new Response(readable, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'no-cache',
			'X-Content-Type-Options': 'nosniff'
		}
	});
}
