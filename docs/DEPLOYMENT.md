# 📤 Deployment & Live-Schaltung

Anleitung zur Live-Schaltung der Webapp.

## Voraussetzung

Setup bereits abgeschlossen: [SETUP.md](SETUP.md)

## Schritt 1: Deployment vorbereiten

1. Öffne dein Apps Script Projekt
2. Stelle sicher, dass beide Dateien aktuell sind:
   - `Code.gs` (Backend)
   - `Index.html` (Frontend)
3. Speichern mit **Ctrl+S** / **Cmd+S**

## Schritt 2: Deployment durchführen

### Im Google Apps Script Editor:

1. **Oben rechts**: Button "Deploy" → "New deployment"
2. **Select type**: Dropdown → "Web app" auswählen
3. **Execute as**: "Me (Benutzer)" auswählen
4. **Who has access**: 
   - ✅ "Anyone" = öffentlich erreichbar
   - ⚠️ "Anyone with the link" = nur mit Link
   - 🔒 "Only myself" = nur für dich
5. **Deploy** klicken

### Neue URL erhalten

Nach dem Deployment zeigt Google eine URL an:
```
https://script.google.com/macros/d/{deployment-id}/userweb
```

Bleibe auf dieser Seite, kopiere die URL.

## Schritt 3: URL konfigurieren (Optional)

Wenn du eine eigene Domain nutzen möchtest:

1. Google Apps Script unterstützt Standard-Domains nicht direkt
2. Alternative: Mit **Google Sites** einbetten oder iFrame-Lösung

**Einfachste Methode**: Direkt die Script-URL verwenden

## Schritt 4: Dokumentation updaten

Trage die Live-URL in folgende Dateien ein:

### README.md
```markdown
## Live Version

**[Hier klicken zur Webapp →](https://script.google.com/macros/d/{deine-id}/userweb)**
```

### docs/DEPLOYMENT.md (diese Datei)
Am Ende dieser Datei:
```markdown
## Aktuelle Live-URLs

- **Produktion**: https://script.google.com/macros/d/{deine-id}/userweb
- **Version**: 1.0.0
- **Deployed**: 2026-04-27
```

## Schritt 5: Test durchführen

1. Öffne die Live-URL in verschiedenen Browsern
2. Teste einen Scan mit echter Materialnummer
3. Prüfe:
   - ✅ Suchbox funktioniert
   - ✅ Daten laden sich
   - ✅ PDF wird angezeigt (falls vorhanden)
   - ✅ Bilder laden (falls vorhanden)
   - ✅ Fehlerbehandlung (mit ungültiger Nummer)

## Schritt 6: Updates durchführen

Beim Ändern von Code:

1. Ändere `Code.gs` oder `Index.html`
2. Speichern mit **Ctrl+S**
3. **Deploy** → "New deployment" (neue Version)
4. Alte Deployment-Version ist weiterhin aktiv
5. **Wichtig**: Im Browser **F5** / **Cmd+R** drücken zum Aktualisieren

### Version in CHANGELOG.md eintragen

```markdown
## [1.0.1] - 2026-04-28

### Fixed
- Bug-Fix Beschreibung

### Changed
- Feature-Änderung
```

## Troubleshooting

### "Fehler 403: Zugriff verweigert"
- Prüfe, ob "Execute as" richtig eingestellt ist
- Prüfe, ob "Who has access" korrekt ist

### Alte Version wird noch angezeigt
- Browser-Cache leeren: **Ctrl+Shift+Delete**
- Oder privates Fenster nutzen

### Webapp lädt nicht
- Öffne Browser-Konsole: **F12** → **Console**
- Schau nach roten Fehlern
- Prüfe, ob `doGet()` Funktion in `Code.gs` definiert ist

## Monitoring & Logging

### Fehler in Echtzeit sehen

1. Apps Script Editor öffnen
2. **Ausführung** (Sidebar) ansehen
3. Fehlhafte Aufrufe sind rot markiert
4. Klicken für Details

### Logs anzeigen

```javascript
// In Code.gs, nach Suchfunktion:
console.log("Suchbegriff: " + suchText);
console.log("Treffer gefunden: " + rowIndex);
```

Logs anschauen:
1. **Ausführung** Sidebar
2. Job auswählen
3. **Logs** Tab

## Performance & Best Practices

### Tipps für schnellere Suche

1. **TextFinder nutzen** (bereits optimiert) ✅
2. **Nur nötige Spalten laden** (bereits optimiert) ✅
3. Zu viele Bilder in einen Ordner? → Unterordner nutzen

### Sicherheit

- 🔒 Sensible Daten (IDs) nicht in `Index.html` speichern → nur in `Code.gs`
- ✅ Die aktuellen IDs sind im Code, aber nur Backend sichtbar

## Rollback (Zurückgehen zu älterer Version)

1. Apps Script → **Project settings**
2. "Show script ID" aktivieren
3. **Deployments** anschauen
4. Alte Version aktivieren

---

## Aktuelle Live-URLs

- **Produktion**: *[Nach Deployment hier eintragen]*
- **Version**: 1.0.0
- **Status**: Deployed 2026-04-27
