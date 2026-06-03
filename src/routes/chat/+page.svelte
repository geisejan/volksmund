<script>
	let messages = $state([
		{
			role: 'assistant',
			content:
				'Grüezi. Ich bin die Schweiz — nicht das Amt, nicht die Partei, sondern das Land selbst.\n\nAm 14. Juni stimmst du über zwei Sachen ab. Was beschäftigt dich?'
		}
	]);

	let input = $state('');
	let loading = $state(false);
	let messagesEnd = $state(null);

	const suggestions = [
		'Zu viele Ausländer kommen in die Schweiz.',
		'Die 10-Mio-Initiative ist doch richtig.',
		'Was passiert mit den Bilateralen?',
		'Ich mache mir Sorgen um meine AHV.',
		'Was ist der Zivildienst überhaupt?'
	];

	async function sendMessage() {
		const trimmed = input.trim();
		if (!trimmed || loading) return;

		input = '';
		messages = [...messages, { role: 'user', content: trimmed }];
		loading = true;

		// Placeholder for streaming
		messages = [...messages, { role: 'assistant', content: '' }];

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					messages: messages.slice(0, -1) // alle ausser leere placeholder
				})
			});

			if (!res.ok) throw new Error('API Fehler');

			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let fullText = '';

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				fullText += decoder.decode(value, { stream: true });
				messages = [
					...messages.slice(0, -1),
					{ role: 'assistant', content: fullText }
				];
				scrollToBottom();
			}
		} catch (e) {
			messages = [
				...messages.slice(0, -1),
				{ role: 'assistant', content: 'Sorry, da isch öppis schiefgloffe. Probier nochmal.' }
			];
		} finally {
			loading = false;
			scrollToBottom();
		}
	}

	function scrollToBottom() {
		setTimeout(() => messagesEnd?.scrollIntoView({ behavior: 'smooth' }), 50);
	}

	function handleKeydown(e) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}

	function useSuggestion(s) {
		input = s;
		sendMessage();
	}

	function formatMessage(text) {
		return text.replace(/\n/g, '<br/>');
	}
</script>

<svelte:head>
	<title>Rede mit der Schweiz — Volksmund</title>
</svelte:head>

<div class="flex flex-col h-[calc(100vh-3.5rem)]">

	<!-- CHAT HEADER -->
	<div class="border-b border-swiss-border px-4 py-3 flex items-center gap-3 bg-swiss-dark">
		<div class="w-10 h-10">
				<img src="/logo.png" alt="Volksmund" class="w-full h-full object-contain" />
			</div>
		<div>
			<p class="text-swiss-warm font-semibold text-sm">Die Schweiz</p>
			<p class="text-swiss-muted text-xs">Antirassistisch · Faktenbasiert · Direkt</p>
		</div>
		<div class="ml-auto flex items-center gap-1.5">
			<div class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow"></div>
			<span class="text-xs text-swiss-muted">Online</span>
		</div>
	</div>

	<!-- MESSAGES -->
	<div class="flex-1 overflow-y-auto px-4 py-6 space-y-4">

		{#each messages as msg, i}
			<div class="flex {msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in">
				{#if msg.role === 'assistant'}
					<div class="flex items-start gap-2 max-w-[80%]">
						<div class="w-9 h-9 flex-shrink-0 mt-0.5">
								<img src="/logo.png" alt="Volksmund" class="w-full h-full object-contain" />
							</div>
						<div class="bg-swiss-card border border-swiss-border rounded-sm px-4 py-3">
							{#if msg.content === '' && loading && i === messages.length - 1}
								<div class="flex gap-1 py-1">
									<div class="w-1.5 h-1.5 bg-swiss-muted rounded-full animate-bounce" style="animation-delay: 0ms"></div>
									<div class="w-1.5 h-1.5 bg-swiss-muted rounded-full animate-bounce" style="animation-delay: 150ms"></div>
									<div class="w-1.5 h-1.5 bg-swiss-muted rounded-full animate-bounce" style="animation-delay: 300ms"></div>
								</div>
							{:else}
								<p class="text-swiss-warm text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
							{/if}
						</div>
					</div>
				{:else}
					<div class="max-w-[75%] bg-swiss-red/10 border border-swiss-red/30 rounded-sm px-4 py-3">
						<p class="text-swiss-warm text-sm leading-relaxed">{msg.content}</p>
					</div>
				{/if}
			</div>
		{/each}

		<!-- Suggestions (nur am Anfang) -->
		{#if messages.length === 1 && !loading}
			<div class="flex flex-wrap gap-2 justify-start ml-9 animate-fade-in">
				{#each suggestions as s}
					<button
						onclick={() => useSuggestion(s)}
						class="text-xs text-swiss-muted border border-swiss-border px-3 py-1.5 rounded-sm hover:border-swiss-red hover:text-swiss-warm transition-colors duration-150"
					>
						{s}
					</button>
				{/each}
			</div>
		{/if}

		<div bind:this={messagesEnd}></div>
	</div>

	<!-- INPUT -->
	<div class="border-t border-swiss-border px-4 py-4 bg-swiss-dark">
		<div class="max-w-3xl mx-auto flex gap-3 items-end">
			<textarea
				bind:value={input}
				onkeydown={handleKeydown}
				placeholder="Deine Frage oder Meinung..."
				rows="1"
				disabled={loading}
				class="flex-1 bg-swiss-card border border-swiss-border rounded-sm px-4 py-3 text-swiss-warm text-sm placeholder:text-swiss-muted resize-none focus:outline-none focus:border-swiss-red transition-colors duration-150 disabled:opacity-50 min-h-[48px] max-h-32"
				style="field-sizing: content;"
			></textarea>
			<button
				onclick={sendMessage}
				disabled={loading || !input.trim()}
				class="bg-swiss-red text-white px-4 py-3 rounded-sm hover:bg-red-700 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm h-12 flex-shrink-0"
			>
				→
			</button>
		</div>
		<p class="text-center text-swiss-muted text-xs mt-2 font-mono">Enter zum Senden · Shift+Enter für neue Zeile</p>
	</div>
</div>
