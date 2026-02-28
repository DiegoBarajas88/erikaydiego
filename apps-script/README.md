# RSVP Setup

This project now expects a Google Apps Script web app for RSVP delivery.

Files:
- `apps-script/rsvp.gs`: receives the form submission, writes to Google Sheets, and sends an email to `contacto@diegobarajas.com`.
- `index.html`: posts the RSVP form to the deployed Apps Script URL.

## Required access

You need all of these:
- Editor access to the Google Sheet: `1TTPW3u8WLihKmlVot7NxOKdVViW19P632MEptc6G13Q`
- A sheet tab named exactly `Confirmación Pagina Web`
- Permission in the same Google account to create and deploy Apps Script
- Permission to authorize `SpreadsheetApp` and `MailApp`

## Deployment steps

1. Open the target Google Sheet.
2. Go to `Extensions -> Apps Script`.
3. Paste the contents of `apps-script/rsvp.gs` into the Apps Script editor.
4. Save the project.
5. Click `Deploy -> New deployment`.
6. Choose `Web app`.
7. Set `Execute as`: `Me`.
8. Set `Who has access`: `Anyone`.
9. Deploy and copy the web app URL.
10. In `index.html`, replace `REEMPLAZAR_CON_URL_DE_APPS_SCRIPT` with that web app URL.
11. Redeploy/push the site.

## Notes

- The landing is static, so the form uses a `no-cors` POST. That is fine for Apps Script, but the browser cannot inspect the response body.
- If the sheet tab name changes, update `SHEET_NAME` in `apps-script/rsvp.gs`.
- If the site will be public, add anti-spam protection next. A honeypot or Turnstile/reCAPTCHA is the correct next step.
