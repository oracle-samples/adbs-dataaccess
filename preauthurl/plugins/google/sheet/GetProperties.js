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

