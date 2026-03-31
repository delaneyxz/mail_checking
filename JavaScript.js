const SHEET_IDS = {
  USERS: "1bqmQWIHiiNf71Xx68qcbCH7k8RCdLiKpF3keenBgQyc",
  MAIN: "1yBl7NzExhFocUs6qR3DokXV4ruPyeF_4_xNHTNXocbY",
  DONE: "1Lzws077sDmoDPY1HYdpIRp4WA9k9aMm4PW4ck_PAZ-8",
  NO_ACTIVITY: "11NYo9vVGV_beFWqpavHZq9LFtyEdeYixtP6dDics0_w",
  PROBLEMS: "1Hd7SKlEn8obg4vFRTPnU9erFpvGGUDBrs7m4LGqW0S8"
};

function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
         .addMetaTag('viewport', 'width=device-width, initial-scale=1')
         .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// লগইন এবং রোল চেক
function checkLogin(u, p) {
  const sheet = SpreadsheetApp.openById(SHEET_IDS.USERS).getSheets()[0];
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == u && data[i][1] == p) {
      return { success: true, role: data[i][2], user: u }; 
    }
  }
  return { success: false };
}

// সব ট্যাবের নাম আনা
function getTabs() {
  return SpreadsheetApp.openById(SHEET_IDS.MAIN).getSheets().map(s => s.getName());
}

// ডাটা আনা
function getSheetData(name) {
  const sheet = SpreadsheetApp.openById(SHEET_IDS.MAIN).getSheetByName(name);
  return sheet.getDataRange().getValues();
}

// এডমিন পেনেলের জন্য ইউজার স্ট্যাটাস (কার কয়টি সাবমিট)
function getUserStats() {
  const ids = [SHEET_IDS.DONE, SHEET_IDS.NO_ACTIVITY, SHEET_IDS.PROBLEMS];
  let stats = {};
  ids.forEach(id => {
    const data = SpreadsheetApp.openById(id).getSheets()[0].getDataRange().getValues();
    for(let i=1; i<data.length; i++) {
      let user = data[i][data[i].length - 2]; // ইউজারনেম শেষের আগের কলামে থাকে
      if(user) stats[user] = (stats[user] || 0) + 1;
    }
  });
  return stats;
}

// সাবমিট এবং মেইন শিট থেকে ডিলিট
function processSubmission(rowIdx, sheetName, status, user, rowData) {
  let targetId = "";
  if(status === "DONE") targetId = SHEET_IDS.DONE;
  else if(status === "No Activity") targetId = SHEET_IDS.NO_ACTIVITY;
  else if(status === "Problems") targetId = SHEET_IDS.PROBLEMS;

  if(targetId) {
    const targetSheet = SpreadsheetApp.openById(targetId).getSheets()[0];
    rowData.push(status, user, new Date().toLocaleString()); // নতুন ডাটা হিসেবে সেভ
    targetSheet.appendRow(rowData);
    
    const mainSheet = SpreadsheetApp.openById(SHEET_IDS.MAIN).getSheetByName(sheetName);
    mainSheet.deleteRow(rowIdx + 1);
    return true;
  }
  return false;
}


function doPost(e) {
  var action = JSON.parse(e.postData.contents).action;
  // এখানে আপনার আগের ফাংশনগুলোকে কল করার লজিক থাকবে (checkLogin, getTabs ইত্যাদি)
  // এটি ক্রস-অরিজিন (CORS) সাপোর্ট করার জন্য প্রয়োজন
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);



fetch('YOUR_APPS_SCRIPT_URL', {
  method: 'POST',
  body: JSON.stringify({ action: 'login', user: u, pass: p })
})
.then(res => res.json())
.then(data => { /* রেজাল্ট হ্যান্ডেল করুন */ });