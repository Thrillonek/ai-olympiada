'use client';

import { useCallback, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// ═══════════════════════════════════════════════════
// DATA — embedded from ML pipeline (Random Forest)
// ═══════════════════════════════════════════════════
const SCENARE_OBCE = {
	Most: [
		{ id: 'S00', nazev: 'Baseline – bez zásahu', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 9.0, co2_2035: 81.6 },
		{ id: 'S01', nazev: 'Malá FVE na úřadu', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 11.0, co2_2035: 103.6 },
		{ id: 'S02', nazev: 'FVE + komunitní baterie', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 44.0, co2_2035: 169.8 },
		{ id: 'S03', nazev: 'Úspory bez výroby', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 11.0, co2_2035: 81.6 },
		{ id: 'S04', nazev: 'Komunitní FVE + ES + smart metr', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 3.2, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 38.0, co2_2035: 302.1 },
		{ id: 'S05', nazev: 'Velká FVE + velká baterie + úspory', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 3.2, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 78.0, co2_2035: 302.1 },
		{ id: 'S06', nazev: 'Vodíková vize 2035', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 3.6, 3.7, 3.7, 3.7, 3.7, 12.8, 12.8, 12.8], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 128.0, co2_2035: 522.6 },
	],
	Litomerice: [
		{ id: 'S00', nazev: 'Baseline – bez zásahu', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 8.0, co2_2035: 43.2 },
		{ id: 'S01', nazev: 'Malá FVE na úřadu', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 11.0, co2_2035: 65.3 },
		{ id: 'S02', nazev: 'FVE + komunitní baterie', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 55.0, co2_2035: 131.4 },
		{ id: 'S03', nazev: 'Úspory bez výroby', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 10.0, co2_2035: 43.2 },
		{ id: 'S04', nazev: 'Komunitní FVE + ES + smart metr', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 3.6, 3.6, 3.6, 3.6, 3.6, 3.6, 3.6, 3.6], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 59.0, co2_2035: 263.7 },
		{ id: 'S05', nazev: 'Velká FVE + velká baterie + úspory', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 110.0, co2_2035: 263.7 },
		{ id: 'S06', nazev: 'Vodíková vize 2035', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.3, 3.6, 3.7, 3.7, 3.7, 12.9, 12.9, 12.9], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 169.0, co2_2035: 484.2 },
	],
	Zatec: [
		{ id: 'S00', nazev: 'Baseline – bez zásahu', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 8.0, co2_2035: 31.8 },
		{ id: 'S01', nazev: 'Malá FVE na úřadu', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 13.0, co2_2035: 53.8 },
		{ id: 'S02', nazev: 'FVE + komunitní baterie', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 70.0, co2_2035: 120.0 },
		{ id: 'S03', nazev: 'Úspory bez výroby', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 11.0, co2_2035: 31.8 },
		{ id: 'S04', nazev: 'Komunitní FVE + ES + smart metr', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 3.6, 3.6, 3.6, 3.6, 3.6, 3.6, 3.6, 3.6], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 86.0, co2_2035: 252.3 },
		{ id: 'S05', nazev: 'Velká FVE + velká baterie + úspory', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 147.0, co2_2035: 252.3 },
		{ id: 'S06', nazev: 'Vodíková vize 2035', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 3.6, 3.7, 3.7, 3.7, 12.8, 12.8, 12.8], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 169.0, co2_2035: 472.8 },
	],
	Bilina: [
		{ id: 'S00', nazev: 'Baseline – bez zásahu', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 8.0, co2_2035: 24.3 },
		{ id: 'S01', nazev: 'Malá FVE na úřadu', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 15.0, co2_2035: 46.3 },
		{ id: 'S02', nazev: 'FVE + komunitní baterie', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 87.0, co2_2035: 112.5 },
		{ id: 'S03', nazev: 'Úspory bez výroby', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 13.0, co2_2035: 24.3 },
		{ id: 'S04', nazev: 'Komunitní FVE + ES + smart metr', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 3.3, 3.3, 3.3, 3.3, 3.3, 3.3, 3.3, 3.3], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 122.0, co2_2035: 244.8 },
		{ id: 'S05', nazev: 'Velká FVE + velká baterie + úspory', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 159.0, co2_2035: 244.8 },
		{ id: 'S06', nazev: 'Vodíková vize 2035', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 3.3, 3.7, 3.7, 3.7, 12.9, 12.9, 12.9], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 169.0, co2_2035: 465.3 },
	],
	Vejprty: [
		{ id: 'S00', nazev: 'Baseline – bez zásahu', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 9.0, co2_2035: 14.1 },
		{ id: 'S01', nazev: 'Malá FVE na úřadu', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 22.0, co2_2035: 36.2 },
		{ id: 'S02', nazev: 'FVE + komunitní baterie', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 149.0, co2_2035: 102.3 },
		{ id: 'S03', nazev: 'Úspory bez výroby', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 18.0, co2_2035: 14.1 },
		{ id: 'S04', nazev: 'Komunitní FVE + ES + smart metr', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 3.3, 3.3, 3.3, 3.3, 3.3, 3.3, 3.3, 3.3], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 184.0, co2_2035: 234.6 },
		{ id: 'S05', nazev: 'Velká FVE + velká baterie + úspory', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 159.0, co2_2035: 234.6 },
		{ id: 'S06', nazev: 'Vodíková vize 2035', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 3.3, 3.7, 3.7, 3.7, 12.8, 12.8, 12.8], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 169.0, co2_2035: 455.1 },
	],
	Dolni_Jiretin: [
		{ id: 'S00', nazev: 'Baseline – bez zásahu', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 8.0, co2_2035: 9.7 },
		{ id: 'S01', nazev: 'Malá FVE na úřadu', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 26.0, co2_2035: 31.8 },
		{ id: 'S02', nazev: 'FVE + komunitní baterie', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 184.0, co2_2035: 97.9 },
		{ id: 'S03', nazev: 'Úspory bez výroby', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 19.0, co2_2035: 9.7 },
		{ id: 'S04', nazev: 'Komunitní FVE + ES + smart metr', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 3.2, 3.2, 3.2, 3.2, 3.2, 3.2, 3.2, 3.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 184.0, co2_2035: 230.2 },
		{ id: 'S05', nazev: 'Velká FVE + velká baterie + úspory', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 3.2, 3.2, 3.2, 3.2, 3.2, 3.2, 3.2, 3.2], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 159.0, co2_2035: 230.2 },
		{ id: 'S06', nazev: 'Vodíková vize 2035', roky: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035], sobestacnost: [2.2, 2.2, 2.2, 3.2, 3.7, 3.7, 3.7, 12.9, 12.9, 12.9], riziko: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0], uspora_2035: 169.0, co2_2035: 450.7 },
	],
};

const OPATRENI = [
	{ id: 'E1', kat: 'výroba', nazev: 'FVE na střeše školy/úřadu', cena: 2.5, dopad_sob: 2.5, dopad_riz: -1.2, doba: 1, barva: '#f59e0b' },
	{ id: 'E2', kat: 'výroba', nazev: 'FVE na průmyslové hale', cena: 6.0, dopad_sob: 5.8, dopad_riz: -2.1, doba: 2, barva: '#f59e0b' },
	{ id: 'E3', kat: 'výroba', nazev: 'Komunitní FVE – ground mounted', cena: 14.0, dopad_sob: 8.0, dopad_riz: -3.5, doba: 3, barva: '#f59e0b' },
	{ id: 'E4', kat: 'výroba', nazev: 'FVE velká – Triangle', cena: 28.0, dopad_sob: 14.0, dopad_riz: -4.8, doba: 4, barva: '#f59e0b' },
	{ id: 'E5', kat: 'výroba', nazev: 'Větrná elektrárna malá', cena: 3.8, dopad_sob: 3.2, dopad_riz: -1.8, doba: 2, barva: '#f59e0b' },
	{ id: 'B1', kat: 'úložiště', nazev: 'Bateriové úložiště malé (BESS)', cena: 1.2, dopad_sob: 1.8, dopad_riz: -4.5, doba: 1, barva: '#3b82f6' },
	{ id: 'B2', kat: 'úložiště', nazev: 'Komunitní baterie střední', cena: 4.5, dopad_sob: 4.2, dopad_riz: -9.8, doba: 2, barva: '#3b82f6' },
	{ id: 'B3', kat: 'úložiště', nazev: 'Smart metering + EMS', cena: 0.8, dopad_sob: 1.2, dopad_riz: -5.2, doba: 1, barva: '#3b82f6' },
	{ id: 'B4', kat: 'úložiště', nazev: 'Komunitní baterie velká + smart grid', cena: 12.0, dopad_sob: 7.5, dopad_riz: -12.0, doba: 3, barva: '#3b82f6' },
	{ id: 'B5', kat: 'úložiště', nazev: 'Sezónní vodíkové úložiště + FVE', cena: 45.0, dopad_sob: 18.0, dopad_riz: -25.0, doba: 8, barva: '#8b5cf6' },
	{ id: 'U1', kat: 'úspory', nazev: 'Zateplení obecních budov', cena: 3.2, dopad_sob: 3.8, dopad_riz: -2.1, doba: 2, barva: '#10b981' },
	{ id: 'U2', kat: 'úspory', nazev: 'Výměna osvětlení za LED', cena: 1.4, dopad_sob: 1.5, dopad_riz: -0.8, doba: 1, barva: '#10b981' },
	{ id: 'U3', kat: 'úspory', nazev: 'Tepelné čerpadlo – obecní budovy', cena: 2.1, dopad_sob: 2.2, dopad_riz: -3.5, doba: 1, barva: '#10b981' },
	{ id: 'U4', kat: 'úspory', nazev: 'Energetický management EMS', cena: 0.6, dopad_sob: 1.8, dopad_riz: -1.2, doba: 1, barva: '#10b981' },
	{ id: 'U5', kat: 'úspory', nazev: 'Registrace ES + smart metr', cena: 0.4, dopad_sob: 0.8, dopad_riz: -0.5, doba: 1, barva: '#10b981' },
];

const SCENAR_COLORS = ['#6b7280', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];
const OBCE = ['Most', 'Litomerice', 'Zatec', 'Bilina', 'Vejprty', 'Dolni_Jiretin'];

// ═══════════════════════════════════════════════════
// OPTIMIZER — greedy knapsack for best combo
// ═══════════════════════════════════════════════════
function optimizeOpatreni(budget: any, priorita: any) {
	const sorted = [...OPATRENI].sort((a, b) => {
		const scoreA = priorita === 'sobestacnost' ? a.dopad_sob / a.cena : Math.abs(a.dopad_riz) / a.cena;
		const scoreB = priorita === 'sobestacnost' ? b.dopad_sob / b.cena : Math.abs(b.dopad_riz) / b.cena;
		return scoreB - scoreA;
	});
	let remaining = budget;
	const selected = [];
	for (const o of sorted) {
		if (o.cena <= remaining) {
			selected.push(o);
			remaining -= o.cena;
		}
	}
	return selected;
}

// ═══════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Sora:wght@300;400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0f1a; }
  :root {
    --bg: #0a0f1a;
    --surface: #111827;
    --surface2: #1a2438;
    --border: #1f2d42;
    --accent: #f0a500;
    --accent2: #38bdf8;
    --green: #34d399;
    --red: #f87171;
    --text: #e2e8f0;
    --text2: #94a3b8;
    --mono: 'Space Mono', monospace;
    --sans: 'Sora', sans-serif;
  }
`;

function Tag({ color, children }: any) {
	const colors = { výroba: '#f59e0b', úložiště: '#3b82f6', úspory: '#10b981', purple: '#8b5cf6' };
	const c = colors[color as keyof typeof colors] || color || '#94a3b8';
	return <span style={{ background: c + '22', color: c, border: `1px solid ${c}44`, borderRadius: 4, padding: '2px 8px', fontSize: 11, fontFamily: 'var(--mono)', letterSpacing: '0.05em' }}>{children}</span>;
}

function StatCard({ label, value, unit, trend, color }: any) {
	return (
		<div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', flex: 1, minWidth: 140 }}>
			<div style={{ color: 'var(--text2)', fontSize: 11, fontFamily: 'var(--mono)', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</div>
			<div style={{ color: color || 'var(--accent)', fontSize: 28, fontFamily: 'var(--mono)', fontWeight: 700, lineHeight: 1 }}>
				{value}
				<span style={{ fontSize: 14, color: 'var(--text2)', marginLeft: 4 }}>{unit}</span>
			</div>
			{trend && <div style={{ color: 'var(--green)', fontSize: 11, marginTop: 6 }}>↑ {trend}</div>}
		</div>
	);
}

function SectionHeader({ title, subtitle }: any) {
	return (
		<div style={{ marginBottom: 24 }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
				<div style={{ width: 3, height: 20, background: 'var(--accent)', borderRadius: 2 }} />
				<h2 style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>{title}</h2>
			</div>
			{subtitle && <p style={{ color: 'var(--text2)', fontSize: 13, paddingLeft: 15 }}>{subtitle}</p>}
		</div>
	);
}

// ═══════════════════════════════════════════════════
// TAB: SCÉNÁŘE
// ═══════════════════════════════════════════════════
function TabScenare() {
	const [obec, setObec] = useState('Bilina');
	const [metric, setMetric] = useState('sobestacnost');
	const scenare = SCENARE_OBCE[obec as keyof typeof SCENARE_OBCE] || [];

	const chartData =
		scenare[0]?.roky.map((rok: any, i: any) => {
			const entry = { rok };
			scenare.forEach((s: any) => {
				entry[s.nazev as keyof typeof entry] = s[metric][i];
			});
			return entry;
		}) || [];

	const barData = scenare.map((s: any) => ({
		nazev: s.nazev.length > 20 ? s.nazev.slice(0, 20) + '…' : s.nazev,
		full: s.nazev,
		uspora: s.uspora_2035,
		co2: s.co2_2035,
		sob: s.sobestacnost[s.sobestacnost.length - 1],
	}));

	return (
		<div>
			<SectionHeader title='Projekce scénářů 2026–2035' subtitle='Predikce modelu Random Forest — soběstačnost a úspory podle zvoleného scénáře' />

			<div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
				<div>
					<label style={{ color: 'var(--text2)', fontSize: 11, fontFamily: 'var(--mono)', display: 'block', marginBottom: 6 }}>OBEC / ES</label>
					<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
						{OBCE.map((o) => (
							<button
								key={o}
								onClick={() => setObec(o)}
								style={{
									padding: '6px 14px',
									borderRadius: 6,
									border: '1px solid',
									borderColor: obec === o ? 'var(--accent)' : 'var(--border)',
									background: obec === o ? 'var(--accent)22' : 'var(--surface)',
									color: obec === o ? 'var(--accent)' : 'var(--text2)',
									fontFamily: 'var(--mono)',
									fontSize: 12,
									cursor: 'pointer',
								}}
							>
								{o}
							</button>
						))}
					</div>
				</div>
				<div>
					<label style={{ color: 'var(--text2)', fontSize: 11, fontFamily: 'var(--mono)', display: 'block', marginBottom: 6 }}>METRIKA</label>
					<div style={{ display: 'flex', gap: 8 }}>
						{[
							['sobestacnost', 'Soběstačnost %'],
							['riziko', 'Riziko (0–100)'],
						].map(([k, l]) => (
							<button
								key={k}
								onClick={() => setMetric(k)}
								style={{
									padding: '6px 14px',
									borderRadius: 6,
									border: '1px solid',
									borderColor: metric === k ? 'var(--accent2)' : 'var(--border)',
									background: metric === k ? 'var(--accent2)22' : 'var(--surface)',
									color: metric === k ? 'var(--accent2)' : 'var(--text2)',
									fontFamily: 'var(--mono)',
									fontSize: 12,
									cursor: 'pointer',
								}}
							>
								{l}
							</button>
						))}
					</div>
				</div>
			</div>

			<div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 20 }}>
				<div style={{ fontSize: 13, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 16 }}>{metric === 'sobestacnost' ? 'SOBĚSTAČNOST (%) — cíl: maximalizovat' : 'RIZIKO NESTABILITY (0–100) — cíl: minimalizovat'}</div>
				<ResponsiveContainer width='100%' height={300}>
					<LineChart data={chartData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#1f2d42' />
						<XAxis dataKey='rok' stroke='#475569' tick={{ fontFamily: 'var(--mono)', fontSize: 11 }} />
						<YAxis stroke='#475569' tick={{ fontFamily: 'var(--mono)', fontSize: 11 }} />
						<Tooltip contentStyle={{ background: '#111827', border: '1px solid #1f2d42', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 11 }} />
						<Legend wrapperStyle={{ fontFamily: 'var(--mono)', fontSize: 10 }} />
						{scenare.map((s: any, i: number) => (
							<Line key={s.id} type='monotone' dataKey={s.nazev} stroke={SCENAR_COLORS[i]} strokeWidth={s.id === 'S06' ? 3 : 1.5} dot={false} strokeDasharray={s.id === 'S00' ? '4 2' : undefined} />
						))}
					</LineChart>
				</ResponsiveContainer>
			</div>

			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
				<div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
					<div style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 12 }}>ÚSPORA NA DOMÁCNOST / ROK 2035 (Kč)</div>
					<ResponsiveContainer width='100%' height={200}>
						<BarChart data={barData} layout='vertical'>
							<XAxis type='number' stroke='#475569' tick={{ fontFamily: 'var(--mono)', fontSize: 10 }} />
							<YAxis type='category' dataKey='nazev' width={140} stroke='#475569' tick={{ fontFamily: 'var(--mono)', fontSize: 9 }} />
							<Tooltip contentStyle={{ background: '#111827', border: '1px solid #1f2d42', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 11 }} formatter={(v, n, p) => [`${v} Kč`, p.payload.full]} />
							<Bar dataKey='uspora' fill='#f0a500' radius={[0, 4, 4, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</div>
				<div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
					<div style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 12 }}>ÚSPORA CO₂ v roce 2035 (t/rok)</div>
					<ResponsiveContainer width='100%' height={200}>
						<BarChart data={barData} layout='vertical'>
							<XAxis type='number' stroke='#475569' tick={{ fontFamily: 'var(--mono)', fontSize: 10 }} />
							<YAxis type='category' dataKey='nazev' width={140} stroke='#475569' tick={{ fontFamily: 'var(--mono)', fontSize: 9 }} />
							<Tooltip contentStyle={{ background: '#111827', border: '1px solid #1f2d42', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 11 }} formatter={(v, n, p) => [`${v} t CO₂`, p.payload.full]} />
							<Bar dataKey='co2' fill='#34d399' radius={[0, 4, 4, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
}

// ═══════════════════════════════════════════════════
// TAB: OPTIMALIZÁTOR
// ═══════════════════════════════════════════════════
function TabOptimalizator() {
	const [budget, setBudget] = useState(15);
	const [priorita, setPrioritita] = useState('sobestacnost');
	const [aiResponse, setAiResponse] = useState('');
	const [aiLoading, setAiLoading] = useState(false);

	const selected = optimizeOpatreni(budget, priorita);
	const totalCena = selected.reduce((s, o) => s + o.cena, 0);
	const totalSob = selected.reduce((s, o) => s + o.dopad_sob, 0);
	const totalRiz = selected.reduce((s, o) => s + o.dopad_riz, 0);
	const totalDoba = Math.max(...selected.map((o) => o.doba), 0);

	const radarData = [
		{ metric: 'Soběstačnost', value: Math.min(totalSob * 5, 100) },
		{ metric: 'Snížení rizika', value: Math.min(Math.abs(totalRiz) * 2, 100) },
		{ metric: 'Rychlost', value: Math.max(0, 100 - totalDoba * 10) },
		{ metric: 'Efektivita', value: Math.min(((totalSob + Math.abs(totalRiz)) / totalCena) * 20, 100) },
		{ metric: 'Diverzita', value: Math.min(new Set(selected.map((o) => o.kat)).size * 33, 100) },
	];

	const callAI = useCallback(async () => {
		setAiLoading(true);
		setAiResponse('');
		const prompt = `Jsi energetický poradce pro obce v Ústeckém kraji. Zákazník má rozpočet ${budget} mil. Kč.
Vybraná opatření: ${selected.map((o) => `${o.nazev} (${o.cena} mil. Kč, +${o.dopad_sob} pp soběstačnosti, ${o.dopad_riz} pp rizika)`).join('; ')}.
Zbývá ${(budget - totalCena).toFixed(1)} mil. Kč.
Celkový dopad: +${totalSob.toFixed(1)} pp soběstačnosti, ${totalRiz.toFixed(1)} pp rizika.
Napiš stručné (max 4 věty) doporučení pro starostu – co tato kombinace přinese, co je nejdůležitějším prvním krokem a na co si dát pozor. Piš česky, konkrétně.`;
		try {
			const resp = await fetch('https://api.anthropic.com/v1/messages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] }),
			});
			const data = await resp.json();
			setAiResponse(data.content?.[0]?.text || 'Chyba při načítání AI odpovědi.');
		} catch {
			setAiResponse('Nepodařilo se připojit k AI.');
		}
		setAiLoading(false);
	}, [budget, selected, totalSob, totalRiz, totalCena]);

	return (
		<div>
			<SectionHeader title='Optimalizátor opatření' subtitle='Zadejte rozpočet a prioritu — AI greedy algoritmus vybere nejefektivnější kombinaci' />

			<div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
				<div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, flex: 1, minWidth: 260 }}>
					<label style={{ color: 'var(--text2)', fontSize: 11, fontFamily: 'var(--mono)', display: 'block', marginBottom: 8 }}>
						ROZPOČET: <span style={{ color: 'var(--accent)' }}>{budget} mil. Kč</span>
					</label>
					<input type='range' min={2} max={80} value={budget} onChange={(e) => setBudget(+e.target.value)} style={{ width: '100%', accentColor: 'var(--accent)' }} />
					<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text2)', fontFamily: 'var(--mono)', marginTop: 4 }}>
						<span>2 mil.</span>
						<span>80 mil.</span>
					</div>

					<label style={{ color: 'var(--text2)', fontSize: 11, fontFamily: 'var(--mono)', display: 'block', marginBottom: 8, marginTop: 16 }}>PRIORITA OPTIMALIZACE</label>
					<div style={{ display: 'flex', gap: 8 }}>
						{[
							['sobestacnost', '↑ Soběstačnost'],
							['riziko', '↓ Riziko'],
						].map(([k, l]) => (
							<button
								key={k}
								onClick={() => setPrioritita(k)}
								style={{
									flex: 1,
									padding: '8px',
									borderRadius: 6,
									border: '1px solid',
									borderColor: priorita === k ? 'var(--accent)' : 'var(--border)',
									background: priorita === k ? 'var(--accent)22' : 'transparent',
									color: priorita === k ? 'var(--accent)' : 'var(--text2)',
									fontFamily: 'var(--mono)',
									fontSize: 11,
									cursor: 'pointer',
								}}
							>
								{l}
							</button>
						))}
					</div>
				</div>

				<div style={{ display: 'flex', gap: 12, flex: 2, flexWrap: 'wrap' }}>
					<StatCard label='CELKOVÁ CENA' value={totalCena.toFixed(1)} unit='mil. Kč' color='var(--accent)' />
					<StatCard label='DOPAD SOBĚSTAČNOST' value={`+${totalSob.toFixed(1)}`} unit='pp' color='var(--green)' />
					<StatCard label='DOPAD RIZIKO' value={totalRiz.toFixed(1)} unit='pp' color='var(--accent2)' />
					<StatCard label='REALIZACE DO' value={`${totalDoba} r.`} unit='' color='#a78bfa' />
				</div>
			</div>

			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
				<div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
					<div style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 16 }}>VYBRANÁ OPATŘENÍ ({selected.length})</div>
					{selected.length === 0 ? (
						<p style={{ color: 'var(--text2)', fontSize: 13 }}>Zvyšte rozpočet</p>
					) : (
						selected.map((o) => (
							<div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
								<Tag color={o.kat}>{o.id}</Tag>
								<div style={{ flex: 1 }}>
									<div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 2 }}>{o.nazev}</div>
									<div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>
										{o.cena} mil. Kč · +{o.dopad_sob}pp sob. · {o.dopad_riz}pp riz. · {o.doba} rok{o.doba > 1 ? 'y' : ''}
									</div>
								</div>
							</div>
						))
					)}
				</div>

				<div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
					<div style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 8 }}>PROFIL KOMBINACE</div>
					<ResponsiveContainer width='100%' height={220}>
						<RadarChart data={radarData}>
							<PolarGrid stroke='#1f2d42' />
							<PolarAngleAxis dataKey='metric' tick={{ fontFamily: 'var(--mono)', fontSize: 10, fill: '#94a3b8' }} />
							<PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
							<Radar dataKey='value' stroke='#f0a500' fill='#f0a500' fillOpacity={0.2} />
						</RadarChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* AI doporučení */}
			<div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
					<div style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>🤖 AI DOPORUČENÍ (Claude)</div>
					<button
						onClick={callAI}
						disabled={aiLoading || selected.length === 0}
						style={{
							padding: '8px 18px',
							borderRadius: 8,
							border: '1px solid var(--accent)',
							background: aiLoading ? 'transparent' : 'var(--accent)22',
							color: 'var(--accent)',
							fontFamily: 'var(--mono)',
							fontSize: 12,
							cursor: 'pointer',
						}}
					>
						{aiLoading ? '⏳ Generuji…' : 'Požádat AI o radu'}
					</button>
				</div>
				{aiResponse ? <p style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.7, fontFamily: 'var(--sans)' }}>{aiResponse}</p> : <p style={{ color: 'var(--text2)', fontSize: 13 }}>Zvolte opatření a klikněte na tlačítko — AI přizpůsobí doporučení vaší kombinaci.</p>}
			</div>
		</div>
	);
}

// ═══════════════════════════════════════════════════
// TAB: MODEL
// ═══════════════════════════════════════════════════
function TabModel() {
	const fiData = [
		{ feat: 'Vodíkové úložiště', val: 83.2, label: '83.2%' },
		{ feat: 'Instalovaný výkon (kWp)', val: 14.6, label: '14.6%' },
		{ feat: 'Spotřeba (MWh/rok)', val: 1.5, label: '1.5%' },
		{ feat: 'Kapacita baterie (kWh)', val: 0.5, label: '0.5%' },
		{ feat: 'Ostatní', val: 0.2, label: '0.2%' },
	];

	const errorData = [
		{ model: 'Random Forest\n(soběstačnost)', r2: 61.6, mae: 1.2 },
		{ model: 'Random Forest\n(riziko)', r2: 100, mae: 0 },
		{ model: 'Baseline\n(průměr)', r2: 0, mae: 2.5 },
	];

	return (
		<div>
			<SectionHeader title='AI model — jak to funguje' subtitle='Random Forest natrénovaný na 66 historických řádcích; predikce pro 420 scénářových řádků' />

			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
				<div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
					<div style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 16 }}>DŮLEŽITOST PŘÍZNAKŮ (soběstačnost)</div>
					<ResponsiveContainer width='100%' height={220}>
						<BarChart data={fiData} layout='vertical'>
							<XAxis type='number' domain={[0, 100]} stroke='#475569' tick={{ fontFamily: 'var(--mono)', fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
							<YAxis type='category' dataKey='feat' width={170} stroke='#475569' tick={{ fontFamily: 'var(--mono)', fontSize: 10 }} />
							<Tooltip contentStyle={{ background: '#111827', border: '1px solid #1f2d42', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 11 }} formatter={(v) => [`${v}%`, 'Důležitost']} />
							<Bar dataKey='val' fill='#f0a500' radius={[0, 4, 4, 0]} label={{ position: 'right', fontFamily: 'var(--mono)', fontSize: 10, fill: '#94a3b8' }} />
						</BarChart>
					</ResponsiveContainer>
				</div>

				<div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
					<div style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 16 }}>PŘESNOST MODELU (R² skóre, %)</div>
					<ResponsiveContainer width='100%' height={220}>
						<BarChart data={errorData}>
							<CartesianGrid strokeDasharray='3 3' stroke='#1f2d42' />
							<XAxis dataKey='model' stroke='#475569' tick={{ fontFamily: 'var(--mono)', fontSize: 9 }} />
							<YAxis domain={[0, 100]} stroke='#475569' tick={{ fontFamily: 'var(--mono)', fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
							<Tooltip contentStyle={{ background: '#111827', border: '1px solid #1f2d42', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 11 }} />
							<Bar dataKey='r2' fill='#38bdf8' name='R² skóre (%)' radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
				<div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
					<div style={{ fontSize: 13, color: 'var(--accent)', fontFamily: 'var(--mono)', marginBottom: 12 }}>Jak model funguje</div>
					<div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.8 }}>
						<p>
							Model <strong style={{ color: 'var(--accent2)' }}>Random Forest</strong> (200 stromů, max hloubka 8) byl natrénován na <strong>66 historických</strong> datových bodech z 20 obcí Ústeckého kraje za roky 2015–2025.
						</p>
						<br />
						<p>Vstupní příznaky: výkon FVE, kapacita baterií, počet domácností, spotřeba, podíl vhodných střech, přítomnost vodíkového úložiště.</p>
						<br />
						<p>
							Výstup: predikovaná <strong style={{ color: 'var(--green)' }}>soběstačnost (%)</strong> a <strong style={{ color: 'var(--red)' }}>riziko nestability</strong> pro 420 scénářových řádků (2026–2035).
						</p>
					</div>
				</div>

				<div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
					<div style={{ fontSize: 13, color: 'var(--accent)', fontFamily: 'var(--mono)', marginBottom: 12 }}>Kdy model selhává — etická analýza</div>
					<div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.8 }}>
						<p>
							⚠️ <strong>83 % váhy</strong> nesou vodíková úložiště — u obcí bez průmyslové základny může model podceňovat potenciál.
						</p>
						<br />
						<p>
							⚠️ Trénovací sada je <strong>malá (66 řádků)</strong> — predikce jsou orientační, ne zárukou.
						</p>
						<br />
						<p>
							⚠️ Model <strong>neřeší spravedlnost</strong> — menší obce bez průmyslových hal mají horší startovní pozici. Tuto nerovnost je třeba zákazníkovi komunikovat explicitně.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

// ═══════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════
export default function App() {
	const [tab, setTab] = useState('scenare');

	const tabs = [
		{ id: 'scenare', label: '📊 Scénáře 2026–2035' },
		{ id: 'optimizer', label: '⚡ Optimalizátor' },
		{ id: 'model', label: '🤖 AI Model' },
	];

	return (
		<>
			<style>{styles}</style>
			<div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--sans)', padding: '0 0 60px' }}>
				{/* HEADER */}
				<div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '20px 32px' }}>
					<div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<div>
							<div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
								<div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }} />
								<h1 style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 22, color: 'var(--accent)', letterSpacing: '0.05em' }}>EnergiAI</h1>
								<span style={{ color: 'var(--text2)', fontSize: 13, fontFamily: 'var(--mono)' }}>/ Plánovací nástroj ES</span>
							</div>
							<p style={{ color: 'var(--text2)', fontSize: 12, fontFamily: 'var(--mono)' }}>Ústecký kraj · Random Forest · 486 datových bodů · 2015–2035</p>
						</div>
						<div style={{ display: 'flex', gap: 8 }}>
							<Tag color='#f0a500'>AI Olympiáda 2026</Tag>
							<Tag color='#38bdf8'>Linie 1 — Tabulková data</Tag>
						</div>
					</div>
				</div>

				{/* KPI STRIP */}
				<div style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)', padding: '16px 32px' }}>
					<div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 32, flexWrap: 'wrap' }}>
						{[
							['Lokalit v datasetu', '20'],
							['Historických bodů', '220'],
							['Scénářů', '7 × 6 obcí'],
							['Model R² (riziko)', '100 %'],
							['Model R² (soběstačnost)', '61.6 %'],
							['Klíčový faktor', 'vodíkové úložiště'],
						].map(([l, v]) => (
							<div key={l}>
								<div style={{ fontSize: 10, color: 'var(--text2)', fontFamily: 'var(--mono)', letterSpacing: '0.08em' }}>{l}</div>
								<div style={{ fontSize: 15, color: 'var(--accent)', fontFamily: 'var(--mono)', fontWeight: 700 }}>{v}</div>
							</div>
						))}
					</div>
				</div>

				{/* TABS */}
				<div style={{ borderBottom: '1px solid var(--border)', padding: '0 32px' }}>
					<div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 4 }}>
						{tabs.map((t) => (
							<button
								key={t.id}
								onClick={() => setTab(t.id)}
								style={{
									padding: '14px 20px',
									border: 'none',
									background: 'transparent',
									color: tab === t.id ? 'var(--accent)' : 'var(--text2)',
									borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
									fontFamily: 'var(--sans)',
									fontSize: 13,
									fontWeight: tab === t.id ? 600 : 400,
									cursor: 'pointer',
									whiteSpace: 'nowrap',
								}}
							>
								{t.label}
							</button>
						))}
					</div>
				</div>

				{/* CONTENT */}
				<div style={{ maxWidth: 1100, margin: '32px auto', padding: '0 32px' }}>
					{tab === 'scenare' && <TabScenare />}
					{tab === 'optimizer' && <TabOptimalizator />}
					{tab === 'model' && <TabModel />}
				</div>

				{/* FOOTER */}
				<div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
					<div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>
						<span>EnergiAI · Česká AI Olympiáda 2026 · AIO_SZ-02-UK · Ústecký kraj</span>
						<span>Random Forest · scikit-learn · Data: modelová (ECUK inspired)</span>
					</div>
				</div>
			</div>
		</>
	);
}
