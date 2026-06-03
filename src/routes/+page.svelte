<script>
	import { vorlagen, urteilConfig } from '$lib/fakten.js';
	import { onMount } from 'svelte';

	let heroSection = $state(null);

	onMount(() => {
		const setHeight = () => {
			if (heroSection) heroSection.style.height = window.innerHeight - 44 + 'px';
		};
		setHeight();
		window.addEventListener('resize', setHeight);
		return () => window.removeEventListener('resize', setHeight);
	});

	// Chat state
	let messages = $state([
		{
			role: 'assistant',
			content: 'Ich bin die Schweiz. Sag mir, was dich wirklich beschäftigt. Zu viele Zuwanderer? Die Rente? Was mit der EU passiert? Ich urteile nicht — ich frage nach.'
		}
	]);
	let input = $state('');
	let loading = $state(false);
	let chatContainer = $state(null);

	const countdown = () => {
		const diff = new Date('2026-06-14') - new Date();
		return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
	};
	const tage = countdown();

	const suggestions = [
		'Zu viele Ausländer kommen.',
		'Meine AHV ist in Gefahr.',
		'Die Initiative schützt die Schweiz.',
		'Ich traue dem Bundesrat nicht.',
		'Was verlieren wir mit den Bilateralen?'
	];

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
				body: JSON.stringify({ messages: messages.slice(0, -1) })
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
</script>

<svelte:head>
	<title>Volksmund — Die Schweiz spricht Klartext</title>
</svelte:head>

<!-- STICKY HEADER -->
<header class="sticky top-0 z-50 border-b border-swiss-border bg-swiss-dark/95 backdrop-blur-sm px-4 h-11 flex items-center justify-between">
	<div class="flex items-center gap-2">
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

<!-- PAGE -->
<div class="max-w-6xl mx-auto px-4">

	<!-- HERO + CHAT -->
	<section bind:this={heroSection} class="flex flex-col justify-start pt-5 pb-6 sm:min-h-[calc(100dvh-2.75rem)] sm:justify-center sm:pt-6 sm:pb-12 border-b border-swiss-border">

		<!-- INITIATIVEN LABELS -->
		<div class="flex flex-wrap gap-2 mb-4">
			<span class="text-xs font-mono border border-swiss-border text-swiss-muted px-2 py-1 whitespace-nowrap">«Keine 10-Mio-Schweiz»</span>
			<span class="text-xs font-mono border border-swiss-border text-swiss-muted px-2 py-1 whitespace-nowrap">Zivildienstgesetz</span>
			<span class="text-xs font-mono text-swiss-red px-2 py-1 border border-swiss-red/30 whitespace-nowrap">14. Juni 2026</span>
		</div>

		<!-- HERO -->
		<h1 class="text-3xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tight text-swiss-warm mb-4 sm:mb-6">
			Was stört dich <span class="text-swiss-red">wirklich?</span>
		</h1>

		<!-- DIE SCHWEIZ + CHAT -->
		<div class="mb-4 w-full">
			<div class="flex items-center gap-2 mb-3">
				<div class="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
				<p class="text-swiss-muted text-xs font-mono">Die Schweiz · gerade online</p>
			</div>
			<div class="flex-1 min-w-0">
				<div bind:this={chatContainer} class="space-y-3">
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
		</div>

		<!-- SCHNELLEINSTIEG -->
		{#if messages.length === 1 && !loading}
			<div class="mb-4 flex flex-col gap-2 sm:flex-row sm:overflow-x-auto sm:no-scrollbar sm:pb-1">
				{#each suggestions as s}
					<button
						onclick={() => sendMessage(s)}
						class="text-xs sm:text-sm text-swiss-warm border border-swiss-border px-3 py-2.5 sm:px-4 sm:py-2.5 hover:border-swiss-red hover:bg-swiss-red/10 active:bg-swiss-red/20 transition-all duration-150 font-medium text-left sm:whitespace-nowrap sm:flex-shrink-0"
					>«{s}»</button>
				{/each}
			</div>
		{/if}

		<div class="flex-1"></div>

		<!-- INPUT -->
		<div class="w-full">
			<p class="text-swiss-muted text-xs mb-2 font-mono hidden sm:block">↓ Deine Meinung — tippe und drück Enter</p>
			<div class="flex border-2 border-swiss-red focus-within:border-white transition-colors duration-150">
				<textarea
					bind:value={input}
					onkeydown={handleKey}
					placeholder="Schreib was du denkst…"
					rows="1"
					disabled={loading}
					class="flex-1 bg-transparent px-4 py-3 sm:px-5 sm:py-4 text-swiss-warm text-base placeholder:text-swiss-muted/40 resize-none focus:outline-none disabled:opacity-50"
					style="field-sizing: content; min-height: 52px; max-height: 120px;"
				></textarea>
				<button
					onclick={() => sendMessage()}
					disabled={loading || !input.trim()}
					class="bg-swiss-red text-white px-5 sm:px-7 font-black text-lg hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 self-stretch flex items-center"
				>→</button>
			</div>
		</div>
	</section>

	<!-- FAKTEN — EINGEKLAPPT -->
	<details class="group border-t border-swiss-border">
		<summary class="flex items-center justify-between cursor-pointer py-5 select-none list-none">
			<div>
				<p class="text-swiss-red font-mono text-xs uppercase tracking-widest mb-0.5">Faktencheck · 14. Juni 2026</p>
				<p class="text-swiss-warm font-black text-lg">Was behauptet wird — was wirklich stimmt</p>
			</div>
			<span class="text-swiss-muted text-xl font-light transition-transform duration-200 group-open:rotate-45 flex-shrink-0 ml-4">+</span>
		</summary>

		<div class="pb-10">
			{#each vorlagen as vorlage}
				<section id={vorlage.id} class="py-10 border-t border-swiss-border">

					<!-- VORLAGE HEADER -->
					<div class="flex flex-wrap items-start gap-4 mb-6">
						<div class="flex-1 min-w-0">
							<div class="flex flex-wrap gap-2 mb-2">
								<span class="text-xs font-mono text-swiss-muted border border-swiss-border px-2 py-0.5">{vorlage.typ}</span>
								<span class="text-xs font-mono px-2 py-0.5 border
									{vorlage.bundesrat === 'JA' ? 'bg-green-950 text-green-400 border-green-800' : 'bg-red-950 text-red-400 border-red-800'}">
									Bundesrat: {vorlage.bundesrat}
								</span>
							</div>
							<h2 class="text-xl sm:text-2xl font-black text-swiss-warm">{vorlage.titel}</h2>
						</div>
						<p class="text-swiss-muted text-sm leading-relaxed max-w-md">{vorlage.zusammenfassung}</p>
					</div>

					<!-- COLUMN LABELS -->
					<div class="grid grid-cols-2 gap-3 mb-3">
						<div class="flex items-center gap-2">
							<div class="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
							<span class="text-xs font-mono text-swiss-muted uppercase tracking-widest">Was behauptet wird</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
							<span class="text-xs font-mono text-swiss-muted uppercase tracking-widest">Was wirklich stimmt</span>
						</div>
					</div>

					<!-- VERGLEICH ROWS -->
					<div class="space-y-2">
						{#each vorlage.vergleiche as v}
							<div class="grid grid-cols-2 gap-0 overflow-hidden border border-swiss-border">
								<div class="bg-red-950/20 border-r border-swiss-border p-3 sm:p-4">
									<p class="text-swiss-warm/90 text-sm leading-relaxed italic">{v.claim}</p>
								</div>
								<div class="bg-swiss-card p-3 sm:p-4">
									<div class="flex items-start gap-2 mb-2">
										<span class="text-xs font-mono border px-1.5 py-0.5 flex-shrink-0 {urteilConfig[v.urteil].class}">{urteilConfig[v.urteil].label}</span>
										{#if v.zahl}
											<span class="text-xs font-mono text-swiss-red font-bold">{v.zahl}</span>
										{/if}
									</div>
									<p class="text-swiss-warm text-sm leading-relaxed">{v.fakt}</p>
									<p class="text-swiss-muted text-xs mt-2 font-mono">Quelle: {v.quelle}</p>
								</div>
							</div>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	</details>

	<!-- FOOTER -->
	<footer class="border-t border-swiss-border py-8 text-center">
		<p class="text-swiss-muted text-xs font-mono">Volksmund · Keine Partei · Keine PR · Nur Fakten · 14. Juni 2026</p>
		<p class="text-swiss-border text-xs mt-1">Quellen: BFS, EJPD, SRF Faktencheck, Studie SEM 2026, SECO, BSV</p>
	</footer>

</div>
