var backgroundTextColorMap = {};
var color_list = [];
var color_cols = [];
var colorMap = {};
var color_track = {};
initializeColors()

/**
 * Get headers
 * This function returns the database column names/headers from the sheet
 * @return {Array}
 */
function getHeaders() {
  var properties = PropertiesService.getScriptProperties();
  var numColumns = parseInt(properties.getProperty('maxcol'), 10);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  var headers = sheet.getRange(1, 1, 1, numColumns).getValues()[0];
  return headers;
}

/**
 * Get mapping from headers to their sheet column names
 * This function returns the database column names/headers from the sheet
 * @return {HashMap}
 */
function getColumnNames() {
  var headers = getHeaders()
  var columnNames = {}; // Object to store mapping from header names to column letters

  for (var i = 0; i < headers.length; i++) {
    var columnName = getColumnLetter(i + 1); // Convert index (1-based) to column letter
    columnNames[headers[i]] = columnName; // Map the header to its column name
  }
  return columnNames; // Return the column names object
}

/**
 * Get the column letter for a given array index
 * @return {String}
 */
function getColumnLetter(index) {
  var letter = '';
  while (index > 0) {
    var remainder = (index - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter; // Convert to letter
    index = Math.floor((index - 1) / 26); // Move to next "digit"
  }
  return letter;
}

/**
 * Helper function to color user selected columns
 * @return {None}
 */
function handleHeaderSelection(selectedHeaders) {
  var columnNames = getColumnNames(); // Get column names mapping
  var selectedColumnNames = selectedHeaders.map(header => columnNames[header]).filter(name => name !== undefined);

  for (var i = 0; i < selectedColumnNames.length; i++) {
    handleColoring(selectedColumnNames[i])
  }
}

/**
 * Helper function to initialize color pallette for columns
 * @return {None}
 */
function initializeColors() {
  var dark = ["#665F5B", "#A63E30", "#8C512F", "#86515D", "#3E694B", "#176885", "#6F587B", "#000000"];
  var light = ["#D4CFCA", "#DAE3E4", "#F9DBD8", "#F2DFC0", "#D2E7D9", "#E7DDEE", "#E69388", "#D39F5E", "#CD9CA7", "#87B395", "#78B1C5", "#B6A1C4"];

  dark.forEach(function(color) {
      backgroundTextColorMap[color] = "white";
  });
  light.forEach(function(color) {
      backgroundTextColorMap[color] = "black";
  });
  color_list = dark.concat(light);
}

/**
 * Helper function to color user selected columns
 * @return {None}
 */
function handleColoring(col) {
  if(color_cols.includes(col)) {
    return;
  }
  color_cols.push(col); //check when its empty
  updateColorMap(col);
  colorData(col);
}

/**
 * Helper function to update map for color to cols
 * @return {None}
 */
function updateColorMap (col) {
    let newColorMap = {...colorMap};
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
    newData = sheet.getRange(col + "2:" + col + sheet.getLastRow()).getValues().flat();
    let distinctVals = Array.from(new Set(newData));
    const newColColorMap = {...colorMap[col]};

    distinctVals.forEach(val => {
        if (!(val in newColColorMap)) {
            newColColorMap[val] = getRandomColor(col);
        }
    });
    newColorMap[col] = newColColorMap;
    colorMap = newColorMap;
}

/**
 * Helper function to randomly pick a color for a given column
 * @return {None}
 */
function getRandomColor(col) {
    if (!color_track[col] || color_track[col].length == 0) {
        color_track[col] = [...color_list];
    }
    var color = color_track[col].splice(Math.floor(Math.random() * color_track[col].length), 1)[0];
    return color;
}

/**
 * Helper function to remove colors from a given column
 * @return {None}
 */
function resetColorData(col) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  var cells = sheet.getRange(col + 2 + ":" + col + sheet.getLastRow())
  // Clear previous font colors
  cells.setFontColor(null);
  cells.setBackground(null);
}

/**
 * Helper function to remove all colors for all columns
 * @return {None}
 */
function resetColor() {
  var columnNames = getColumnNames(); // Get column names mapping
  var headers = getHeaders();
  var selectedColumnNames = headers.map(header => columnNames[header]).filter(name => name !== undefined);

  for (var i = 0; i < selectedColumnNames.length; i++) {
    resetColorData(selectedColumnNames[i])
  }
}

/**
 * Helper function to color user selected columns
 * @return {None}
 */
function colorData(col) {
  resetColorData(col)
  var properties = PropertiesService.getScriptProperties();
  var maxrecords = parseInt(properties.getProperty('maxrow'), 10) - 1;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  var cells = sheet.getRange(col + 2 + ":" + col + (maxrecords + 1))
  var cell_values = cells.getValues();
  var backgroundColors = Array(maxrecords)
  var textColors = Array(maxrecords)
  for (var i = 0; i < maxrecords; i++) {
    if ((color_cols && color_cols.includes(col))) {
        color = colorMap[col][cell_values[i][0]]
        backgroundColors[i] = [color]
        textColors[i] = [backgroundTextColorMap[color]]
    }
  }
  cells.setBackgrounds(backgroundColors)
  cells.setFontColors(textColors);
}