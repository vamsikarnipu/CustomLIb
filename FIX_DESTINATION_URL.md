# 🔴 Problem: Destination URL Configuration for HTML5-Repo Apps

## ⚠️ IMPORTANT: This App Uses HTML5-Repo Deployment

Your `mta.yaml` shows:
```yaml
deploy_mode: html5-repo
type: html5
```

This means your app is served by **SAP Launchpad's central app-router**, NOT your app's `xs-app.json`.

---

## ❌ Wrong Destination URL (for HTML5-Repo)

```
URL: https://mathbasics-library.cfapps.us10-001.hana.ondemand.com
```

**Problem:** Launchpad expects the destination URL to include `/resources` because it does NOT use your `xs-app.json` routing.

---

## 🔍 How Launchpad Handles Destinations

### For HTML5-Repo Apps:

Launchpad's app-router:
- ❌ Does **NOT** read your `xs-app.json`
- ❌ Does **NOT** apply your routing rules
- ✅ Uses its own internal routing logic

### Launchpad's Internal Logic:

When UI5 requests:
```
/destinations/mathbasics-library/resources/mathbasics/library.js
```

Launchpad internally does:
```
destination.URL + /resources/<namespace>/<file>
```

### With Wrong URL (base only):
```
Destination URL: https://mathbasics-library.cfapps.us10-001.hana.ondemand.com
Launchpad creates: https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/library.js
```

**Problem:** Your library is deployed at `/resources/mathbasics/...`, but Launchpad might not find it correctly → **404 Error**

### With Correct URL (includes `/resources`):
```
Destination URL: https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources
Launchpad creates: https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/library.js
```

✅ **Matches your deployed library structure** → **200 OK**

---

## ✅ Solution: Fix Destination URL for HTML5-Repo

### Step 1: Update Destination in BTP Cockpit

1. Go to **BTP Cockpit** → **Cloud Foundry** → **Destinations**
2. Find **`mathbasics-library`**
3. Click **Edit**
4. Change **URL** to:
   ```
   ✅ https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources
   ```
   (Include `/resources`, but NO trailing slash)
5. **Save**

### Step 2: Verify

After updating, test:
```
https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/library.js
```

Should return the library file (not 404).

---

## 📋 Correct Destination Configuration (HTML5-Repo)

### Main Properties:
- **Name:** `mathbasics-library`
- **Type:** `HTTP`
- **Proxy Type:** `Internet`
- **URL:** `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources` ✅ 
  - ✅ **MUST include `/resources` path**
  - ❌ **NO trailing slash**
- **Authentication:** `NoAuthentication`

### Additional Properties:
- `WebIDEEnabled`: `true`
- `HTML5.DynamicDestination`: `true`
- `WebIDEUsage`: `custom`

---

## ✅ Summary

| Setting | Wrong ❌ | Correct ✅ |
|---------|---------|-----------|
| **URL** | `...ondemand.com` | `...ondemand.com/resources` |
| **Has `/resources`?** | No | Yes |
| **Result** | 404 Error | Works correctly |

**Fix:** Add `/resources` to the destination URL! 🎯

---

## ❓ FAQ: Should Destination URL Include `/resources/`?

### For HTML5-Repo Apps (Your Case): ✅ YES!

**Answer: YES!** ✅

The destination URL **MUST include `/resources`**:
- ✅ `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources`
- ❌ `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com`

**Why?** 
- Launchpad does **NOT** use your `xs-app.json`
- Launchpad expects destination URL to point directly to `/resources`
- Launchpad appends `/mathbasics/library.js` to the destination URL

---

## 🔄 Comparison: HTML5-Repo vs Standalone App-Router

### HTML5-Repo Apps (Your Case):
- **Deployment:** `deploy_mode: html5-repo`
- **Router:** Launchpad's central app-router
- **xs-app.json:** ❌ NOT used
- **Destination URL:** ✅ **MUST include `/resources`**
- **Example:** `https://library.com/resources`

### Standalone App-Router Apps:
- **Deployment:** `deploy_mode: app-router` or direct CF push
- **Router:** Your app's `xs-app.json`
- **xs-app.json:** ✅ Used for routing
- **Destination URL:** ❌ Should NOT include `/resources` (xs-app.json handles it)
- **Example:** `https://library.com`

---

## ✅ Final Verdict for Your App

Since you're using **HTML5-Repo deployment**:

### ✅ Destination URL must be:
```
https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources
```

**Not the base URL!**
