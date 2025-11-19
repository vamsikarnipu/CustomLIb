# Troubleshoot: Destination at Subaccount Level But Still 404

## ✅ Confirmed: Destination is Correctly Configured

Your destination `mathbasics-library` is:
- ✅ At **SUBACCOUNT level** (confirmed - you're viewing "Subaccount: trial - Destinations")
- ✅ Configuration is correct
- ✅ Library file exists and is accessible

But still getting **404** errors. Let's troubleshoot further.

---

## 🔍 Step 1: Test Destination Connection

1. In BTP Cockpit, open destination `mathbasics-library`
2. Click **"Check Connection"** button
3. What does it show?
   - ✅ **Connection successful** = Destination is working
   - ❌ **Connection failed** = Issue with destination URL or network

**If connection fails:**
- Verify library URL is accessible: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com`
- Check if library is deployed and running
- Verify URL has no typos

---

## 🔍 Step 2: Verify Additional Properties

Your destination has:
- ✅ `WebIDEEnabled: true`
- ✅ `HTML5.DynamicDestination: true`
- ✅ `WebIDEUsage: custom`

**Try adding one more property:**

| Key | Value |
|-----|-------|
| `sap.cloud.service` | `mathbasics-library` |

**Or try:**

| Key | Value |
|-----|-------|
| `sap-platform` | `CF` |

---

## 🔍 Step 3: Recreate Destination (Refresh)

Sometimes destinations need to be refreshed:

1. **Note down** all your destination settings
2. **Delete** destination `mathbasics-library`
3. **Wait 30 seconds**
4. **Create new destination** with same settings:
   - Name: `mathbasics-library`
   - Type: `HTTP`
   - URL: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com`
   - Proxy Type: `Internet`
   - Authentication: `NoAuthentication`
   - Properties: `WebIDEEnabled: true`, `HTML5.DynamicDestination: true`, `WebIDEUsage: custom`
5. **Save**
6. **Test Connection** ✅
7. **Wait 5 minutes** for Launchpad to pick up changes
8. **Clear browser cache** completely
9. **Test in FLP**

---

## 🔍 Step 4: Check Launchpad App Router Logs

If you have access to Launchpad app-router logs:

1. Check if destination is being resolved
2. Look for errors related to `mathbasics-library`
3. Verify destination service is accessible

---

## 🔍 Step 5: Verify Destination Service

Check if destination service is working:

1. Go to **BTP Cockpit** → **Cloud Foundry** → **Subaccount**
2. Check **Service Instances**
3. Look for destination service instance
4. Verify it's running and accessible

---

## 🔍 Step 6: Test Direct URL Resolution

Try accessing the destination path directly from Launchpad domain:

**In browser, try:**
```
https://602b9a51trial.launchpad.cfapps.us10.hana.ondemand.com/destinations/mathbasics-library/resources/mathbasics/library-preload.js
```

**Expected:**
- Should redirect/resolve to: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/library-preload.js`
- Should return library file content (200 OK)

**If still 404:**
- Destination resolution is not working
- Need to check destination service configuration

---

## 🔍 Step 7: Check Destination URL Format

**Current URL:**
```
https://mathbasics-library.cfapps.us10-001.hana.ondemand.com
```

**Try without protocol (if supported):**
```
mathbasics-library.cfapps.us10-001.hana.ondemand.com
```

**Or try with trailing slash:**
```
https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/
```

(Usually base URL without trailing slash is correct, but worth trying)

---

## 🔍 Step 8: Verify Launchpad Can Access Destination

Check if Launchpad's app-router can see the destination:

1. Open Launchpad
2. Open **Developer Tools** → **Console**
3. Look for destination-related errors
4. Check Network tab for destination resolution attempts

---

## 🔍 Step 9: Check CORS Configuration

Verify library server allows requests from Launchpad domain:

**Launchpad domain:**
```
602b9a51trial.launchpad.cfapps.us10.hana.ondemand.com
```

**Library domain:**
```
mathbasics-library.cfapps.us10-001.hana.ondemand.com
```

If CORS is blocking, you'll see CORS errors in console (not 404).

---

## 🔍 Step 10: Try Alternative Approach

If destination still doesn't work, try using direct URL temporarily to verify:

**In Component.js, temporarily change:**
```javascript
// Temporary test - use direct URL
sap.ui.getCore().loadLibrary("mathbasics", "https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics");
```

**If this works:**
- Confirms library is accessible
- Confirms issue is with destination resolution
- Need to fix destination configuration

**If this doesn't work:**
- Issue might be with library loading itself
- Check library deployment

---

## ⚠️ Common Issues

### Issue 1: Destination Service Not Running

**Symptom:** Destination exists but can't be resolved

**Fix:** Check destination service instance is running

---

### Issue 2: Propagation Delay

**Symptom:** Destination configured correctly but still 404

**Fix:** Wait longer (up to 10 minutes), clear cache, restart browser

---

### Issue 3: Destination Name Case Sensitivity

**Symptom:** 404 error

**Check:**
- Destination name: `mathbasics-library` (lowercase)
- Code path: `/destinations/mathbasics-library/...` (lowercase)
- Must match exactly!

---

### Issue 4: Destination URL Format

**Symptom:** Connection test fails

**Try:**
- Base URL without trailing slash: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com`
- Verify URL is accessible directly in browser

---

## 📋 Diagnostic Checklist

- [ ] Destination is at subaccount level ✅ (confirmed)
- [ ] Destination configuration is correct ✅ (confirmed)
- [ ] Library file exists ✅ (confirmed)
- [ ] Connection test passes ⚠️ **CHECK THIS**
- [ ] Additional properties added (try `sap.cloud.service`)
- [ ] Waited 5-10 minutes after creating/updating
- [ ] Cleared browser cache completely
- [ ] Tested in incognito mode
- [ ] Verified destination service is running
- [ ] Tested direct URL resolution from Launchpad domain
- [ ] Checked Launchpad logs for errors

---

## 🎯 Most Likely Solutions

Based on your configuration being correct:

1. **Try recreating destination** (Step 3) - Sometimes refreshes the connection
2. **Add `sap.cloud.service` property** (Step 2) - May help Launchpad recognize it
3. **Wait longer** (5-10 minutes) - Propagation can take time
4. **Check connection test** - Verify destination service can reach library URL

---

## 🧪 Quick Test

After trying the above:

1. **Recreate destination** at subaccount level
2. **Add property:** `sap.cloud.service: mathbasics-library`
3. **Test connection** - should pass ✅
4. **Wait 5-10 minutes**
5. **Clear browser cache**
6. **Test in FLP** - Network tab should show 200 OK ✅

---

**Your configuration is correct - the issue is likely propagation delay or destination service connection. Try recreating the destination and waiting longer!** 🎉

