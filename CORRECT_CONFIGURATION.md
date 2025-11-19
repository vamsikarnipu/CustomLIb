# ❌ Wrong Configuration vs ✅ Correct Configuration

## ❌ What You Proposed (Won't Work)

### manifest.json:
```json
"sap.ui5": {
  "resourceRoots": {  // ❌ NOT a valid property in manifest.json!
    "mathbasics": "/destinations/mathbasics-library/resources/mathbasics/"
  },
  "dependencies": {
    "libs": {
      "mathbasics": {  // ❌ FLP will try to load BEFORE Component.js runs
        "lazy": false
      }
    }
  }
}
```

### Component.js:
```javascript
init: function () {
  UIComponent.prototype.init.apply(this, arguments);  // ❌ No library loading!
  // ...
}
```

**Problems:**
1. ❌ `resourceRoots` is NOT a valid property in `manifest.json` - UI5 ignores it
2. ❌ Library in dependencies → FLP tries to load BEFORE Component.js runs
3. ❌ FLP doesn't know where to find library → tries default CDN: `https://sapui5.hana.ondemand.com/...`
4. ❌ No library loading code in Component.js

---

## ✅ Correct Configuration (What We Have Now)

### manifest.json:
```json
"sap.ui5": {
  "flexEnabled": true,
  "dependencies": {
    "minUI5Version": "1.142.1",
    "libs": {
      "sap.m": {},
      "sap.ui.core": {}
      // ✅ NO mathbasics here - prevents FLP from loading before Component.js
    }
  }
}
```

**Why:** Prevents FLP from trying to load library before Component.js runs

---

### Component.js:
```javascript
init: function () {
  // ✅ Register resource root FIRST
  var oCore = sap.ui.getCore();
  oCore.registerResourceRoot("mathbasics", "/destinations/mathbasics-library/resources/mathbasics/");
  
  // ✅ Load library directly from destination path
  oCore.loadLibrary("mathbasics", "/destinations/mathbasics-library/resources/mathbasics");

  // ✅ Then proceed with base init
  UIComponent.prototype.init.apply(this, arguments);
  
  // ... rest of init
}
```

**Why:** 
- We control when library loads
- Library loads from destination path, not default CDN
- Resource root registered before loading

---

## 🔍 Why Your Proposed Config Won't Work

### Issue 1: `resourceRoots` Not Valid in manifest.json

**Standard UI5 manifest.json properties:**
- ✅ `dependencies` - Valid
- ✅ `models` - Valid
- ✅ `routing` - Valid
- ✅ `resources` - Valid
- ❌ `resourceRoots` - **NOT VALID**

**Resource roots must be registered via:**
- `data-sap-ui-resource-roots` in `index.html` (but FLP ignores this)
- `sap.ui.getCore().registerResourceRoot()` in code (✅ This is what we do)

---

### Issue 2: Library in Dependencies Causes Timing Issue

**Timeline:**

1. **FLP reads `manifest.json`** (BEFORE Component.js runs)
2. **Sees `mathbasics` in dependencies**
3. **Tries to load library immediately**
4. **Doesn't know about resource root** (not registered yet)
5. **Falls back to default CDN:** `https://sapui5.hana.ondemand.com/...` ❌

**Your Component.js:**
- Runs AFTER FLP tries to load library
- Too late to help!

---

## ✅ Correct Approach (Current Implementation)

### Timeline:

1. **FLP reads `manifest.json`**
   - Sees NO `mathbasics` dependency ✅
   - Doesn't try to load library ✅

2. **FLP starts Component.js**
   - `init()` method runs
   - Registers resource root FIRST ✅
   - Loads library from destination path ✅

3. **Library loads successfully** ✅

---

## 📋 Complete Correct Configuration

### 1. manifest.json
```json
{
  "sap.ui5": {
    "flexEnabled": true,
    "dependencies": {
      "minUI5Version": "1.142.1",
      "libs": {
        "sap.m": {},
        "sap.ui.core": {}
        // NO mathbasics here!
      }
    }
  }
}
```

### 2. Component.js
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

### 3. xs-app.json
```json
{
  "source": "^/destinations/mathbasics-library/(.*)$",
  "destination": "mathbasics-library",
  "target": "/$1",
  "authenticationType": "xsuaa",  // ✅ Critical!
  "csrfProtection": false
}
```

---

## ✅ Summary

| Configuration | Status | Why |
|--------------|--------|-----|
| `resourceRoots` in manifest.json | ❌ Invalid | Not a valid UI5 property |
| Library in dependencies | ❌ Wrong | FLP loads before Component.js |
| No loading in Component.js | ❌ Wrong | Library never loads |
| **Current approach** | ✅ **Correct** | Loads in Component.js BEFORE base init |

---

## 🎯 Final Answer

**Your proposed configuration is ❌ INCORRECT**

**Use the current implementation:**
- ✅ NO library in `manifest.json` dependencies
- ✅ NO `resourceRoots` in `manifest.json` (not valid)
- ✅ Load library in `Component.js` BEFORE base init
- ✅ Register resource root in `Component.js` BEFORE loading

**This matches the blog's "Run everywhere" approach and fixes the CDN loading issue!** 🎉

