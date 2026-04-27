// =========================================================================
// 1. WEB-APP INITIALISIERUNG
// =========================================================================
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('📦 Umpackungs-Terminal')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL) // Erlaubt das Einbetten von PDFs
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// =========================================================================
// 2. DATENBANK-ABFRAGE FÜR WEB-APP (Ohne Bild-Suche)
// =========================================================================
function sucheMaterial(suchbegriff) {
  // --- BITTE IDs PRÜFEN ---
  const SPREADSHEET_ID = '1NwigM2UgtTsVQAWOBn0Mh0FTLXnN8lYlJ3sPbgiB810'; // Deine Tabelle
  const PDF_FOLDER_ID = '1LHUc1lu_9tuG6YDv95iUFNsAJiaAvqC1'; // Ordner mit den fertigen PDFs
  const IMAGE_FOLDER_ID = '1SmEfw8bgt_7tA7Sd5QN_xhili2okF5Ts'; // NEU: Ordner für die Fotos
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
  const suchText = suchbegriff.toString().trim();
  
  // === TURBO-UPDATE 1: Google's interne Suchmaschine (TextFinder) nutzen ===
  // Durchsucht nur Spalte A direkt auf dem Server (in Millisekunden), anstatt alles herunterzuladen
  const searchResult = sheet.getRange("A:A").createTextFinder(suchText).matchEntireCell(true).findNext();
  
  // Nichts gefunden -> Abbruch
  if (!searchResult) {
    return { found: false };
  }
  
  // Nur die exakte, gefundene Zeile (Spalten A bis F) herunterladen
  const rowIndex = searchResult.getRow();
  const rowData = sheet.getRange(rowIndex, 1, 1, 6).getDisplayValues()[0];
  
  const treffer = {
    materialnummer: rowData[0].toString().trim(),
    bezeichnung: rowData[1] ? rowData[1].toString().trim() : "",
    umpackanweisung: rowData[2] ? rowData[2].toString().trim() : "", 
    besonderes: rowData[3] ? rowData[3].toString().trim() : "",      
    pdfName: rowData[4] ? rowData[4].toString().trim() : "",         
    behaelterName: rowData[5] ? rowData[5].toString().trim() : "" 
  };
  
  let pdfEmbedUrl = "";
  let bild1Url = ""; // NEU
  let bild2Url = ""; // NEU
  
  // =========================================================
  // LOGIK-WEICHE: PDF einbetten oder Bilder laden?
  // =========================================================
  
  if (treffer.pdfName !== "") {
    // FALL 1: PDF VORHANDEN
    try {
      const pdfFolder = DriveApp.getFolderById(PDF_FOLDER_ID);
      
      // === TURBO-UPDATE 2: Nur noch EINE Suchanfrage an Google Drive senden ===
      const exactName = `${treffer.materialnummer}.pdf`;
      const umpackName = `Umpackung_${treffer.materialnummer}.pdf`;
      const fallbackName = treffer.pdfName;
      
      // Wir fragen Google Drive in einem einzigen Rutsch (OR-Verknüpfung)
      const query = `title = '${exactName}' or title = '${umpackName}' or title = '${fallbackName}'`;
      const files = pdfFolder.searchFiles(query);
      
      if (files.hasNext()) {
        const fileId = files.next().getId();
        pdfEmbedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      }
    } catch(e) {
      console.error("Fehler beim Suchen des PDFs:", e);
    }
  } else {
    // FALL 2: KEIN PDF -> Suche Fotos im Drive anhand der Materialnummer
    try {
      const imgFolder = DriveApp.getFolderById(IMAGE_FOLDER_ID);
      
      // Bild 1: Suche nach dem Materialbild (z.B. "09030522001.png")
      let imgFiles = imgFolder.getFilesByName(`${treffer.materialnummer}.png`);
      if (!imgFiles.hasNext()) imgFiles = imgFolder.getFilesByName(`${treffer.materialnummer}.jpg`);
      if (!imgFiles.hasNext()) imgFiles = imgFolder.getFilesByName(`${treffer.materialnummer}.jpeg`);
      
      if (imgFiles.hasNext()) {
        const file = imgFiles.next();
        // LÖSUNG: Das Bild als Datenstrom (Base64) kodieren, um Browser-Blockaden zu umgehen
        const base64 = Utilities.base64Encode(file.getBlob().getBytes());
        bild1Url = `data:${file.getMimeType()};base64,${base64}`;
      }
      
      // Bild 2: Suche nach Behälter (falls in Spalte F ein Name wie "E10" steht)
      if (treffer.behaelterName !== "") {
        let bFiles = imgFolder.getFilesByName(`${treffer.behaelterName}.png`);
        if (!bFiles.hasNext()) bFiles = imgFolder.getFilesByName(`${treffer.behaelterName}.jpg`);
        
        if (bFiles.hasNext()) {
           const file = bFiles.next();
           // LÖSUNG: Auch hier Base64 Encoding anwenden
           const base64 = Utilities.base64Encode(file.getBlob().getBytes());
           bild2Url = `data:${file.getMimeType()};base64,${base64}`;
        }
      }
      
    } catch(e) {
      console.error("Fehler bei der Bildersuche:", e);
    }
  }
  
  // Daten an Frontend senden
  return {
    found: true,
    data: {
      ...treffer,
      pdfEmbedUrl: pdfEmbedUrl,
      bild1Url: bild1Url,    // URL für Bild 1 (Jetzt als garantierter Datenstrom)
      bild2Url: bild2Url     // URL für Bild 2 (Jetzt als garantierter Datenstrom)
    }
  };
}
