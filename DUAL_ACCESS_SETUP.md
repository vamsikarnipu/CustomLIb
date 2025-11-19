# Dual Access Setup: FLP + HTML5 App Repo

## 🎯 Goal

Support **TWO access methods**:
1. **Fiori Launchpad (FLP)** - Central AppRouter
2. **HTML5 App Repo** - Direct access from Cockpit

---

## 📋 Configuration for Both Scenarios

### ✅ Solution: Dual Configuration

We configure the library loading in **BOTH** places:
- `index.html` - For HTML5 App Repo direct access
- `Component.js` - For FLP (Central AppRouter)

The code automatically detects which scenario and loads accordingly.

---

## 📄 File 1: `webapp/index.html`

**Keep resource roots** (for HTML5 App Repo and BAS):

```html
<script
    id="sap-ui-bootstrap"
    src="resources/sap-ui-core.js"
    data-sap-ui-theme="sap_horizon"
    data-sap-ui-resource-roots='{
        "customlib": "./",
        "mathbasics": "/destinations/mathbasics-library/resources/mathbasics/"
    }'
    ...>
</script>
```

**Why:** HTML5 App Repo and BAS start from `index.html`, so resource roots work here.

---

## 📄 File 2: `webapp/Component.js`

**Load library conditionally** (for FLP):

```javascript
init() {
    UIComponent.prototype.init.apply(this, arguments);

    // Load mathbasics library dynamically
    // Required for FLP (Central AppRouter) which starts from Component.js, not index.html
    // Resource roots in index.html are not used in FLP
    // For HTML5 App Repo direct access, library is loaded via index.html resource roots
    // Check if library is not already loaded (for HTML5 App Repo scenario)
    if (!sap.ui.getCore().getLoadedLibraries()["mathbasics"]) {
        sap.ui.getCore().loadLibrary("mathbasics", "/destinations/mathbasics-library/resources/mathbasics");
    }

    this.setModel(models.createDeviceModel(), "device");
    this.getRouter().initialize();
}
```

**Why:** 
- FLP starts from `Component.js`, so resource roots in `index.html` are ignored
- The check prevents double-loading if already loaded via `index.html`

---

## 📄 File 3: `xs-app.json`

**Keep destination route** (for both scenarios):

```json
{
  "source": "^/destinations/mathbasics-library/(.*)$",
  "destination": "mathbasics-library",
  "target": "/$1",
  "authenticationType": "none",
  "csrfProtection": false
}
```

**Note:** For HTML5-Repo apps, Launchpad handles routing, but `xs-app.json` is still good practice.

---

## 📄 File 4: `webapp/manifest.json`

**Keep library dependency**:

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

---

## 📄 File 5: Destination Configuration

**BTP Cockpit → Destinations → `mathbasics-library`:**

```
URL: https://mathbasics-library.cfapps.us10-001.hana.ondemand.com
```
(Base URL, no `/resources`)

---

## 🔍 How It Works

### Scenario 1: HTML5 App Repo (Direct Access)

1. User accesses app directly from HTML5 App Repo
2. App starts from `index.html`
3. Resource roots in `index.html` load the library ✅
4. `Component.js` checks if library is loaded → Already loaded, skips ✅
5. **Result:** Library loads via `index.html` ✅

### Scenario 2: Fiori Launchpad (FLP)

1. User accesses app from FLP tile
2. FLP starts app from `Component.js` (not `index.html`)
3. Resource roots in `index.html` are **ignored** ❌
4. `Component.js` checks if library is loaded → Not loaded, loads it ✅
5. **Result:** Library loads via `Component.js` ✅

---

## ✅ Summary

| Access Method | Entry Point | Library Loading | Status |
|--------------|-------------|-----------------|--------|
| **HTML5 App Repo** | `index.html` | Resource roots in `index.html` | ✅ Works |
| **Fiori Launchpad** | `Component.js` | `loadLibrary()` in `Component.js` | ✅ Works |
| **BAS (Local)** | `index.html` | Resource roots in `index.html` | ✅ Works |

---

## 🧪 Testing

### Test 1: HTML5 App Repo
1. Go to **BTP Cockpit** → **HTML5 Applications**
2. Open your app directly
3. Check browser console - library should load ✅

### Test 2: Fiori Launchpad
1. Go to **Fiori Launchpad**
2. Click your app tile
3. Check browser console - library should load ✅

---

## 📚 Reference

Based on: [Using UI5 Libraries in CF approuter - SAP Community Blog](https://community.sap.com/t5/technology-blog-posts-by-members/using-ui5-libraries-in-cf-approuter/ba-p/13483023)

Key insight: FLP uses `Component.js`, HTML5 App Repo uses `index.html` - configure both!

