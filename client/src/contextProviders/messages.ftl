global-text-value-wilderlist-name = Wilderlist
global-text-value-default-meta-description = Track, plan and share your hiking and mountaineering adventures.

meta-data-list-search-default-title = Search hiking lists - Wilderlist
meta-data-mtn-search-default-title = Search mountains - Wilderlist
meta-data-campsite-search-default-title = Search campsites - Wilderlist
meta-data-trail-search-default-title = Search trails - Wilderlist
meta-data-friend-search-default-title = Friends - Wilderlist
meta-data-settings-default-title = Settings - Wilderlist
meta-data-dashboard-default-title = Dashboard - Wilderlist
meta-data-your-stats-default-title = Your Stats - Wilderlist
meta-data-privacy-default-title = Privacy Policy - Wilderlist
meta-data-about-title = About - Wilderlist
meta-data-terms-of-use-default-title = Terms of Use - Wilderlist
meta-data-detail-default-title = { $title }{
  $type ->
    *[standard] {""}
    [winter] , Winter
    [fourSeason] , 4-Season
    [grid] , Grid
  } - Wilderlist
meta-data-compare-peak-list-title = Comparing { $title }{
  $type ->
    *[standard] {""}
    [winter] , Winter
    [fourSeason] , 4-Season
    [grid] , Grid
  } with { $user } - Wilderlist
meta-data-compare-all-title = Comparing all ascents with { $user } - Wilderlist

meta-data-mountain-detail-description = { $name }{ $state } stands at { $elevation }ft high{ $additionaltext }. View trails, camping, directions, weather, and trip reports for { $name }.

meta-data-campsite-detail-description = { $name } is a { $type } in { $state }. Explore nearby trails, mountains, directions, weather, and trip reports for { $name }.

meta-data-trail-detail-description = { $name } is a { $type } in { $state }. Find nearby camping, mountains, directions, weather, and trip reports for { $name }.

meta-data-mountain-search-description = Search for mountains and find maps, trails, weather and trip reports.
meta-data-peak-list-search-description = Search for hiking lists like the New Hampshire 4000 Footers, New England 100 Highest, the Adirondack 46ers, and many more.
meta-data-campsite-search-description = Search for campsites and find maps, trails, weather and trip reports.
meta-data-trail-search-description = Search for trails and find maps, trails, weather and trip reports.

meta-data-peak-list-detail-description = {
  $type ->
  *[standard] Plan and track your ascents of { $list-name } ({ $list-short-name }) with maps, weather, trip reports and directions for all { $num-mountains } peaks{ $state-or-region-string }.
  [winter] Plan and track your ascents of { $list-name } ({ $list-short-name }) in the winter with maps, weather, trip reports and directions for all { $num-mountains } peaks.
  [fourSeason] Plan and track your 4-Season ascents on the peaks of the { $list-name } ({ $list-short-name }) with trail maps, weather and trip reports, and robust tracking tools.
  [grid] The 12-month Grid, the ultimate hiking challenge. Plan and track your ascents as you work towards the { $list-name } Grid with trail maps, weather and trip reports, and robust tracking tools.
}

meta-data-privacy-policy-description = Read Wilderlist's Privacy Policy.
meta-data-terms-of-use-description = Read Wilderlist's Terms of Use.

global-text-value-navigation-next = Next
global-text-value-navigation-prev = Previous

global-text-value-list-view = List
global-text-value-detail-view = Detail

global-text-value-search-hiking-lists = Search hiking lists
global-text-value-search-mountains = Search mountains
global-text-value-search-trails = Search trails
global-text-value-search-campsites = Search campsites
global-text-value-search-users = Search users
global-text-value-search-geo = Search for a location

global-text-value-generic-user = Wilderlist User
global-text-value-private = Private
global-text-value-private-list = This list is private

global-text-value-search-mountains-to-add = Search for mountains to add
global-text-value-search-trails-to-add = Search for trails to add
global-text-value-search-campsites-to-add = Search for campsites to add

global-text-value-view-route = View route

global-text-value-fitler-items = Filter {
  $type ->
    [mountain] mountains
    [campsite] campsites
    [trail] trails
    *[other] items
} on list

global-text-value-miles-to = {
  $miles ->
    [1] mile
    *[else] miles
} to {
  $type ->
    [mountain] summit
    [campsite] campsite
    [trail] summit
    *[other] point
}
global-text-value-feet-to = {
  $feet ->
    [1] foot
    *[else] feet
} to {
  $type ->
    [mountain] summit
    [campsite] campsite
    [trail] summit
    *[other] point
}

global-text-value-no-routes-to = No {
  $type ->
    [mountain] routes to summit
    [campsite] nearby campsites
    [trail] nearby mountains
    *[other] routes to point
} found

global-text-value-results-near-center = Showing { $type } near map center
global-text-value-results-bottom-of-results = Move the map or use the search bar to find more { $type }
global-text-value-no-results-found = No results found.
global-text-value-no-items-found = No { $type } found.
global-text-value-no-items-found-map = No { $type } found near this location.
global-text-value-no-results-found-for-term = No results found for&#32;<strong>{ $term }</strong>
global-text-value-no-users-found-for-term = No users found for&#32;<strong>{ $term }</strong>
global-text-value-are-you-sure-modal = Please Confirm
global-text-value-modal-confirm = Confirm
global-text-value-modal-dismiss = Dismiss
global-text-value-modal-create-trip-report = Create Trip Report
global-text-value-modal-cancel = Cancel
global-text-value-cancel-delete-request = Cancel delete request
global-text-value-modal-close = Close
global-text-value-modal-close-menu = Close Menu
global-text-value-modal-close-panel = Close Panel
global-text-value-modal-mark-complete = Log Trip
global-text-value-description = Description
global-text-value-directions = Directions
global-text-value-yes = Yes
global-text-value-no = No
global-text-value-more = more
global-text-value-or = or
global-text-value-in = in
global-text-value-to = to
global-text-value-from = from
global-text-value-others = {
  $count ->
    [1] other
    *[other] others
}
global-text-value-on = on
global-text-value-back = Back
global-text-value-loading = Loading
global-text-value-loading-routes = Finding routes
global-text-value-loading-campsites = Finding campsites
global-text-value-loading-mountains = Finding mountains
global-text-value-loading-directions = Finding directions
global-text-value-loading-medium =  This is taking awhile, please don't get lost
global-text-value-loading-long =  Our bearing seems to be off, sorry about the wait
global-text-value-loading-extra-long =  Hmmm, I don't know how we got here. Contact us at help@wilderlist.app if these loading times continue

global-text-value-contact = Contact
global-text-value-phone = Phone
global-text-value-website = Website

global-error-retrieving-data = There was an error retrieving the data. Please try refreshing or accessing a different page. If the problem persists, contact us at help@wilderlist.app
global-error-saving-data = There was a network error trying to save the data. Please try again. If the problem persists, contact us at help@wilderlist.app
global-text-value-no-permission = You do not have permission to access this page. If you think this is in error, please contact us at help@wilderlist.app
global-text-value-none-avail = None Available
global-text-value-no-data = No Data

global-text-value-modal-reddit = Reddit
global-text-value-modal-email = Email
global-text-value-modal-email-address = Email Address
global-text-value-name = Name
global-text-value-profile-picture = Profile Picture
global-text-value-modal-sign-up-today = Start tracking progress on { $list-short-name } with a free account
global-text-value-modal-sign-up-today-save = Save { $list-short-name } for later with a free account
global-text-value-modal-sign-up-today-import = Import your data and start tracking your progress in just a few clicks
global-text-value-modal-sign-up-today-export = Export your data with a free account
global-text-value-modal-sign-up-today-ascents-list = Start tracking ascents for { $mountain-name } and other peaks with a free account
global-text-value-modal-sign-up-log-trips = Start logging trips with a free account

global-text-value-modal-cancel-request-text = This will cancel your request to have { $name } deleted.
global-text-value-modal-request-delete-title = Request delete
global-text-value-modal-request-delete-text = This will submit a request to have { $name } deleted. Are you sure you want to continue?

global-text-value-unsaved-changes = You have changes that won't be saved if you leave. Are you sure you want to continue?

global-text-value-mountain = Mountain
global-text-value-mountains = Mountains
global-text-value-trails = Trails
global-text-value-campsite = Campsite
global-text-value-campsites = Campsites
global-text-value-camping = Camping
global-text-value-parking = Parking
global-text-value-ascents = ascents
global-text-value-dates = Dates
global-text-value-date = Date
global-text-value-regions = Regions
global-text-value-state = State
global-text-value-length = Length
global-text-value-distance = Distance
global-text-value-duration = Duration
global-text-value-average-incline = Average Incline
global-text-value-total-segments = Total Segments
global-text-value-incline = Incline
global-text-value-max-incline = Max. Incline
global-text-value-min-incline = Min. Incline
global-text-value-max = Max
global-text-value-min = Min
global-text-value-loss = Loss
global-text-value-gain = Gain
global-text-value-elevation = Elevation
global-text-value-elevation-gain = Elevation Gain
global-text-value-high-point = Highest Point
global-text-value-low-point = Lowest Point
global-text-value-trail = Trail
global-text-value-trail-segments = Trail Segments
global-text-value-feet = feet
global-text-value-meters = meters
global-text-value-latitude = Latitude
global-text-value-longitude = Longitude
global-text-value-prominence = Prominence
global-text-value-location = Location
global-text-value-everywhere = Everywhere
global-text-value-ascent-dates = Your Ascents
global-text-value-item-notes-and-dates = Your notes and {
  $type ->
    [mountain] Ascents
    [campsite] Trips
    [trail] Hikes
    *[other] Trips
}
global-text-value-item-dates = Your {
  $type ->
    [mountain] Ascents
    [campsite] Trips
    [trail] Hikes
    *[other] Trips
}
global-text-value-done = Hiked
global-text-value-not-done = Not Hiked

global-text-value-neither-hiked = Neither have Hiked
global-text-value-one-hiked = One has Hiked
global-text-value-both-hiked = Both have Hiked

global-text-value-not-done-dynamic = {
  $type ->
    [mountains] Not yet hiked
    [campsites] Not yet camped
    [trails] Not yet hiked
    *[other] Not yet visited
}
global-text-value-last-trip-dynamic = {
  $type ->
    [mountains] You last hiked on
    [campsites] You last camped on
    [trails] You last hiked on
    *[other] Your last trip on
}
global-text-value-last-trip = Last trip
global-text-value-today = Today
global-text-value-yesterday = Yesterday
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

global-formatted-text-date = {
  $month ->
  *[1] January
  [2] February
  [3] March
  [4] April
  [5] May
  [6] June
  [7] July
  [8] August
  [9] September
  [10] October
  [11] November
  [12] December
} { $day }, { $year }

global-formatted-text-date-compact = {
  $month ->
  *[1] Jan
  [2] Feb
  [3] Mar
  [4] Apr
  [5] May
  [6] Jun
  [7] Jul
  [8] Aug
  [9] Sep
  [10] Oct
  [11] Nov
  [12] Dec
} { $day }, { $year }

global-formatted-text-date-day-month = {
  $month ->
  *[1] January
  [2] February
  [3] March
  [4] April
  [5] May
  [6] June
  [7] July
  [8] August
  [9] September
  [10] October
  [11] November
  [12] December
} { $day }

global-formatted-text-month-year = {
  $month ->
  *[1] January
  [2] February
  [3] March
  [4] April
  [5] May
  [6] June
  [7] July
  [8] August
  [9] September
  [10] October
  [11] November
  [12] December
} { $year }

global-formatted-trail-type = {
  $type ->
  *[trail] trail
  [dirtroad] dirt road
  [path] path
  [stairs] path
  [cycleway] bike trail
  [road] road
  [hiking] trail
  [bridleway] trail
  [demanding_mountain_hiking] trail
  [mountain_hiking] trail
  [herdpath] herd path
  [alpine_hiking] alpine trail
  [demanding_alpine_hiking] alpine trail
  [difficult_alpine_hiking] alpine trail
  [parent_trail] feature route
}

global-formatted-campsite-type = {
  $type ->
  *[camp_site] campsite
  [caravan_site] campground
  [weather_shelter] shelter
  [camp_pitch] tentsite
  [lean_to] lean-to
  [wilderness_hut] wilderness hut
  [alpine_hut] alpine hut
  [basic_hut] hut
  [rock_shelter] rock shelter
}

global-formatted-anything-type = {
  $type ->
  [camp_site] campsite
  [caravan_site] campground
  [weather_shelter] weather shelter
  [camp_pitch] tentsite
  [lean_to] lean-to
  [wilderness_hut] wilderness hut
  [alpine_hut] alpine hut
  [basic_hut] basic hut
  [rock_shelter] rock shelter
  [trail] trail
  [dirtroad] dirt road
  [path] path
  [stairs] path
  [cycleway] bike trail
  [road] road
  [hiking] trail
  [bridleway] trail
  [demanding_mountain_hiking] trail
  [mountain_hiking] trail
  [herdpath] herd path
  [alpine_hiking] alpine trail
  [demanding_alpine_hiking] alpine trail
  [difficult_alpine_hiking] alpine trail
  [parent_trail] feature route
  [information_board] information board
  [information_map] information map
  [picnic_site] picnic site
  [park] park
  [trailhead] trailhead
  [parking_space] parking area
  [parking] parking lot
  [intersection] trail/road crossing
  *[other] point
}

global-type-official-classification = {
  $type ->
  [camp_site] campsite
  [caravan_site] campground
  [weather_shelter] weather shelter
  [camp_pitch] tentsite
  [lean_to] lean-to
  [wilderness_hut] wilderness hut
  [alpine_hut] alpine hut
  [basic_hut] basic hut
  [rock_shelter] rock shelter
  [trail] trail
  [dirtroad] dirt road
  [path] path
  [stairs] stairs
  [cycleway] bike trail
  [road] road
  [hiking] hiking trail
  [bridleway] horse trail
  [demanding_mountain_hiking] demanding mountain hiking trail
  [mountain_hiking] mountain hiking trail
  [herdpath] herd path
  [alpine_hiking] alpine trail
  [demanding_alpine_hiking] demanding alpine trail
  [difficult_alpine_hiking] difficult alpine trail
  [parent_trail] parent route
  [information_board] information board
  [information_map] information map
  [picnic_site] picnic site
  [park] park
  [trailhead] trailhead
  [parking_space] parking area
  [parking] parking lot
  [intersection] trail/road crossing
  *[other] point
}

global-type-official-classification-description = {
  $type ->
  [camp_site] An area that has space for multiple tents.
  [caravan_site] A vehicle accessible camping area. It likely has at least some basic facilities and RVs may be allowed.
  [weather_shelter] Designed to protect people from the elements.
  [camp_pitch] An area for a single tent or a few small tents.
  [lean_to] A simple shelter for sleeping in, typically designed with three walls and a roof.
  [wilderness_hut] A backcountry building designed for sleeping in. It often includes some basic amenities.
  [alpine_hut] A backcountry building designed for sleeping in. It often includes some basic amenities.
  [basic_hut] A building designed for sleeping in. It may includes some basic amenities.
  [rock_shelter] A basic structure designed to protect from the elements.
  [trail] A primarily foot-accessible pathway.
  [dirtroad] An unpaved road. Vehicles may be allowed.
  [path] A foot-accessible pathway that could be a trail, sidewalk, road or other.
  [stairs] A vertical series of steps over an incline.
  [cycleway] A bike-accessible trail or road.
  [road] A vehicle accessible road. Foot travel may also be permitted.
  [hiking] A primarily foot-accessible trail.
  [bridleway] A horse-accessible trail or road.
  [demanding_mountain_hiking] A very difficult hiking trail in the mountains.
  [mountain_hiking] A difficult hiking trail in the mountains.
  [herdpath] A trail that has formed primarily by the repeated use of people or animals. Often not maintained.
  [alpine_hiking] An advanced hiking trail in the mountains. Use of hands may be necessary.
  [demanding_alpine_hiking] An advanced hiking trail in the mountains. May require climbing equipment.
  [difficult_alpine_hiking] An expert level hiking trail in the mountains. Requires climbing equipment and experience.
  [parent_trail] A feature route linking together a number of other trails.
  [information_board] A board with information about the area.
  [information_map] A board with a map of the area.
  [picnic_site] A place with picnic tables.
  [park] A place with greenspace for people to hang out or walk around in.
  [trailhead] The start of a trail.
  [parking_space] A spot for a one or a very small number of cars.
  [parking] An area for a number of cars to be parked.
  [intersection] A point at which a trail and a road cross each other.
  *[other] A point on the map.
}

global-view-all-classifications = View all classifications

global-text-value-weeks = weeks
global-text-value-week = week
global-text-value-days = days
global-text-value-day = day
global-text-value-hours = hours
global-text-value-hour = hour

global-text-value-open = Open
global-text-value-open-for-winter = Open for Winter
global-text-value-open-for = Open for
global-text-value-open-for-every-month-except = Open for every month except
global-text-value-open-for-every-season-except = Open for every season except
global-text-value-complete = Complete
global-text-value-completed-on = Completed on
global-text-value-completed-in-every-month = Completed in every month
global-text-value-completed-in-every-season = Completed in every season
global-text-value-mountain-not-being-pursued = This mountain is not being pursued

global-text-value-appears-on = Find { $name } on:

global-text-value-submit = Submit
global-text-value-clear = Clear

global-text-value-copy = Copy
global-text-value-edit = Edit
global-text-value-change = Change
global-text-value-save-and-add = Save and Add Another
global-text-value-save = Save
global-text-value-saved = Saved
global-text-value-save-changes = Save Changes
global-text-value-saving = Saving
global-text-value-all-changes-saved = All Changes Saved

global-form-html-required-note = <span class="red-text">*</span> Indicates a required field

global-text-value-selected = Selected

global-text-value-your-location = Your Location

global-text-value-delete = Delete
global-text-value-remove = Remove

global-text-value-flag = Report Issue
global-text-value-optional = Optional
global-text-value-parent = Parent

global-text-value-privacy = Privacy
global-text-value-visibility = Visibility

global-text-value-other-list-versions = Other Version of this list

global-text-value-additional-resources = Additional Resources
global-text-value-external-resources = External Resources
global-text-value-add-external-resources = Add Another Resource
global-text-value-resource-title = Resource Title
global-text-value-resource-url = http://example.com

global-text-value-tracking-type = Tracking Type
global-text-value-type = Type
global-text-value-list-type = {
  $type ->
    *[standard] Standard
    [winter] Winter
    [fourSeason] 4-Season
    [grid] Grid
}
global-text-value-list-type-tooltip = {
  $type ->
    *[standard] Track your hikes on this list
    [winter] Track your hikes on this list in the winter
    [fourSeason] Track your hikes on this list over every season
    [grid] Track your hikes on this list over every month
}

global-text-value-difficulty = difficulty
global-text-value-list-tier = {
  $tier ->
    *[casual] Casual
    [advanced] Advanced
    [expert] Expert
    [mountaineer] Mountaineer
}
global-text-value-list-tier-desc =
  <p>
  Please select an appropriate difficulty for this list.
  </p>
  <p>
  <strong>Casual</strong> lists tend to have less than 20 peaks and can be completed by most people with an average to low-average fitness level.
  </p>
  <p>
  <strong>Advanced</strong> lists tend to have less than 100 peaks and can be completed by most people with an average fitness level.
  </p>
  <p>
  <strong>Expert</strong> lists may have up to 200 peaks <strong>and/or</strong> require a higher fitness level or more advanced technical skills, such as winter hiking or compass navigation.
  </p>
  <p>
  <strong>Mountaineer</strong> lists may have any number of peaks <strong>and/or</strong> require a high fitness level and may require advanced mountaineering skills.
  </p>


global-add-trip-report = Log&nbsp;a Trip
global-create-route = Plan a Route
global-plan-trip = Plan&nbsp;a Trip
global-3d-mode-on = Turn&nbsp;on 3D&nbsp;Mode
global-3d-mode-off = Turn&nbsp;off 3D&nbsp;Mode
global-map-layers = Layers
global-tools-and-settings = Tools

global-text-details = Details
global-text-nearby = Nearby
global-text-classification = Classification
global-text-information = Information
global-text-amenities = Amenities


header-text-login-with-google = Login With Google
header-text-login-with-reddit = Login With Reddit
header-text-login-with-facebook = Login With Facebook
header-text-login-or-sign-up = Login or Sign up

header-text-menu-item-dashboard = Dashboard
header-text-menu-item-lists = Hiking Lists
header-text-menu-item-lists-short = Lists
header-text-menu-item-mountains = Mountains
header-text-menu-item-trails = Trails
header-text-menu-item-camping = Camping
header-text-menu-item-your-stats = Your Stats
header-text-menu-item-about = About
header-text-menu-item-your-stats-short = Stats
header-text-menu-item-friends = Friends
header-text-menu-item-admin-panel = Admin Panel
header-text-menu-item-logout = Logout
header-text-menu-my-profile = My Profile
header-text-menu-settings = Settings
header-text-menu-privacy-policy = Privacy Policy
header-text-menu-terms-of-use = Terms of Use

notification-bar-ascent-marked = marked you as hiking
notification-bar-camped-marked = marked you as camping at

dashboard-title = Dashboard & Saved Items

login-page-plan-your-trip-title = Plan your trip
login-page-plan-your-trip-desc = ● Maps ● Trails ● Camping ● Weather Forecasts ● Trip Reports ● Driving Directions
login-page-track-your-adventure-title = Track your adventure
login-page-track-your-adventure-li-1 = ● Plan your trip with up-to-date weather forecasts, trail conditions, and mountain elevation
login-page-track-your-adventure-li-2 = ● Find the best trails and nearby campsites with the easy to use interactive map 
login-page-track-your-adventure-li-3 = ● Update your recent hiking trips for your recording keep and share your activity with friends
login-page-track-your-adventure-li-4 = ● Easily upload your existing hiking lists and download recent activity
login-page-track-your-adventure-li-5 = ● Create and share your own lists
login-page-sign-up-for-free = Sign Up For Free


settings-page-sync-your-account-help = To update your <a href="https://support.google.com/mail/answer/8158?hl=en" target="__blank">name</a>, email, or <a href="https://support.google.com/mail/answer/35529?hl=en&ref_topic=3394219" target="__blank">profile picture</a>, you must change it from your <a href="https://support.google.com/mail/answer/8158?hl=en" target="__blank">Google Account</a> and then log back in here. If you made changes and they are not showing up, try <a href="/api/logout">logging out</a> out and then logging back in.

settings-page-sync-your-account-reddit = To update your profile picture, you must change it from your Reddit account and then log back in here. If you made changes and they are not showing up, try <a href="/api/logout">logging out</a> out and then logging back in.

settings-page-sync-your-account-facebook = To update your name, email, or profile picture, you must change it from your Facebook account and then log back in here. If you made changes and they are not showing up, try <a href="/api/logout">logging out</a> out and then logging back in.

settings-page-privacy-settings = Privacy Settings
settings-page-display-email = Display your email address on your profile
settings-page-display-profile-picture = Display your Profile Picture on your profile
settings-page-display-profile-in-search = Have your account appear in search results

settings-page-notification-settings = Notifications Settings
settings-page-notification-settings-email = Email Notifications

settings-page-delete-account = Delete your Account
settings-page-delete-account-text = If you no longer wish to have an account on Wilderlist, you may contact us at <strong>help@wilderlist.app</strong> and we will delete your account. <strong>This action is permanent and CANNOT be undone. All your data will be deleted.</strong>

dashboard-empty-state-no-active-lists-text = You haven't added any active lists yet. Search for lists and add them by clicking the blue star button to save them to your account. Any mountains, trails, or campsites you mark done will be tracked across every list on Wilderlist, regardless of whether you have started it or not. Happy hiking!

dashboard-empty-state-no-saved-mountains-text = You haven't saved any mountains yet. Search for mountains and add them by clicking the blue star button to save them to your account.

dashboard-empty-state-no-saved-trails-text = You haven't saved any trails yet. Search for trails and add them by clicking the blue star button to save them to your account.

dashboard-empty-state-no-saved-campsites-text = You haven't saved any campsites yet. Search for campsites and add them by clicking the blue star button to save them to your account.

dashboard-empty-state-no-active-lists-button = Find Hiking Lists
dashboard-empty-state-no-friends-text = You haven't added any friends yet.
dashboard-empty-state-no-friends-button = Find Friends
dashboard-suggested-lists = Suggested Lists

dashboard-empty-state-no-saved-mountains = Find Mountains
dashboard-empty-state-no-saved-trails = Find Trails
dashboard-empty-state-no-saved-campsites = Find Campsites

dashboard-back-to-dashboard = Back to Dashboard

your-stats-title = Your Stats

stats-mountain-panel = All In Progress & Completed Mountains
stats-total-mountains = ({ $total } total)
stats-showing-ascents-for = Showing ascents for:
global-text-value-list-type-description = {
  $type ->
    *[standard] Any Time
    [winter] Winter Only
    [fourSeason] Each Season (4-Season)
    [grid] Each Month (Grid)
}
stats-mountain-panel-no-mountains-para-1 =
  Once you start adding lists and marking mountains complete you will see them here. This space will list everything you've completed to date as well as everything you're pursuing.

stats-mountain-panel-no-mountains-para-2 =
  Already have spreadsheets full of your ascents? No problem! You can import any spreadsheet data directly from a Hiking List page and get your Wilderlist up to speed in no time. Just go to a Hiking List and look for the green 'Import Ascents' button.

stats-total-overall-ascents = Total Overall Ascents
stats-total-unique-mountains-ascended = Total Unique Mountains Ascended
stats-most-hiked-mountains = Most Hiked Mountains
stats-most-hiked-months = Most Hiked Months
stats-your-wilderlist-contributions = Your Wilderlist Contributions
stats-total-wilderlist-contributions = Total Wilderlist Contributions
stats-trip-reports-written = Trip Reports Written
stats-mountains-added = Mountains Added
stats-hiking-lists-created = Hiking Lists Created
stats-time-between-hikes = Time Between Hikes
stats-average-time-context-note-html = Average time is calculated based on the time between recorded <em>full dates</em>, starting with your first recorded date on Wilderlist to your last.
stats-top-hiked-states = Top Hiked States
stats-top-hiked-years = Top Hiked Years
stats-top-hiked-seasons = Top Hiked Seasons
stats-total-lifetime-elevation = Total Lifetime elevation
stats-total-lifetime-context-note = Lifetime Elevation is calculated based on the total elevation of each peak hiked for a given day. Wilderlist does not currently take into account prominence or elevation gain.
stats-your-lists = Your Hiking Lists
stats-your-lists-pursued = Hiking lists being pursued
stats-your-lists-complete = Hiking lists completed
stats-your-lists-percent = Percentage Complete For All Lists
stats-no-average-time = You need more than one recorded hike with a full date to see your average.
stats-average-time-since-start = Average time between hikes since { $start-date }

list-search-list-detail-placeholder = Select a list on the left to see more details
mountain-search-mountains-detail-placeholder = Select a mountain on the left to see more details
list-detail-mountain-detail-placeholder = Select a mountain to see more details

peak-list-search-state = Showing lists only with mountains in <strong>{ $state-name }</strong>.
map-search-back-to-map = Back to Map
map-search-states-title = Explore Hiking Lists
map-search-color-scale-text = Number of lists in state or territory

peak-list-text-latest-ascent = {
  $completed ->
    [true] Completed
    *[false] Latest ascent
} {
  $has-full-date ->
    *[false] in
    [true] on
}
peak-list-text-no-completed-ascent = No logged hikes yet
peak-list-text-completed-ascent = Completed Ascents
peak-list-text-total-points = Total Points
peak-list-text-total-ascents = Total Ascents
peak-list-text-across-the-us = Across the US

peak-list-text-last-hiked = You last hiked on

peak-list-detail-text-modal-remove-confirm = Remove&#32;<strong>{ $peak-list-name }</strong>&#32;from your active lists?
peak-list-detail-text-begin-list = Start Tracking
peak-list-detail-text-remove-list = Stop Tracking
peak-list-detail-select-mountain = Select a mountain to see its details and your ascents
peak-list-detail-filter-mountains = Filter mountains

peak-list-detail-list-overview-empty = { $list-name } does not yet have any mountains associated with it.

peak-list-detail-list-standard-para-1 = The { $list-name } {
  $type ->
    *[standard] {""}
    [winter] in the Winter
    [fourSeason] 4-Season
    [grid] Grid
} is a list with {
  $number-of-peaks ->
    [1] 1 mountain that is
    *[other] { $number-of-peaks } mountains that are
} located ⁨{
  $state-or-region ->
    [state] within
    *[region] throughout
} { $state-region-name }. Sitting at { $highest-mountain-elevation }ft, ⁨{ $highest-mountain-name } is the highest point on the { $list-name }. The smallest mountain is { $smallest-mountain-name } at { $smallest-mountain-elevation }ft.

peak-list-detail-list-standard-para-2 = Explore the different peaks and track your progress towards completing the { $list-name } below.

peak-list-detail-list-winter-has-parent-para-1 = The { $list-name } In the Winter ({ $short-name } - Winter) takes the standard { $parent-list-name } list to the next level. Just like it's any-season counterpart, { $short-name } - Winter spans {
  $number-of-peaks ->
    [1] 1 peak
    *[other] { $number-of-peaks } peaks
} in { $state-region-name }. Each mountain stands at over { $min-elevation-rounded } feet of elevation, ranging from { $smallest-mountain-name } at { $smallest-mountain-elevation } feet tall to { $highest-mountain-name } at { $highest-mountain-elevation } feet.

peak-list-detail-list-winter-para-2 = Winter conditions can be a lot more difficult with much more dangerous weather patterns. Special gear, more advanced knowledge, and greater physical capabilities may be required to safely hike the mountains of the { $list-name } in the winter. In order for an ascent to count towards { $short-name } - Winter, it must be completed during the official calendar winter between the solstice and spring equinox. For this { $current-or-upcoming } season, those dates are between { $solstice } and { $equinox }. Wilderlist automatically tracks any ascent recorded in this time frame for you, across all of your past hikes of any year.

peak-list-detail-list-winter-para-3 = Explore the different peaks, get updates on the conditions and weather reports, and track your progress towards completing the { $list-name } In the Winter below.

peak-list-detail-list-4-season-has-parent-para-1 = The { $list-name } 4-Season ({ $short-name } - 4-Season) gives you the experience of seeing the mountains of the { $parent-list-name } through the ever changing seasons. Just like it's standard counterpart, { $short-name } - 4-Season includes {
  $number-of-peaks ->
    [1] 1 peak
    *[other] { $number-of-peaks } peaks
} in { $state-region-name }. Each mountain stands at over { $min-elevation-rounded } feet of elevation, ranging from { $smallest-mountain-name } at { $smallest-mountain-elevation } feet tall to { $highest-mountain-name } at { $highest-mountain-elevation } feet.

peak-list-detail-list-4-season-para-2 = Mountain conditions in the late fall, winter, and spring can be a lot more difficult with much more dangerous weather patterns. Special gear, more advanced knowledge, and greater physical capabilities may be required to safely hike the mountains of the { $list-name } in those times of the year. Ascents for each season in { $short-name } - 4-Season are counted based on the official calendar seasons of a given year. For { $current-year }, spring starts on { $first-day-of-spring }, summer starts on { $first-day-of-summer }, fall starts on { $first-day-of-fall }, and winter starts on { $first-day-of-winter }. Wilderlist automatically tracks any ascents recorded in their respective seasons, across all of your hikes for any and all years.

peak-list-detail-list-4-season-para-3 = Explore the different peaks, get updates on the conditions and weather reports, and track your progress towards completing the { $list-name } 4-Season below.

peak-list-detail-list-grid-has-parent-para-1 = The { $list-name } Grid ({ $short-name } Grid) is the the ultimate hiking challenge for the { $parent-list-name }. { $short-name } Grid includes the same {
  $number-of-peaks ->
    [1] 1 peak
    *[other] { $number-of-peaks } peaks
} in { $state-region-name } as found on the standard list. But to finish the Grid, you must complete each of these peaks every month of the year, for a total of { $total-ascents } ascents.

peak-list-detail-list-grid-para-2 = Mountain conditions in the late fall, winter, and spring can be a lot more difficult with much more dangerous weather patterns. Special gear, more advanced knowledge, and greater physical capabilities may be required to safely hike the mountains of the { $list-name } in those times of the year. Wilderlist automatically tracks any ascents recorded in their respective months, across all of your hikes for any and all years. The { $list-name } Grid often takes people years to complete.

peak-list-detail-list-grid-para-3 = Explore the different peaks, get updates on the conditions and weather reports, and track your progress towards completing the { $list-name } Grid below.

peak-list-detail-friend-viewing-list = Viewing list for
peak-list-detail-friend-view-your-progress-button = View your progress
peak-list-detail-your-progress = Your progress
compare-progress-for = Compare Progress For

peak-list-detail-text-optional-mountains = Optional Mountains
peak-list-detail-text-optional-mountains-desc = The following mountains are considered optional for this list. They fit the criteria needed to be on here, but for one reason or another they are not required for completion. Common reasons include the peak being on private property or requiring special permissions to be able to climb. Optional peaks do not count towards a 100% completion for this list.

peak-list-detail-text-optional-toggle = Show optional { $type }s
peak-list-detail-text-optional-items-desc = Optional { $type }s are included below but do not count towards 100% completion for this list. Common reasons include the { $type } being on private property or requiring special permissions to be able to access, or they might just be fun or informative add ons to the list.

peak-list-export-grid-special-link = Export your Wilderlist ascents to the official Grid Application

user-notes-title = Your Notes
user-notes-placeholder = Keep your own personal notes for { $name } here.
user-notes-tooltip = Your personal notes are private to your account and are not viewable by anyone else.
user-notes-placeholder-not-logged-in = Create a free account to keep your own personal notes for { $name } here.

mountain-search-no-results-mobile = No mountains found near { $map-center-text }. Use the search above or go to the map view to explore.
mountain-search-no-results-map = No mountains found here. Try moving the map or using the search above.
mountain-search-query-desc = Showing mountains for query <strong>{ $search-query }</strong>.
mountain-search-generic-desc = Showing mountains that match your search filter.
mountain-search-map-text = Showing mountains near { $map-center-text }
mountain-search-mobile-nav-list = List View
mountain-search-mobile-nav-map = Map View

mountain-card-view-details = View Details
mountain-card-show-on-map = Show on map

crow-flies-distance = { $distance } mi to { $name }
crow-flies = as the crow flies
crow-flies-tooltip = "As the crow flies" is the straight-line distance between two locations. For driving directions or route lengths, select an individual item.

mountain-completion-modal-toggle-btn-full-date = Full Date
mountain-completion-modal-toggle-btn-month-year = Month / Year
mountain-completion-modal-toggle-btn-year-only = Year Only
mountain-completion-modal-toggle-btn-no-date = No Date
mountain-completion-modal-no-date = Mark complete with no date.
mountain-completion-modal-text-note-standard =
  Entering a date is optional for <strong>Standard</strong> lists. However an unspecific date may not count towards other lists that contain this peak.
mountain-completion-modal-text-note-winter =
  <strong>Winter</strong> lists require the date to be in between the <strong>winter solstice</strong> and the <strong>vernal equinox</strong> for a given year. You may still enter other dates here and they will be added to your overall ascent record. But they will not appear on this list if they do not match the criteria.
mountain-completion-modal-text-note-four-season =
  <strong>4-Season</strong> lists require dates to be in between the official solstice and equinox for a given season and year. You may still enter other dates here and they will be added to your overall ascent record. But they will not appear on this list if they do not match the criteria.
mountain-completion-modal-text-note-grid =
  <strong>Grid</strong> lists require dates to be a day within the specified month. You may still enter other dates here and they will be added to your overall ascent record. But they will not appear on this list if they do not match the criteria.

mountain-completion-modal-text-details = Details
mountain-completion-modal-text-required-text = At least one mountain, trail or campsite is required to log a trip
mountain-completion-modal-text-people-hiked-with = Friends on Trip
mountain-completion-modal-text-add-wilderlist-friends = Wilderlist Friends
mountain-completion-modal-text-add-other-friends = Other Friends
mountain-completion-modal-text-add-other-friends-note = Enter the email address of anyone who isn't on Wilderlist to add them
mountain-completion-modal-text-add-email-button = Add Another Email Address

mountain-completion-modal-add-people = Add People
mountain-completion-modal-add-remove-people = Add/Remove People
mountain-completion-modal-done-adding-people = Done Updating People

mountain-completion-modal-text-no-friends-yet = You haven't added any friends yet
trip-log-delete-trip = Delete Trip
trip-log-add-another = Log & Add Next Day

mountain-table-grid-date-note-text =
  <div>Date is shown in <em>DD,'YY</em> format in order to better fit on screen.</div>
  <div>For example, <em>March 9, 2014</em> would show as <em>9, '14</em> under the <strong>March</strong> column.</div>
mountain-table-import-button = Import from spreadsheet
mountain-table-export-button = Download data
download-csv-button = Download CSV
download-gpx-button = Download GPX file
download-official-grid-xlsx-button = Download Grid application with your dates

mountain-detail-summit-view = Summit View
mountain-detail-summit-view-for = Summit View for { $name }
mountain-detail-summit-back = Back to mountain details
mountain-detail-summit-help = Move your mouse to rotate the view

mountain-detail-remove-ascent-modal-text = Remove&#32;<strong>{ $date }</strong>&#32;from your ascents?
mountain-detail-add-another-ascent = Add another ascent
mountain-detail-add-ascent-date = Add Ascent Date
mountain-detail-remove-ascent = Remove Ascent
mountain-detail-no-ascents-text = You have not yet hiked { $mountain-name }.
mountain-detail-lists-mountain-appears-on = Lists { $mountain-name } appears on:
mountain-detail-lists-mountain-appears-on-ranks =  — { $elevation-rank } largest peak

item-detail-remove-trip-modal-text = Remove&#32;<strong>{ $date }</strong>&#32;from your {
  $type ->
    [mountain] ascents
    [trail] hikes
    *[campsite] trips
}?
item-detail-log-trip = Log {
  $type ->
    [mountain] ascent
    [trail] hike
    *[campsite] trip
}
item-detail-remove-trip = Remove {
  $type ->
    [mountain] ascent
    [trail] hike
    *[campsite] trip
}
item-detail-no-ascents-text = You have not yet {
  $type ->
    [mountain] hiked
    [trail] hiked
    [campsite] camped at
    *[else] been to
} { $name }.

directions-select-origin = Select your starting point
directions-your-location = Use your location
directions-nothing-found = Could not find directions to point
directions-open-in-google-maps = Open in Google Maps
directions-google-maps = Google Maps
directions-driving-duration = {
  $hours ->
    [0] {""}
    [1] 1 hr
    *[else] { $hours } hrs
} {
  $minutes ->
    [0] {""}
    [1] 1 min
    *[else] { $minutes } mins
}
directions-driving-distance = {
  $miles ->
    [1] 1 mile
    *[else] { $miles } miles
}
distance-feet-formatted = {
  $feet ->
    [1] 1 foot
    *[else] { $feet } feet
}

mountain-detail-enable-driving-distances = Enable Driving Distances
mountain-detail-driving-distance = {
  $hours ->
    [0] {""}
    [1] 1 hour
    *[else] { $hours } hours
} {
  $minutes ->
    [0] {""}
    [1] 1 minute
    *[else] { $minutes } minutes
} ({
  $miles ->
    [0] You're already there!
    [1] 1 mile
    *[else] { $miles } miles
})
mountain-detail-driving-error-location = There was a problem getting your location.
mountain-detail-driving-error-direction = There was probelm getting directions.
mountain-detail-driving-distance-title = Driving Distance
mountain-detail-pending-approval = This mountain is pending confirmation

mountain-detail-weather-and-reports = Summit Weather & Trip Reports
mountain-detail-snow-depth = Last 7-Day Snowfall & Snow Depth
mountain-detail-notes-and-ascents = Notes & Ascents
mountain-detail-get-weather = Get Weather

trail-detail-subtitle = { $type } { 
  $segment ->
    [0] {""}
    *[else] segment
} in { $state }
trail-child-segments = This route is the connecting parent for { $count } other trails
trail-parent-links = Part of
trail-parent-full-trail = full trail
trail-detail-allows-bikes = Allows Bikes
trail-detail-allows-horses = Allows Horses
trail-detail-water-crossing = Water Crossing
trail-detail-ski-trail = Ski Trail
trail-detail-elevation-profile = Elevation Profile
trail-detail-download-trail = Download Trail

global-text-value-ownership = Ownership
campsite-formatted-ownership = {
  $ownership ->
    [private] Privately Run
    [federal] Federally Run
    [state] State Run
    *[else] {""}
}

campsite-detail-subtitle = {
  $ownership ->
    [private] Privately Run
    [federal] Federally Run
    [state] State Run
    *[else] {""}
} { $type } {
  $location ->
    [null] {""}
    *[else] in { $location }
}

campsite-detail-elevation = Elevation
campsite-detail-reservation = Reservation
campsite-detail-required-fee = Required Fee
campsite-detail-allows-tents = Allows Tents
campsite-detail-max-capacity = Max Capacity
campsite-detail-max-tents = Max Tents

campsite-detail-electricity = Electricity
campsite-detail-toilets = Toilets
campsite-detail-drinking-water = Drinking Water
campsite-detail-showers = Showers
campsite-detail-internet-access = Internet Access
campsite-detail-allows-fires = Allows Fires

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
user-profile-latest-ascents = Hiked { $mountain-name } { $preposition } { $date }
user-profile-sent-you-a-friend-request = { $name } sent you a friend request.
user-profile-compare-ascents-placeholder = Click "Compare Ascents" on a list on the left to compare your progress

user-profile-lists-in-progress = Lists in progress
user-profile-lists-completed = Completed Lists

user-profile-remove-friend-modal = Remove&#32;<strong>{ $name }</strong>&#32;from your friends?

user-card-completed = Completed
user-card-working-on = Working On
user-card-not-currently-working-on = Not currently working on any lists

map-mountain-title = Map of Mountain
map-generic-title = Map
map-list-title = Map of Mountains on { $short-name }
map-mountains-colored = Mountains Colored By Completion
map-mountain-colored = Mountain Colored By Completion
map-completed = You Completed On
map-completed-other-user = Completed On
map-completed-in-winter = Completed in winter
map-add-ascent = Add Ascent
map-number-of-seasons = colored by number of seasons you’ve hiked
map-no-seasons = 0
map-all-seasons = 4
map-number-of-months = colored by number of months you’ve hiked
map-completed-colored = colored by Completion
map-completed-colored-winter = colored by Completion in Winter
map-no-months = 0
map-all-months = 12

map-coordinates-at-center = Coordinates at Center
map-set-lat-long-value = Set Location To Center

map-get-directions = Get Directions

map-legend-location = Your Location &amp;<br />Driving Directions
map-legend-location-tooltip = <strong>Show the driving times and routes from your location to any mountain, trailhead, or campsite.</strong> Click on a point on the map and then click "Get Directions".
map-legend-other-mountains = Other Mountains<br />On Wilderlist
map-legend-other-mountains-tooltip = <strong>Show other mountains in the Wilderlist database</strong><br />Is a mountain missing? Add it with the link below.
map-legend-trails-major = Nearby Trails &amp;<br /> Trailheads
map-legend-trails-tooltip = <strong>Show trails and trailheads.</strong><br /><small>Trail data is provided through REI's Hiking Project (no affiliation) and is not a complete set. There may be other trails in a given area than what is listed.</small>
map-legend-campsites = Nearby Camping &amp;<br /> Shelters
map-legend-campsites-tooltip = <strong>Show camping, tentsites, and shelters.</strong><br /><small>Camping data is provided via Recreation.gov and Reserve America (no affiliation). There may be other sites in a given area than what is listed.</small>
map-legend-show-hide = click to {
  $shown ->
    [true] hide
    [false] show
    *[other] toggle
}

map-missing-mountain-text = Is a mountain missing?
map-missing-mountain-link = Click here to add it

map-refresh-map = Reset Map
map-broken-message = Whoops! Looks like something happened to the map. Try clicking the 'Reset Map' button below to fix it.

map-scroll-zoom-text = Use SHIFT + SCROLL to zoom
map-scroll-zoom-text-mobile = Use two fingers to scroll & zoom

map-trails-trail-desc = {
  $miles ->
    [1] mile
    *[other] miles
} long
map-trails-difficulty-desc = {
  $difficulty ->
    [green] No obstacles. Flat.
    [greenBlue] Some uneven terrain. Mostly flat.
    [blue] Moderate inclines. Uneven terrain.
    [blueBlack] Some rocks, roots. Steep sections.
    [black] Steep. Tricky terrain.
    [dblack] Very steep. Hazardous terrain.
    *[other] Difficulty unknown.
}

campsite-modal-go-to-website = Go To Campground's Website

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

import-ascents-notification-text = Already have a spreadsheet of ascents?

weather-forecast-summit-weather = Summit Forecast
weather-forecast-valley-weather = Valley Forecast
weather-forecast-weather = Weather
weather-forecast-weather-forecast = Weather Forecast
weather-forecast-weather-trail-center = Weather (at trail center)
weather-forecast-high = High
weather-forecast-low = Low
weather-forecast-wind = Wind
weather-forecast-sunrise-and-set = Sunrise & set
weather-forecast-chance-precip = chance of precipitation
weather-forecast-precipitation = precipitation
weather-forecast-chance = chance
weather-forecast-detailed-report = Detailed Report
weather-forecast-feels-like = Feels like
weather-forecast-network-error = Weather for this location is not available at this time.
weather-loading-report = Getting your forecast

weather-forecast-temperature = Temperature
weather-forecast-hourly = Hourly

weather-forecast-cloud-coverage = Cloud coverage: { $clouds }%
weather-forecast-dewpoint = Dewpoint: { $dew_point }°F
weather-forecast-humidity = Relative humidity: { $humidity }%
weather-forecast-sunrise = Sunrise: { $sunrise }
weather-forecast-sunset = Sunset: { $sunset }
weather-forecast-uvi = UV Index: { $uvi }
weather-forecast-rain-volume = { $rain }mm of rainfall
weather-forecast-snow-volume = { $snow }mm of snow
weather-forecast-wind-gust = gusts up to { $wind_gust }mph

snow-report-title = Snow Report
snow-report-network-error = Unable to get snow report for this location at this time.
snow-report-loading = Getting your snow report
snow-report-snowfall-attr = Snowfall is for { $station } Station, { $county } County, { $state }
snow-report-snowdepth-attr = Snow depth is for { $station } Station, { $county } County, { $state }
snow-report-full-attr = Snow report is for { $station } Station, { $county } County, { $state }
snow-report-location-details = { $distance }mi away, elevation of { $elevation }ft
snow-report-new-snow = New Snowfall
snow-report-current-depth = Total Snow Depth
snow-report-7-day-total = 7 day total, as of { $date }
snow-report-as-of = as of { $date }
snow-report-source-stations = Source Stations
snow-report-distance = { $miles }mi away, ele. { $elevation }ft

detail-route-to-summit = Routes to Summit
detail-nearby-camping = Nearby Camping
detail-nearby-mountains = Nearby Mountains

local-trails-hiking-project-feet-elevation = { $miles } miles, { $elevation }ft elevation gain
local-trails-hiking-project-nearby-route = Nearby Routes
local-trails-hiking-project-beta = Beta
local-trails-hiking-project-via-the = via the
local-trails-hiking-project-no-trails = Could not find any routes near { $mountain-name } on the Hiking Project.
local-trails-hiking-project-network-error = There was a network error retrieving trails data. Please try again later.

local-trails-nearby-trails-title = Nearby Trails
local-trails-all-trails-link-text = View trails for { $mountain-name } on

trip-report-latest-title = Latest Wilderlist Trip Reports
trip-report-title = Trip Report
trip-report-privacy-disclaimer = Public trip reports can help fellow hikers plan their hikes with insights from your experience. If you don’t want to share your trip publicly, you can set the visibility to “Private”  or simply leave this section blank.

trip-report-conditions-title = Conditions

trip-report-condition-name = {
  $key ->
    *[other] ---
    [mudMinor] Mud - Minor
    [mudMajor] Mud - Major
    [waterSlipperyRocks] Water - Slippery Rocks
    [waterOnTrail] Water - Significant On Trail
    [leavesSlippery] Leaves - Slippery
    [iceBlack] Ice - Minor
    [iceBlack] Ice - Black
    [iceBlue] Ice - Blue
    [iceCrust] Ice - Crust
    [snowMinor] Snow - Minor
    [snowIceFrozenGranular] Snow - Frozen Granular
    [snowIceMonorailStable] Snow - Monorail (Stable)
    [snowIceMonorailUnstable] Snow - Monorail (Unstable)
    [snowIcePostholes] Snow - Postholes
    [snowPackedPowder] Snow - Packed Powder
    [snowUnpackedPowder] Snow - Unpacked Powder
    [snowDrifts] Snow - Drifts
    [snowSticky] Snow - Sticky
    [snowSlush] Snow - Slush
    [obstaclesBlowdown] Obstacles - Blowdown
    [obstaclesOther] Obstacles - Other
}

trip-report-add-additional-mtns-title = Mountains Hiked
trip-report-add-additional-mtns-desc = Click mountains on the map to add them or search below
trip-report-add-additional-trails-desc = Click trails on the map to add them or search below
trip-report-add-additional-campsites-desc = Click campsites on the map to add them or search below
trip-report-add-mtns-btn = Add Mountains
trip-report-add-remove-mtns-btn = Add/Remove Mountains
trip-report-add-mtns-done = Done Updating Mountains

trip-report-notes-title = Report
trip-report-notes-placeholder = Share more details about your trip. What trails did you take? Any recommended traction? Water crossings? Parking information? Trail-maintenance? Bugs?

trip-report-link-title = Link
trip-report-link-placeholder = https://example.com

trip-report-invalid-date-format = Trip conditions and reports are not available for partial or unknown dates.

trip-reports-title = Latest Trip Reports
trip-report-read-full-report = Read Full Report

trip-report-external-link-title = External Link
trip-report-hiked-with = Hiked With
trip-report-no-reports = There are no recent trips reports for { $mountain-name }
trip-reports-load-more-button = Load More Reports
trip-reports-view-edit-button = View/Edit Report

create-mountain-title-create = Add Mountain
create-mountain-title-edit = Edit Mountain: { $mountain-name }

create-campsite-title-create = Add Campsite

create-mountain-title-create-question = Can't find the mountain you're looking for?
create-mountain-title-create-new = Add New Mountain

create-mountain-title-create-question-optional = Can't find the optional mountain you're looking for?

create-mountain-map-your-mountain = Your Mountain
create-mountain-map-nearby-mountains = Nearby Mountains
create-mountain-mountain-name-placeholder = Mountain Name
create-campsite-name-placeholder = Campsite Name
create-mountain-name-title = Name of Mountain
create-campsite-name-title = Name of Campsite
create-mountain-location-title = Location Information
create-mountain-location-loading = Determining location data...
create-mountain-location-error = We were unable to automatically determine all of the location information. Please fill out the fields manually.

create-trail-name-title = Trail Name
create-trail-name-placeholder = Name of trail

create-mountain-location-note = Use the map {
  $position ->
    [below] below
    *[right] to the right
} to automatically set the following values or enter them manually. If your location is near a state border, double check the "State" value as the automatic value will sometimes be wrong.
create-mountain-select-a-state = Select a State
create-mountain-latlong-note = as a decimal
create-mountain-latitude-placeholder = Enter the latitude in decimal format
create-mountain-longitude-placeholder = Enter the longitude in decimal format
create-mountain-elevation-placeholder = Enter the elevation in feet
create-mountain-optional-title = OPTIONAL: Additional Information
create-item-campsite-contact-title = OPTIONAL: Campsite Contact Information
create-mountain-optional-note = The following fields are optional and may be left blank.
create-mountain-optional-description = Enter an optional description for the mountain here.

create-mountain-check-your-work = I have checked the map to make sure my information is accurate. I have double-checked nearby mountains (in gray) to make sure I am not adding a duplicate (duplicates will be removed). I understand that repeated inaccurate or duplicate submissions could result in my losing the ability to post new mountains.

flag-mountain-title = Report an issue for { $name }
flag-mountain-thanks = Thank you for submitting your report. An administrator will be looking into it shortly.

flag-mountain-select-issue = Please describe the issue below
flag-mountain-select-issue-description = {
  $issue ->
    [location] Location - The location (latitude/longitude) is incorrect
    [elevation] Elevation - The elevation is wrong
    [state] State - The listed State is wrong
    [duplicate] Duplicate - This is a duplicate entry of the mountain
    [data] Data - There is an issue with data (i.e. name, trails, reports)
    [abuse] Abuse - This entry is inappropriate or otherwise abusive
    *[other] Other - There is a problem not specified in this list
}

flag-item-text = If something seems wrong about this { $type }, submit an issue report and an administrator will take a look at it ASAP

flag-peak-list-select-issue = Please select an issue from the box below
flag-peak-list-select-issue-description = {
  $issue ->
    [duplicate] Duplicate - This is a duplicate entry of another list
    [data] Data - There is an issue with data (i.e. name, states)
    [abuse] Abuse - This entry is inappropriate or otherwise abusive
    *[other] Other - There is a problem not specified in this list
}

create-peak-list-title-create = Create a hiking list

create-peak-list-title-edit = Edit { $list-name }
create-peak-list-peak-list-name-label = Hiking List Details
create-peak-list-peak-list-name-placeholder = i.e. New Hampshire 4000 Footers
create-peak-list-peak-list-short-name-label = Abbreviation
create-peak-list-peak-list-short-name-note = max 8 characters
create-peak-list-peak-list-short-name-placeholder = i.e. NH48
create-peak-list-cycle-image = Cycle Image
create-peak-list-peak-list-details-title = List Details
create-peak-list-peak-list-mountains-note = Select mountains directly on the map or by clicking {
  $number-mountains ->
    [0] 'Add Mountains'
    *[other] 'Add/Remove Mountains'
} below. You can also copy mountains from an existing list to add to this one.
create-peak-list-peak-list-description-label = Description
create-peak-list-peak-description = Enter an optional description for the list here.
create-peak-list-peak-optional-description = Enter an optional description about the Optional Mountains on this list.
create-peak-list-check-your-work = I have checked my work to make sure the information is accurate and follows Wilderlist's content policies. I understand that repeated inaccurate or duplicate submissions could result in my losing the ability to create new lists.
create-peak-list-peak-list-optional-mountains = OPTIONAL: Optional Mountains
create-peak-list-peak-list-optional-mountains-note = Optional mountains allow for additional mountains to be on this list that do not count towards 100% completion.
create-peak-list-peak-list-optional-description-label = Optional Mountains Description
create-peak-list-select-parent-modal-button = Copy Mountains From Another List
create-peak-list-select-parent-title = Copy { $type } From Another List
create-peak-list-copy-mountains-button = Copy Mountains

create-peak-list-copy-from-list-button = Copy From Another List

create-peak-list-has-parent-mountains = This list will reflect the same mountains as the selected parent
create-peak-list-has-parent-optional-mountains = This list will reflect the same optional mountains as the selected parent
create-peak-list-remove-parent = Remove Parent
create-peak-list-search-mountain-to-add = Search mountains to add
create-peak-list-selected-mountain-count = Selected mountains ({ $total } total)

page-not-found-404-title = The page you are looking for seems to be off the trail.
page-not-found-404-desc = Try searching what you are looking for at one of the following pages -
page-not-found-404-contact = If you think this page should be here, contact us at <a href='mailto: help@wilderlist.app'>help@wilderlist.app</a>.
