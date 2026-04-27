# ❓ FAQ - Häufig gestellte Fragen

## Allgemein

### F: Kann ich die Webapp offline nutzen?
**A:** Nein, die Webapp benötigt eine Internetverbindung zu Google Sheets und Drive.

### F: Auf welchen Geräten läuft die Webapp?
**A:** Auf allen Geräten mit modernem Browser (Smartphone, Tablet, PC, Mac). Optimiert für Touch-Bedienung.

### F: Kann ich mehrere Personen gleichzeitig die Webapp nutzen lassen?
**A:** Ja! Die Webapp ist Read-Only. Mehrere Nutzer können gleichzeitig scannen.

## Setup & Konfiguration

### F: Welche IDs muss ich genau eintragen?
**A:** Drei Stück:
1. `SPREADSHEET_ID` - aus Google Sheets URL
2. `PDF_FOLDER_ID` - aus Google Drive Ordner-Link
3. `IMAGE_FOLDER_ID` - aus Google Drive Ordner-Link

Details: [SETUP.md](SETUP.md)

### F: Kann ich die Spaltenreihenfolge in Sheets ändern?
**A:** Nein, die Reihenfolge A-F ist fest im Code. Änderungen erfordern Code-Anpassung.

### F: Was ist mit Sonderzeichen in Materialnummern?
**A:** Sollten funktionieren. TextFinder ist relativ flexibel. Getestet mit: `-`, `_`, Leerzeichen, Zahlen.

## Funktionalität

### F: Warum wird manchmal ein PDF und manchmal Bilder angezeigt?
**A:** Das ist beabsichtigt (siehe ARCHITECTURE.md):
- **Mit PDF** (Spalte E): iFrame zeigt PDF
- **Ohne PDF**: Textanweisung + 2 Bilder

### F: Kann ich PDFs und Bilder gleichzeitig anzeigen?
**A:** Aktuell nein. Code würde geändert werden müssen. Feature-Request? → Issue erstellen!

### F: Was passiert, wenn eine Materialnummer nicht gefunden wird?
**A:** Rote Fehlermeldung wird angezeigt mit der Nummer. Hinweis: "Wende dich an Koordinator."

### F: Wie schnell ist die Suche?
**A:** Mit TextFinder: **100-500ms** (abhängig von Sheets-Größe). Sehr schnell!

## Fehlerbehandlung

### F: Ich sehe "Verbindungsfehler zur Google Tabelle"
**A:** 
1. Internet-Verbindung prüfen
2. Google-Services nicht down? → status.google.com
3. Apps Script IDs prüfen (SETUP.md)
4. Browser-Cache leeren (F12 → Cmd/Ctrl+Shift+Del)

### F: Bilder werden nicht angezeigt
**A:**
1. Bildernamen korrekt? `{Materialnummer}.{jpg|png|jpeg}`
2. Bilder im richtigen Ordner? IMAGE_FOLDER_ID prüfen
3. Berechtigungen OK? Apps Script darf Drive-Ordner lesen

### F: PDF zeigt sich nicht an
**A:**
1. PDF-Name in Spalte E korrekt?
2. PDF im PDF_FOLDER_ID Ordner?
3. Dateiname genau gleich (Großschreibung!)?

## Deployment

### F: Wie oft muss ich neu deployen?
**A:** Nur wenn Code geändert wird. UI-Änderungen (HTML/React) auch.

### F: Kann ich die alte Version noch verwenden?
**A:** Ja! Apps Script speichert alle Deployments. Du kannst zurückwechseln.

### F: Wie gebe ich anderen die Webapp-URL?
**A:** Einfach teilen:
- "Anyone" = URL reicht
- "Anyone with link" = URL reicht
- "Only me" = Shared mit einzelnen Account nötig

## Daten & Datenschutz

### F: Werden Scan-Daten gespeichert?
**A:** Nein. Webapp lädt nur Daten, speichert keine Logs.

### F: Wem gehören meine Daten?
**A:** Dir. Du speicherst sie in deinen Google Accounts (Sheets/Drive).

### F: Ist die Webapp DSGVO-konform?
**A:** Die Webapp selbst speichert nichts. Google Sheets/Drive folgen Googles Datenschutzerklärung. Für Business: Google Workspace Agreement beachten.

## Problembehebung

### F: Webapp lädt unendlich
**A:**
```
1. Browser-Console öffnen (F12)
2. Nach roten Fehlern schauen
3. Falls keine: Projekt-Settings in Apps Script
4. Script ID anschauen
5. Vielleicht neuer Deploy nötig?
```

### F: "Fehler 403: Permission denied"
**A:**
- Prüfe IDs in Code.gs
- Stelle sicher, dass Google Account Zugriff auf Sheets/Drive hat
- Evtl. neue Authorization nötig → Re-Authorization in Apps Script

### F: Suche funktioniert, aber Bilder bleiben leer
**A:**
- Sind Bilder in IMAGE_FOLDER_ID?
- Namensschema korrekt? (siehe FAQ oben)
- Dateityp geöffnet im Drive? (.png/.jpg erkannt?)

## Erweiterungen & Anpassungen

### F: Kann ich Spalten hinzufügen?
**A:** Ja! Code anpassen (getRange Spalten-Zahl erhöhen + neue Variablen). Level: Einfach

### F: Kann ich QR-Codes scannen?
**A:** Barcode-Scanning funktioniert bereits! QR-Code braucht nur barcode-in-QR-gebunden-zu-sein.

### F: Kann ich mehrere Sprachen unterstützen?
**A:** Ja, aber manuell: React-Code anpassen mit i18n. Level: Fortgeschrittene

### F: Kann ich weitere Bilder anzeigen?
**A:** Ja, Code erweiterbar. Momentan: 2 Bilder hardcoded. Level: Mittel

## Nächste Schritte

- Weitere Fragen? → GitHub Issues erstellen
- Bug gefunden? → Issue mit Screenshot
- Feature-Idee? → Discussion starten
