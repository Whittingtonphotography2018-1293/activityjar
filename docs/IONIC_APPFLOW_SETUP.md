# Ionic Appflow Setup Guide for Activity Jar

This guide walks you through setting up Ionic Appflow to build your iOS and Android apps without needing a Mac.

---

## Prerequisites

Before starting, make sure you have:
- ✅ Your GitHub repository connected (via Lovable's "Export to GitHub")
- ✅ An Apple Developer account ($99/year) for iOS builds
- ✅ A Google Play Developer account ($25 one-time) for Android builds

---

## Step 1: Create Ionic Appflow Account

1. Go to [https://ionic.io/appflow](https://ionic.io/appflow)
2. Click **"Get Started Free"** or **"Sign Up"**
3. Create an account using your email or GitHub

![Ionic Homepage](https://ionic.io/images/appflow/appflow-hero.png)

---

## Step 2: Connect Your GitHub Repository

1. After logging in, click **"New App"** or **"Import existing app"**
2. Select **"Connect to GitHub"**
3. Authorize Ionic to access your GitHub account
4. Find and select your **Activity Jar** repository
5. Click **"Connect"**

### Repository Settings
- **Stack**: Select **"Capacitor"**
- **Default Branch**: `main`

---

## Step 3: Configure Build Settings

### Navigate to Build Settings
1. In your app dashboard, go to **"Build"** → **"Native Builds"**
2. Click **"New Build"**

### Build Configuration
| Setting | Value |
|---------|-------|
| **Build Type** | Capacitor |
| **Platform** | iOS or Android |
| **Build Stack** | Latest stable |
| **Environment** | Production |

---

## Step 4: Set Up iOS Signing (Required for iOS builds)

### 4a. Create Certificates in Apple Developer Portal

1. Go to [https://developer.apple.com](https://developer.apple.com)
2. Navigate to **Certificates, IDs & Profiles**

#### Create App ID
1. Go to **Identifiers** → Click **"+"**
2. Select **"App IDs"** → Continue
3. Select **"App"** → Continue
4. Fill in:
   - **Description**: Activity Jar
   - **Bundle ID**: `app.lovable.196550bee0f849a7aab500b86f1846d1` (Explicit)
5. Enable any capabilities you need (Push Notifications, etc.)
6. Click **Register**

#### Create Distribution Certificate
1. Go to **Certificates** → Click **"+"**
2. Select **"Apple Distribution"** → Continue
3. You'll need to create a Certificate Signing Request (CSR):
   - On any computer, use a CSR generation tool
   - Or use Appflow's built-in certificate generation
4. Upload the CSR and download the certificate

#### Create Provisioning Profile
1. Go to **Profiles** → Click **"+"**
2. Select **"App Store Connect"** → Continue
3. Select your App ID → Continue
4. Select your Distribution Certificate → Continue
5. Name it: `Activity Jar App Store`
6. Download the profile

### 4b. Upload to Ionic Appflow

1. In Appflow, go to **"Build"** → **"Signing Certificates"**
2. Click **"Add Certificate"** for iOS
3. Upload your:
   - **Distribution Certificate** (.p12 file)
   - **Provisioning Profile** (.mobileprovision file)
4. Enter the certificate password if required

---

## Step 5: Set Up Android Signing (Required for Android builds)

### 5a. Create a Keystore

You can create a keystore using Android Studio or command line:

```bash
keytool -genkey -v -keystore activity-jar.keystore -alias activity-jar -keyalg RSA -keysize 2048 -validity 10000
```

You'll be prompted for:
- Keystore password (save this!)
- Key alias: `activity-jar`
- Key password
- Your name, organization, etc.

### 5b. Upload to Ionic Appflow

1. In Appflow, go to **"Build"** → **"Signing Certificates"**
2. Click **"Add Certificate"** for Android
3. Upload your `.keystore` file
4. Enter:
   - **Keystore Password**
   - **Key Alias**: `activity-jar`
   - **Key Password**

---

## Step 6: Prepare Your Code for Production

### IMPORTANT: Update capacitor.config.ts

Before building, you MUST remove the development server URL:

**Current (Development):**
```typescript
server: {
  url: 'https://196550be-e0f8-49a7-aab5-00b86f1846d1.lovableproject.com?forceHideBadge=true',
  cleartext: true
},
```

**Production (Remove or comment out the server block):**
```typescript
// Remove the entire server block for production builds
```

### Steps:
1. Pull your latest code from GitHub
2. Edit `capacitor.config.ts`
3. Remove the `server` configuration block
4. Commit and push to GitHub

---

## Step 7: Create Your First Build

### iOS Build
1. Go to **"Build"** → **"Native Builds"**
2. Click **"New Build"**
3. Select:
   - **Commit**: Latest on main
   - **Target Platform**: iOS
   - **Build Type**: App Store (for submission) or Development (for testing)
   - **Signing Certificate**: Select your uploaded certificate
4. Click **"Build"**

### Android Build
1. Go to **"Build"** → **"Native Builds"**
2. Click **"New Build"**
3. Select:
   - **Commit**: Latest on main
   - **Target Platform**: Android
   - **Build Type**: Release
   - **Signing Certificate**: Select your uploaded keystore
4. Click **"Build"**

---

## Step 8: Download and Submit

### iOS
1. Once build completes, download the `.ipa` file
2. Use **Transporter** app (free on Mac App Store) or **altool** to upload to App Store Connect
3. Or use Appflow's **"Deploy to App Store"** feature (paid plan)

### Android
1. Once build completes, download the `.aab` (Android App Bundle) file
2. Go to [Google Play Console](https://play.google.com/console)
3. Create a new app or select existing
4. Go to **"Production"** → **"Create new release"**
5. Upload the `.aab` file

---

## Troubleshooting

### Build Fails with "Module not found"
- Make sure all dependencies are in `package.json`
- Run `npm install` locally and commit `package-lock.json`

### iOS Signing Issues
- Ensure Bundle ID matches exactly: `app.lovable.196550bee0f849a7aab500b86f1846d1`
- Certificate and provisioning profile must match

### Android Keystore Issues
- Double-check passwords and alias name
- Keystore must be the same one used for all future updates

---

## Quick Reference

| Item | Value |
|------|-------|
| **App ID (iOS)** | `app.lovable.196550bee0f849a7aab500b86f1846d1` |
| **Package Name (Android)** | `app.lovable.196550bee0f849a7aab500b86f1846d1` |
| **App Name** | Activity Jar |
| **Build Type** | Capacitor |

---

## Need Help?

- [Ionic Appflow Documentation](https://ionic.io/docs/appflow)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Apple Developer Help](https://developer.apple.com/support/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
