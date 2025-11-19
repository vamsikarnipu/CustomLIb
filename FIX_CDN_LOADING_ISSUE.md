# Fix: Library Loading from Wrong Location (UI5 CDN)

## 🔴 Problem

After deployment, the app is trying to load the library from:
```
https://sapui5.hana.ondemand.com/1.142.1/resources/mathbasics/library.js
```

Instead of from the destination path:
```
/destinations/mathbasics-library/resources/mathbasics/library.js
```

---

## ✅ Root Cause

**FLP reads `manifest.json` BEFORE `Component.js` runs:**

1. FLP reads `manifest.json`
2. Sees `mathbasics` in dependencies
3. Tries to load library immediately
4. Doesn't know about resource root (not registered yet)
5. Falls back to default UI5 CDN location ❌

**Timing Issue:**
- `manifest.json` is read FIRST
- `Component.js` runs LATER
- Resource root registration happens TOO LATE

---

## ✅ Solution

**Remove library from `manifest.json` and load it directly in `Component.js`:**

This way:
1. FLP reads `manifest.json` → sees NO library dependency ✅
2. FLP doesn't try to load library automatically ✅
3. `Component.js` runs → registers resource root ✅
4. `Component.js` loads library from destination path ✅

---

## 📋 Changes Made

### 1. ✅ Removed Library from `manifest.json`

**Before:**
```json
"dependencies": {
  "libs": {
    "sap.m": {},
    "sap.ui.core": {},
    "mathbasics": {
      "lazy": false
    }
  }
}
```

**After:**
```json
"dependencies": {
  "libs": {
    "sap.m": {},
    "sap.ui.core": {}
  }
}
```

**Why:** Prevents FLP from trying to load library before Component.js runs

---

### 2. ✅ Load Library Directly in `Component.js`

**Updated Code:**
```javascript
init: function () {
  var oCore = sap.ui.getCore();
  
  // Register resource root FIRST
  oCore.registerResourceRoot("mathbasics", "/destinations/mathbasics-library/resources/mathbasics/");
  
  // Load library directly with destination path
  // This prevents FLP from loading from default UI5 CDN location
  oCore.loadLibrary("mathbasics", "/destinations/mathbasics-library/resources/mathbasics");

  // Proceed with normal component initialization
  UIComponent.prototype.init.apply(this, arguments);
  
  // ... rest of init
}
```

**Why:** 
- We control when and how library loads
- Library loads from destination path, not default CDN
- Resource root is registered before loading

---

## 🔍 How It Works Now

### Request Flow:

1. **FLP reads `manifest.json`:**
   - Sees `sap.m` and `sap.ui.core` only ✅
   - No `mathbasics` dependency → doesn't try to load it ✅

2. **FLP starts Component.js:**
   - `init()` method runs
   - Registers resource root FIRST ✅
   - Loads library from destination path ✅

3. **Library loads from correct location:**
   ```
   /destinations/mathbasics-library/resources/mathbasics/library.js
   ```

4. **xs-app.json route handles it:**
   - Route with `authenticationType: "xsuaa"` forwards request
   - Destination resolves to library URL ✅

5. **Library loads successfully** ✅

---

## ✅ Benefits

| Benefit | Description |
|---------|-------------|
| **No CDN Fallback** | Library loads from destination, not default UI5 CDN |
| **Timing Control** | We control when library loads |
| **Correct Path** | Library loads from `/destinations/...` path |
| **Works in FLP** | Aligns with blog's "Run everywhere" approach |

---

## 📋 Final Configuration

### `manifest.json`
```json
{
  "sap.ui5": {
    "dependencies": {
      "libs": {
        "sap.m": {},
        "sap.ui.core": {}
        // NO mathbasics here!
      }
    }
  }
}
```

### `Component.js`
```javascript
init: function () {
  var oCore = sap.ui.getCore();
  
  // Register resource root FIRST
  oCore.registerResourceRoot("mathbasics", "/destinations/mathbasics-library/resources/mathbasics/");
  
  // Load library directly
  oCore.loadLibrary("mathbasics", "/destinations/mathbasics-library/resources/mathbasics");

  UIComponent.prototype.init.apply(this, arguments);
  // ... rest of init
}
```

### `xs-app.json`
```json
{
  "source": "^/destinations/mathbasics-library/(.*)$",
  "destination": "mathbasics-library",
  "target": "/$1",
  "authenticationType": "xsuaa",  // ✅ Critical for destination resolution
  "csrfProtection": false
}
```

---

## 🎯 Summary

**Problem:** FLP loads library from `manifest.json` before Component.js runs → tries default CDN location

**Solution:** 
1. Remove library from `manifest.json` dependencies
2. Load library directly in `Component.js` BEFORE base init
3. Register resource root before loading

**Result:** Library loads from destination path, not default UI5 CDN ✅

---

**This matches the blog's "Run everywhere" approach and fixes the CDN loading issue!** 🎉

