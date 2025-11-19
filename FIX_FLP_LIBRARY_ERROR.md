# Fix: FLP Library Loading Errors

## 🔴 Errors You're Seeing

1. **Resource root error:**
   ```
   Resource root for "mathbasics" is absolute and therefore won't be registered! 
   "/destinations/mathbasics-library/resources/mathbasics/"
   ```

2. **Library loading from wrong URL:**
   ```
   failed to load 'mathbasics/library.js' from 
   https://sapui5.hana.ondemand.com/1.142.1/resources/mathbasics/library.js
   ```

3. **No descriptor found:**
   ```
   Error in application dependency 'mathbasics': No descriptor was found
   ```

---

## ✅ Root Cause

**FLP (Fiori Launchpad) behavior:**
- FLP reads `manifest.json` **BEFORE** `Component.js` runs
- FLP tries to load libraries declared in `manifest.json` immediately
- Resource roots in `index.html` are **ignored** in FLP
- FLP doesn't know where to find the library → tries default location (sapui5.hana.ondemand.com)
- Absolute paths starting with `/` in resource roots cause errors

---

## ✅ Solution

### Fix 1: Remove Resource Roots from index.html

**Why:** FLP ignores `index.html` resource roots, and they cause errors.

**Changed:**
```html
<!-- BEFORE (causes error) -->
data-sap-ui-resource-roots='{
    "project3": "./",
    "mathbasics": "/destinations/mathbasics-library/resources/mathbasics/"
}'

<!-- AFTER (fixed) -->
data-sap-ui-resource-roots='{
    "project3": "./"
}'
```

### Fix 2: Load Library in Component.js BEFORE Base Init

**Why:** Must load library BEFORE FLP tries to load it from manifest.json.

**Changed:**
```javascript
init: function () {
  // Load library BEFORE base init (CRITICAL for FLP)
  if (!sap.ui.getCore().getLoadedLibraries()["mathbasics"]) {
    sap.ui.getCore().loadLibrary("mathbasics", "/destinations/mathbasics-library/resources/mathbasics");
  }
  
  // Then proceed with base init
  UIComponent.prototype.init.apply(this, arguments);
}
```

### Fix 3: Fix Destination URL (Remove Trailing Slash)

**In BTP Cockpit → Destinations → `mathbasics-library`:**

**Change from:**
```
URL: https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/
```

**Change to:**
```
URL: https://mathbasics-library.cfapps.us10-001.hana.ondemand.com
```

**Why:** Trailing slash can cause path resolution issues.

---

## 📋 Complete Configuration

### 1. ✅ `index.html`
```html
data-sap-ui-resource-roots='{
    "project3": "./"
}'
```
**Note:** No mathbasics resource root (FLP ignores it anyway)

### 2. ✅ `Component.js`
```javascript
init: function () {
  // Load library BEFORE base init
  if (!sap.ui.getCore().getLoadedLibraries()["mathbasics"]) {
    sap.ui.getCore().loadLibrary("mathbasics", "/destinations/mathbasics-library/resources/mathbasics");
  }
  
  UIComponent.prototype.init.apply(this, arguments);
  // ... rest of init
}
```

### 3. ✅ `manifest.json`
```json
{
  "sap.ui5": {
    "dependencies": {
      "libs": {
        "sap.m": {},
        "sap.ui.core": {},
        "mathbasics": {}
      }
    }
  }
}
```
**Note:** Keep library dependency declaration

### 4. ✅ `xs-app.json`
```json
{
  "source": "^/destinations/mathbasics-library/(.*)$",
  "destination": "mathbasics-library",
  "target": "/$1",
  "authenticationType": "none"
}
```

### 5. ✅ Destination in BTP Cockpit
- **Name:** `mathbasics-library`
- **URL:** `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com` (NO trailing slash)
- **Type:** HTTP
- **Proxy Type:** Internet
- **Authentication:** NoAuthentication

---

## 🔄 Steps to Fix

1. ✅ **Update `index.html`** - Remove mathbasics resource root
2. ✅ **Update `Component.js`** - Load library before base init (already done)
3. ✅ **Fix destination URL** - Remove trailing slash in BTP Cockpit
4. ✅ **Redeploy app:**
   ```bash
   cd CustomLIb
   npm run build:mta
   cf deploy mta_archives/customlib_0.0.1.mtar
   ```

---

## 🎯 Why This Works

**FLP Flow:**
1. FLP reads `manifest.json` → sees `"mathbasics": {}`
2. FLP tries to load library immediately
3. `Component.js` `init()` runs → loads library via `loadLibrary()` BEFORE base init
4. Library is loaded → FLP can use it
5. Base init continues → app works ✅

**Key:** Load library **BEFORE** base init so FLP finds it when it tries to load from manifest.json.

---

## ✅ Verification

After fixing:

1. **Update destination URL** in BTP Cockpit (remove trailing slash)
2. **Redeploy app**
3. **Open app in FLP**
4. **Check browser console** - should see:
   - ✅ Library loading successfully
   - ✅ No "absolute path" error
   - ✅ No "descriptor not found" error
   - ✅ App loads correctly

---

## 📝 Summary

| Issue | Fix |
|-------|-----|
| Resource root absolute path error | Remove mathbasics from index.html resource roots |
| Library loading from wrong URL | Load library in Component.js BEFORE base init |
| Destination URL trailing slash | Remove trailing slash in BTP Cockpit |

**All fixes applied!** Redeploy and test. ✅

