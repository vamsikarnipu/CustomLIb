# Verify Destination Level - Critical Check

## ✅ Your Destination Configuration Looks Correct!

Your destination `mathbasics-library` has all the correct settings:
- ✅ Name: `mathbasics-library`
- ✅ URL: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com` (correct format)
- ✅ Proxy Type: `Internet`
- ✅ Authentication: `NoAuthentication`
- ✅ Additional properties: All correct

---

## ⚠️ CRITICAL: Check Destination Level

The **ONLY** issue could be that the destination is at the **wrong level**.

### How to Verify:

1. **Look at the URL in your browser** when viewing the destination:
   
   **✅ CORRECT (Subaccount Level):**
   ```
   https://.../destinations/mathbasics-library
   ```
   OR
   ```
   https://.../subaccount/<subaccount-id>/destinations/mathbasics-library
   ```

   **❌ WRONG (Space Level):**
   ```
   https://.../spaces/<space-name>/destinations/mathbasics-library
   ```

2. **Check the breadcrumb** at the top of the page:
   - ✅ Should show: `Subaccount > Destinations`
   - ❌ Should NOT show: `Subaccount > Spaces > <space-name> > Destinations`

---

## 🔍 Step-by-Step: Verify You're at Subaccount Level

### Method 1: Check URL

1. When viewing the destination, look at the browser URL
2. If URL contains `/spaces/` → **WRONG LEVEL** ❌
3. If URL shows `/destinations/` or `/subaccount/.../destinations/` → **CORRECT LEVEL** ✅

### Method 2: Navigate from Scratch

1. Go to **BTP Cockpit**
2. Click **Cloud Foundry**
3. Click **Subaccount** (your subaccount name) - **NOT "Spaces"**
4. Click **Destinations** in the left menu
5. Look for `mathbasics-library`

**If you see it here:** ✅ Correct level

**If you don't see it here:** ❌ It's at space level, need to recreate at subaccount level

---

## 🔄 If Destination is at Space Level

**You need to recreate it at SUBACCOUNT level:**

1. Go to **Subaccount** → **Destinations** (not Space → Destinations)
2. Click **New Destination**
3. Configure exactly as before:
   - Name: `mathbasics-library`
   - URL: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com`
   - Proxy Type: `Internet`
   - Authentication: `NoAuthentication`
   - Properties: `WebIDEEnabled: true`, `HTML5.DynamicDestination: true`, `WebIDEUsage: custom`
4. **Save**
5. **Test Connection**
6. **Delete the old one** from space level (if it exists)

---

## ⏱️ Wait for Propagation

After creating/updating destination at subaccount level:

1. **Wait 1-2 minutes** for Launchpad to pick up the change
2. **Clear browser cache** or use incognito mode
3. **Refresh your app** in FLP
4. **Check Network tab** - should see 200 OK ✅

---

## 🧪 Test Destination Resolution

After verifying destination is at subaccount level:

1. Open your app in Fiori Launchpad
2. Open **Developer Tools** → **Network** tab
3. Filter by: `mathbasics-library`
4. Look for request to: `/destinations/mathbasics-library/resources/mathbasics/library.js`
5. Check status:
   - ✅ **200 OK** = Destination working!
   - ❌ **404** = Still at wrong level or not propagated yet

---

## 📋 Quick Checklist

- [ ] Destination exists at **SUBACCOUNT level** (not space level)
- [ ] URL shows `/destinations/` or `/subaccount/.../destinations/` (NOT `/spaces/`)
- [ ] Destination name: `mathbasics-library` (exact match)
- [ ] Destination URL: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com` (no trailing slash)
- [ ] Connection test passes ✅
- [ ] Waited 1-2 minutes after creating/updating
- [ ] Cleared browser cache
- [ ] Tested in FLP - Network tab shows 200 OK ✅

---

## 🎯 Most Likely Issue

Based on your configuration being correct, the **most likely issue** is:

**Destination is at SPACE level instead of SUBACCOUNT level**

**Fix:** Recreate destination at subaccount level (see steps above)

---

**Once destination is at subaccount level, your 404 error will be resolved!** 🎉

