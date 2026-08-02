// ===== 孵化率予測システム - サーバーサイド =====
// データはこのスクリプトに紐づくスプレッドシートの「Records」シートに、
// 農場ごと1行（既存のCSV出力と同じ列構成）で保存する。

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('孵化率予測システム - カジワラファーム');
}

// ===== 認証 =====
// パスワードは Apps Script エディタの「プロジェクトの設定」→「スクリプト プロパティ」で
// キー "APP_PASSWORD" として設定する（コードには書かない）。
function checkPassword(pw) {
  const correct = PropertiesService.getScriptProperties().getProperty('APP_PASSWORD');
  return typeof pw === 'string' && pw.length > 0 && correct && pw === correct;
}

// ===== データ層 =====
const SHEET_NAME = 'Records';
const HEADERS = [
  'recordId', 'recordDate', 'incubationDate', 'farmId', 'farmName', 'parentAge', 'eggCount', 'storageDays',
  'pred_linear_total', 'pred_linear_female', 'pred_linear_rate',
  'pred_normal_total', 'pred_normal_female', 'pred_normal_rate',
  'actual_female', 'actual_total', 'actual_recordedDate'
];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  return sheet;
}

function toIso_(v) {
  if (v instanceof Date) return v.toISOString();
  return v === '' ? null : v;
}

function toDateStr_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, 'Asia/Tokyo', 'yyyy-MM-dd');
  return v;
}

function toRate_(v) {
  if (v === '' || v === null || v === undefined) return null;
  return Number(v).toFixed(1);
}

function getRecords() {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const byId = new Map();
  values.slice(1).forEach(row => {
    const [recordId, recordDate, incubationDate, farmId, farmName, parentAge, eggCount, storageDays,
      plTotal, plFemale, plRate, pnTotal, pnFemale, pnRate, aFemale, aTotal, aRecordedDate] = row;
    if (!recordId) return;
    const key = String(recordId);
    if (!byId.has(key)) {
      byId.set(key, {
        id: Number(recordId),
        recordDate: toIso_(recordDate),
        incubationDate: toDateStr_(incubationDate),
        farms: []
      });
    }
    byId.get(key).farms.push({
      id: farmId,
      farmName: farmName,
      parentAge: Number(parentAge),
      eggCount: Number(eggCount),
      storageDays: Number(storageDays),
      predictions: {
        linear: { totalChicks: plTotal, femaleChicks: plFemale, hatchRate: toRate_(plRate) },
        normal: { totalChicks: pnTotal, femaleChicks: pnFemale, hatchRate: toRate_(pnRate) }
      },
      actual: {
        femaleChicks: aFemale === '' ? null : aFemale,
        totalChicks: aTotal === '' ? null : aTotal,
        recordedDate: toIso_(aRecordedDate)
      }
    });
  });

  return Array.from(byId.values()).sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate));
}

function saveRecords(records) {
  const sheet = getSheet_();
  const rows = [];
  (records || []).forEach(r => {
    (r.farms || []).forEach(f => {
      rows.push([
        r.id, r.recordDate, r.incubationDate, f.id, f.farmName, f.parentAge, f.eggCount, f.storageDays,
        (f.predictions && f.predictions.linear && f.predictions.linear.totalChicks) || '',
        (f.predictions && f.predictions.linear && f.predictions.linear.femaleChicks) || '',
        (f.predictions && f.predictions.linear && f.predictions.linear.hatchRate) || '',
        (f.predictions && f.predictions.normal && f.predictions.normal.totalChicks) || '',
        (f.predictions && f.predictions.normal && f.predictions.normal.femaleChicks) || '',
        (f.predictions && f.predictions.normal && f.predictions.normal.hatchRate) || '',
        (f.actual && f.actual.femaleChicks != null) ? f.actual.femaleChicks : '',
        (f.actual && f.actual.totalChicks != null) ? f.actual.totalChicks : '',
        (f.actual && f.actual.recordedDate) || ''
      ]);
    });
  });

  const lastRow = sheet.getLastRow();
  if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, HEADERS.length).clearContent();
  if (rows.length > 0) sheet.getRange(2, 1, rows.length, HEADERS.length).setValues(rows);
  return true;
}
