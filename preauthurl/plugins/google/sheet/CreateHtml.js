/*
##  Copyright (c) 2024 Oracle and/or its affiliates.
##
## The Universal Permissive License (UPL), Version 1.0
##
## Subject to the condition set forth below, permission is hereby granted to any
## person obtaining a copy of this software, associated documentation and/or data
## (collectively the "Software"), free of charge and under any and all copyright
## rights in the Software, and any and all patent rights owned or freely
## licensable by each licensor hereunder covering either (i) the unmodified
## Software as contributed to or provided by such licensor, or (ii) the Larger
## Works (as defined below), to deal in both
##
## (a) the Software, and
## (b) any piece of software and/or hardware listed in the lrgrwrks.txt file if
## one is included with the Software (each a "Larger Work" to which the Software
## is contributed by such licensors),
##
## without restriction, including without limitation the rights to copy, create
## derivative works of, display, perform, and distribute the Software and make,
## use, sell, offer for sale, import, export, have made, and have sold the
## Software and the Larger Work(s), and to sublicense the foregoing rights on
## either these or other terms.
##
## This license is subject to the following condition:
## The above copyright notice and either this complete permission notice or at
## a minimum a reference to the UPL must be included in all copies or
## substantial portions of the Software.
##
## THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
## IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
## FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
## AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
## LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
## OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
## SOFTWARE.
*/

/**
 * This javascript class provides the methods to create html content for the data from Autonomous Database pre-authenticated URL.
 */

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

