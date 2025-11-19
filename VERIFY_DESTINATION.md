# Verify Destination is Working

## 🔍 Step 1: Test Destination Directly

Test if the destination route is working by accessing these URLs directly in your browser:

### Test 1: Library.js (Should work)
```
https://602b9a51trial.launchpad.cfapps.us10.hana.ondemand.com/destinations/mathbasics-library/resources/mathbasics/library.js
```

**Expected:** Should return the library.js file content

### Test 2: BasicMath.js (Should work)
```
https://602b9a51trial.launchpad.cfapps.us10.hana.ondemand.com/destinations/mathbasics-library/resources/mathbasics/BasicMath.js
```

**Expected:** Should return the BasicMath.js file content

### Test 3: Library-preload.js (May not exist - that's OK!)
```
https://602b9a51trial.launchpad.cfapps.us10.hana.ondemand.com/destinations/mathbasics-library/resources/mathbasics/library-preload.js
```

**Expected:** 404 is OK if the library wasn't built with preload optimization. UI5 will fall back to individual files.

---

## ✅ If Test 1 & 2 Work

If `library.js` and `BasicMath.js` are accessible via the destination route, then:
- ✅ Destination is configured correctly
- ✅ Route is working
- ✅ 404 for `library-preload.js` is expected (if library doesn't have preload)

**The app should work!** UI5 will load `library.js` instead of `library-preload.js`.

---

## ❌ If Test 1 & 2 Fail (404)

If both `library.js` and `BasicMath.js` return 404, then the route isn't working. Check:

### Check 1: Verify Destination Name
- Destination name in BTP Cockpit: `mathbasics-library`
- Destination name in `xs-app.json`: `mathbasics-library`
- **Must match exactly!**

### Check 2: Verify Destination URL
- Destination URL: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources`
- **MUST include `/resources` path** (for HTML5-Repo apps)
- **No trailing slash**

### Check 3: Verify Deployment Mode
- **For HTML5-Repo apps:** `xs-app.json` is NOT used by Launchpad
- **For Standalone apps:** Destination route should be **FIRST** in `xs-app.json` routes array

### Check 4: Test Direct Library URL
Test if library is accessible directly (bypass destination):
```
https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/library.js
```

If this works but destination route doesn't, then route configuration has an issue.

---

## 🔧 Common Issues

### Issue 1: Route Not Matching
**Symptom:** All destination URLs return 404

**Fix:** Check route pattern in `xs-app.json`:
```json
{
  "source": "^/destinations/mathbasics-library/(.*)$",
  "destination": "mathbasics-library",
  "target": "/$1",
  "authenticationType": "none"
}
```

### Issue 2: Destination Name Mismatch
**Symptom:** 404 errors

**Fix:** Destination name in BTP Cockpit must match `xs-app.json` exactly (case-sensitive)

### Issue 3: Library-preload.js Missing
**Symptom:** 404 for `library-preload.js` but app still works

**Status:** ✅ **This is normal!** UI5 falls back to individual files.

---

## 📋 Quick Checklist

- [ ] Test `library.js` via destination route → Should work
- [ ] Test `BasicMath.js` via destination route → Should work  
- [ ] Test `library-preload.js` → 404 is OK if library doesn't have preload
- [ ] Verify destination name matches exactly
- [ ] Verify destination URL has no trailing slash
- [ ] Verify route is first in `xs-app.json`

---

## 🎯 Expected Behavior

**If everything is configured correctly:**

1. ✅ `library.js` loads successfully
2. ✅ `BasicMath.js` loads successfully  
3. ⚠️ `library-preload.js` returns 404 (normal if library doesn't have preload)
4. ✅ App works despite `library-preload.js` 404

**UI5 automatically handles missing preload files!** 🎉

