# Troubleshooting: Destination 404 Error

## ✅ Fixed: Route Order

I moved the destination route to the **top** of the routes array so it matches first.

---

## 🔍 Verify Destination Configuration

Since you created the destination manually, please verify these settings in **BTP Cockpit**:

### 1. Check Destination Name

**Must match exactly:**
- Destination Name: `mathbasics-library` (case-sensitive, no spaces)
- In `xs-app.json`: `"destination": "mathbasics-library"`

### 2. Check Destination URL

**In BTP Cockpit → Destinations → mathbasics-library:**

✅ **Correct:**
```
URL: https://mathbasics-library.cfapps.us10-001.hana.ondemand.com
```

❌ **Wrong (with trailing slash):**
```
URL: https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/
```

❌ **Wrong (with path):**
```
URL: https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources
```

### 3. Check Authentication Type

**Must be:**
```
Authentication: NoAuthentication
```

### 4. Check Destination Level

**Try both:**
- ✅ **Subaccount Level** (recommended) - Available to all apps in subaccount
- ✅ **Space Level** - Available to apps in specific CF space

**If space-level doesn't work, try subaccount-level.**

---

## 🔍 How Route Works

When UI5 requests:
```
/destinations/mathbasics-library/resources/mathbasics/library.js
```

The route matches:
- **Source pattern:** `^/destinations/mathbasics-library/(.*)$`
- **Captures:** `resources/mathbasics/library.js` as `$1`
- **Target:** `/$1` → `/resources/mathbasics/library.js`
- **Forwards to:** `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/library.js`

---

## 🔧 Additional Checks

### Check 1: Destination Visibility

In BTP Cockpit:
1. Go to **Cloud Foundry** → **Destinations**
2. Find `mathbasics-library`
3. Check **"Subaccount"** or **"Space"** level
4. Verify it's visible to your app

### Check 2: Test Destination Directly

Try accessing the library directly (should work):
```
https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/library.js
```

If this doesn't work, the library deployment has an issue.

### Check 3: Verify Route Pattern

The route pattern `^/destinations/mathbasics-library/(.*)$` should match:
- ✅ `/destinations/mathbasics-library/resources/mathbasics/library.js`
- ✅ `/destinations/mathbasics-library/resources/mathbasics/BasicMath.js`

### Check 4: App Router Logs

Check your app logs in Cloud Foundry:
```bash
cf logs customlib --recent
```

Look for destination-related errors.

---

## 🚀 Next Steps

1. **Redeploy** after route order change:
   ```bash
   npm run build:cf
   cf deploy mta_archives/customlib_0.0.1.mtar
   ```

2. **Verify destination** in BTP Cockpit matches exactly:
   - Name: `mathbasics-library`
   - URL: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com` (no trailing slash)
   - Authentication: `NoAuthentication`

3. **Test** the app again

---

## 📋 Current Configuration

### xs-app.json (Updated - Route Order Fixed)
```json
{
  "welcomeFile": "/index.html",
  "authenticationMethod": "route",
  "routes": [
    {
      "source": "^/destinations/mathbasics-library/(.*)$",
      "destination": "mathbasics-library",
      "target": "/$1",
      "authenticationType": "none"
    },
    // ... other routes
  ]
}
```

### index.html (Correct)
```html
"mathbasics": "/destinations/mathbasics-library/resources/mathbasics/"
```

### manifest.json (Correct)
```json
"mathbasics": {}
```

---

## ❓ Still Not Working?

If still getting 404 after redeploy:

1. **Check destination name** - Must be exactly `mathbasics-library`
2. **Check destination URL** - No trailing slash
3. **Check destination level** - Try subaccount level
4. **Check app logs** - `cf logs customlib --recent`
5. **Verify library is accessible** - Direct URL should work


