# Configure Destination at Subaccount Level for HTML5-Repo Apps

## 🔴 Problem

For **HTML5-Repo apps** deployed to Fiori Launchpad:
- Launchpad's central app-router does **NOT** use your app's `xs-app.json` routing
- Destinations configured in your app's destination service are **NOT** accessible
- You get **404 errors** when trying to use `/destinations/mathbasics-library/...`

## ✅ Solution: Configure Destination at Subaccount Level

Launchpad's app-router reads destinations from the **subaccount level**, not the app level.

---

## 📋 Step-by-Step: Configure Subaccount Destination

### Step 1: Navigate to Subaccount Destinations

1. Go to **BTP Cockpit** → **Cloud Foundry** → **Spaces**
2. Select your **space** (e.g., `dev`)
3. Click **Destinations** tab (at the top, NOT under your app)

**OR**

1. Go to **BTP Cockpit** → **Cloud Foundry** → **Subaccount** (your subaccount)
2. Click **Destinations** in the left menu

---

### Step 2: Create/Edit Destination

**Click:** **New Destination** (or find existing `mathbasics-library` and click **Edit**)

---

### Step 3: Configure Destination Properties

**Main Properties:**

| Property | Value |
|----------|-------|
| **Name** | `mathbasics-library` |
| **Type** | `HTTP` |
| **URL** | `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com` |
| **Proxy Type** | `Internet` |
| **Authentication** | `NoAuthentication` |

**Important:**
- ✅ URL should be **base URL** (no `/resources` at the end)
- ✅ URL should **NOT have trailing slash**
- ✅ Name must match exactly: `mathbasics-library`

---

### Step 4: Add Additional Properties

Click **New Property** and add:

| Key | Value |
|-----|-------|
| `WebIDEEnabled` | `true` |
| `HTML5.DynamicDestination` | `true` |
| `WebIDEUsage` | `custom` |

---

### Step 5: Save Destination

Click **Save**

---

## ✅ Verify Destination

After saving, test the destination:

1. Click on the destination name (`mathbasics-library`)
2. Click **Check Connection** button
3. Should show **Connection successful** ✅

---

## 🔍 How It Works

### Request Flow:

1. **Your app requests:**
   ```
   /destinations/mathbasics-library/resources/mathbasics/library.js
   ```

2. **Launchpad's app-router:**
   - Reads destination `mathbasics-library` from **subaccount level**
   - Resolves destination URL: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com`
   - Appends the path: `/resources/mathbasics/library.js`
   - Final URL: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/library.js` ✅

3. **Library loads successfully** ✅

---

## 📋 Complete Destination Configuration

### Main Properties:
```
Name: mathbasics-library
Type: HTTP
URL: https://mathbasics-library.cfapps.us10-001.hana.ondemand.com
Proxy Type: Internet
Authentication: NoAuthentication
```

### Additional Properties:
```
WebIDEEnabled: true
HTML5.DynamicDestination: true
WebIDEUsage: custom
```

---

## ⚠️ Important Notes

### Subaccount vs App-Level Destinations:

| Level | Used By | For HTML5-Repo Apps |
|-------|---------|---------------------|
| **Subaccount** | Launchpad app-router | ✅ **REQUIRED** |
| **App-Level** | Your app's xs-app.json | ❌ **NOT USED** |

### Why Subaccount Level?

- Launchpad's central app-router serves multiple apps
- It needs to access destinations at a **shared level** (subaccount)
- App-level destinations are only accessible to your app's own app-router (which Launchpad doesn't use)

---

## 🧪 Testing

After configuring the subaccount destination:

1. **Redeploy your app** (if needed)
2. **Open app from Fiori Launchpad**
3. **Check browser console** - should see library loading successfully ✅
4. **Check Network tab** - requests to `/destinations/mathbasics-library/...` should return **200 OK** ✅

---

## 🔄 Alternative: Use Direct URL (Not Recommended)

If you can't configure subaccount destinations, you can use direct URL in `Component.js`:

```javascript
sap.ui.getCore().loadLibrary("mathbasics", "https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics");
```

**But:** This hardcodes the URL and won't work if the library URL changes.

---

## ✅ Summary

**For HTML5-Repo apps in Fiori Launchpad:**

1. ✅ Configure destination at **SUBACCOUNT level** (not app level)
2. ✅ Use destination path: `/destinations/mathbasics-library/resources/mathbasics`
3. ✅ Destination URL: Base URL only (no `/resources`, no trailing slash)
4. ✅ Launchpad's app-router will resolve the destination correctly ✅

---

## 🎯 Quick Checklist

- [ ] Navigate to **Subaccount** → **Destinations**
- [ ] Create/Edit destination `mathbasics-library`
- [ ] Set URL: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com`
- [ ] Set Proxy Type: `Internet`
- [ ] Set Authentication: `NoAuthentication`
- [ ] Add property: `WebIDEEnabled: true`
- [ ] Add property: `HTML5.DynamicDestination: true`
- [ ] Add property: `WebIDEUsage: custom`
- [ ] Save destination
- [ ] Test connection
- [ ] Redeploy app (if needed)
- [ ] Test in FLP ✅

---

**You're all set!** Once the destination is configured at subaccount level, your app will be able to load the library via the destination path! 🎉

