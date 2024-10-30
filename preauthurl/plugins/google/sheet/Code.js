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
 * This javascript class provides the internal methods to process the data from Autonomous Database pre-authenticated URL.
 */

  /**
   * Function on Install of plugin that loads all necessary variables and resets sheet to initial state
   * @return {None}
   */
  function onInstall(e) {
    var loadlimit = 3; //max pages to load at once
    var reloadlimit = 10000; //max for reload from api limit
    var rolloverOffset = 0;
    var properties = PropertiesService.getScriptProperties();
    properties.setProperty('loadlimit', loadlimit);
    properties.setProperty('reloadlimit', reloadlimit);
    properties.setProperty('loadlimit', loadlimit);
    properties.setProperty('rolloverOffset', rolloverOffset);
    properties.setProperty('autoRefresh', false);
    properties.setProperty('autoRefreshInterval', 0);
    properties.setProperty('savedUrl', "");
    properties.setProperty('loadMore', true);
    properties.setProperty('maxrow', 1);
    properties.setProperty('maxcol', 1);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
    sheet.clearContents();
    var numRows = sheet.getMaxRows();
    var numCols = sheet.getMaxColumns();
    var range = sheet.getRange(1, 1, numRows, numCols);
    range.setBackground(null);
    range.setFontColor(null);
    sheet.setFrozenRows(1);
    onOpen(e);
    showURLSidebar();
    createRefreshTrigger(properties.getProperty('autoRefreshInterval'));
  }

  function reset() {
    onInstall(null);
  }
  
  /**
   * Function to clear the sheet of any set PAR URL data
   * @return {None}
   */
  function clearSheet(row, col) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
    const range = sheet.getRange(1, 1, row, col);
    range.clearContent();
    range.setBackground(null);
    range.setFontColor(null);
  }
  
  /**
   * Function to create a refresh trigger on a certain interval based on user input
   * @param {Integer} auto_refresh_interval Interval set by user for auto refresh
   * @return {None}
   */
  function createRefreshTrigger(auto_refresh_interval) {
    // Delete existing triggers to avoid duplicates
    const triggers = ScriptApp.getProjectTriggers();
    for (const trigger of triggers) {
      if (trigger.getHandlerFunction() === 'refreshData') {
        ScriptApp.deleteTrigger(trigger);
      }
    }
  
    var refreshValues = [5, 10, 15, 30, 1, 6, 12, 1]
    var refreshTimer = parseInt(auto_refresh_interval, 10)
    PropertiesService.getScriptProperties().setProperty('autoRefreshInterval', refreshTimer);
  
    // the first 4 values are under an hour
    if(refreshTimer < 4) {
      ScriptApp.newTrigger('refreshData')
        .timeBased()
        .everyMinutes(refreshValues[refreshTimer])
        .create();
    } else if(refreshTimer < 7){
      ScriptApp.newTrigger('refreshData')
        .timeBased()
        .everyHours(refreshValues[refreshTimer])
        .create();
    } else {
      ScriptApp.newTrigger('refreshData')
        .timeBased()
        .everyDays(refreshValues[refreshTimer])
        .create();
    }
  }
  
  /**
   * Function to reload all loaded PAR URL data
   * @return {None}
   */
  function reloadData() {
    var properties = PropertiesService.getScriptProperties();
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  
    var url = properties.getProperty('savedUrl');
    var offset = 0;
    var maxrecords = parseInt(properties.getProperty('maxrow'), 10) - 1;
    var numColumns = parseInt(properties.getProperty('maxcol'), 10);
    clearSheet(maxrecords + 1, numColumns)
    showSidebar();
  
    var apiURL = url + "?offset=" + offset;
    var data = [];
  
    while (data.length < maxrecords) {
      // Get all the data & add it to current google sheet
      var response = UrlFetchApp.fetch(apiURL, {});
      var pageData = response.getContentText();
      var obj = JSON.parse(pageData);
  
      data = data.concat(obj.items);
  
      // If no more items, break from loop
      if (!obj.hasMore) {
        properties.setProperty('loadMore', false);
        break;
      }
   
     // Get the next page url from the response
      var links = obj.links;
      nextPageApiUrl = null;
      for (i = 0 ; i < links.length; ++i) {
        if (links[i].rel == "next") {
          apiURL = links[i].href;
        }
      }
    }
  
    data = data.slice(0, maxrecords);
      
    // Insert the data into the sheet
    var numRows = data.length;    
    var maxrow =  numRows + 1;
  
    // Get the column names from first object
    if(data.length > 0) {
      numColumns = Object.keys(data[0]).length;
      properties.setProperty('maxcol', numColumns);
      var headers = Object.keys(data[0]);
      var headerRange = sheet.getRange(1, 1, 1, numColumns).setValues([headers]);
      headerRange.setBackground("#F5F5F5");
    } else {
      return;
    }
  
    // Populate the values
    sheet.getRange(2, 1, numRows, numColumns).setValues(getValuesByKeys(data, headers));
    SpreadsheetApp.flush();
  
    properties.setProperty('maxrow', maxrow);
  }
  
  /**
   * Function to load more data for the PAR URL
   * It will load 3 pages worth of data on every invocation
   * @return {None}
   */
  function fetchAndLoadData() {
    var properties = PropertiesService.getScriptProperties();
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  
    var loadlimit = parseInt(properties.getProperty('loadlimit'), 10);
    var url = properties.getProperty('savedUrl');
    var offset = parseInt(properties.getProperty('maxrow'), 10) - 1;
    var numColumns = parseInt(properties.getProperty('maxcol'), 10);
    var apiURL = url + "?offset=" + offset;
    var maxrow = offset + 1;
    var data = [];
  
    for (var page = 0; page < loadlimit; page++) {
      // Get all the data & add it to current google sheet
      var response = UrlFetchApp.fetch(apiURL, {});
      var pageData = response.getContentText();
      var obj = JSON.parse(pageData);
      var data = [];
  
      data = data.concat(obj.items);
  
      // Insert the data into the sheet
      var numRows = data.length;    
  
      // Get the column names from first object
      if(offset == 0 && data.length > 0) {
        numColumns = Object.keys(data[0]).length;
        properties.setProperty('maxcol', numColumns);
        var headers = Object.keys(data[0]);
        var headerRange = sheet.getRange(1, 1, 1, numColumns).setValues([headers]);
        headerRange.setBackground("#F5F5F5");
      } else {
        var headers = sheet.getRange(1, 1, 1, numColumns).getValues()[0];
      }
  
      // Populate the values
      sheet.getRange(maxrow + 1, 1, numRows, numColumns).setValues(getValuesByKeys(data, headers));
      SpreadsheetApp.flush();
  
      maxrow =  numRows + maxrow;
      offset = maxrow - 1;
      properties.setProperty('maxrow', maxrow);
  
      // If no more items, break from loop
      if (!obj.hasMore) {
        properties.setProperty('loadMore', false);
        break;
      }
   
     // Get the next page url from the response
      var links = obj.links;
      for (i = 0 ; i < links.length; ++i) {
        if (links[i].rel == "next") {
          apiURL = links[i].href;
        }
      }
    }
    
  }
  
  function getValuesByKeys(data, keys) {
      return data.map(item => keys.map(key => item[key]));
  };
  
  /**
   * Function to refresh all loaded PAR URL data on a given interval
   * This function works on a sliding window logic: 1 page will be refresh sequentially on every invocation
   * @return {None}
   */
  function refreshData() {
    if (!getAutoRefreshProperty()) {
      return; //do not refresh if flag is false
    }
  
    var properties = PropertiesService.getScriptProperties();
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  
    var maxOffset = parseInt(properties.getProperty('maxrow'), 10) - 1;
    var rolloverOffset = parseInt(properties.getProperty('rolloverOffset'), 10);
    var numColumns =  parseInt(properties.getProperty('maxcol'), 10);
    var url = properties.getProperty('savedUrl');
  
    var apiURL = url + "?offset=" + rolloverOffset;
    var data = [];
    
    // Get all the data & add it to current google sheet
    var response = UrlFetchApp.fetch(apiURL, {});
    var pageData = response.getContentText();
    var obj = JSON.parse(pageData);
  
    if(!obj.hasMore) {
      properties.setProperty('loadMore', false);
      properties.setProperty('maxrow', rolloverOffset + 1 + obj.items.length);
    }
    
    data = data.concat(obj.items);
    
    // Insert the data into the sheet
    var numRows = data.length;
  
    // Get the column names from first object
    if(rolloverOffset == 0 && data.length > 0) {
      numColumns = Object.keys(data[0]).length;
      properties.setProperty('maxcol', numColumns);
      var headers = Object.keys(data[0]);
      var headerRange = sheet.getRange(1, 1, 1, numColumns).setValues([headers]);
      headerRange.setBackground("#F5F5F5");
    } else {
      var headers = sheet.getRange(1, 1, 1, numColumns).getValues()[0];
      var numColumns = headers.length
    }
  
    // Populate the values
    sheet.getRange(rolloverOffset + 2, 1, numRows, numColumns).setValues(getValuesByKeys(data, headers));
    SpreadsheetApp.flush();
  
    if((rolloverOffset + numRows) < maxOffset) {
      rolloverOffset = rolloverOffset + numRows;
    } 
    else if((rolloverOffset + numRows) > maxOffset) {
        properties.setProperty('loadMore', true);
        rolloverOffset = 0;
    } else {
      rolloverOffset = 0;
    }
  
    properties.setProperty('rolloverOffset', rolloverOffset);
  }
  
  /**
   * Function to save the user input PAR URL data and load the feature sidebar and first set of data
   * @return {None}
   */
  function saveUrl(url) {
    if(validateUrl(url)) {
      const scriptProperties = PropertiesService.getScriptProperties();
      scriptProperties.setProperty('savedUrl', sanitizeURL(url));
      showSidebar();
      fetchAndLoadData();
    }
    else {
      SpreadsheetApp.getUi().alert('Pre-authenticated url not found or not authorized.');
    }
  }
  
  /**
   * Function to save the user input PAR URL data and load the feature sidebar and first set of data
   * @return {Boolean} True or False depending on http status returned
   */
  function validateUrl(url) {
    var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true});
    var responseCode = response.getResponseCode();
    return responseCode === 200
  }
  
  /**
   * Function to sanitize a user input PAR URL and remove any extra flags
   * @param {String} url The customer provided PAR URL data
   * @return {None}
   */
  function sanitizeURL(url) {
    const questionMarkIndex = url.indexOf('?');
  
    if (questionMarkIndex === -1) {
        return url;
    }
    
    const baseUrl = url.substring(0, questionMarkIndex);
    const queryString = url.substring(questionMarkIndex + 1);
    
    const params = queryString.split('&');
    
    // Filter out unwanted parameters
    const filteredParams = params.filter(param => {
        const [key] = param.split('=');
        return key !== 'limit' && key !== 'offset';
    });
    
    // Reconstruct the URL
    return filteredParams.length > 0 
        ? `${baseUrl}?${filteredParams.join('&')}` 
        : baseUrl; // If no params left, return base URL
  }
  