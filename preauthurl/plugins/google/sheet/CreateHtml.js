/**
 * Function to show initial sidebar that requests user pre-auth url input
 * @return {None}
 */
function showURLSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Urlsidebar')
      .setTitle('Autonomous Database URL')
      .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Function to show sidebar with features for a given PAR URL
 * @return {None}
 */
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Autonomous Database URL')
      .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Function to open Modal that requests user pre-auth url input
 * @return {None}
 */
function openURLModal() {
  var html = HtmlService.createHtmlOutputFromFile('UrlModal')
      .setWidth(400)
      .setHeight(150);
  SpreadsheetApp.getUi().showModalDialog(html, 'Autonomous Database URL');
}

/**
 * Function to open Modal to allow User to color columns
 * @return {None}
 */
function openColorModal() {
  // Get the last column
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  var lastColumn = sheet.getLastColumn();

  // If there are no columns, alert the user and exit
  if (lastColumn === 0) {
    SpreadsheetApp.getUi().alert('The sheet is empty.');
    return;
  }

  var html = HtmlService.createHtmlOutputFromFile('ColorModal')
      .setWidth(400)
      .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, 'Autonomous Database URL');
}

/**
 * Default onOpen function that loads custom menu on top of sheet
 * @return {None}
 */
function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Autonomous Database')
      .addItem('Open Sidebar', 'showADSidebar')
      .addToUi();
}

/**
 * Function to show either initial url input sidebar or feature sidebar
 * @return {None}
 */
function showADSidebar() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var url = scriptProperties.getProperty('savedUrl');

  // Check if the property is null or undefined
  if (url === "" || url == null) {
    showURLSidebar();
  } else {
    showSidebar();
  }
}

