export const vorlagen = [
	{
		id: 'no10mio',
		titel: 'Volksinitiative «Keine 10-Millionen-Schweiz»',
		typ: 'Volksinitiative',
		bundesrat: 'NEIN',
		zusammenfassung:
			'Deckt die Schweizer Wohnbevölkerung verfassungsmässig auf 10 Mio. bis 2050. Ab 9,5 Mio. greifen Zwangsmassnahmen. Ab 10 Mio.: Kündigung Personenfreizügigkeit → Guillotineklausel → alle Bilateralen I fallen. Heute: 9,1 Mio. Einwohner.',
		vergleiche: [
			{
				claim: '«5 von 10 Einwanderern arbeiten nicht.»',
				fakt: '76% der ausländischen Wohnbevölkerung sind erwerbstätig. EU/EFTA-Staatsangehörige sogar 81–87% — fast identisch mit Schweizern (82%). Die 50%-Zahl gilt nur für Flüchtlingskinder, eine bewusst selektiv gewählte Subgruppe.',
				urteil: 'falsch',
				quelle: 'SRF Faktencheck · BFS 2024',
				zahl: '76% erwerbstätig'
			},
			{
				claim: '«Einwanderer belasten die AHV und die Sozialwerke.»',
				fakt: 'Die ausländische Wohnbevölkerung zahlt 33% aller AHV/IV-Beiträge, bezieht aber nur 18,3% der Leistungen. Zuwanderer verjüngen die Bevölkerung und zahlen langfristig mehr ein als sie erhalten.',
				urteil: 'irrefuehrend',
				quelle: 'SECO 2024 · BSV-Daten',
				zahl: '33% der Beiträge, 18.3% der Leistungen'
			},
			{
				claim: '«180\'000 Einwanderer pro Jahr — Bevölkerungsexplosion.»',
				fakt: 'Das BFS schreibt explizit: «Im Zusammenhang mit der demografischen Alterung in Europa wird angenommen, dass der Wanderungssaldo in etwa zehn Jahren etwas abnimmt.» Keine Explosion — eine moderierende Tendenz.',
				urteil: 'falsch',
				quelle: 'BFS Bevölkerungsszenarien, April 2025',
				zahl: null
			},
			{
				claim: '«Alle zwei Tage wird ein Bauernhof zubetoniert — wegen Einwanderung.»',
				fakt: 'Kein kausaler Zusammenhang mit Einwanderung nachweisbar. Der Rückgang landwirtschaftlicher Flächen hat strukturelle Ursachen (Strukturwandel, Bauzonen). Von 3 unabhängigen Prüfern einstimmig widerlegt.',
				urteil: 'falsch',
				quelle: 'SRF Faktencheck 2026',
				zahl: null
			},
			{
				claim: '«Die Initiative schützt die Wirtschaft und die Schweiz.»',
				fakt: 'Das Gegenteil: Bei Annahme verlieren 23–24 von 26 Kantone bis 2050 Erwerbsbevölkerung. Das Arbeitskräfteangebot sinkt um 4,4–5,9%. Milliarden-Einnahmeverluste, sinkendes Haushaltseinkommen — laut unabhängiger Demografik-Studie.',
				urteil: 'falsch',
				quelle: 'Demografik-Studie SEM, Mai 2026 · EJPD',
				zahl: '23–24 Kantone verlieren Erwerbsbevölkerung'
			},
			{
				claim: '«Man kann die Personenfreizügigkeit allein kündigen — die Bilateralen bleiben.»',
				fakt: 'Falsch. Die Guillotineklausel ist eindeutig: Fällt ein Abkommen der Bilateralen I, fallen automatisch alle 7. Das bedeutet das Ende von Landverkehr, Luftverkehr, Forschungsabkommen und mehr.',
				urteil: 'irrefuehrend',
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
			'Sechs Massnahmen schränken die Zivildienst-Zulassung ein. 2025 wurden 7\'211 Personen zugelassen — Rekord (+6,1%). Die Verfassung verlangt: kein freies Wahlrecht zwischen Militär- und Zivildienst. Bundesrat und Parlament empfehlen Annahme (120:76 / 33:10).',
		vergleiche: [
			{
				claim: '«Das Militär ist unterbesetzt — deshalb braucht es die Einschränkung.»',
				fakt: 'Der Kausalzusammenhang ist umstritten. Die Verfassung verlangt klar, dass kein freies Wahlrecht bestehen darf — das ist der eigentliche Grund, nicht ein akuter Armeemangel. 2025: 7\'211 Zulassungen zum Zivildienst (+6,1% gegenüber 2024).',
				urteil: 'irrefuehrend',
				quelle: 'admin.ch · Abstimmungsunterlagen',
				zahl: '7\'211 Zulassungen 2025'
			},
			{
				claim: '«Zivildienst ist kaum wichtig für die Gesellschaft.»',
				fakt: '50,4% aller Zivildiensttage werden im Sozialbereich geleistet. 18,1% in der Bildung, 14,8% im Gesundheitswesen. Pflegeheime, Spitäler und Schulen sind auf Zivildienstleistende angewiesen.',
				urteil: 'falsch',
				quelle: '20min.ch · offizielles Abstimmungsmaterial',
				zahl: '50,4% in Soziales, 18,1% Bildung, 14,8% Gesundheit'
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
