# Configuration for HTML5 App + SAP Managed App Router (FLP)

## 🎯 Question

**If accessing through HTML5 Application AND linked to SAP Managed App Router (FLP), where should library be configured?**

**Answer: ALL THREE places!** ✅

---

## 📋 Required Configuration (All 3 Files)

### 1. ✅ `manifest.json` - **MUST HAVE** (Always Required)

**File:** `webapp/manifest.json`

**Why:** Declares library dependency - UI5 uses this to know the library is needed.

**Configuration:**
```json
{
  "sap.ui5": {
    "dependencies": {
      "libs": {
        "sap.m": {},
        "sap.ui.core": {},
        "mathbasics": {}  // ← REQUIRED
      }
    }
  }
}
```

**Used by:** Both HTML5 App Repo AND FLP (Managed App Router)

---

### 2. ✅ `Component.js` - **MUST HAVE** (For Managed App Router/FLP)

**File:** `webapp/Component.js`

**Why:** FLP (Managed App Router) starts apps from `Component.js`, NOT `index.html`. Resource roots in `index.html` are **ignored** in FLP.

**Configuration:**
```javascript
init() {
    UIComponent.prototype.init.apply(this, arguments);

    // Load library for FLP (Managed App Router)
    // FLP starts from Component.js, so index.html resource roots are ignored
    if (!sap.ui.getCore().getLoadedLibraries()["mathbasics"]) {
        sap.ui.getCore().loadLibrary("mathbasics", "/destinations/mathbasics-library/resources/mathbasics");
    }

    this.setModel(models.createDeviceModel(), "device");
    this.getRouter().initialize();
}
```

**Used by:** FLP (Managed App Router) ✅

**Not used by:** Direct HTML5 App Repo access (uses index.html instead)

---

### 3. ✅ `index.html` - **MUST HAVE** (For Direct HTML5 App Repo Access)

**File:** `webapp/index.html`

**Why:** When accessing directly from HTML5 App Repo (not through FLP), the app starts from `index.html`, so resource roots here are used.

**Configuration:**
```html
<script
    id="sap-ui-bootstrap"
    src="resources/sap-ui-core.js"
    data-sap-ui-resource-roots='{
        "customlib": "./",
        "mathbasics": "/destinations/mathbasics-library/resources/mathbasics/"  // ← REQUIRED
    }'
    ...>
</script>
```

**Used by:** Direct HTML5 App Repo access ✅

**Not used by:** FLP (Managed App Router) - FLP ignores this and uses Component.js instead

---

## 🔍 How It Works

### Scenario 1: Access via HTML5 App Repo (Direct)

1. User opens app from **BTP Cockpit → HTML5 Applications**
2. App starts from `index.html`
3. Resource roots in `index.html` load library ✅
4. `manifest.json` declares dependency ✅
5. `Component.js` checks if library loaded → Already loaded, skips ✅
6. **Result:** Library loads via `index.html` ✅

### Scenario 2: Access via FLP (Managed App Router)

1. User opens app from **Fiori Launchpad** tile
2. FLP (Managed App Router) starts app from `Component.js` (NOT `index.html`)
3. Resource roots in `index.html` are **ignored** ❌
4. `manifest.json` declares dependency ✅
5. `Component.js` loads library via `loadLibrary()` ✅
6. **Result:** Library loads via `Component.js` ✅

---

## ✅ Summary Table

| File | Purpose | Used by HTML5 App Repo? | Used by FLP? |
|------|---------|------------------------|-------------|
| **manifest.json** | Declare library dependency | ✅ Yes | ✅ Yes |
| **Component.js** | Load library for FLP | ⚠️ Check only (already loaded) | ✅ Yes (loads library) |
| **index.html** | Resource roots for direct access | ✅ Yes (loads library) | ❌ No (ignored) |

---

## 🎯 Answer to Your Question

**"If accessing through HTML5 Application AND linked to SAP Managed App Router, where should library be configured?"**

**Answer:** Configure in **ALL THREE places**:

1. ✅ **manifest.json** - Always required (both scenarios)
2. ✅ **Component.js** - Required for FLP (Managed App Router)
3. ✅ **index.html** - Required for direct HTML5 App Repo access

**Why all three?**
- `manifest.json` declares the dependency (always needed)
- `Component.js` handles FLP access (Managed App Router)
- `index.html` handles direct HTML5 App Repo access

The code in `Component.js` checks if library is already loaded, so it's safe to have both configurations.

---

## ✅ Current Configuration Status

Your app is **already configured correctly** for both scenarios! ✅

- ✅ `manifest.json` has `"mathbasics": {}`
- ✅ `Component.js` has `loadLibrary()` call
- ✅ `index.html` has resource roots

**You're all set!** 🎉


