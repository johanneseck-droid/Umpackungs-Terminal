# 🚀 Setup & Konfiguration

Anleitung zum Konfigurieren und Einrichten des Umpackungs-Terminals.

## Voraussetzungen

- Google Account mit Zugriff auf:
  - Google Sheets (für Datenbank)
  - Google Drive (für PDFs und Bilder)
  - Google Apps Script

## Schritt 1: Google Sheets vorbereiten

### Datenbank-Struktur

Erstelle eine Google Sheets Tabelle mit folgenden Spalten:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| **Materialnummer** | **Bezeichnung** | **Umpackanweisung** | **Besonderes** | **PDF Name** | **Behälter Name** |
| 09030522001 | Schraube M8 | 1. Box öffnen 2. Sortieren... | Vorsicht Kanten,Kühl | Umpackung_09030522001.pdf | E10 |
| 09030522002 | Dichtung | 1. Dichtung prüfen... | | | B05 |

**Spalten-Erklärung:**
- **A**: Eindeutige Materialnummer (Scanner-Input)
- **B**: Produktbezeichnung
- **C**: Schrittweise Umpackanweisung (mehrzeilig möglich)
- **D**: Besonderheiten (kommagetrennt, z.B. "Vorsicht,Kühl,Fragil")
- **E**: Name der PDF-Datei (wenn vorhanden)
- **F**: Behälter-ID für Bildersuche (z.B. E10, B05)

### Datenbank-Link kopieren

1. Öffne deine Google Sheets Tabelle
2. URL kopieren, z.B.: `https://docs.google.com/spreadsheets/d/**1NwigM2UgtTsVQAWOBn0Mh0FTLXnN8lYlJ3sPbgiB810**/edit`
3. Die ID zwischen `/d/` und `/edit` ist deine `SPREADSHEET_ID`

## Schritt 2: Google Drive vorbereiten

### Ordner für PDFs erstellen

1. Öffne [Google Drive](https://drive.google.com)
2. Erstelle einen neuen Ordner: "Umpackungs-PDFs"
3. Lade deine PDFs hoch (Namensschema: `Materialnummer.pdf` oder wie in Spalte E angegeben)
4. Rechtsklick auf Ordner → "Link abrufen"
5. Link-ID extrahieren: `https://drive.google.com/drive/folders/**1LHUc1lu_9tuG6YDv95iUFNsAJiaAvqC1**`

### Ordner für Bilder erstellen

1. Neuer Ordner: "Umpackungs-Bilder"
2. Bilder hochladen (Namensschema: `Materialnummer.png` oder `BehaelterName.jpg`)
3. Ordner-ID kopieren wie oben

**Beispiel-Struktur:**
```
Umpackungs-Bilder/
├── 09030522001.png    (Produktbild)
├── 09030522002.jpg    (Produktbild)
├── E10.png            (Behälterbild)
└── B05.jpg            (Behälterbild)
```

## Schritt 3: Apps Script Projekt erstellen

### Projekt starten

1. Öffne [Google Apps Script](https://script.google.com)
2. Erstelle ein neues Projekt: "Umpackungs-Terminal"
3. Lösche den vordefinierten `Code.gs`

### Code hochladen

#### Code.gs
1. In der linken Sidebar: **Editor** → Neue Datei → "Code.gs"
2. Code aus `src/Code.gs` kopieren
3. **IDs eintragen** (WICHTIG):
   ```javascript
   const SPREADSHEET_ID = '1NwigM2UgtTsVQAWOBn0Mh0FTLXnN8lYlJ3sPbgiB810';  // DEINE ID
   const PDF_FOLDER_ID = '1LHUc1lu_9tuG6YDv95iUFNsAJiaAvqC1';          // DEINE ID
   const IMAGE_FOLDER_ID = '1SmEfw8bgt_7tA7Sd5QN_xhili2okF5Ts';        // DEINE ID
   ```

#### Index.html (Frontend)
1. In der linken Sidebar: **+** → HTML
2. Nennung: "Index"
3. Code aus `src/Index.html` kopieren
4. Speichern

## Schritt 4: Berechtigungen erteilen

1. **Erstmals ausführen:**
   - Im Apps Script Editor: oberer Button → **Funktionen auswählen** → `doGet`
   - Play-Button drücken
   - Google wird um Berechtigung fragen
   - "Zulassen" auswählen (dein Account)

2. **Automatische Berechtigungen:**
   - Apps Script wird folgende Berechtigungen benötigen:
     - Google Sheets lesen
     - Google Drive Ordner durchsuchen
     - Webapp bereitstellen

## Schritt 5: Deployment

Siehe [DEPLOYMENT.md](DEPLOYMENT.md)

## Fehlerbehandlung

### "Tabelle nicht gefunden"
- Prüfe `SPREADSHEET_ID` in `Code.gs`
- Stelle sicher, dass der Google Account Lesezugriff hat

### "PDF nicht gefunden"
- Prüfe `PDF_FOLDER_ID`
- Stelle sicher, dass PDF-Dateinamen korrekt sind (Spalte E)

### "Bilder nicht verfügbar"
- Prüfe `IMAGE_FOLDER_ID`
- Stelle sicher, dass Bilder als `Materialnummer.png` oder `BehaelterName.jpg` benannt sind

## Nächste Schritte

→ [Deployment-Anleitung](DEPLOYMENT.md) für Live-Schaltung
