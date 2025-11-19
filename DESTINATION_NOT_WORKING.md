# Destination Route Not Working - Troubleshooting

## 🔴 Problem

Destination route returns 404:
```
https://602b9a51trial.launchpad.cfapps.us10.hana.ondemand.com/destinations/mathbasics-library/resources/mathbasics/library.js
→ 404 Not Found
```

---

## ✅ Step 1: Verify Library is Accessible Directly

**Test this URL directly in browser:**
```
https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/library.js
```

**Expected:** Should return the library.js file content

**If this doesn't work:** The library deployment has an issue (not a destination problem)

**If this works:** Continue to Step 2

---

## ✅ Step 2: Check Destination Level

For **HTML5 Application Repository** apps, destinations might need to be at **Subaccount Level**.

### Check in BTP Cockpit:

1. Go to **Cloud Foundry** → **Destinations**
2. Find `mathbasics-library`
3. Check if it's at:
   - ✅ **Subaccount Level** (recommended for HTML5 apps)
   - ⚠️ **Space Level** (might not work)

**If at Space Level:** Try creating it at **Subaccount Level** instead.

---

## ✅ Step 3: Verify Destination Configuration

### In BTP Cockpit → Destinations → mathbasics-library:

**Must have:**
- **Name:** `mathbasics-library` (exact match, case-sensitive)
- **Type:** `HTTP`
- **Proxy Type:** `Internet`
- **URL:** `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com` (no trailing slash)
- **Authentication:** `NoAuthentication`

**Additional Properties:**
- `HTML5.DynamicDestination`: `true` ✅ (you have this)
- `WebIDEEnabled`: `true` ✅ (you have this)

---

## ✅ Step 4: Check App Logs

Check Cloud Foundry logs for destination errors:

```bash
cf logs customlib --recent
```

Look for:
- Destination resolution errors
- Route matching errors
- Authentication errors

---

## ✅ Step 5: Alternative - Use Direct URL Temporarily

If destination still doesn't work, you can temporarily use direct URL in `index.html`:

**Change in `webapp/index.html`:**
```html
"mathbasics": "https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/"
```

**Note:** This is a temporary workaround. Destination is preferred for production.

---

## 🔧 Common Issues for HTML5 Apps

### Issue 1: Destination at Wrong Level
**Symptom:** Route returns 404

**Fix:** Create destination at **Subaccount Level** (not Space Level)

### Issue 2: Destination Not Visible to App
**Symptom:** Route returns 404

**Fix:** 
- Ensure destination is at Subaccount Level
- Verify `HTML5.DynamicDestination: true` is set
- Redeploy app after creating destination

### Issue 3: Route Pattern Not Matching
**Symptom:** Route returns 404

**Fix:** Verify route pattern in `xs-app.json`:
```json
{
  "source": "^/destinations/mathbasics-library/(.*)$",
  "destination": "mathbasics-library",
  "target": "/$1",
  "authenticationType": "none"
}
```

---

## 📋 Checklist

- [ ] Library is accessible directly (test direct URL)
- [ ] Destination is at **Subaccount Level** (not Space Level)
- [ ] Destination name matches exactly: `mathbasics-library`
- [ ] Destination URL has no trailing slash
- [ ] `HTML5.DynamicDestination: true` is set
- [ ] Route is first in `xs-app.json` routes array
- [ ] App logs checked for errors
- [ ] App redeployed after destination creation

---

## 🎯 Most Likely Fix

**For HTML5 Application Repository apps, the destination MUST be at Subaccount Level!**

1. Delete destination at Space Level (if exists)
2. Create destination at **Subaccount Level**
3. Set `HTML5.DynamicDestination: true`
4. Redeploy app
5. Test again

---

## 📝 Current Configuration

### xs-app.json (Correct)
```json
{
  "source": "^/destinations/mathbasics-library/(.*)$",
  "destination": "mathbasics-library",
  "target": "/$1",
  "authenticationType": "none"
}
```

### Destination (Verify These)
- Name: `mathbasics-library`
- Level: **Subaccount** (not Space)
- URL: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com`
- `HTML5.DynamicDestination`: `true`



