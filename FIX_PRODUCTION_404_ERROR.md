# Fix Production 404 Error: Destination Not Found

## 🔴 Error You're Seeing

```
GET https://602b9a51trial.launchpad.cfapps.us10.hana.ondemand.com/destinations/mathbasics-library/resources/mathbasics/library-preload.js 404 (Not Found)
```

**Root Cause:** Destination `mathbasics-library` is **NOT configured at subaccount level** or is configured incorrectly.

---

## ✅ Solution: Verify and Configure Subaccount Destination

### Step 1: Navigate to Subaccount Destinations

**Important:** You must go to **SUBACCOUNT level**, NOT space level!

1. Go to **BTP Cockpit**
2. Click **Cloud Foundry** → **Spaces**
3. Click on your **space** (e.g., `dev`)
4. Look at the **breadcrumb** at the top - you should see: `Subaccount > Space`
5. Click on **Subaccount** in the breadcrumb (or go back to Cloud Foundry → Subaccount)
6. Click **Destinations** in the left menu

**OR**

1. Go to **BTP Cockpit**
2. Click **Cloud Foundry** → **Subaccount** (your subaccount name)
3. Click **Destinations** in the left menu

---

### Step 2: Check if Destination Exists

**Look for:** `mathbasics-library` in the destinations list

**If it exists:**
- Click on it to edit
- Go to Step 3

**If it doesn't exist:**
- Click **New Destination**
- Go to Step 3

---

### Step 3: Configure Destination

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
- ✅ Name must match exactly: `mathbasics-library` (case-sensitive!)

---

### Step 4: Add Additional Properties

Click **New Property** and add these one by one:

| Key | Value |
|-----|-------|
| `WebIDEEnabled` | `true` |
| `HTML5.DynamicDestination` | `true` |
| `WebIDEUsage` | `custom` |

---

### Step 5: Save and Test

1. Click **Save**
2. Click on the destination name again
3. Click **Check Connection** button
4. Should show: **Connection successful** ✅

**If connection fails:**
- Verify the library URL is accessible: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com`
- Check if library is deployed and running
- Verify URL is correct (no typos)

---

## 🔍 Verify Destination Configuration

### Check 1: Destination Name

**In BTP Cockpit:**
- Destination name: `mathbasics-library`

**In Component.js:**
- Path: `/destinations/mathbasics-library/resources/mathbasics`

**Must match exactly!** ✅

---

### Check 2: Destination URL

**Correct URL:**
```
https://mathbasics-library.cfapps.us10-001.hana.ondemand.com
```

**Wrong URLs:**
```
❌ https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/
❌ https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources
❌ https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/
```

---

### Check 3: Destination Level

**Must be at SUBACCOUNT level:**

| Level | Works? | Why |
|-------|--------|-----|
| **Subaccount** | ✅ YES | Launchpad reads from here |
| **Space** | ❌ NO | Launchpad doesn't read from space level |
| **App-level** | ❌ NO | Launchpad doesn't read from app level |

**How to verify:**
- Look at the URL in browser: Should show `/destinations` (subaccount level)
- NOT `/spaces/<space-name>/destinations` (space level)

---

## 🧪 Test Destination Resolution

After configuring, test if Launchpad can resolve the destination:

1. Open your app in Fiori Launchpad
2. Open browser **Developer Tools** → **Network** tab
3. Look for requests to `/destinations/mathbasics-library/...`
4. Check the **Request URL** - should be:
   ```
   https://602b9a51trial.launchpad.cfapps.us10.hana.ondemand.com/destinations/mathbasics-library/resources/mathbasics/library.js
   ```
5. Check the **Response** - should be **200 OK** (not 404)

**If still 404:**
- Verify destination is at **subaccount level** (not space level)
- Verify destination name matches exactly: `mathbasics-library`
- Verify destination URL is correct
- Try deleting and recreating the destination

---

## 🔄 Alternative: Check Destination via API

You can verify destinations are accessible via API:

1. Get your subaccount destination service URL
2. Use CF CLI or Postman to query destinations
3. Verify `mathbasics-library` appears in the list

---

## ⚠️ Common Mistakes

### Mistake 1: Destination at Space Level

**Symptom:** 404 error in production

**Fix:** Move destination to subaccount level

---

### Mistake 2: Wrong Destination Name

**Symptom:** 404 error

**Check:**
- BTP Cockpit: `mathbasics-library`
- Component.js: `/destinations/mathbasics-library/...`
- Must match exactly (case-sensitive!)

---

### Mistake 3: Wrong URL Format

**Symptom:** Connection test fails or 404

**Correct:**
```
https://mathbasics-library.cfapps.us10-001.hana.ondemand.com
```

**Wrong:**
```
https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/
https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources
```

---

## ✅ Final Checklist

Before testing again, verify:

- [ ] Destination exists at **SUBACCOUNT level** (not space level)
- [ ] Destination name: `mathbasics-library` (exact match)
- [ ] Destination URL: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com` (no trailing slash)
- [ ] Proxy Type: `Internet`
- [ ] Authentication: `NoAuthentication`
- [ ] Additional properties added: `WebIDEEnabled`, `HTML5.DynamicDestination`, `WebIDEUsage`
- [ ] Connection test passes ✅
- [ ] App redeployed (if needed)
- [ ] Test in FLP - check Network tab for 200 OK ✅

---

## 🎯 Quick Fix Steps

1. **Go to:** BTP Cockpit → Cloud Foundry → **Subaccount** → Destinations
2. **Create/Edit:** Destination `mathbasics-library`
3. **Set URL:** `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com`
4. **Set Proxy Type:** `Internet`
5. **Set Authentication:** `NoAuthentication`
6. **Add Properties:** `WebIDEEnabled: true`, `HTML5.DynamicDestination: true`, `WebIDEUsage: custom`
7. **Save** and **Test Connection**
8. **Refresh** your app in FLP
9. **Check Network tab** - should see 200 OK ✅

---

**Once destination is configured correctly at subaccount level, the 404 error will be resolved!** 🎉

