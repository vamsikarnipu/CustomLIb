# Complete Guide: Using Custom Library in Fiori Launchpad Application

## 📋 Overview

This guide shows you **exactly** how to consume a custom UI5 library in an application deployed to **Fiori Launchpad (FLP)**.

**Library:** `mathbasics`  
**Library URL:** `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com`  
**Destination:** `mathbasics-library`

---

## 🎯 Prerequisites

Before starting, ensure:

- ✅ Custom library is deployed and accessible
- ✅ Library URL is known (e.g., `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com`)
- ✅ You have access to BTP Cockpit to create destinations
- ✅ Your application is set up for HTML5-Repo deployment

---

## 📝 Step-by-Step Configuration

### Step 1: Create Destination in BTP Cockpit

**Go to:** BTP Cockpit → Cloud Foundry → Destinations

**Click:** New Destination

**Configure:**

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
| `WebIDEUsage` | `custom` |

**Important:** 
- ✅ URL should be **base URL only** (no `/resources` at the end)
- ✅ URL should **NOT have trailing slash**
- ✅ Name must match exactly: `mathbasics-library`

**Click:** Save

---

### Step 2: Configure `xs-app.json`

**File:** `xs-app.json` (root folder)

**Add destination route** (should be FIRST in routes array):

```json
{
  "welcomeFile": "/index.html",
  "authenticationMethod": "route",
  "routes": [
    {
      "source": "^/destinations/mathbasics-library/(.*)$",
      "destination": "mathbasics-library",
      "target": "/$1",
      "authenticationType": "none",
      "csrfProtection": false
    },
    {
      "source": "^/resources/(.*)$",
      "target": "/resources/$1",
      "authenticationType": "none",
      "destination": "ui5"
    },
    {
      "source": "^/test-resources/(.*)$",
      "target": "/test-resources/$1",
      "authenticationType": "none",
      "destination": "ui5"
    },
    {
      "source": "^(.*)$",
      "target": "$1",
      "service": "html5-apps-repo-rt",
      "authenticationType": "xsuaa"
    }
  ]
}
```

**Key Points:**
- ✅ Destination route must be **FIRST** in routes array
- ✅ `source` pattern: `^/destinations/mathbasics-library/(.*)$`
- ✅ `destination` name must match BTP Cockpit destination name
- ✅ `target`: `/$1` (strips prefix, forwards rest)

---

### Step 3: Configure `Component.js`

**File:** `webapp/Component.js`

**CRITICAL:** Load library in `init()` method **BEFORE** base init:

```javascript
sap.ui.define([
  "sap/ui/core/UIComponent",
  "project3/model/models"  // Adjust to your app namespace
], function (UIComponent, models) {
  "use strict";

  return UIComponent.extend("project3.Component", {  // Adjust to your app namespace
    metadata: {
      manifest: "json",
      interfaces: [
        "sap.ui.core.IAsyncContentCreation"
      ]
    },

    init: function () {
      // --- CRITICAL: Register resource root BEFORE base init (for FLP) ---
      // FLP reads manifest.json and tries to load libraries BEFORE Component.js init runs
      // We must register the resource root IMMEDIATELY so FLP knows where to find the library
      var oCore = sap.ui.getCore();
      
      // Register resource root FIRST (before any library loading attempts)
      // This tells UI5 where to find mathbasics library files
      if (!oCore.getResourceRoots()["mathbasics"]) {
        oCore.registerResourceRoot("mathbasics", "/destinations/mathbasics-library/resources/mathbasics/");
      }
      
      // Load library if not already loaded
      if (!oCore.getLoadedLibraries()["mathbasics"]) {
        oCore.loadLibrary("mathbasics", "/destinations/mathbasics-library/resources/mathbasics");
      }

      // --- Proceed with normal component initialization ---
      UIComponent.prototype.init.apply(this, arguments);

      // set the device model
      this.setModel(models.createDeviceModel(), "device");

      // enable routing
      this.getRouter().initialize();
    }
  });
});
```

**Key Points:**
- ✅ Register resource root **BEFORE** base init
- ✅ Load library **BEFORE** base init
- ✅ Use destination path: `/destinations/mathbasics-library/resources/mathbasics`
- ✅ Check if already loaded to prevent double-loading

---

### Step 4: Configure `index.html`

**File:** `webapp/index.html`

**IMPORTANT:** Do **NOT** add library to resource roots in `index.html` for FLP!

**Correct configuration:**

```html
<script
    id="sap-ui-bootstrap"
    src="/resources/sap-ui-core.js"
    data-sap-ui-theme="sap_horizon"
    data-sap-ui-resource-roots='{
        "project3": "./"  // Only your app namespace, NO mathbasics here!
    }'
    data-sap-ui-on-init="module:sap/ui/core/ComponentSupport"
    data-sap-ui-compat-version="edge"
    data-sap-ui-async="true"
    data-sap-ui-frame-options="trusted"
></script>
```

**Why?**
- FLP ignores resource roots in `index.html`
- FLP starts from `Component.js`, not `index.html`
- Adding library here causes errors in FLP

---

### Step 5: Configure `manifest.json`

**File:** `webapp/manifest.json`

**IMPORTANT:** Do **NOT** add library to dependencies for FLP!

**Correct configuration:**

```json
{
  "sap.ui5": {
    "dependencies": {
      "minUI5Version": "1.142.1",
      "libs": {
        "sap.m": {},
        "sap.ui.core": {}
        // NO mathbasics here! Loaded dynamically in Component.js
      }
    }
  }
}
```

**Why?**
- FLP reads `manifest.json` **BEFORE** `Component.js` runs
- If library is in dependencies, FLP tries to load it immediately
- FLP doesn't know destination path → tries default location → Error
- Loading dynamically in `Component.js` avoids this issue

---

### Step 6: Use Library in Your Code

**File:** `webapp/controller/Main.controller.js` (or any controller)

**Import and use:**

```javascript
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "mathbasics/BasicMath"  // ← Import custom library module
], function (Controller, MessageBox, BasicMath) {
  "use strict";

  return Controller.extend("project3.controller.Main", {
    onTestMath: function () {
      try {
        // Use BasicMath from the custom library
        var sum = BasicMath.add(10, 50);
        var product = BasicMath.multiply(5, 4);
        var difference = BasicMath.subtract(50, 30);
        var quotient = BasicMath.divide(100, 5);

        MessageBox.show(
          "Math Results:\n" +
          "10 + 50 = " + sum + "\n" +
          "5 × 4 = " + product + "\n" +
          "50 - 30 = " + difference + "\n" +
          "100 ÷ 5 = " + quotient,
          {
            title: "BasicMath Library Test",
            icon: MessageBox.Icon.SUCCESS
          }
        );
      } catch (error) {
        MessageBox.show("Error: " + error.message, {
          title: "Error",
          icon: MessageBox.Icon.ERROR
        });
      }
    }
  });
});
```

---

## 🧪 Local Testing Setup (Optional)

### Configure Proxy in `ui5.yaml`

**File:** `ui5.yaml`

**Add backend proxy** for local testing:

```yaml
server:
  customMiddleware:
    - name: fiori-tools-proxy
      afterMiddleware: compression
      configuration:
        ui5:
          path:
            - /resources
            - /test-resources
          url: https://ui5.sap.com
        backend:
          # Proxy for mathbasics-library destination (for local testing)
          - path: /destinations/mathbasics-library
            url: https://mathbasics-library.cfapps.us10-001.hana.ondemand.com
```

**Test locally:**

```bash
npm start
```

**What this does:**
- Proxies `/destinations/mathbasics-library/...` to actual library URL
- Allows local testing with same destination path as deployment
- No need to change code between local and deployed

---

## 🚀 Deployment Steps

### Step 1: Build Application

```bash
cd CustomLIb
npm install
npm run build:mta
```

**Or if using standard build:**

```bash
npm run build:cf
```

### Step 2: Deploy to Cloud Foundry

```bash
cf deploy mta_archives/customlib_0.0.1.mtar
```

**Or if using standard deploy:**

```bash
cf push
```

### Step 3: Verify Deployment

1. Go to **BTP Cockpit** → **HTML5 Applications**
2. Find your app
3. Verify it's deployed successfully

### Step 4: Add to Fiori Launchpad

1. Go to **Fiori Launchpad** → **Site Manager**
2. Add your app as a tile
3. Configure navigation target
4. Save and publish

---

## ✅ Complete File Checklist

| File | Configuration | Status |
|------|---------------|--------|
| **BTP Cockpit** | Destination `mathbasics-library` created | ⚠️ Required |
| **`xs-app.json`** | Destination route configured | ✅ Required |
| **`Component.js`** | Library loaded dynamically | ✅ Required |
| **`index.html`** | NO library in resource roots | ✅ Required |
| **`manifest.json`** | NO library in dependencies | ✅ Required |
| **`ui5.yaml`** | Proxy for local testing | ⚠️ Optional |

---

## 🔍 How It Works

### Request Flow in FLP:

1. **User opens app** from Fiori Launchpad tile

2. **FLP reads `manifest.json`:**
   - Sees `sap.m` and `sap.ui.core` only
   - Loads standard libraries ✅

3. **FLP starts Component.js:**
   - `init()` method runs
   - Registers resource root for `mathbasics` ✅
   - Loads `mathbasics` library via destination ✅

4. **App requests library file:**
   - Request: `/destinations/mathbasics-library/resources/mathbasics/library.js`

5. **xs-app.json route matches:**
   - Captures: `resources/mathbasics/library.js`
   - Forwards to destination: `mathbasics-library`
   - Final URL: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/library.js` ✅

6. **Library loads successfully** ✅

7. **App code can use library** ✅

---

## 🐛 Troubleshooting

### Error: "No descriptor was found"

**Cause:** Library declared in `manifest.json` dependencies

**Fix:** Remove `"mathbasics": {}` from `manifest.json` dependencies

---

### Error: "failed to load from https://sapui5.hana.ondemand.com/..."

**Cause:** FLP trying to load from default UI5 CDN instead of destination

**Fix:** Ensure `Component.js` registers resource root **BEFORE** base init

---

### Error: "Resource root is absolute and won't be registered"

**Cause:** Library added to `index.html` resource roots

**Fix:** Remove library from `index.html` resource roots (FLP ignores it anyway)

---

### Error: 404 when accessing library

**Check:**
1. ✅ Destination exists in BTP Cockpit
2. ✅ Destination URL is correct (base URL, no trailing slash)
3. ✅ Destination name matches `xs-app.json` route
4. ✅ Library is deployed and accessible
5. ✅ Test library URL directly: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/library.js`

---

## 📋 Quick Reference

### Destination Configuration

```
Name: mathbasics-library
URL: https://mathbasics-library.cfapps.us10-001.hana.ondemand.com
Type: HTTP
Proxy Type: Internet
Authentication: NoAuthentication
```

### Component.js Code

```javascript
init: function () {
  var oCore = sap.ui.getCore();
  
  // Register resource root FIRST
  if (!oCore.getResourceRoots()["mathbasics"]) {
    oCore.registerResourceRoot("mathbasics", "/destinations/mathbasics-library/resources/mathbasics/");
  }
  
  // Load library
  if (!oCore.getLoadedLibraries()["mathbasics"]) {
    oCore.loadLibrary("mathbasics", "/destinations/mathbasics-library/resources/mathbasics");
  }
  
  UIComponent.prototype.init.apply(this, arguments);
  // ... rest of init
}
```

### xs-app.json Route

```json
{
  "source": "^/destinations/mathbasics-library/(.*)$",
  "destination": "mathbasics-library",
  "target": "/$1",
  "authenticationType": "none"
}
```

---

## ✅ Summary

**For Fiori Launchpad deployment:**

1. ✅ **Create destination** in BTP Cockpit (base URL, no trailing slash)
2. ✅ **Configure `xs-app.json`** with destination route (FIRST in routes)
3. ✅ **Configure `Component.js`** to register resource root and load library BEFORE base init
4. ✅ **Do NOT** add library to `index.html` resource roots
5. ✅ **Do NOT** add library to `manifest.json` dependencies
6. ✅ **Deploy** and test in FLP

**Key Principle:** FLP loads libraries from `manifest.json` BEFORE `Component.js` runs. Load library dynamically in `Component.js` to avoid conflicts.

---

## 🎯 Final Checklist

Before deploying to FLP:

- [ ] Destination `mathbasics-library` created in BTP Cockpit
- [ ] Destination URL is base URL (no `/resources`, no trailing slash)
- [ ] `xs-app.json` has destination route (first in routes array)
- [ ] `Component.js` registers resource root BEFORE base init
- [ ] `Component.js` loads library BEFORE base init
- [ ] `index.html` does NOT have library in resource roots
- [ ] `manifest.json` does NOT have library in dependencies
- [ ] Library code imports work correctly
- [ ] App builds successfully
- [ ] App deployed to Cloud Foundry
- [ ] App added to Fiori Launchpad
- [ ] Test in FLP - library loads successfully ✅

---

## 📚 Additional Resources

- [Using UI5 Libraries in CF approuter - SAP Community Blog](https://community.sap.com/t5/technology-blog-posts-by-members/using-ui5-libraries-in-cf-approuter/ba-p/13483023)
- SAP BTP Documentation: HTML5 Application Development

---

**You're all set!** Follow these steps and your custom library will work in Fiori Launchpad! 🎉

