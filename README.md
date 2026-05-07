# 📦 Umpackungs-Terminal (HECHT)

Webapp zur Verwaltung des Wareneingangs mit Google AppScript. Diese Webapp ermöglicht das Scannen von Materialnummern und die Anzeige von Umpackanweisungen, PDFs und Bildern.

## Features

- 🔍 **Barcode-Scanning**: Schnelle Suche nach Materialnummern
- 📄 **PDF-Integration**: Einbettung von Umpackungsanleitungen aus Google Drive
- 🖼️ **Bildanzeige**: Dynamische Anzeige von Produktbildern und Behälterbildern
- ⚡ **Schnelle Datenbanktsuche**: Optimiert mit Google Sheets TextFinder (Server-seitige Suche in Millisekunden)
- 📱 **Responsive Design**: Mobile und Desktop optimiert mit Tailwind CSS
- ⚠️ **Besonderheiten-Anzeige**: Markierung von besonderen Handhabungen
- 🔐 **Base64 Bildcodierung**: Bilder werden als Datenströme kodiert für sichere Browser-Anzeige
- ⚙️ **Intelligente Fallunterscheidung**: Automatische Anzeige von PDF oder Bildern je nach Verfügbarkeit

## Neue Verbesserungen

### TURBO-UPDATE 1: TextFinder-Optimierung
- Nutzt Google Sheets interne Suchmaschine (TextFinder)
- Durchsucht nur Spalte A direkt auf dem Server
- **Ergebnis**: Millisekunden-schnelle Abfragen statt alles herunterladen

### TURBO-UPDATE 2: Optimierte PDF-Suche
- Reduziert Google Drive Suchanfragen von mehreren auf EINE
- Kombiniert drei Namensvarianten in einer OR-Verknüpfung:
  - `{materialnummer}.pdf`
  - `Umpackung_{materialnummer}.pdf`
  - `{fallbackName}` (aus Tabelle)

### Fallunterscheidung (Logic Switch)
- **FALL 1**: PDF vorhanden → PDF einbetten (iframe)
- **FALL 2**: Kein PDF → Bilder + Textanweisungen anzeigen

### Base64-Bildcodierung
- Bilder werden als Base64-Datenströme kodiert
- Umgeht Browser-CORS-Blockaden und Sicherheitseinschränkungen
- Garantierte, sichere Anzeige von Bildern

## Live Version

**Deployment Link**: https://script.google.com/a/macros/external.roche.com/s/AKfycbxTdfnNm1NrpJyl71PdwgYUNUeRb-6p8dMX20ska3q1z5IBmYnFrrbxQxeQ2POph-0g/exec

## Technologie Stack

- **Backend**: Google Apps Script (GAS)
- **Frontend**: React 18 + Babel (über CDN)
- **UI Framework**: Tailwind CSS
- **Datenbank**: Google Sheets
- **Storage**: Google Drive (PDF & Bilder)
- **Bildverarbeitung**: Base64-Encoding für Browser-Kompatibilität

## Projektstruktur

```
Umpackungs-Terminal/
├── README.md                 # Projektbeschreibung (diese Datei)
├── CHANGELOG.md              # Versionshistorie
├── .gitignore                # Git Ignorierung
├── docs/
│   ├── SETUP.md              # Installations- & Konfigurationsanleitung
│   ├── DEPLOYMENT.md         # Deployment-Schritte
│   ├── ARCHITECTURE.md       # Technische Architektur
│   └── FAQ.md                # Häufig gestellte Fragen
├── src/
│   ├── Code.gs               # Apps Script Backend-Logik
│   └── Index.html            # HTML/React Frontend
└── releases/
    └── v1.0/                 # Releases nach Version
```

## Erste Schritte

1. **Setup durchführen**: Siehe [docs/SETUP.md](docs/SETUP.md)
2. **Entwicklung starten**: Lokal testen und modifizieren
3. **Deployment**: Siehe [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## Konfiguration

Die Webapp benötigt drei Google Drive/Sheets IDs, die in `Code.gs` konfiguriert sind:

```javascript
const SPREADSHEET_ID = '1NwigM2UgtTsVQAWOBn0Mh0FTLXnN8lYlJ3sPbgiB810';      // Google Sheets mit Materialdaten
const PDF_FOLDER_ID = '1LHUc1lu_9tuG6YDv95iUFNsAJiaAvqC1';       // Google Drive Ordner mit PDFs
const IMAGE_FOLDER_ID = '1SmEfw8bgt_7tA7Sd5QN_xhili2okF5Ts';     // Google Drive Ordner mit Bildern
```

### Spreadsheet-Struktur (Spalten A-F)

| Spalte | Name | Beschreibung |
|--------|------|-------------|
| A | Materialnummer | Eindeutige Identifikation (z.B. 09030522001) |
| B | Bezeichnung | Produktbezeichnung |
| C | Umpackanweisung | Textanweisungen zum Umpacken |
| D | Besonderes | Komma-getrennte Besonderheiten (z.B. "Kühl lagern, Zerbrechlich") |
| E | PDF Name | Name des PDF in Google Drive (leer = Bildmodus) |
| F | Behälter Name | Name des Behälterbildes (z.B. "E10") |

Detaillierte Konfigurationsanleitung: [docs/SETUP.md](docs/SETUP.md)

## API-Funktionen

### `doGet()`
Initialisiert die Web-App und gibt die HTML-Seite mit allen erforderlichen Meta-Tags zurück.

```javascript
doGet()
// Rückgabe: HtmlOutput mit ReactJS Frontend
```

### `sucheMaterial(suchbegriff)`
Sucht eine Materialnummer in der Google Sheet und lädt zugehörige Daten.

**Parameter:**
- `suchbegriff` (String): Materialnummer zum Suchen

**Rückgabe:**
```javascript
{
  found: boolean,
  data: {
    materialnummer: string,
    bezeichnung: string,
    umpackanweisung: string,
    besonderes: string,
    pdfName: string,
    behaelterName: string,
    pdfEmbedUrl: string,       // Google Drive Preview URL (falls PDF)
    bild1Url: string,          // Base64-codiertes Materialbild
    bild2Url: string           // Base64-codiertes Behälterbild
  }
}
```

## Verwendung

1. Webapp öffnen (Link nach Deployment)
2. Materialnummer scannen oder manuell eingeben
3. System wählt automatisch:
   - **PDF-Modus**: Eingebettetes PDF anzeigen (falls vorhanden)
   - **Bild-Modus**: Textanweisung + Produktbilder anzeigen
4. Mit "🔄 Anzeige zurücksetzen (Nächster Scan)" zurücksetzen

## Performance-Optimierungen

- ✅ Server-seitige TextFinder-Suche (nur 1 Zeile wird übertragen)
- ✅ Kombinierte Google Drive Suchanfrage (1 statt 3+ Abfragen)
- ✅ Base64-Bildcodierung (keine externen Anfragen)
- ✅ Caching auf Frontend-Seite via React State
- ✅ Lazy-Loading von Bildern

## Entwicklung & Beiträge

Branch-Strategie:
- `main` = Produktionsversion (stabil)
- `develop` = Entwicklungsbranch
- Feature Branches: `feature/beschreibung`

### Lokale Entwicklung
Die App läuft als Google Apps Script Web-App. Zum Entwickeln:
1. Google Apps Script Editor öffnen
2. Code in `Code.gs` bearbeiten
3. HTML/React in `Index.html` anpassen
4. Mit "Deployment" → "New deployment" testen

## Fehlerbehandlung

- ✅ Material nicht gefunden: Benutzerfreundliche Fehlermeldung
- ✅ PDF nicht im Drive: Fallback zu Bildmodus (falls vorhanden)
- ✅ Bilder nicht verfügbar: Placeholder-Meldungen
- ✅ Verbindungsfehler: Error-Handler mit Benutzer-Alert

## Support & Kontakt

Bei Fragen oder Problemen: [Kontaktdaten hier]

## Lizenz

[Lizenztext hier]

## Changelog

Siehe [CHANGELOG.md](CHANGELOG.md) für Versionshistorie.

### Version 1.1 (Aktuell)
- ✨ TURBO-UPDATE 1: TextFinder-Server-Suche implementiert
- ✨ TURBO-UPDATE 2: Kombinierte Google Drive Suchanfrage
- ✨ Base64-Bildcodierung für sichere Anzeige
- 🐛 Fehlerbehandlung verbessert
