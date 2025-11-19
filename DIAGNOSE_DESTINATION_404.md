# Diagnose Destination 404 Error

## 🔍 What's Happening

Launchpad is requesting:
```
https://602b9a51trial.launchpad.cfapps.us10.hana.ondemand.com/destinations/mathbasics-library/resources/mathbasics/library-preload.js
```

This should resolve to:
```
https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/library-preload.js
```

But getting **404** means Launchpad can't resolve the destination.

---

## ✅ Step 1: Verify Library File Exists

First, verify the library file actually exists:

**Test URL directly:**
```
https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/library-preload.js
```

**Open in browser or use:**
```bash
# In browser, open this URL directly
https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/library-preload.js
```

**Expected:**
- ✅ **200 OK** = File exists, issue is with destination resolution
- ❌ **404** = File doesn't exist, need to check library deployment

---

## ✅ Step 2: Verify Destination is at Subaccount Level

**Critical:** Destination MUST be at **SUBACCOUNT level**, not space level.

### Check Method 1: URL Pattern

When viewing destination in BTP Cockpit, check browser URL:

**✅ CORRECT (Subaccount):**
```
https://.../destinations/mathbasics-library
```
OR
```
https://.../subaccount/<id>/destinations/mathbasics-library
```

**❌ WRONG (Space):**
```
https://.../spaces/<space-name>/destinations/mathbasics-library
```

### Check Method 2: Navigation Path

1. Go to **BTP Cockpit** → **Cloud Foundry**
2. Click **Subaccount** (your subaccount name) - **NOT "Spaces"**
3. Click **Destinations** in left menu
4. Look for `mathbasics-library`

**If you see it:** ✅ Correct level
**If you don't see it:** ❌ It's at space level - need to recreate

---

## ✅ Step 3: Verify Destination Configuration

When viewing destination at **subaccount level**, verify:

| Property | Should Be |
|----------|-----------|
| **Name** | `mathbasics-library` (exact match, case-sensitive) |
| **Type** | `HTTP` |
| **URL** | `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com` |
| **Proxy Type** | `Internet` |
| **Authentication** | `NoAuthentication` |

**Additional Properties:**
- `WebIDEEnabled`: `true`
- `HTML5.DynamicDestination`: `true`
- `WebIDEUsage`: `custom`

---

## ✅ Step 4: Test Destination Connection

1. Open destination `mathbasics-library` at subaccount level
2. Click **Check Connection** button
3. Should show: **Connection successful** ✅

**If connection fails:**
- Verify library URL is accessible
- Check if library is deployed and running
- Verify URL has no typos

---

## ✅ Step 5: Verify Destination Name Match

**In BTP Cockpit:**
- Destination name: `mathbasics-library`

**In Component.js:**
- Path: `/destinations/mathbasics-library/resources/mathbasics`

**Must match exactly!** (case-sensitive)

---

## 🔄 Step 6: Recreate Destination (If Needed)

If destination is at space level or not working:

1. **Go to:** Subaccount → Destinations (NOT Space → Destinations)
2. **Delete** old destination (if exists at wrong level)
3. **Click:** New Destination
4. **Configure:**
   - Name: `mathbasics-library`
   - Type: `HTTP`
   - URL: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com`
   - Proxy Type: `Internet`
   - Authentication: `NoAuthentication`
5. **Add Properties:**
   - `WebIDEEnabled`: `true`
   - `HTML5.DynamicDestination`: `true`
   - `WebIDEUsage`: `custom`
6. **Save**
7. **Test Connection** ✅
8. **Wait 1-2 minutes** for Launchpad to pick up changes
9. **Clear browser cache** or use incognito mode
10. **Refresh app** in FLP

---

## 🧪 Step 7: Test in Browser Network Tab

After recreating destination:

1. Open app in Fiori Launchpad
2. Open **Developer Tools** → **Network** tab
3. Filter by: `mathbasics-library`
4. Look for request to: `/destinations/mathbasics-library/resources/mathbasics/library-preload.js`
5. Check:
   - **Status:** Should be **200 OK** (not 404)
   - **Request URL:** Shows Launchpad URL
   - **Response:** Should show library file content

**If still 404:**
- Verify destination is at subaccount level (not space)
- Wait longer (up to 5 minutes) for propagation
- Try clearing browser cache completely
- Check if library file actually exists at the URL

---

## ⚠️ Common Issues

### Issue 1: Destination at Space Level

**Symptom:** 404 error even though destination exists

**Fix:** Recreate at subaccount level

---

### Issue 2: Destination Name Mismatch

**Symptom:** 404 error

**Check:**
- BTP: `mathbasics-library`
- Code: `/destinations/mathbasics-library/...`
- Must match exactly (case-sensitive!)

---

### Issue 3: Library File Doesn't Exist

**Symptom:** 404 error

**Check:**
- Test library URL directly in browser
- Verify library is deployed correctly
- Check library build includes `library-preload.js`

---

### Issue 4: Propagation Delay

**Symptom:** Destination configured correctly but still 404

**Fix:**
- Wait 2-5 minutes after creating/updating destination
- Clear browser cache
- Try incognito mode
- Restart browser

---

## 📋 Diagnostic Checklist

- [ ] Library file exists: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/library-preload.js` returns 200 OK
- [ ] Destination is at **SUBACCOUNT level** (not space level)
- [ ] Destination name matches exactly: `mathbasics-library`
- [ ] Destination URL is correct: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com` (no trailing slash)
- [ ] Connection test passes ✅
- [ ] Waited 2-5 minutes after creating/updating
- [ ] Cleared browser cache
- [ ] Tested in FLP - Network tab shows 200 OK ✅

---

## 🎯 Most Likely Solution

Based on your configuration being correct, the **most likely issue** is:

**Destination is at SPACE level instead of SUBACCOUNT level**

**Fix:** Recreate destination at subaccount level (see Step 6 above)

---

**Once destination is correctly configured at subaccount level, the 404 will be resolved!** 🎉

