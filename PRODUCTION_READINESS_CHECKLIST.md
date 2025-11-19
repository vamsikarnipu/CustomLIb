# Production Readiness Checklist

## ✅ Code Configuration (Already Done!)

Your code is **100% ready** for production:

- ✅ **Component.js** - Uses destination path: `/destinations/mathbasics-library/resources/mathbasics`
- ✅ **manifest.json** - No library dependency (correct for FLP)
- ✅ **index.html** - No library in resource roots (correct for FLP)
- ✅ **xs-app.json** - Has destination route (good practice)
- ✅ **No hardcoded URLs** - All uses destination paths

---

## ⚠️ CRITICAL: Subaccount Destination Configuration

**This is the ONLY thing you need to do for production!**

### Why This Is Required:

| Environment | How It Works |
|------------|--------------|
| **Local** | `ui5.yaml` proxy forwards `/destinations/...` to library URL ✅ |
| **Production** | Launchpad's app-router reads destination from **subaccount level** ⚠️ |

**Without subaccount destination:** Production will fail with **404 errors** ❌

---

## 📋 Pre-Deployment Checklist

### Step 1: Configure Subaccount Destination

**Go to:** BTP Cockpit → Cloud Foundry → **Subaccount** (your subaccount) → **Destinations**

**Create/Edit destination `mathbasics-library`:**

| Property | Value |
|----------|-------|
| **Name** | `mathbasics-library` |
| **Type** | `HTTP` |
| **URL** | `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com` |
| **Proxy Type** | `Internet` |
| **Authentication** | `NoAuthentication` |

**Additional Properties:**
- `WebIDEEnabled`: `true`
- `HTML5.DynamicDestination`: `true`
- `WebIDEUsage`: `custom`

**Click:** Save

---

### Step 2: Verify Destination

1. Click on destination name
2. Click **Check Connection**
3. Should show: **Connection successful** ✅

---

### Step 3: Deploy Application

```bash
cd CustomLIb
npm run build:mta
cf deploy mta_archives/project3_0.0.1.mtar
```

---

### Step 4: Test in Production

1. Open Fiori Launchpad
2. Click your app tile
3. Check browser console - should see library loading ✅
4. Check Network tab - requests to `/destinations/mathbasics-library/...` should return **200 OK** ✅

---

## 🔍 How It Works in Production

### Request Flow:

1. **App requests:**
   ```
   /destinations/mathbasics-library/resources/mathbasics/library.js
   ```

2. **Launchpad's app-router:**
   - Reads destination `mathbasics-library` from **subaccount level** ✅
   - Resolves destination URL: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com`
   - Appends path: `/resources/mathbasics/library.js`
   - Final URL: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/library.js` ✅

3. **Library loads successfully** ✅

---

## ⚠️ Common Production Issues

### Issue 1: 404 Error on Library Files

**Cause:** Destination not configured at subaccount level

**Fix:** Configure destination at subaccount level (see Step 1 above)

---

### Issue 2: Destination Not Found

**Cause:** Destination name mismatch

**Check:**
- Destination name in BTP Cockpit: `mathbasics-library`
- Path in Component.js: `/destinations/mathbasics-library/...`
- Must match exactly! ✅

---

### Issue 3: CORS Errors

**Cause:** Library server doesn't allow requests from Launchpad domain

**Fix:** Ensure library server allows CORS from Launchpad domain (usually handled automatically by CF)

---

## ✅ Final Verification

Before going live, verify:

- [ ] Destination `mathbasics-library` exists at **subaccount level**
- [ ] Destination URL is correct (base URL, no trailing slash)
- [ ] Destination connection test passes ✅
- [ ] App deployed successfully
- [ ] App added to Fiori Launchpad
- [ ] Test in FLP - library loads ✅
- [ ] Test library functions work ✅

---

## 🎯 Summary

**Your code is production-ready!** ✅

**Only requirement:** Configure destination at subaccount level before deploying.

**Once destination is configured:** Production will work exactly like local (but using Launchpad's app-router instead of ui5.yaml proxy).

---

## 📚 Reference

See `SUBACCOUNT_DESTINATION_SETUP.md` for detailed step-by-step instructions.

