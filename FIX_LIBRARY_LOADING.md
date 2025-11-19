# Fix: Library Loading Error in HTML5-Repo Apps

## 🔴 Problem

Error when loading library:
```
failed to load 'mathbasics/library.js' from /destinations/mathbasics-library/resources/mathbasics/library.js: script load error
```

## ✅ Root Cause (Based on SAP Community Blog)

Reference: [Using UI5 Libraries in CF approuter](https://community.sap.com/t5/technology-blog-posts-by-members/using-ui5-libraries-in-cf-approuter/ba-p/13483023)

### Issue 1: Resource Roots in index.html Not Used in FLP

**Problem:** 
- FLP (Central AppRouter) starts apps from `Component.js`, **NOT** `index.html`
- Resource roots defined in `index.html` are **ignored** in FLP
- Library must be loaded in `Component.js` instead

### Issue 2: Destination URL Configuration

**Problem:**
- Launchpad appends `/resources/<namespace>/<file>` to the destination URL
- If destination URL includes `/resources`, you get double paths

**Solution:**
- Destination URL should be **BASE URL only** (no `/resources`)

---

## ✅ Solution

### Fix 1: Load Library in Component.js

**File:** `webapp/Component.js`

**Add library loading in `init()` method:**

```javascript
init() {
    // call the base component's init function
    UIComponent.prototype.init.apply(this, arguments);

    // Load mathbasics library dynamically
    // Required for FLP (Central AppRouter) which starts from Component.js, not index.html
    // Resource roots in index.html are not used in FLP
    sap.ui.getCore().loadLibrary("mathbasics", "/destinations/mathbasics-library/resources/mathbasics");

    // set the device model
    this.setModel(models.createDeviceModel(), "device");

    // enable routing
    this.getRouter().initialize();
}
```

### Fix 2: Update Destination URL to Base URL

**File:** `mta.yaml` (or BTP Cockpit)

**Change destination URL from:**
```yaml
URL: https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources  # ❌ WRONG
```

**To:**
```yaml
URL: https://mathbasics-library.cfapps.us10-001.hana.ondemand.com  # ✅ CORRECT
```

**Why?**
- Launchpad appends `/resources/mathbasics/library.js` automatically
- Final URL: `https://mathbasics-library.../resources/mathbasics/library.js` ✅
- If URL includes `/resources`: `https://mathbasics-library.../resources/resources/mathbasics/library.js` ❌

---

## 📋 How It Works

### Request Flow:

1. **UI5 requests:** `/destinations/mathbasics-library/resources/mathbasics/library.js`

2. **Launchpad forwards to:** `destination.URL + /resources/mathbasics/library.js`

3. **With correct base URL:**
   - Destination URL: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com`
   - Final URL: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/library.js` ✅

4. **Library files are at:** `dist/resources/mathbasics/library.js` (when deployed)
5. **Staticfile serves from:** `dist/` root
6. **Result:** File found → 200 OK ✅

---

## ✅ Summary of Changes

| File | Change | Reason |
|------|--------|--------|
| `webapp/Component.js` | Add `loadLibrary()` call | FLP starts from Component.js, not index.html |
| `mta.yaml` | Remove `/resources` from destination URL | Launchpad appends `/resources/...` automatically |
| BTP Cockpit | Update destination URL to base URL | Same reason |

---

## 🧪 Testing

After making these changes:

1. **Redeploy the app:**
   ```bash
   cd CustomLIb
   npm run build:mta
   cf deploy mta_archives/customlib_0.0.1.mtar
   ```

2. **Update destination in BTP Cockpit** (if created manually):
   - Go to **BTP Cockpit** → **Cloud Foundry** → **Destinations**
   - Edit `mathbasics-library`
   - Set URL to: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com` (no `/resources`)

3. **Test in FLP:**
   - Open your app in Fiori Launchpad
   - Check browser console - should see library loading successfully
   - No more "script load error" ✅

---

## 📚 References

- [Using UI5 Libraries in CF approuter - SAP Community Blog](https://community.sap.com/t5/technology-blog-posts-by-members/using-ui5-libraries-in-cf-approuter/ba-p/13483023)
- Key insight: FLP starts from Component.js, resource roots in index.html are ignored

---

## ✅ Final Configuration

### Component.js:
```javascript
sap.ui.getCore().loadLibrary("mathbasics", "/destinations/mathbasics-library/resources/mathbasics");
```

### Destination URL:
```
https://mathbasics-library.cfapps.us10-001.hana.ondemand.com
```
(No `/resources` at the end!)

### index.html:
Keep resource roots for local development (BAS), but Component.js handles FLP deployment.

