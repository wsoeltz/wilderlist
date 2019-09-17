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

header-text-login-with-google = Login With Google
header-text-menu-item-dashboard = Dashboard
header-text-menu-item-lists = Lists
header-text-menu-item-friends = Friends
header-text-menu-item-admin-panel = Admin Panel
header-text-menu-item-logout = Logout

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
  <div>For example, <em>March 9, 2014</em> would show as <em>9, '14</em>.</div>

mountain-detail-remove-ascent-modal-text = Remove&#32;<strong>{ $date }</strong>&#32;from your ascents?
mountain-detail-add-another-ascent = Add another ascent
mountain-detail-add-ascent-date = Add Ascent Date
mountain-detail-remove-ascent = Remove Ascent
mountain-detail-no-ascents-text = You have not yet hiked { $mountain-name }.
mountain-detail-lists-mountain-appears-on = Lists { $mountain-name } appears on:

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

user-profile-lists-in-progress = Lists in progress
user-profile-lists-completed = Completed Lists

user-profile-remove-friend-modal = Remove&#32;<strong>{ $name }</strong>&#32;from your friends?

user-card-completed = Completed
user-card-working-on = Working On
user-card-not-currently-working-on = Not currently working on any lists

map-text-attribution = Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)
