# SAP-Approved FLP Method: Library Loading via manifest.json

## ✅ Correct Implementation (SAP Standard)

This is the **ONLY** SAP-approved method for loading custom libraries in Fiori Launchpad apps.

---

## 📋 Final Configuration

### 1. ✅ `manifest.json` - Declarative Library Loading

```json
{
  "sap.ui5": {
    "flexEnabled": true,
    "resourceRoots": {
      "mathbasics": "/destinations/mathbasics-library/resources/mathbasics/"
    },
    "dependencies": {
      "minUI5Version": "1.142.1",
      "libs": {
        "sap.m": {},
        "sap.ui.core": {},
        "mathbasics": {
          "lazy": false
        }
      }
    }
  }
}
```

**Key Points:**
- ✅ `resourceRoots` - Tells FLP where to find the library
- ✅ `mathbasics` in dependencies - Declares library dependency
- ✅ `lazy: false` - Forces FLP to wait for library before showing app

---

### 2. ✅ `Component.js` - Clean, No Manual Loading

```javascript
init: function () {
  // Library loading is handled declaratively in manifest.json
  // FLP reads manifest.json BEFORE Component.js runs
  // resourceRoots tells FLP where to find the library
  // lazy: false ensures library loads before views are rendered
  // No manual loading needed - SAP-approved FLP method

  UIComponent.prototype.init.apply(this, arguments);
  
  this.setModel(models.createDeviceModel(), "device");
  this.getRouter().initialize();
}
```

**Key Points:**
- ✅ **NO** `loadLibrary()` call
- ✅ **NO** `registerResourceRoot()` call
- ✅ Clean, standard Component.js

---

### 3. ✅ `xs-app.json` - Destination Routing with Authentication

```json
{
  "source": "^/destinations/mathbasics-library/(.*)$",
  "destination": "mathbasics-library",
  "target": "/$1",
  "authenticationType": "xsuaa",
  "csrfProtection": false
}
```

**Key Points:**
- ✅ `authenticationType: "xsuaa"` - Passes user token to library
- ✅ Routes `/destinations/mathbasics-library/...` to destination

---

### 4. ✅ BTP Destination Configuration

**Subaccount Level Destination:**

| Property | Value |
|----------|-------|
| **Name** | `mathbasics-library` |
| **Type** | `HTTP` |
| **URL** | `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com` |
| **Proxy Type** | `Internet` |
| **Authentication** | `NoAuthentication` |

**Additional Properties:**

| Key | Value |
|-----|-------|
| `WebIDEEnabled` | `true` |
| `HTML5.DynamicDestination` | `true` |
| `HTML5.ForwardAuthToken` | `true` |
| `WebIDEUsage` | `custom` |

---

## 🔍 How It Works

### Timeline:

1. **FLP reads `manifest.json`:**
   - Sees `resourceRoots` → knows where to find library
   - Sees `mathbasics` in dependencies with `lazy: false`
   - **Waits** for library to load before proceeding ✅

2. **FLP loads library:**
   - Uses `resourceRoots` path: `/destinations/mathbasics-library/resources/mathbasics/...`
   - Requests library file from destination

3. **xs-app.json route handles request:**
   - Route matches `/destinations/mathbasics-library/...`
   - `authenticationType: "xsuaa"` forwards user token
   - Destination resolves to library URL ✅

4. **Library loads successfully** ✅

5. **FLP starts Component.js:**
   - Library is already loaded ✅
   - Views can safely use library controls ✅

---

## ❌ Why Component.js Loading Fails

| Issue | Why It Fails |
|-------|--------------|
| **Timing** | Component.js runs AFTER FLP tries to load library |
| **Race Condition** | Views load before library finishes downloading |
| **API Removal** | `registerResourceRoot()` removed in UI5 1.142+ |
| **FLP Bypass** | Manual loading bypasses FLP's whitelist and async preload |

---

## ✅ Why manifest.json Works

| Benefit | Why |
|---------|-----|
| **Early Loading** | FLP reads manifest.json BEFORE Component.js runs |
| **No Race Condition** | `lazy: false` ensures library loads before views |
| **FLP Compatible** | Uses FLP's built-in library loading mechanism |
| **SAP Standard** | Official SAP-approved method |

---

## 📋 Complete File Checklist

| File | Configuration | Status |
|------|---------------|--------|
| **manifest.json** | `resourceRoots` + library in dependencies | ✅ Required |
| **Component.js** | Clean, no manual loading | ✅ Required |
| **xs-app.json** | Destination route with `xsuaa` | ✅ Required |
| **BTP Destination** | At subaccount level with properties | ✅ Required |

---

## 🎯 Summary

**SAP-Approved Method:**
- ✅ `resourceRoots` in `manifest.json` (tells FLP where to find library)
- ✅ Library in `manifest.json` dependencies with `lazy: false` (forces early loading)
- ✅ Clean `Component.js` (no manual loading)
- ✅ `xs-app.json` with `xsuaa` authentication (forwards user token)

**This is the ONLY correct way for FLP apps!** 🎉

---

## 🚀 Next Steps

1. **Verify destination** has `HTML5.ForwardAuthToken: true` property
2. **Deploy** the updated code
3. **Test in FLP** - library should load from destination path ✅

---

**This implementation follows SAP's official guidelines for FLP library loading!** ✅

