<script>
	import { OPPONENTS } from '$lib/system-prompt.js';
	import { onMount } from 'svelte';

	// Game state
	let selectedId = $state(null);
	let opponent = $derived(selectedId ? OPPONENTS[selectedId] : null);

	// Chat state
	let messages = $state([]);
	let input = $state('');
	let loading = $state(false);
	let chatContainer = $state(null);
	let inputBar = $state(null);

	function selectOpponent(id) {
		selectedId = id;
		messages = [{ role: 'assistant', content: OPPONENTS[id].intro }];
	}

	function back() {
		selectedId = null;
		messages = [];
		input = '';
	}

	// iOS: fixed input follows keyboard
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
	<title>Volksmund — Überzeug sie, wenn du kannst</title>
</svelte:head>

<!-- STICKY HEADER -->
<header class="sticky top-0 z-50 border-b border-swiss-border bg-swiss-dark/95 backdrop-blur-sm px-4 h-11 flex items-center justify-between">
	<div class="flex items-center gap-2">
		{#if selectedId}
			<button onclick={back} class="text-swiss-muted hover:text-swiss-warm text-xs font-mono mr-1 transition-colors">← zurück</button>
		{/if}
		<img src="/logo.png" alt="Volksmund" class="h-7 w-auto object-contain" />
		<span class="font-black text-base tracking-tight text-swiss-warm">Volks<span class="text-swiss-red">mund</span></span>
	</div>
	<div class="flex items-center gap-2">
		<span class="text-swiss-muted text-xs font-mono hidden sm:block">Keine Partei. Keine PR. Nur Fakten.</span>
		<span class="text-xs font-mono bg-swiss-red/10 border border-swiss-red/30 text-swiss-red px-2 py-0.5">
			{tage}d bis Abstimmung
		</span>
	</div>
</header>

{#if !selectedId}
	<!-- LANDING PAGE -->
	<div class="max-w-3xl mx-auto px-4 py-10 sm:py-16">

		<p class="text-xs font-mono text-swiss-red uppercase tracking-widest mb-5">Initiative · 14. Juni 2026</p>

		<h1 class="text-4xl sm:text-6xl lg:text-7xl font-black text-swiss-warm tracking-tight leading-none mb-5">
			Überzeug sie —<br><span class="text-swiss-red">wenn du kannst.</span>
		</h1>

		<p class="text-swiss-muted text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
			Die Initiative «Keine 10-Millionen-Schweiz» kommt am 14. Juni zur Abstimmung. Hier triffst du zwei, die dagegen sind. Sie werden nicht nachgeben.
		</p>

		<div class="grid sm:grid-cols-2 gap-4 mb-8">
			{#each Object.entries(OPPONENTS) as [id, opp]}
				<button
					onclick={() => selectOpponent(id)}
					class="text-left border border-swiss-border p-5 sm:p-6 hover:border-swiss-red hover:bg-swiss-red/5 active:bg-swiss-red/10 transition-all duration-150 group"
				>
					<p class="text-xs font-mono text-swiss-muted mb-4 uppercase tracking-widest">{opp.label}</p>
					<p class="text-xl font-black text-swiss-warm mb-0.5">{opp.name}, {opp.age}</p>
					<p class="text-xs font-mono text-swiss-muted mb-5">{opp.job}</p>
					<p class="text-swiss-warm/70 text-sm italic leading-relaxed mb-6">«{opp.quote}»</p>
					<span class="text-xs font-mono text-swiss-red group-hover:underline">Herausforderung annehmen →</span>
				</button>
			{/each}
		</div>

		<p class="text-swiss-muted/50 text-xs font-mono">Beide lassen sich nicht überzeugen. Das ist der Punkt.</p>
	</div>

{:else}
	<!-- CHAT PAGE -->
	<div class="max-w-3xl mx-auto px-4">
		<section
			class="flex flex-col pt-5 pb-28 sm:pb-12 sm:min-h-[calc(100dvh-2.75rem)] sm:justify-start sm:pt-6"
			style="min-height: calc(100svh - 2.75rem)"
		>
			<!-- OPPONENT INFO -->
			<div class="flex items-center gap-3 mb-6 pb-4 border-b border-swiss-border">
				<div>
					<div class="flex items-center gap-2 mb-0.5">
						<div class="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
						<p class="text-swiss-warm font-black text-base">{opponent.name}, {opponent.age}</p>
					</div>
					<p class="text-swiss-muted text-xs font-mono">{opponent.job}</p>
				</div>
			</div>

			<!-- CHAT MESSAGES -->
			<div bind:this={chatContainer} class="space-y-3 flex-1">
				{#each messages as msg, i}
					{#if msg.role === 'assistant'}
						{#if msg.content === '' && loading && i === messages.length - 1}
							<div class="flex gap-1.5 py-1">
								<div class="w-2 h-2 bg-swiss-muted rounded-full animate-bounce" style="animation-delay:0ms"></div>
								<div class="w-2 h-2 bg-swiss-muted rounded-full animate-bounce" style="animation-delay:150ms"></div>
								<div class="w-2 h-2 bg-swiss-muted rounded-full animate-bounce" style="animation-delay:300ms"></div>
							</div>
						{:else}
							<p class="text-swiss-warm text-sm sm:text-base leading-relaxed font-medium whitespace-pre-wrap">{msg.content}</p>
						{/if}
					{:else}
						<div class="flex justify-end">
							<div class="bg-swiss-red/10 border border-swiss-red/30 px-3 py-2 max-w-[85%]">
								<p class="text-swiss-warm text-sm sm:text-base">{msg.content}</p>
							</div>
						</div>
					{/if}
				{/each}
			</div>

			<!-- INPUT — Desktop -->
			<div class="hidden sm:block mt-6">
				<div class="flex border-2 border-swiss-red focus-within:border-white transition-colors duration-150">
					<textarea
						bind:value={input}
						onkeydown={handleKey}
						placeholder="Dein Argument…"
						rows="1"
						disabled={loading}
						class="flex-1 bg-transparent px-5 py-4 text-swiss-warm text-base placeholder:text-swiss-muted/40 resize-none focus:outline-none disabled:opacity-50"
						style="field-sizing: content; min-height: 52px; max-height: 120px;"
					></textarea>
					<button
						onclick={() => sendMessage()}
						disabled={loading || !input.trim()}
						class="bg-swiss-red text-white px-7 font-black text-lg hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 self-stretch flex items-center"
					>→</button>
				</div>
			</div>
		</section>
	</div>

	<!-- FIXED INPUT BAR — Mobile -->
	<div
		bind:this={inputBar}
		class="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-swiss-dark border-t border-swiss-border px-4 py-3"
		style="padding-bottom: max(12px, env(safe-area-inset-bottom))"
	>
		<div class="flex border-2 border-swiss-red focus-within:border-white transition-colors duration-150">
			<textarea
				bind:value={input}
				onkeydown={handleKey}
				placeholder="Dein Argument…"
				rows="1"
				disabled={loading}
				class="flex-1 bg-transparent px-4 py-3 text-swiss-warm text-base placeholder:text-swiss-muted/40 resize-none focus:outline-none disabled:opacity-50"
				style="field-sizing: content; min-height: 48px; max-height: 100px;"
			></textarea>
			<button
				onclick={() => sendMessage()}
				disabled={loading || !input.trim()}
				class="bg-swiss-red text-white px-5 font-black text-lg hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 self-stretch flex items-center"
			>→</button>
		</div>
	</div>
{/if}
