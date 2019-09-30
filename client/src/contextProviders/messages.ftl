global-text-value-wilderlist-name = Wilderlist

global-text-value-navigation-next = Next
global-text-value-navigation-prev = Previous

global-text-value-no-results-found-for-term = No results found for&#32;<strong>{ $term }</strong>
global-text-value-no-users-found-for-term = No users found for&#32;<strong>{ $term }</strong>
global-text-value-are-you-sure-modal = Please Confirm
global-text-value-modal-confirm = Confirm
global-text-value-modal-cancel = Cancel
global-text-value-modal-mark-complete = Mark Complete
global-text-value-more = more

global-error-retrieving-data = There was an error retrieving the data. Please try refreshing or accessing a different page. If the problem persists, contact the administrator.

global-text-value-modal-email = Email

global-text-value-mountain = Mountain
global-text-value-mountains = Mountains
global-text-value-dates = Dates
global-text-value-regions = Regions
global-text-value-state = State
global-text-value-elevation = Elevation
global-text-value-prominence = Prominence
global-text-value-location = Location
global-text-value-ascent-dates = Ascent Dates
global-text-value-done = Done
global-text-value-summer = Summer
global-text-value-fall = Fall
global-text-value-winter = Winter
global-text-value-spring = Spring
global-text-value-month-short-jan = Jan
global-text-value-month-short-feb = Feb
global-text-value-month-short-mar = Mar
global-text-value-month-short-apr = Apr
global-text-value-month-short-may = May
global-text-value-month-short-jun = Jun
global-text-value-month-short-jul = Jul
global-text-value-month-short-aug = Aug
global-text-value-month-short-sep = Sep
global-text-value-month-short-oct = Oct
global-text-value-month-short-nov = Nov
global-text-value-month-short-dec = Dec

global-text-value-open = Open
global-text-value-open-for-winter = Open for Winter
global-text-value-open-for = Open for
global-text-value-open-for-every-month-except = Open for every month except
global-text-value-open-for-every-season-except = Open for every season except
global-text-value-completed-on = Completed on
global-text-value-completed-in-every-month = Completed in every month
global-text-value-completed-in-every-season = Completed in every season
global-text-value-mountain-not-being-pursued = This mountain is not being pursued

global-text-value-submit = Submit

header-text-login-with-google = Login With Google
header-text-menu-item-dashboard = Dashboard
header-text-menu-item-lists = Lists
header-text-menu-item-friends = Friends
header-text-menu-item-admin-panel = Admin Panel
header-text-menu-item-logout = Logout
header-text-menu-my-profile = My Profile
header-text-menu-settings = Settings

login-page-tagline-text = Track, plan, and share progress towards your hiking goals

dashboard-empty-state-no-active-lists-text = You haven't added any active lists yet.
dashboard-empty-state-no-active-lists-button = Find Lists
dashboard-empty-state-no-friends-text = You haven't added any friends yet.
dashboard-empty-state-no-friends-button = Find Friends

list-search-list-detail-placeholder = Select a list on the left to see more details
list-detail-mountain-detail-placeholder = Select a mountain to see more details

peak-list-text-latest-ascent = {
  $completed ->
    [true] Completed
    *[false] Latest ascent
} {
  $has-full-date ->
    *[false] in
    [true] on
}
peak-list-text-no-completed-ascent = No completed ascents yet
peak-list-text-completed-ascent = Completed Ascents
peak-list-text-total-ascents = Total Ascents
peak-list-text-across-the-us = Across the US

peak-list-detail-text-modal-remove-confirm = Remove&#32;<strong>{ $peak-list-name }</strong>&#32;from your active lists?
peak-list-detail-text-begin-list = Begin List
peak-list-detail-text-remove-list = Remove List
peak-list-detail-select-mountain = Select a mountain to see its details and your ascents

peak-list-detail-list-overview-para-1 = { $list-name } is a list with { $number-of-peaks } mountains that are located {
  $state-or-region ->
    [state] within
    *[region] throughout
} { FORMAT_STATE_REGION_FOR_TEXT($state-region-name) }. Sitting at { $highest-mountain-elevation }ft {
  $highest-also-most-prominent ->
    [true] and { $most-prominent-value }ft of prominence, { $highest-mountain-name } is
    *[false] , { $highest-mountain-name } is
} {
  $highest-also-most-prominent ->
    [true] both the
    *[false] the
} highest point {
  $highest-also-most-prominent ->
    [true] and the most prominent peak on { $list-name }.
    *[false] on { $list-name }.
} {
  $highest-also-most-prominent ->
    [true] The smallest mountain is
    *[false] However, the most prominent peak is { $most-prominent-peak-name } at { $most-prominent-elevation }ft high and { $most-prominent-value }ft of prominence. The smallest mountain is
} { $smallest-mountain-name } at { $smallest-mountain-elevation }ft.

mountain-completion-modal-text-note-standard =
  Entering a date is optional for <strong>Standard</strong> lists. However an unspecific date may not count towards other lists that contain this peak.
mountain-completion-modal-text-note-winter =
  <strong>Winter</strong> lists require the date to be in between the <strong>winter solstice</strong> and the <strong>vernal equinox</strong> for a given year. You may still enter other dates here and they will be added to your overall ascent record. But they will not appear on this list if they do not match the criteria.
mountain-completion-modal-text-note-four-season =
  <strong>4-Season</strong> lists require dates to be in between the official solstice and equinox for a given season and year. You may still enter other dates here and they will be added to your overall ascent record. But they will not appear on this list if they do not match the criteria.
mountain-completion-modal-text-note-grid =
  <strong>Grid</strong> lists require dates to be a day within the specified month. You may still enter other dates here and they will be added to your overall ascent record. But they will not appear on this list if they do not match the criteria.

mountain-table-grid-date-note-text =
  <div>Date is shown in <em>DD,'YY</em> format in order to better fit on screen.</div>
  <div>For example, <em>March 9, 2014</em> would show as <em>9, '14</em> under the <strong>March</strong> column.</div>
mountain-table-import-button = Import Ascents from Spreadsheet

mountain-detail-remove-ascent-modal-text = Remove&#32;<strong>{ $date }</strong>&#32;from your ascents?
mountain-detail-add-another-ascent = Add another ascent
mountain-detail-add-ascent-date = Add Ascent Date
mountain-detail-remove-ascent = Remove Ascent
mountain-detail-no-ascents-text = You have not yet hiked { $mountain-name }.
mountain-detail-lists-mountain-appears-on = Lists { $mountain-name } appears on:
mountain-detail-lists-mountain-appears-on-ranks =  — { ORDINAL_NUMBER($elevation-rank) } largest peak, { ORDINAL_NUMBER($prominence-rank) } most prominent

user-list-no-user-selected-text = Select a user on the left to see more details
user-profile-requests-add-friend = Add Friend
user-profile-requests-remove-friend = Remove Friend
user-profile-requests-pending-request = Pending Friend Request
user-profile-requests-cancel-request = Cancel Request
user-profile-requests-decline-request = Decline
user-profile-requests-accept-request = Accept Request

user-profile-compare-all-ascents = Compare All Ascents
user-profile-compare-ascents = Compare Ascents
user-profile-compare-completed-by = completed by { $user-name }
user-profile-no-lists = { $user-name } has not started any lists.
user-profile-no-recent-ascents = No recent ascents
user-profile-latest-ascents = Hiked { $mountain-name } on { $date }
user-profile-sent-you-a-friend-request = { $name } sent you a friend request.
user-profile-compare-ascents-placeholder = Click "Compare Ascents" on a list on the left to compare your progress

user-profile-lists-in-progress = Lists in progress
user-profile-lists-completed = Completed Lists

user-profile-remove-friend-modal = Remove&#32;<strong>{ $name }</strong>&#32;from your friends?

user-card-completed = Completed
user-card-working-on = Working On
user-card-not-currently-working-on = Not currently working on any lists

map-text-attribution = Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)

import-ascents-title = Import Ascents
import-ascents-para-1 = This tool will import your existing ascent data from a spreadsheet and into Wilderlist.
import-ascents-date-note = <strong>Note:</strong>&#32;Dates must be in&#32;<strong>Month/Day/Year</strong>&#32;format in order to be properly read.
import-ascents-step-1 = First, select all of the cells with the&#32;<strong>mountain names</strong>&#32;and paste them into the box on the&#32;<strong>left</strong>.
import-ascents-step-2 = Then, select all of the cells with the&#32;<strong>dates (including the ones that are blank)</strong>&#32;and paste them into the box on the&#32;<strong>right</strong>.
import-ascents-gif-help-alt-text = Click and drag to select multiple cells in a spreadsheet
import-ascents-paste-mountains-here = Paste Mountain Names Here
import-ascents-paste-dates-here = Paste Dates Here

import-ascents-your-input = Your Input
import-ascents-your-name-input = Your Name Input
import-ascents-name-output = Name Output
import-ascents-your-date-input = Your Date Input
import-ascents-date-output = Date Output
import-ascents-mountains-on-list = Mountains On This List

import-ascents-error-message-your-list-too-long = The list of mountains you pasted was&#32;<strong>longer than the amount of mountains on this list</strong>.&#32;Please review the output of what we received below, make changes, and try pasting again.
import-ascents-error-message-please-paste-dates = Please paste your list of&#32;<strong>dates</strong>.
import-ascents-error-message-please-paste-mountains = Please paste your list of&#32;<strong>mountains</strong>.
import-ascents-error-message-list-is-bigger-than-other = Your list of { $bigger-list } is larger than your { $smaller-list }. Please adjust them so they are both the same size. Please review the output of what we received below.

import-ascents-success-message = Your data has been successfully read. Please review it for accuracy and make any necessary changes. Then hit the green <strong>Submit</strong> button at the end of page.

import-ascents-no-date-specified = No date specified
import-ascents-date-specified-but-could-not-get = Date specified but could not be determined:
import-ascents-duplicate-text-warning = <strong>Duplicate:</strong> There is more than one selection with this name

import-grid-introduction = If you have been tracking your <strong>New Hampshire 48 4000-footers Grid</strong> via the official Grid spreadsheet, <a href="http://www.48x12.com/application.shtml" target="_blank">found here</a>, you may import that data directly into Wilderlist with following steps.

import-grid-steps-1 = <strong>Upload your spreadsheet to Google Drive</strong> - If you are already using your spreadsheet via Google Drive (as opposed to Microsoft Excel) than you can skip to step 2. Otherwise navigate to <a href="https://drive.google.com/" target="_blank">Google Drive</a> and then click the <strong>"New"</strong> button in the top left corner. From there select <strong>File upload</strong> and select your grid file.
import-grid-steps-2-a = <strong>Publish your spreadsheet</strong> - Open your Grid spreadsheet in Google Docs. Then click <strong>File > Publish to the web</strong>.
import-grid-steps-2-b = A window with two dropdown boxes will appear. Select the one that says <strong>"Entire Document"</strong> and click on the grid that you want import (i.e. <em>Grid 1</em>). Then select the other box that says <strong>"Web Page"</strong> and click the option that says <strong>Comma-separated values (.csv)</strong>. Your settings should look like the diagram below -
import-grid-steps-3 = <strong>Copy the link to Wilderlist</strong> - Once your settings look good, press the <strong>Publish</strong> button. The window will then update with a link. Copy it and paste it into the box on this page.

import-grid-paste-url = Paste your Google Sheets Grid URL here

import-grid-error-entire-file = It appears as though you published the entire Grid file instead of a single page. Please review the steps to import and try again.
import-grid-error-not-csv = The Google Sheets file you pasted does not appear to be in CSV format. Please review the steps to import and try again.
import-grid-error-not-google-url = The url you pasted does not appear to be a valid Google Spreadsheets url. Please review the steps to import and try again.
import-grid-error-network-error = Unable to access your Google Sheets file. Please review the steps to import and try again.
import-grid-error-incorrect-format = The spreadsheet you are trying to import does not appear to have the same formatting as the <a href="http://www.48x12.com/application.shtml" target="_blank">official Grid spreadsheet</a>. Please review the steps to import and try again.

import-grid-success = Your Grid ascents have been successfully retrieved. Please <strong>review</strong> them below for accuracy and then press the green <strong>Confirm</strong> button at the bottom to import them into Wilderlist.

import-grid-img-alt-new-button = Click the NEW button in Google Drive
import-grid-img-alt-file-upload = Then select FILE UPLOAD
import-grid-img-alt-file-publish = Go to File > Publish to the web
import-grid-img-alt-publish-setting = Select the Grid you would like to publish and set it to CSV
import-grid-img-alt-publish-link = Copy the generated link
