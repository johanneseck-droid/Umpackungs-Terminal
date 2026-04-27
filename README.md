# 📦 Umpackungs-Terminal (HECHT)

Webapp zur Verwaltung des Wareneingangs mit Google AppScript. Diese Webapp ermöglicht das Scannen von Materialnummern und die Anzeige von Umpackanweisungen, PDFs und Bildern.

## Features

- 🔍 **Barcode-Scanning**: Schnelle Suche nach Materialnummern
- 📄 **PDF-Integration**: Einbettung von Umpackungsanleitungen aus Google Drive
- 🖼️ **Bildanzeige**: Dynamische Anzeige von Produktbildern und Behälterbildern
- ⚡ **Schnelle Datenbanktsuche**: Optimiert mit Google Sheets TextFinder
- 📱 **Responsive Design**: Mobile und Desktop optimiert mit Tailwind CSS
- ⚠️ **Besonderheiten-Anzeige**: Markierung von besonderen Handhabungen

## Live Version

**Deployment Link**: [Hier einfügen nach Deployment]

## Technologie Stack

- **Backend**: Google Apps Script (GAS)
- **Frontend**: React 18 + Babel (über CDN)
- **UI Framework**: Tailwind CSS
- **Datenbank**: Google Sheets
- **Storage**: Google Drive (PDF & Bilder)

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
const SPREADSHEET_ID = '...';      // Google Sheets mit Materialdaten
const PDF_FOLDER_ID = '...';       // Google Drive Ordner mit PDFs
const IMAGE_FOLDER_ID = '...';     // Google Drive Ordner mit Bildern
```

Detaillierte Konfigurationsanleitung: [docs/SETUP.md](docs/SETUP.md)

## Verwendung

1. Webapp öffnen (Link nach Deployment)
2. Materialnummer scannen oder manuell eingeben
3. Anweisungen, Bilder oder PDF werden angezeigt
4. Mit "Anzeige zurücksetzen" zum nächsten Scan

## Entwicklung & Beiträge

Branch-Strategie:
- `main` = Produktionsversion (stabil)
- `develop` = Entwicklungsbranch
- Feature Branches: `feature/beschreibung`

## Support & Kontakt

Bei Fragen oder Problemen: [Kontaktdaten hier]

## Lizenz

[Lizenztext hier]

## Changelog

Siehe [CHANGELOG.md](CHANGELOG.md) für Versionshistorie.
