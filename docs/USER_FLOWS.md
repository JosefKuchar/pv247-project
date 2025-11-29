# User Flows Documentation

This document describes the key user journeys and workflows in Locagram.

## New User Onboarding

### Registration Flow Options

#### Email/Password Registration
1. **Landing Page**: User visits the application
2. **Sign Up**: User clicks "Sign Up" button
3. **Registration Method**: User selects "Sign up with Email"
4. **Registration Form**: User provides email, password, and display name
5. **Account Creation**: System creates user account and profile
6. **Welcome**: User is logged in and sees welcome message
7. **Profile Setup**: Optional profile picture upload and bio completion

#### GitHub OAuth Registration
1. **Landing Page**: User visits the application
2. **Sign Up**: User clicks "Sign Up" button
3. **OAuth Selection**: User clicks "Continue with GitHub" button
4. **GitHub Redirect**: User is redirected to GitHub OAuth authorization
5. **Permission Grant**: User authorizes Locagram to access basic GitHub profile
6. **Account Creation**: System creates account using GitHub profile data:
   - Display name from GitHub profile
   - Email from GitHub account
   - Profile picture from GitHub avatar
7. **Return to App**: User is redirected back to Locagram, logged in
8. **Profile Completion**: Optional bio addition and profile customization

### Login Flow Options

#### Email/Password Login
1. **Login Page**: Returning user visits login page or clicks "Login" button
2. **Login Method**: User selects "Sign in with Email"
3. **Credentials**: User enters email and password
4. **Authentication**: System verifies credentials
5. **Session Creation**: System creates user session
6. **Redirect**: User is redirected to feed or intended page

#### GitHub OAuth Login
1. **Login Page**: Returning user visits login page or clicks "Login" button
2. **OAuth Selection**: User clicks "Continue with GitHub" button
3. **GitHub Redirect**: User is redirected to GitHub OAuth authorization
4. **Permission Check**: GitHub verifies user identity (no re-authorization needed if previously granted)
5. **Account Verification**: System verifies existing GitHub-linked account
6. **Session Creation**: System creates user session
7. **Return to App**: User is redirected back to Locagram, logged in

#### Account Linking (Existing Email Users)
1. **GitHub Login Attempt**: User tries to login with GitHub using email that exists with password account
2. **Account Conflict**: System detects existing email/password account
3. **Linking Option**: System offers to link GitHub account to existing account
4. **Password Verification**: User enters existing account password to confirm ownership
5. **Account Merge**: GitHub OAuth is linked to existing account
6. **Future Login**: User can now login with either method

### First-Time Experience
1. **Default Tab**: New users land on Home Feed tab (empty since no follows yet)
2. **Tab Discovery**: User explores the 5 main tabs: Create, Map, Home, Search, Profile
3. **Location Discovery**: User explores Map tab to find nearby places and reviews
4. **User Discovery**: User uses Search tab to find interesting users and places
5. **First Follows**: User follows users and/or places to populate Home Feed
6. **First Post**: User creates their first review using Create tab

## App Navigation Structure

The app uses a 5-tab bottom navigation (mobile) or sidebar navigation (desktop):

### Tab 1: Create Post
1. **Tab Access**: User taps Create tab
2. **Location Selection**: User searches for and selects a place from Google Maps
3. **Content Entry**: User fills out:
   - Review title
   - Description of experience
   - Star rating (1-5)
   - Optional photo uploads
4. **Review Submission**: User submits the review
5. **Success Redirect**: User is redirected to Home Feed to see their new post
6. **Feed Updates**: Review appears in followers' Home Feeds and user's Profile

### Tab 2: Map
1. **Map Access**: User taps Map tab
2. **Location Centering**: Map centers on user's current location (with permission)
3. **Nearby Places**: Map shows nearby reviewed places as markers
4. **Marker Interaction**: User taps markers to see place preview
5. **Place Detail**: User taps "View Details" to open full place page
6. **Actions**: From place detail, user can:
   - View all reviews for that place
   - Follow the place
   - Create a new review for that place

### Tab 3: Home Feed (Default)
1. **Feed Access**: User taps Home tab or opens app
2. **Content Display**: Feed shows posts from:
   - People the user follows
   - Places the user follows
3. **Post Interactions**: User can:
   - Like posts
   - Comment on posts
   - Share posts
   - Tap author name → User profile detail
   - Tap place name → Place detail view
4. **Real-time Updates**: Feed updates with new posts from followed users/places

### Tab 4: Search
1. **Search Access**: User taps Search tab
2. **Search Input**: User enters search terms
3. **Search Categories**: Results split into:
   - Users (with profile photos, names, follower counts)
   - Places (with photos, ratings, review counts)
4. **Result Selection**: User taps results to open:
   - User Profile detail
   - Place detail view
5. **Follow Actions**: User can follow users/places directly from search results

### Tab 5: Profile
1. **Profile Access**: User taps Profile tab
2. **Profile Display**: Shows user's profile as others see it:
   - Profile photo, name, bio
   - List of user's reviews
   - Follower/following counts
3. **Profile Menu**: User taps menu button for options:
   - Edit Profile (name, description, photo)
   - Claim Place ownership
   - My Places (if user owns verified places)
   - Settings/Logout

## Social Interactions

### Following Users
1. **User Discovery**: User finds profiles through Search tab or post authors in Home Feed
2. **Profile Visit**: User taps username to view full profile
3. **Follow Action**: User taps "Follow" button on profile
4. **Feed Update**: Followed user's posts appear in Home Feed
5. **Notification**: Optional notification sent to followed user

### Following Places
1. **Place Discovery**: User finds places through Map tab or Search tab
2. **Place Detail**: User views full place page with all reviews and details
3. **Follow Action**: User taps "Follow Place" button
4. **Feed Update**: New reviews for followed places appear in Home Feed
5. **Place Updates**: User sees when new reviews are posted for places they follow

### Engaging with Content
1. **Content Discovery**: User finds posts in Home Feed or on place pages
2. **Like Action**: User taps heart button to like posts
3. **Comment Creation**: User taps comment button, writes and submits comment
4. **Share Action**: User shares posts to external platforms or copies link
5. **Profile/Place Navigation**: User taps author name or place name for detail views

## Business User Workflows

### Place Ownership Claim Process
1. **Profile Access**: Business owner goes to their Profile tab
2. **Menu Navigation**: Owner taps profile menu button
3. **Claim Initiation**: Owner selects "Claim Place" option
4. **Place Selection**: Owner searches for and selects their business location
5. **Reasoning Submission**: Owner provides short reasoning why they can claim the place
6. **Claim Submission**: Owner submits claim request
7. **Admin Review**: Platform administrators review claim (outside UI scope)
8. **Approval Notification**: Owner receives notification of approval/rejection
9. **Place Access**: If approved, place appears in "My Places" section

### Managing Claimed Places
1. **Profile Menu**: Verified owner accesses "My Places" from profile menu
2. **Places List**: Owner sees list of all claimed/verified places
3. **Place Management**: Owner taps on place to:
   - Edit place information and photos
   - Monitor customer reviews
   - View analytics and statistics
   - Manage place visibility settings

## Content Management Workflows

### Editing Own Content
1. **Content Access**: User navigates to their own post
2. **Edit Initiation**: User clicks edit button on their post
3. **Content Modification**: User updates title, description, rating, or photos
4. **Save Changes**: User submits edited content
5. **Update Confirmation**: System confirms successful update

### Deleting Content
1. **Content Selection**: User identifies content to delete
2. **Delete Action**: User clicks delete button
3. **Confirmation Dialog**: System asks for deletion confirmation
4. **Permanent Removal**: Content is permanently deleted from system
5. **Feed Updates**: Content removed from followers' feeds

## Advanced User Flows

### Location Page Interaction
1. **Location Discovery**: User finds location through search, map, or post
2. **Location Page Access**: User navigates to dedicated location page
3. **Information Review**: User views location details, average rating, photos
4. **Review Browsing**: User reads through all reviews for the location
5. **Action Taking**: User can:
   - Add their own review
   - Like existing reviews
   - Follow users who reviewed the location
   - Share location with others

### Profile Management
1. **Profile Access**: User navigates to their own profile
2. **Information Review**: User views their posts, followers, following
3. **Profile Editing**: User updates display name, bio, profile picture
4. **Privacy Settings**: User manages account visibility and privacy options
5. **Account Actions**: User can delete account or export data

## Error Handling Flows

### Authentication Errors

#### Failed Email/Password Login
1. **Invalid Credentials**: User enters incorrect email or password
2. **Error Display**: System shows "Invalid email or password" message
3. **Retry Attempt**: User corrects credentials and retries
4. **Password Reset Option**: Link to password reset if user forgotten password
5. **Account Recovery**: User can reset password via email

#### GitHub OAuth Errors
1. **OAuth Cancellation**: User cancels GitHub authorization
2. **Return to Login**: User is redirected back to login page with message
3. **Retry Option**: User can attempt GitHub login again
4. **Alternative Method**: User can choose email/password login instead

#### GitHub OAuth Permission Denied
1. **Insufficient Permissions**: GitHub user denies required permissions
2. **Permission Error**: System explains required permissions for Locagram
3. **Retry Authorization**: User can retry with proper permissions
4. **Fallback Option**: User can register/login with email instead

#### Account Linking Conflicts
1. **Email Already Exists**: User tries GitHub login but email exists with password account
2. **Conflict Notification**: System explains account exists with different auth method
3. **Linking Offer**: System offers to link accounts or login with existing method
4. **Resolution**: User chooses to link accounts or use existing login method

### Failed Content Creation
1. **Submission Error**: User submits invalid or incomplete content
2. **Error Display**: System shows specific validation errors
3. **Content Correction**: User fixes identified issues
4. **Retry Submission**: User resubmits corrected content
5. **Success Confirmation**: System confirms successful creation

### Network Issues
1. **Connection Loss**: User loses internet connection during action
2. **Error Detection**: System detects failed request
3. **User Notification**: System informs user of connection issue
4. **Auto Retry**: System attempts automatic retry
5. **Manual Retry**: User can manually retry action when connection restored

### OAuth Session Expiry
1. **Session Timeout**: GitHub OAuth token expires during session
2. **Re-authentication**: System detects expired token
3. **Seamless Refresh**: System attempts to refresh token automatically
4. **Manual Re-auth**: If refresh fails, user prompted to re-authenticate
5. **Session Restoration**: User re-authorizes and session continues

## Mobile-Specific Flows

### Mobile Navigation
1. **App Opening**: User opens app on mobile device
2. **Bottom Navigation**: User uses bottom tab bar for primary navigation
3. **Touch Interactions**: User taps, swipes, and pinches for interactions
4. **Mobile Features**: User accesses mobile-specific features like location services

### Photo Upload on Mobile
1. **Review Creation**: User starts creating new review on mobile
2. **Photo Option**: User taps photo upload button
3. **Source Selection**: User chooses camera or gallery
4. **Photo Capture/Selection**: User takes new photo or selects existing
5. **Upload Process**: Photo is uploaded and processed
6. **Review Completion**: User completes review with uploaded photos