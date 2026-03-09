/**
 * Google Apps Script — RSVP Wedding Form Handler
 *
 * HƯỚNG DẪN SỬ DỤNG:
 * 1. Tạo Google Sheet mới, đặt tên tuỳ ý (vd: "RSVP Đám Cưới")
 * 2. Ở dòng 1 (header), nhập: Timestamp | Họ và tên | Số điện thoại | Email | Lời nhắn
 * 3. Vào menu Extensions > Apps Script
 * 4. Xoá code mặc định, paste toàn bộ code này vào
 * 5. Bấm Deploy > New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Bấm Deploy, copy URL deployment
 * 7. Paste URL vào file src/data/weddingData.js, dòng rsvpFormEndpoint
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
      data.name || '',
      data.phone || '',
      data.email || '',
      data.note || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok', message: 'RSVP endpoint is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
