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
 * This javascript class provides methods to process the properties for data from Autonomous Database pre-authenticated URL.
 */

/**
 * Get AutoRefresh Property
 * This property is used to check whether or not to automatically
 * refresh PAR URL data from autonomous database on a set interval
 * @return {Boolean}
 */
function getAutoRefreshProperty() {
  return PropertiesService.getScriptProperties().getProperty('autoRefresh') === 'true';
}

/**
 * Get LoadMore Property
 * This property is used to check whether or not to allow load more button
 * to be enabled or disabled. 
 * Property will get updated based on whether the par url has more data to load or not
 * @return {Boolean}
 */
function getLoadMoreProperty() {
  return PropertiesService.getScriptProperties().getProperty('loadMore') === 'true';
}

/**
 * Get Reload Enabled Property
 * This property is used to check whether or not to allow reload button
 * to be enabled or disabled. 
 * Button will be disabled after a certain quota has been reached for loaded data
 * @return {Boolean}
 */
function getReloadEnabledProperty() {
  return parseInt(PropertiesService.getScriptProperties().getProperty('maxrow'), 10) < parseInt(PropertiesService.getScriptProperties().getProperty('reloadlimit'), 10);
}

/**
 * Get Auto Refresh Interval Property
 * This property is used to check the auto refresh interval set by user
 * @return {String}
 */
function getAutoRefreshIntervalProperty() {
  return PropertiesService.getScriptProperties().getProperty('autoRefreshInterval');
}

/**
 * Toggle Auto Refresh Property
 * This property is used to switch the auto refresh property to its inverse
 * @return {Boolean}
 */
function toggleAutoRefreshProperty() {
  var properties = PropertiesService.getScriptProperties();
  var refreshProp = (properties.getProperty('autoRefresh') === 'true');
  properties.setProperty('autoRefresh', !refreshProp);
  return getAutoRefreshProperty();
}

