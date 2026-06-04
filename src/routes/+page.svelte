<script>
	import { OPPONENTS } from '$lib/system-prompt.js';
	import { onMount } from 'svelte';

	let selectedId = $state(null);
	let opponent = $derived(selectedId ? OPPONENTS[selectedId] : null);

	let messages = $state([]);
	let input = $state('');
	let loading = $state(false);
	let chatContainer = $state(null);
	let inputBar = $state(null);

	function selectOpponent(id) {
		selectedId = id;
		messages = [{ role: 'assistant', content: OPPONENTS[id].intro }];
		setTimeout(() => chatContainer?.scrollTo({ top: 0 }), 50);
	}

	function back() {
		selectedId = null;
		messages = [];
		input = '';
	}

	onMount(() => {
		if (typeof window === 'undefined') return;
		const vv = window.visualViewport;
		if (!vv) return;
		const reposition = () => {
			if (!inputBar) return;
			const offset = window.innerHeight - vv.height - vv.offsetTop;
			inputBar.style.transform = `translateY(-${Math.max(0, offset)}px)`;
		};
		vv.addEventListener('resize', reposition);
		vv.addEventListener('scroll', reposition);
		return () => {
			vv.removeEventListener('resize', reposition);
			vv.removeEventListener('scroll', reposition);
		};
	});

	async function sendMessage(text) {
		const content = (text ?? input).trim();
		if (!content || loading) return;
		input = '';

		messages = [...messages, { role: 'user', content }];
		loading = true;
		messages = [...messages, { role: 'assistant', content: '' }];
		scrollChat();

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: messages.slice(0, -1), opponent: selectedId })
			});
			if (!res.ok) throw new Error();

			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let full = '';
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				full += decoder.decode(value, { stream: true });
				messages = [...messages.slice(0, -1), { role: 'assistant', content: full }];
				scrollChat();
			}
		} catch {
			messages = [...messages.slice(0, -1), { role: 'assistant', content: 'Verbindungsfehler. Bitte versuche es erneut.' }];
		} finally {
			loading = false;
			scrollChat();
		}
	}

	function scrollChat() {
		setTimeout(() => chatContainer?.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' }), 50);
	}

	function handleKey(e) {
		if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
	}

	const countdown = () => {
		const diff = new Date('2026-06-14') - new Date();
		return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
	};
	const tage = countdown();
</script>

<svelte:head>
	<title>linkeratte.ch — Überzeug sie, wenn du kannst</title>
</svelte:head>

<!-- HEADER -->
<header class="sticky top-0 z-50 border-b border-swiss-border bg-swiss-dark/95 backdrop-blur-sm px-4 h-11 flex items-center justify-between">
	<div class="flex items-center gap-2">
		{#if selectedId}
			<button onclick={back} class="text-swiss-muted hover:text-swiss-warm text-xs font-mono mr-1 transition-colors">← zurück</button>
		{/if}
		<img src="/logo-rat.png" alt="linkeratte.ch" class="h-7 w-auto object-contain rounded-full" />
		<span class="font-black text-base tracking-tight text-swiss-warm">linker<span class="text-swiss-red">atte</span>.ch</span>
	</div>
	<span class="text-xs font-mono bg-swiss-red/10 border border-swiss-red/30 text-swiss-red px-2 py-0.5">
		{tage}d bis Abstimmung
	</span>
</header>

{#if !selectedId}
	<!-- LANDING -->
	<div class="max-w-3xl mx-auto px-4 py-10 sm:py-14">

		<p class="text-xs font-mono text-swiss-red uppercase tracking-widest mb-4">Abstimmung · 14. Juni 2026</p>

		<h1 class="text-4xl sm:text-6xl lg:text-7xl font-black text-swiss-warm tracking-tight leading-none mb-4">
			Überzeug sie —<br><span class="text-swiss-red">wenn du kannst.</span>
		</h1>

		<p class="text-swiss-muted text-base leading-relaxed mb-10 max-w-lg">
			Zwei Vorlagen. Zwei Gegner. Wähl deinen — und versuch es.
		</p>

		<!-- CHARACTER SELECT -->
		<div class="grid sm:grid-cols-2 gap-5">
			{#each Object.entries(OPPONENTS) as [id, opp]}
				<button
					onclick={() => selectOpponent(id)}
					class="group text-left overflow-hidden border border-swiss-border hover:border-swiss-red transition-all duration-200"
				>
					<!-- Photo -->
					<div class="relative aspect-[4/3] overflow-hidden bg-swiss-card">
						<img
							src={opp.photo}
							alt={opp.name}
							class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-swiss-dark via-swiss-dark/20 to-transparent"></div>
						<!-- Name overlay -->
						<div class="absolute bottom-0 left-0 right-0 p-4">
							<p class="text-xl font-black text-white leading-none">{opp.name}, {opp.age}</p>
							<p class="text-xs font-mono text-white/60 mt-0.5">{opp.job}</p>
						</div>
					</div>
					<!-- Card footer -->
					<div class="px-4 py-3 flex items-center justify-between border-t border-swiss-border">
						<p class="text-xs font-mono text-swiss-red uppercase tracking-wide">{opp.initiative}</p>
						<span class="text-xs font-mono text-swiss-muted group-hover:text-swiss-red transition-colors">Antreten →</span>
					</div>
				</button>
			{/each}
		</div>

	</div>

{:else}
	<!-- CHAT -->
	<div class="max-w-2xl mx-auto flex flex-col" style="height: calc(100svh - 2.75rem)">

		<!-- Opponent header -->
		<div class="flex items-center gap-3 px-4 py-3 border-b border-swiss-border flex-shrink-0">
			<div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
				<img src={opponent.photo} alt={opponent.name} class="w-full h-full object-cover object-top" />
			</div>
			<div>
				<p class="text-swiss-warm font-black text-sm leading-none">{opponent.name}, {opponent.age}</p>
				<div class="flex items-center gap-1.5 mt-0.5">
					<div class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse-slow"></div>
					<p class="text-swiss-muted text-xs font-mono">{opponent.job}</p>
				</div>
			</div>
		</div>

		<!-- Messages -->
		<div bind:this={chatContainer} class="flex-1 overflow-y-auto px-4 py-4 space-y-3">
			{#each messages as msg, i}
				{#if msg.role === 'assistant'}
					<div class="flex items-end gap-2 max-w-[80%]">
						<div class="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mb-0.5">
							<img src={opponent.photo} alt={opponent.name} class="w-full h-full object-cover object-top" />
						</div>
						{#if msg.content === '' && loading && i === messages.length - 1}
							<div class="bg-zinc-800 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
								<div class="w-2 h-2 bg-swiss-muted rounded-full animate-bounce" style="animation-delay:0ms"></div>
								<div class="w-2 h-2 bg-swiss-muted rounded-full animate-bounce" style="animation-delay:150ms"></div>
								<div class="w-2 h-2 bg-swiss-muted rounded-full animate-bounce" style="animation-delay:300ms"></div>
							</div>
						{:else}
							<div class="bg-zinc-800 rounded-2xl rounded-bl-sm px-4 py-3">
								<p class="text-white text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
							</div>
						{/if}
					</div>
				{:else}
					<div class="flex justify-end">
						<div class="bg-swiss-red rounded-2xl rounded-br-sm px-4 py-3 max-w-[80%]">
							<p class="text-white text-sm leading-relaxed">{msg.content}</p>
						</div>
					</div>
				{/if}
			{/each}
		</div>

		<!-- Input — Desktop -->
		<div class="hidden sm:block flex-shrink-0 px-4 py-3 border-t border-swiss-border">
			<div class="flex items-end gap-2">
				<div class="flex-1 bg-zinc-800 rounded-3xl px-4 py-3 focus-within:ring-1 focus-within:ring-swiss-red transition-all">
					<textarea
						bind:value={input}
						onkeydown={handleKey}
						placeholder="Dein Argument…"
						rows="1"
						disabled={loading}
						class="w-full bg-transparent text-white text-sm placeholder:text-zinc-500 resize-none focus:outline-none disabled:opacity-50"
						style="field-sizing: content; max-height: 100px;"
					></textarea>
				</div>
				<button
					onclick={() => sendMessage()}
					disabled={loading || !input.trim()}
					class="w-11 h-11 rounded-full bg-swiss-red text-white flex items-center justify-center hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 text-lg font-black"
				>→</button>
			</div>
		</div>
	</div>

	<!-- FIXED INPUT — Mobile -->
	<div
		bind:this={inputBar}
		class="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-swiss-dark border-t border-swiss-border px-4 py-3"
		style="padding-bottom: max(12px, env(safe-area-inset-bottom))"
	>
		<div class="flex items-end gap-2">
			<div class="flex-1 bg-zinc-800 rounded-3xl px-4 py-3 focus-within:ring-1 focus-within:ring-swiss-red transition-all">
				<textarea
					bind:value={input}
					onkeydown={handleKey}
					placeholder="Dein Argument…"
					rows="1"
					disabled={loading}
					class="w-full bg-transparent text-white text-sm placeholder:text-zinc-500 resize-none focus:outline-none disabled:opacity-50"
					style="field-sizing: content; max-height: 100px;"
				></textarea>
			</div>
			<button
				onclick={() => sendMessage()}
				disabled={loading || !input.trim()}
				class="w-11 h-11 rounded-full bg-swiss-red text-white flex items-center justify-center hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 text-lg font-black"
			>→</button>
		</div>
	</div>
{/if}
