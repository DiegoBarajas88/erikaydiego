const SHEET_ID = '1TTPW3u8WLihKmlVot7NxOKdVViW19P632MEptc6G13Q';
const SHEET_NAME = 'Confirmación Pagina Web';
const NOTIFY_EMAIL = 'contacto@diegobarajas.com';

function doGet() {
  return jsonResponse_({ ok: true, service: 'rsvp' });
}

function doPost(e) {
  try {
    const payload = normalizePayload_(e);

    if (!payload.nombre || !payload.invitados || !payload.asistencia) {
      return jsonResponse_({ ok: false, error: 'Missing required fields' });
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error('Sheet not found: ' + SHEET_NAME);
    }

    sheet.appendRow([
      new Date(),
      payload.nombre,
      payload.invitados,
      payload.asistencia,
      payload.mensaje,
      payload.source,
      payload.timestamp,
      payload.userAgent
    ]);

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'Nuevo RSVP web: ' + payload.nombre,
      htmlBody: buildEmail_(payload)
    });

    return jsonResponse_({ ok: true });
  } catch (error) {
    return jsonResponse_({ ok: false, error: error.message });
  }
}

function normalizePayload_(e) {
  const params = (e && e.parameter) || {};

  return {
    nombre: clean_(params.nombre),
    invitados: clean_(params.invitados),
    asistencia: clean_(params.asistencia),
    mensaje: clean_(params.mensaje),
    source: clean_(params.source || 'Landing Erika y Diego'),
    timestamp: clean_(params.timestamp || new Date().toISOString()),
    userAgent: clean_(params.userAgent)
  };
}

function buildEmail_(payload) {
  return [
    '<h2>Nuevo RSVP desde la landing</h2>',
    '<p><strong>Nombre:</strong> ' + escapeHtml_(payload.nombre) + '</p>',
    '<p><strong>Numero de invitados:</strong> ' + escapeHtml_(payload.invitados) + '</p>',
    '<p><strong>Asistencia:</strong> ' + escapeHtml_(payload.asistencia) + '</p>',
    '<p><strong>Mensaje:</strong> ' + escapeHtml_(payload.mensaje || 'Sin mensaje') + '</p>',
    '<p><strong>Origen:</strong> ' + escapeHtml_(payload.source) + '</p>',
    '<p><strong>Timestamp:</strong> ' + escapeHtml_(payload.timestamp) + '</p>'
  ].join('');
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(value) {
  return String(value || '').trim();
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
