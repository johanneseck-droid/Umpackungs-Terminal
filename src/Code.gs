// =========================================================================
// 1. WEB-APP INITIALISIERUNG
// =========================================================================

function doGet() {
  
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('📦 Umpackungs-Terminal')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL) 
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// =========================================================================
// 2. DATENBANK-ABFRAGE FÜR WEB-APP
// =========================================================================
function sucheMaterial(suchbegriff) {
  const suchText = suchbegriff.toString().trim();
  const cache = CacheService.getScriptCache();
  
  const cachedData = cache.get(suchText);
  if (cachedData) {
    return JSON.parse(cachedData); 
  }

  // --- BITTE IDs PRÜFEN ---
  const SPREADSHEET_ID = '1NwigM2UgtTsVQAWOBn0Mh0FTLXnN8lYlJ3sPbgiB810'; 
  const PDF_FOLDER_ID = '1LHUc1lu_9tuG6YDv95iUFNsAJiaAvqC1'; 
  const IMAGE_FOLDER_ID = '1SmEfw8bgt_7tA7Sd5QN_xhili2okF5Ts'; 
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
  const searchResult = sheet.getRange("A:A").createTextFinder(suchText).matchEntireCell(true).findNext();
  
  if (!searchResult) {
    return { found: false };
  }
  
  const rowIndex = searchResult.getRow();
  const rowData = sheet.getRange(rowIndex, 1, 1, 7).getDisplayValues()[0];
  
  // === Lese die Dropdown-Optionen aus Google Sheets (Spalte D = 4) ===
  let dropdownOptions = ["Nicht auspacken", "ESD-Ware", "Karton bündig schneiden", "Als L10 weitergeben", "Deckel"]; // Fallback
  try {
    const rule = sheet.getRange(rowIndex, 4).getDataValidation();
    if (rule) {
      const type = rule.getCriteriaType();
      let sheetOptions = [];
      if (type === SpreadsheetApp.DataValidationCriteria.VALUE_IN_LIST) {
        sheetOptions = rule.getCriteriaValues()[0];
      } else if (type === SpreadsheetApp.DataValidationCriteria.VALUE_IN_RANGE) {
        sheetOptions = rule.getCriteriaValues()[0].getValues().flat().filter(String);
      }
      if (sheetOptions.length > 0) {
        // NEU: Hängt "Deckel" zwingend an die Optionen an, selbst wenn es in deiner Google Tabelle in den Regeln fehlt!
        dropdownOptions = [...new Set([...sheetOptions, "Deckel"])];
      }
    }
  } catch(e) { console.error("Fehler beim Laden der Dropdowns", e); }
  
  const treffer = {
    materialnummer: rowData[0].toString().trim(),
    bezeichnung: rowData[1] ? rowData[1].toString().trim() : "",
    umpackanweisung: rowData[2] ? rowData[2].toString().trim() : "", 
    besonderes: rowData[3] ? rowData[3].toString().trim() : "",      
    pdfName: rowData[4] ? rowData[4].toString().trim() : "",         
    zielbehaelter: rowData[5] ? rowData[5].toString().trim() : "", 
    fuellmenge: rowData[6] ? rowData[6].toString().trim() : "",
    dropdownOptions: dropdownOptions, // Optionen an Frontend senden
    behaelterOptions: ["A-Box", "E10", "E15", "E20", "E25", "E30", "E40", "E50"] // NEU: Definierte Behälter-Liste für das Dropdown
  };
  
  let pdfEmbedUrl = "";
  let bild1Url = "";
  let bild2Url = "";
  
  if (treffer.pdfName !== "") {
    try {
      const pdfFolder = DriveApp.getFolderById(PDF_FOLDER_ID);
      const exactName = `${treffer.materialnummer}.pdf`;
      const umpackName = `Umpackung_${treffer.materialnummer}.pdf`;
      const fallbackName = treffer.pdfName;
      
      const query = `title = '${exactName}' or title = '${umpackName}' or title = '${fallbackName}'`;
      const files = pdfFolder.searchFiles(query);
      
      if (files.hasNext()) {
        pdfEmbedUrl = `https://drive.google.com/file/d/${files.next().getId()}/preview`;
      }
    } catch(e) { console.error(e); }
  } else {
    try {
      const imgFolder = DriveApp.getFolderById(IMAGE_FOLDER_ID);
      const mNum = treffer.materialnummer;
      
      // === BILD 1 SUCHE ===
      let imgQuery1 = `title = '${mNum}_1.jpg' or title = '${mNum}_1.png' or title = '${mNum}.jpg' or title = '${mNum}.png' or title = '${mNum}'`;
      let imgFiles1 = imgFolder.searchFiles(imgQuery1);
      
      if (!imgFiles1.hasNext()) {
        imgFiles1 = imgFolder.searchFiles(`title contains '${mNum}_1' and mimeType contains 'image'`);
        if (!imgFiles1.hasNext()) imgFiles1 = imgFolder.searchFiles(`title contains '${mNum}' and mimeType contains 'image'`);
      }
      
      if (imgFiles1.hasNext()) {
        bild1Url = `https://drive.google.com/thumbnail?id=${imgFiles1.next().getId()}&sz=w800`;
      }
      
      // === BILD 2 SUCHE ===
      let foundImg2 = false;

      // 1. Suche nach spezifischem Bild (Materialnummer_2)
      let imgFiles2 = imgFolder.searchFiles(`title = '${mNum}_2.jpg' or title = '${mNum}_2.png' or title = '${mNum}_2'`);
      if (imgFiles2.hasNext()) {
         bild2Url = `https://drive.google.com/thumbnail?id=${imgFiles2.next().getId()}&sz=w800`;
         foundImg2 = true;
      } else {
         imgFiles2 = imgFolder.searchFiles(`title contains '${mNum}_2' and mimeType contains 'image'`);
         if (imgFiles2.hasNext()) {
            bild2Url = `https://drive.google.com/thumbnail?id=${imgFiles2.next().getId()}&sz=w800`;
            foundImg2 = true;
         }
      }
      
      // 2. FALLBACK: "Beispiel [Behälter]" Bild
      // Wir prüfen zur Sicherheit Spalte C (Anweisung) UND Spalte D (Besonderes) auf das Wort "Deckel"
      const textZuPruefen = (treffer.umpackanweisung + " " + treffer.besonderes).toLowerCase();
      const hatDeckel = textZuPruefen.includes("deckel");
      
      if (!foundImg2 && treffer.zielbehaelter && hatDeckel) {
         let baseContainer = treffer.zielbehaelter.trim();
         
         // Spezialregel für A-Behälter (A, A-Box, a, etc.)
         if (baseContainer.toUpperCase().startsWith("A")) {
             baseContainer = "A-Box";
         }
         
         const beispielName = `Beispiel ${baseContainer}`;
         
         // Breite Suche: "title contains" fängt auch ".JPG" oder kleine Tippfehler ab
         let fallbackFiles = imgFolder.searchFiles(`title contains '${beispielName}' and mimeType contains 'image'`);
         
         if (fallbackFiles.hasNext()) {
            bild2Url = `https://drive.google.com/thumbnail?id=${fallbackFiles.next().getId()}&sz=w800`;
         } else {
            // Extrem breite Suche als absoluter Notnagel (ohne Beschränkung auf "image")
            fallbackFiles = imgFolder.searchFiles(`title contains '${beispielName}'`);
            if (fallbackFiles.hasNext()) {
                bild2Url = `https://drive.google.com/thumbnail?id=${fallbackFiles.next().getId()}&sz=w800`;
            }
         }
      }
      
    } catch(e) { console.error(e); }
  }
  
  const finalResult = {
    found: true,
    data: {
      ...treffer,
      pdfEmbedUrl: pdfEmbedUrl,
      bild1Url: bild1Url,
      bild2Url: bild2Url
    }
  };
  
  cache.put(suchText, JSON.stringify(finalResult), 21600);
  return finalResult;
}

// =========================================================================
// 3. DATEN AKTUALISIEREN / NEU ANLEGEN & BILDER VERWALTEN
// =========================================================================
function saveMaterialUpdate(payload) {
  try {
    const SPREADSHEET_ID = '1NwigM2UgtTsVQAWOBn0Mh0FTLXnN8lYlJ3sPbgiB810';
    const IMAGE_FOLDER_ID = '1SmEfw8bgt_7tA7Sd5QN_xhili2okF5Ts';
    
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    const imgFolder = DriveApp.getFolderById(IMAGE_FOLDER_ID);
    const timestamp = new Date(); // Erzeugt das aktuelle Datum & Uhrzeit
    let row;
    
    // FALL A: Ein komplett neues Material wird angelegt
    if (payload.isNew) {
      sheet.appendRow([
        payload.materialnummer,      // Spalte A
        payload.bezeichnung,         // Spalte B
        payload.umpackanweisung,     // Spalte C
        payload.besonderes,          // Spalte D
        "",                          // Spalte E (PDF Name)
        payload.zielbehaelter,       // Spalte F
        payload.fuellmenge,          // Spalte G
        timestamp                    // Spalte H (Zeitstempel)
      ]);
      row = sheet.getLastRow();
    } 
    // FALL B: Ein bestehendes Material wird geupdatet
    else {
      const searchResult = sheet.getRange("A:A").createTextFinder(payload.materialnummer).matchEntireCell(true).findNext();
      if (!searchResult) return { success: false, error: "Material nicht in Tabelle gefunden." };
      
      row = searchResult.getRow();
      
      // Texte in der Tabelle überschreiben
      sheet.getRange(row, 2).setValue(payload.bezeichnung);     // Spalte B
      sheet.getRange(row, 3).setValue(payload.umpackanweisung); // Spalte C
      sheet.getRange(row, 4).setValue(payload.besonderes);      // Spalte D
      sheet.getRange(row, 5).setValue("");                      // Spalte E (PDF-Eintrag löschen, falls vorhanden)
      sheet.getRange(row, 6).setValue(payload.zielbehaelter);   // Spalte F
      sheet.getRange(row, 7).setValue(payload.fuellmenge);      // Spalte G
      sheet.getRange(row, 8).setValue(timestamp);               // Spalte H (Zeitstempel aktualisieren)
    }
    
    // --- BILDER LÖSCHEN LOGIK ---
    if (payload.deleteBild1) {
      const existing = imgFolder.searchFiles(`title contains '${payload.materialnummer}_1'`);
      while(existing.hasNext()) existing.next().setTrashed(true);
    }
    if (payload.deleteBild2) {
      const existing = imgFolder.searchFiles(`title contains '${payload.materialnummer}_2'`);
      while(existing.hasNext()) existing.next().setTrashed(true);
    }
    
    // --- NEUE BILDER SPEICHERN LOGIK ---
    if (payload.bild1Base64) {
      _saveImageToDrive(imgFolder, `${payload.materialnummer}_1`, payload.bild1Base64);
    }
    if (payload.bild2Base64) {
      _saveImageToDrive(imgFolder, `${payload.materialnummer}_2`, payload.bild2Base64);
    }
    
    CacheService.getScriptCache().remove(payload.materialnummer);
    return { success: true };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

function _saveImageToDrive(folder, fileName, dataUrl) {
  const split = dataUrl.split(',');
  const mimeString = split[0].split(':')[1].split(';')[0];
  const base64Data = split[1];
  
  const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeString, `${fileName}.jpg`);

  const existing = folder.searchFiles(`title contains '${fileName}'`);
  while(existing.hasNext()) {
    existing.next().setTrashed(true);
  }

  folder.createFile(blob);
}

// =========================================================================
// 4. AUTOMATISCHE CACHE-LÖSCHUNG & ZEITSTEMPEL BEI MANUELLEN TABELLEN-ÄNDERUNGEN
// =========================================================================
function onEdit(e) {
  if (!e || !e.range) return;
  const sheet = e.range.getSheet();
  const startRow = e.range.getRow();
  const numRows = e.range.getNumRows();
  const startCol = e.range.getColumn();

  // Wenn nur in der Kopfzeile geändert wurde -> ignorieren
  if (startRow === 1 && numRows === 1) return;

  // 1. Cache leeren (damit die Web-App die neuen Daten zieht)
  const materialNummern = sheet.getRange(startRow, 1, numRows, 1).getDisplayValues();
  const cache = CacheService.getScriptCache();
  for (let i = 0; i < materialNummern.length; i++) {
    const matNum = materialNummern[i][0].toString().trim();
    if (matNum !== "") cache.remove(matNum);
  }

  // 2. NEU: Zeitstempel in Spalte H (8) eintragen, wenn etwas in den Inhaltsspalten (A-G) geändert wird
  if (startCol < 8) {
    sheet.getRange(startRow, 8, numRows, 1).setValue(new Date());
  }
}

// Hilfsfunktion (Türöffner für Google Berechtigungen)
function erteileRechte() {
  const ordner = DriveApp.getRootFolder();
  const dummyDatei = ordner.createFile('test_berechtigung.txt', 'test');
  dummyDatei.setTrashed(true);
}
