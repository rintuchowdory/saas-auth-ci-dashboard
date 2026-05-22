# Design Brainstorming — SaaS Auth CI Dashboard

## Ziel
Ein Portfolio-Projekt das zeigt: React + TypeScript + TanStack Query + FastAPI + PostgreSQL + JWT Auth + Docker + CI/CD.
Das Frontend soll Tiefe zeigen — kein Spielzeug, sondern ein echter, professioneller Stack.

---

<response>
<text>
## Idee A — "Terminal Noir" (Dark Engineering Aesthetic)

**Design Movement:** Neo-Brutalism meets Terminal / Hacker aesthetic
**Core Principles:**
1. Monospace-first typography — Code und UI sprechen dieselbe Sprache
2. Hoher Kontrast: fast-schwarz Hintergrund, elektrisches Grün/Cyan als Akzent
3. Scharfe Kanten, keine abgerundeten Ecken — Präzision über Weichheit
4. Daten im Vordergrund: Tabellen, Badges, Status-Indikatoren dominieren

**Color Philosophy:** `#0d1117` (GitHub-Dark-Schwarz), `#00ff88` (Terminal-Grün), `#58a6ff` (Blau für Links), `#f0883e` (Warn-Orange). Farbe = Bedeutung, nicht Dekoration.

**Layout Paradigm:** Asymmetrisches 2-Spalten-Layout: schmale linke Sidebar (Icon-only collapsed), breite Hauptfläche. Header zeigt Branch/Commit-Info wie ein Git-Terminal.

**Signature Elements:**
- Blinkender Cursor-Effekt auf aktiven Elementen
- "Pipeline"-Visualisierung der CI/CD-Stages als horizontale Kette
- Monospace-Badge-System für Build-Status

**Interaction Philosophy:** Hover = subtile Glow-Effekte (box-shadow mit Akzentfarbe). Übergänge fühlen sich wie Terminal-Output an — schnell, präzise.

**Animation:** Slide-in von links für Sidebar-Items (50ms stagger), Pulse für laufende CI-Jobs, Fade für Status-Wechsel (150ms).

**Typography System:** `JetBrains Mono` für Code/Badges, `IBM Plex Sans` für Body-Text. Monospace dominiert die Oberfläche.
</text>
<probability>0.08</probability>
</response>

<response>
<text>
## Idee B — "Slate Precision" (Modern SaaS / Linear-inspired)

**Design Movement:** Minimalist SaaS — inspiriert von Linear, Vercel, Railway
**Core Principles:**
1. Tiefdunkles Slate-Grau als Basis — nicht reines Schwarz, sondern `#0f172a`
2. Subtile Glassmorphism-Karten mit `backdrop-blur`
3. Akzentfarbe Indigo/Violet für interaktive Elemente
4. Dichte Informationsarchitektur ohne Überfüllung

**Color Philosophy:** Slate-900 Hintergrund, Slate-800 für Karten, Indigo-500 als Primary, Emerald-400 für Erfolg, Rose-500 für Fehler. Professionell und modern.

**Layout Paradigm:** Persistente linke Sidebar mit Icon + Label, Top-Header mit Breadcrumb + User-Avatar. Dashboard-Grid mit Metric-Cards oben, Tabellen unten.

**Signature Elements:**
- Glassmorphism-Karten mit subtiler Border (`border-white/10`)
- Animated Progress-Bars für CI-Pipeline-Stages
- Status-Dots mit Pulse-Animation für laufende Jobs

**Interaction Philosophy:** Smooth 200ms Transitions auf allen interaktiven Elementen. Hover-States heben Karten leicht an (`translateY(-2px)`).

**Animation:** Entrance-Animations mit Framer Motion (stagger 40ms), Skeleton-Loading-States, sanfte Übergänge.

**Typography System:** `Geist` für UI-Text, `Geist Mono` für Code-Snippets und Hashes. Klare Hierarchie durch Gewicht, nicht Größe.
</text>
<probability>0.07</probability>
</response>

<response>
<text>
## Idee C — "Blueprint Engineering" (Technical Documentation Aesthetic)

**Design Movement:** Technical Blueprint / Engineering Drawing meets modern UI
**Core Principles:**
1. Off-white Hintergrund mit Blueprint-Blau als dominante Farbe
2. Grid-Linien als subtile Textur im Hintergrund
3. Technische Typografie — präzise, informationsdicht
4. Diagramm-artige Visualisierungen für Datenflüsse

**Color Philosophy:** `#f8fafc` Hintergrund, `#1e3a5f` Blueprint-Blau, `#0ea5e9` Cyan-Akzent, `#22c55e` Grün für Erfolg. Hell, klar, technisch.

**Layout Paradigm:** Horizontale Top-Navigation + Sidebar-less Dashboard. Cards sind wie Blaupausen-Panels angeordnet.

**Signature Elements:**
- Dashed-Border-Elemente wie technische Zeichnungen
- Koordinaten-artige Labels an Karten-Ecken
- Schematische Diagramme für Architektur-Übersicht

**Interaction Philosophy:** Präzise, keine überflüssige Animation. Hover zeigt technische Details.

**Animation:** Minimal — nur Fade-Ins (100ms) und Progress-Animationen.

**Typography System:** `Space Grotesk` für Headlines, `Space Mono` für technische Werte.
</text>
<probability>0.06</probability>
</response>

---

## Gewähltes Design: **Idee B — "Slate Precision"**

Linear/Vercel/Railway-inspiriertes dunkles SaaS-Dashboard. Zeigt professionelle Tiefe ohne Terminal-Nerd-Ästhetik zu sein — genau das, was Recruiter und Tech-Leads bei einem Portfolio-Projekt erwarten.
