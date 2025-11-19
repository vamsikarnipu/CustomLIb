# Fix: FLP Loading Library from Wrong Location

## 🔴 Problem

FLP is trying to load library from:
```
https://sapui5.hana.ondemand.com/1.142.1/resources/mathbasics/library.js
```

Instead of from destination:
```
/destinations/mathbasics-library/resources/mathbasics/library.js
```

**Error:** `Error in application dependency 'mathbasics': No descriptor was found`

---

## ✅ Root Cause

**FLP behavior:**
1. FLP reads `manifest.json` **BEFORE** `Component.js` runs
2. FLP sees `"mathbasics": {}` in dependencies
3. FLP immediately tries to load library from default UI5 CDN location
4. FLP doesn't know about destination path → tries `sapui5.hana.ondemand.com`
5. Library not found → Error

**The problem:** Library declared in `manifest.json` dependencies causes FLP to load it too early, before Component.js can register the resource root.

---

## ✅ Solution: Remove Library from manifest.json Dependencies

### Why?

- **FLP loads libraries from manifest.json immediately** (before Component.js)
- **Component.js loads library dynamically** (after it runs)
- **Conflict:** FLP tries to load before Component.js can tell it where to find it

### Fix:

**Remove `mathbasics` from `manifest.json` dependencies:**

```json
{
  "sap.ui5": {
    "dependencies": {
      "libs": {
        "sap.m": {},
        "sap.ui.core": {}
        // mathbasics removed - loaded dynamically in Component.js
      }
    }
  }
}
```

**Component.js will load it dynamically:**

```javascript
init: function () {
  // Register resource root FIRST
  var oCore = sap.ui.getCore();
  if (!oCore.getResourceRoots()["mathbasics"]) {
    oCore.registerResourceRoot("mathbasics", "/destinations/mathbasics-library/resources/mathbasics/");
  }
  
  // Load library dynamically
  if (!oCore.getLoadedLibraries()["mathbasics"]) {
    oCore.loadLibrary("mathbasics", "/destinations/mathbasics-library/resources/mathbasics");
  }
  
  UIComponent.prototype.init.apply(this, arguments);
  // ... rest of init
}
```

---

## 📋 Updated Configuration

### 1. ✅ `manifest.json` - NO library dependency

```json
{
  "sap.ui5": {
    "dependencies": {
      "libs": {
        "sap.m": {},
        "sap.ui.core": {}
      }
    }
  }
}
```

**Why:** Prevents FLP from trying to load library before Component.js runs

### 2. ✅ `Component.js` - Load library dynamically

```javascript
init: function () {
  // Register resource root FIRST
  var oCore = sap.ui.getCore();
  if (!oCore.getResourceRoots()["mathbasics"]) {
    oCore.registerResourceRoot("mathbasics", "/destinations/mathbasics-library/resources/mathbasics/");
  }
  
  // Load library
  if (!oCore.getLoadedLibraries()["mathbasics"]) {
    oCore.loadLibrary("mathbasics", "/destinations/mathbasics-library/resources/mathbasics");
  }
  
  UIComponent.prototype.init.apply(this, arguments);
}
```

**Why:** Loads library AFTER Component.js runs, so resource root is registered first

### 3. ✅ `ui5.yaml` - Proxy for local testing

```yaml
backend:
  - path: /destinations/mathbasics-library
    url: https://mathbasics-library.cfapps.us10-001.hana.ondemand.com
```

**Why:** Allows local testing with destination path

---

## 🔄 How It Works Now

### FLP Flow:

1. FLP reads `manifest.json` → sees `sap.m` and `sap.ui.core` only ✅
2. FLP loads standard libraries ✅
3. FLP starts Component.js → `init()` runs
4. Component.js registers resource root for mathbasics ✅
5. Component.js loads mathbasics library ✅
6. App code can use mathbasics library ✅

**Result:** Library loads correctly via destination! ✅

---

## 🧪 Testing

### Local Testing:

```bash
cd CustomLIb
npm start
```

**Expected:**
- ✅ Library loads via proxy
- ✅ No errors in console
- ✅ App works correctly

### FLP Testing:

After redeploy:
- ✅ Library loads via destination
- ✅ No "descriptor not found" error
- ✅ No loading from sapui5.hana.ondemand.com
- ✅ App works correctly

---

## ✅ Summary

| Change | Why |
|--------|-----|
| **Remove `mathbasics` from manifest.json** | Prevents FLP from loading too early |
| **Load in Component.js** | Ensures resource root is registered first |
| **Add proxy to ui5.yaml** | Enables local testing |

**This should fix the FLP loading issue!** ✅


