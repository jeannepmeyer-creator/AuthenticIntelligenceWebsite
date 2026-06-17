/**
 * ─────────────────────────────────────────────────────────────────
 *  AUTHENTIC INTELLIGENCE — Google Apps Script for Form Submissions
 * ─────────────────────────────────────────────────────────────────
 *
 *  SETUP INSTRUCTIONS (one-time, ~5 minutes):
 *
 *  1. Go to https://sheets.google.com and create a new spreadsheet.
 *     Name it something like "AI Website Form Submissions".
 *
 *  2. In the spreadsheet menu, click Extensions → Apps Script.
 *
 *  3. Delete everything in the editor and paste ALL of this file's code.
 *
 *  4. Click Save (the floppy disk icon), then click Deploy → New deployment.
 *
 *  5. Click the gear icon next to "Type" and choose Web app.
 *     - Description: AI Website Forms
 *     - Execute as: Me
 *     - Who has access: Anyone
 *     Click Deploy, then Authorize access when prompted.
 *
 *  6. Copy the Web App URL (looks like https://script.google.com/macros/s/ABC.../exec)
 *
 *  7. Open reserve.html and replace the placeholder at the top of the
 *     <script> section:
 *         var SHEET_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';
 *
 *  That's it! Every form submission will now appear as a new row
 *  in your Google Sheet automatically.
 * ─────────────────────────────────────────────────────────────────
 */

var HEADERS = [
  'Timestamp',
  'Type',
  'First Name',
  'Last Name',
  'Email',
  'Phone / Preferred Time',
  'Company',
  'Program',
  'Tier',
  'Context / Message'
];

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Write header row on very first submission
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
      data.type        || '',
      data.fname       || '',
      data.lname       || '',
      data.email       || '',
      data.phone       || '',
      data.company     || '',
      data.program     || '',
      data.tier        || '',
      data.context     || data.contact || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: test this by running it manually inside Apps Script
function testEntry() {
  var fakePost = {
    postData: {
      contents: JSON.stringify({
        type: 'reservation',
        fname: 'Jane',
        lname: 'Smith',
        email: 'jane@test.com',
        phone: '917-555-1234, mornings',
        company: 'Test Co',
        program: 'oncall',
        tier: '12credits',
        context: 'Testing the form integration.'
      })
    }
  };
  doPost(fakePost);
}
