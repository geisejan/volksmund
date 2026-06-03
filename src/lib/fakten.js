export const vorlagen = [
	{
		id: 'no10mio',
		titel: 'Volksinitiative «Keine 10-Millionen-Schweiz»',
		typ: 'Volksinitiative',
		bundesrat: 'NEIN',
		zusammenfassung:
			'Die Initiative will die Schweizer Bevölkerung per Gesetz auf 10 Millionen begrenzen. Heute leben 9,1 Millionen Menschen hier. Ab 9,5 Millionen müsste der Staat die Zuwanderung stark einschränken. Ab 10 Millionen würden automatisch alle Verträge mit der EU wegfallen — Handel, Flüge, Forschung.',
		vergleiche: [
			{
				claim: '«5 von 10 Zuwanderern arbeiten nicht.»',
				fakt: '76% der ausländischen Bevölkerung arbeiten. EU-Bürger sogar 81–87% — fast gleich viel wie Schweizer (82%). Die 50%-Zahl gilt nur für Flüchtlingskinder — eine bewusst ausgewählte Ausnahme.',
				urteil: 'falsch',
				quelle: 'SRF Faktencheck · BFS 2024',
				zahl: '76% arbeiten'
			},
			{
				claim: '«Zuwanderer belasten unsere Rente.»',
				fakt: 'Das Gegenteil stimmt: Ausländer zahlen 33% aller AHV-Beiträge, bekommen aber nur 18% der Leistungen zurück. Sie stützen die Rente — sie belasten sie nicht.',
				urteil: 'falsch',
				quelle: 'SECO 2024 · BSV-Daten',
				zahl: '33% eingezahlt, 18% bezogen'
			},
			{
				claim: '«180\'000 kommen jedes Jahr — das hört nie auf.»',
				fakt: 'Das Bundesamt für Statistik schreibt klar: Die Zuwanderung wird in etwa 10 Jahren abnehmen — weil Europa altert und weniger Menschen auswandern.',
				urteil: 'falsch',
				quelle: 'BFS Bevölkerungsszenarien, April 2025',
				zahl: null
			},
			{
				claim: '«Alle zwei Tage wird ein Bauernhof zubetoniert — wegen Zuwanderung.»',
				fakt: 'Der Rückgang von Landwirtschaftsflächen hat nichts mit Zuwanderung zu tun. Es sind wirtschaftliche Gründe: Strukturwandel und Baupolitik. Drei unabhängige Prüfer haben das widerlegt.',
				urteil: 'falsch',
				quelle: 'SRF Faktencheck 2026',
				zahl: null
			},
			{
				claim: '«Die Initiative schützt die Schweizer Wirtschaft.»',
				fakt: 'Das Gegenteil ist wahr: Wenn die Verträge mit der EU wegfallen, verlieren 23 von 26 Kantonen bis 2050 Arbeitskräfte. Das Angebot an Arbeitskräften sinkt um bis zu 6%. Das kostet uns Milliarden.',
				urteil: 'falsch',
				quelle: 'Studie Staatssekretariat für Migration, Mai 2026 · EJPD',
				zahl: '23 von 26 Kantonen verlieren Arbeitskräfte'
			},
			{
				claim: '«Man kann den Vertrag mit der EU über die Arbeit allein kündigen — der Rest bleibt.»',
				fakt: 'Das stimmt nicht. Es gibt eine sogenannte «Guillotineklausel»: Fällt ein Abkommen, fallen automatisch alle 7 anderen auch — Handel, Flüge, Forschung, Landverkehr. Alles.',
				urteil: 'falsch',
				quelle: 'EJPD · offizieller Abstimmungstext',
				zahl: null
			}
		]
	},
	{
		id: 'zivildienst',
		titel: 'Änderung Zivildienstgesetz',
		typ: 'Parlamentarische Initiative',
		bundesrat: 'JA',
		zusammenfassung:
			'Wer nicht in die Armee will, kann Zivildienst leisten — zum Beispiel in Altersheimen, Schulen oder Spitälern. Diese Abstimmung macht den Wechsel in den Zivildienst schwieriger. 2025 haben sich so viele Menschen wie nie dafür entschieden: 7\'211. Bundesrat und Parlament sagen Ja.',
		vergleiche: [
			{
				claim: '«Die Armee ist zu schwach — deshalb braucht es strengere Regeln.»',
				fakt: 'Der direkte Zusammenhang ist umstritten. Die Verfassung sagt klar: Der Zivildienst darf kein einfacher Ausweg aus der Armee sein. Das ist der eigentliche Grund — nicht ein akuter Armeemangel.',
				urteil: 'irrefuehrend',
				quelle: 'admin.ch · Abstimmungsunterlagen',
				zahl: '7\'211 Zulassungen 2025'
			},
			{
				claim: '«Zivildienst ist kaum wichtig für die Gesellschaft.»',
				fakt: 'Zivildienst ist sehr wichtig: 50% der Einsätze sind in Altersheimen und sozialen Einrichtungen. 18% in Schulen. 15% in Spitälern. Viele dieser Orte wären ohne Zivildienstleistende stark überfordert.',
				urteil: 'falsch',
				quelle: 'Offizielles Abstimmungsmaterial',
				zahl: '50% in sozialen Einrichtungen'
			}
		]
	}
];

export const urteilConfig = {
	falsch: { label: 'Falsch', class: 'bg-red-950 text-red-400 border-red-800' },
	irrefuehrend: { label: 'Irreführend', class: 'bg-orange-950 text-orange-400 border-orange-800' },
	uebertrieben: { label: 'Übertrieben', class: 'bg-yellow-950 text-yellow-400 border-yellow-800' },
	wahr: { label: 'Stimmt', class: 'bg-green-950 text-green-400 border-green-800' }
};
