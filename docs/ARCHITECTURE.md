# 🏗️ Technische Architektur

Übersicht der Systemarchitektur des Umpackungs-Terminals.

## Systemübersicht

```
┌─────────────────────────────────────────────────────────────┐
│                    WEBAPP - FRONTEND                         │
│  (React 18 + Tailwind CSS über CDN in Index.html)           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Barcode-Input → Suche triggern → Ergebnis anzeigen  │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │ Suchbox (Material-Nr eingeben/scannen)        │ │  │
│  │  │ ├─ Loading State                              │ │  │
│  │  │ ├─ Erfolg: PDF/Bilder + Anweisungen zeigen   │ │  │
│  │  │ └─ Error: Rot. Hinweis "Nicht gefunden"      │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ google.script.run.sucheMaterial()
               │ (JSON über IPC)
               ↓
┌──────────────────────────────────────────────────────────────┐
│              GOOGLE APPS SCRIPT - BACKEND                   │
│  (Code.gs - Server-side JavaScript)                         │
│                                                              │
│  doGet() ──→ Serve Index.html                              │
│                                                              │
│  sucheMaterial(suchbegriff)                                 │
│    ├─ TextFinder in Spalte A (Sheets)                      │
│    ├─ Row-Daten laden (A-F)                                │
│    ├─ PDF-Ordner suchen (Drive API)                        │
│    ├─ Bilder suchen (Base64 encoding)                      │
│    └─ JSON zurück ans Frontend                             │
└──────────────┬──────────────────────────────────────────────┘
               │
      ┌────────┼────────┐
      ↓        ↓        ↓
┌──────────┐┌──────────┐┌────────────┐
│ Spreadsheet│ Drive   │ Drive      │
│ (Datenbank)│ (PDFs)  │ (Bilder)   │
│            │         │            │
│ A: MatNr  │ Dateien │ Dateien    │
│ B: Name   │ xyz.pdf │ abc.png    │
│ C: Anw.   │ def.pdf │ 123.jpg    │
│ D: Besond.│         │            │
│ E: PDF    │         │            │
│ F: Behälter│        │            │
└──────────┘└──────────┘└────────────┘
```

## Komponenten-Details

### Frontend (Index.html)

**React App** mit folgenden States:

```javascript
- suchbegriff       // aktuelles Input
- ergebnis          // die gefundenen Daten
- fehlerNummer      // bei "Nicht gefunden"
- wirdGeladen       // Loading-Spinner
```

**Zwei Render-Modi:**

1. **Mit PDF** (ergebnis.pdfName):
   - iFrame zeigt PDF aus Drive
   - Header mit Material-Nr

2. **Ohne PDF** (nur Bilder & Text):
   - Besonderheiten-Tags oben
   - Links: Textanweisung (pre-formatted)
   - Rechts: 2x2 Grid für Bilder

### Backend (Code.gs)

**Funktionen:**

1. `doGet()`
   - Serves `Index.html`
   - Meta-Tags für Responsive Design

2. `sucheMaterial(suchbegriff)`
   - Punkt 1: TextFinder in Sheets (schnell!)
   - Punkt 2: Row-Daten laden
   - Punkt 3: Je nach PDF ja/nein:
     - **PDF-Modus**: Drive nach PDF-Datei suchen
     - **Bild-Modus**: Drive nach 2 Bilder suchen + Base64
   - Punkt 4: JSON zurück

### Datenflusst

```
[Scanner] → [Input-Feld]
                 ↓
          [handleSuche]
                 ↓
    [google.script.run]
                 ↓
         [sucheMaterial]
                 ↓
    [TextFinder in Sheets]
                 ↓
      [Row-Daten laden]
                 ↓
    [PDF oder Bilder?]
       ↙          ↘
   [PDF-Suche]  [Bild-Suche]
       ↓            ↓
  [Embed-URL] [Base64-URLs]
       \          /
        [Response]
            ↓
    [setErgebnis]
            ↓
   [UI re-renders]
```

## Datenbank-Struktur

Google Sheets Format:

| Spalte | Feld | Typ | Beispiel |
|--------|------|-----|----------|
| A | Materialnummer | Text | 09030522001 |
| B | Bezeichnung | Text | Schraube M8 |
| C | Umpackanweisung | Text (mehrzeilig) | 1. Box öffnen\n2. Sortieren |
| D | Besonderes | Text (kommagetrennt) | Vorsicht,Kühl |
| E | PDF Name | Text (optional) | Umpackung_09030522001.pdf |
| F | Behälter Name | Text (optional) | E10 |

## Dateiablage (Google Drive)

```
Google Drive
├── Umpackungs-PDFs/
│   ├── 09030522001.pdf
│   ├── Umpackung_09030522002.pdf
│   └── custom_name.pdf
│
└── Umpackungs-Bilder/
    ├── 09030522001.png      (Produktbild)
    ├── 09030522002.jpg      (Produktbild)
    ├── E10.png              (Behälterbild)
    └── B05.jpg              (Behälterbild)
```

**Bildnamen:** 
- 1. Bild: `{Materialnummer}.{jpg|png|jpeg}`
- 2. Bild: `{BehälterName}.{jpg|png|jpeg}`

## Performance-Optimierungen

### ✅ Bereits implementiert

1. **TextFinder statt getAllValues()**
   - Server-seitige Suche
   - Nur 1 HTTP-Request statt N
   - ~100-200ms statt Sekunden

2. **Nur nötige Spalten laden**
   - `getRange(row, 1, 1, 6)` statt komplette Row

3. **Base64-Bilder im Response**
   - Keine separaten Drive-Abfragen im Frontend
   - Umgeht CORS-Probleme

4. **React + Tailwind via CDN**
   - Keine lokalen Builds notwendig
   - Automatische Updates

### 🚀 Mögliche Verbesserungen

- Caching in Apps Script (mit Properties Service)
- Lazy-loading für große Bilder
- Progressive Web App (PWA) Features
- QR-Code Scanner Integration

## Sicherheit

### ✅ Implementiert

- **Backend-Secrets**: IDs nur in `Code.gs`, nicht im Frontend
- **CORS**: Apps Script managed das automatisch
- **Execution Context**: Läuft unter Benutzer-Account

### ⚠️ Empfehlungen

- Regelmäßige Drive-Backups
- Access Control: Nur relevante Personen sollten Apps Script Editor öffnen können
- Audit Log: Google Admin Console trackt Zugriffe

## Deployment-Architektur

```
Apps Script → Deploy
  ├─ Staging: Development-Version
  └─ Production: Live-URL
     └─ CDNs laden React, Babel, Tailwind
```

Jede Deployment erhält eine neue `deployment-id`, alte bleiben abrufbar.

## API-Schnittstelle (Frontend ↔ Backend)

### Request

```javascript
google.script.run.sucheMaterial("09030522001")
```

### Response (Success)

```json
{
  "found": true,
  "data": {
    "materialnummer": "09030522001",
    "bezeichnung": "Schraube M8",
    "umpackanweisung": "1. Box öffnen\n2. ...",
    "besonderes": "Vorsicht,Kühl",
    "pdfName": "Umpackung_09030522001.pdf",
    "behaelterName": "E10",
    "pdfEmbedUrl": "https://drive.google.com/file/d/1ABC.../preview",
    "bild1Url": "data:image/png;base64,iVBORw0KGgo...",
    "bild2Url": "data:image/png;base64,iVBORw0KGgo..."
  }
}
```

### Response (Not Found)

```json
{
  "found": false
}
```

## Browser-Kompatibilität

- ✅ Chrome/Chromium (optimal)
- ✅ Firefox (optimal)
- ✅ Safari (optimal)
- ✅ Edge (optimal)
- ⚠️ IE11 (nicht unterstützt, zu alt)

## Nächste Schritte

- Monitoring/Logging erweitern
- A/B Testing für UI-Verbesserungen
- Analytics Integration (Google Analytics)
