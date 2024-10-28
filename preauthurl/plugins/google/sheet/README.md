# Google Sheet Pre-Authenticated URL Add-on
 
The following sample code is for enabling Google Sheets Pre-Authenticated URL Add-on. 
This folder maintains the sample source code for the add-on, with instructions on how to do a deployment and installation as well.

The sample add-on provides functionality for integration of Pre-Authenticated URL with Google Sheets, 
enabling auto refresh and loading/reloading of data as well as coloring of columns.

# Prerequisite

Customer should have a Google account.

# Setup

1. Clone git repository and navigate to sample code directory.

    ```git clone ssh://git@bitbucket.oci.oraclecorp.com:7999/~shairoy/oracle-samples-test.git```

    ```cd <repository_root>/adbs-dataaccess/preauthurl/plugins/google/sheet```
##  

2. Install Google Apps Script CLI tool `clasp`.

    ```npm i @google/clasp -g```
##  

3. Navigate to `https://script.google.com/home/usersettings` and set
`Google Apps Script API on` in your Google account.
##  

4. Login to Google account using Google Apps Script CLI tool and select the permission `Create and update Google Apps Script projects`

    ```clasp login```
##  

5. Open a Google Sheet and navigate to `Extensions -> Apps Script`. Go to `Project Settings` and under `IDs` section, copy the `Script ID`
##  

6. Clone the Google Apps Script project locally and replace the remote code.

    ```clasp clone <Script ID copied in previous step>``` 

    ```git checkout appsscript.json Code.js```

    ```clasp push -f```
##  

7. Install the Apps Script Project by going to `Editor` in your Apps Script Project, selecting `Code.gs` and click `Run` function for `onInstall`. Note that you may need to review and accept permissions required for the sample Add-on.
##  

8. Wait for install to finish. Refresh the Google Sheet & custom menu item `Autonomous Database` for the new Add-on should be visible.    
##  

# Usage

### Access Pre-Authenticated URL Data

1. Go to top menu & select `Autonomous Database -> Open Sidebar` to open the sidebar.


2. Click `Enter Pre-authenticated URL` and populate the Pre-Authenticated URL shared by the producer.


3. It loads limited amount of the data in the Google Sheet. Click on `Load More Data` button in the sidebar to fetch more data if available.


4. Click `Close` button to close the sidebar.

### Reload Pre-Authenticated URL Data

Click `Reload` button in the sidebar to reload the preloaded data in the Google Sheet. A maximum of 10,000 records can be reloaded. The button will be disabled if there are more than 10,000 records present in the sheet.

### Auto Refresh Pre-Authenticated URL Data

Click `Auto Refresh Data` checkbox to enable or disable auto refresh of data. Select auto refresh interval using `Auto Refresh Timer`. Data is refreshed periodically in batches if `Auto Refresh` is enabled. The intervals are 5 min, 10 min, 15 min, 30 min, 1 hour, 6 hours, 12 hours and 24 hours. This feature is disabled by default.

### Coloring Columns

1. Click `Color Settings` button to open up the Color Modal. Select the columns to color similar values by the same color and click `Enable Color`.


2. Click `Reset Color` in the Color Modal to remove colors from all the columns in the sheet. Reloading data will also remove colors from the columns.


### Notes
Customer added columns in Google sheet are not cleared on refresh or reload.  
