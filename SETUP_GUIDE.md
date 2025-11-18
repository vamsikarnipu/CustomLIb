# Complete Setup Guide - Consuming mathbasics Library

This guide explains how to set up your Fiori app to use the `mathbasics` library both locally and when deployed.

## 📋 Prerequisites

- ✅ `mathbasics` library deployed to Cloud Foundry
- ✅ Destination `mathbasics-library` created in BTP Cockpit
- ✅ Fiori app (`com.genpact`) created

---

## 🏠 Part 1: Local Development Setup

### Step 1: Configure index.html

Open `webapp/index.html` and add the library resource root:

```html
<script
    id="sap-ui-bootstrap"
    src="resources/sap-ui-core.js"
    data-sap-ui-resource-roots='{
        "com.genpact": "./",
        "mathbasics": "https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/"
    }'
    ...>
</script>
```

**What this does:** Points directly to your deployed library URL for local testing.

### Step 2: Configure manifest.json

Open `webapp/manifest.json` and add the library to dependencies:

```json
{
    "sap.ui5": {
        "dependencies": {
            "libs": {
                "sap.ui.core": {},
                "sap.m": {},
                "mathbasics": {}  ← Add this
            }
        }
    }
}
```

**What this does:** Tells UI5 that your app needs the `mathbasics` library.

### Step 3: Use the Library in Your Code

In any controller, import and use BasicMath:

```javascript
sap.ui.define([
    "./BaseController",
    "mathbasics/BasicMath"  ← Import the library
], function (BaseController, BasicMath) {
    return BaseController.extend("com.genpact.controller.Main", {
        onCalculate: function () {
            var sum = BasicMath.add(10, 20);        // Returns 30
            var product = BasicMath.multiply(5, 4);  // Returns 20
        }
    });
});
```

### Step 4: Run Locally

```bash
cd com.genpact
npm start
```

Open `http://localhost:8080` - your app should load the library from Cloud Foundry!

---

## ☁️ Part 2: Cloud Foundry Deployment Setup

### Step 1: Create xs-app.json

Create `xs-app.json` in the root of your app:

```json
{
  "welcomeFile": "/index.html",
  "routes": [
    {
      "source": "^/destinations/mathbasics-library/(.*)$",
      "destination": "mathbasics-library",
      "target": "/$1",
      "authenticationType": "none"
    }
  ]
}
```

**What this does:** Routes requests from your app to the destination.

### Step 2: Update index.html for Deployment (Optional)

When deploying, you can optionally change the resource root to use destination:

```html
"mathbasics": "/destinations/mathbasics-library/resources/mathbasics/"
```

**Note:** The direct URL also works when deployed, so this step is optional.

### Step 3: Create manifest.yml (if not exists)

Create `manifest.yml` in the root:

```yaml
applications:
  - name: com-genpact-app
    path: dist
    buildpacks:
      - staticfile_buildpack
    memory: 128M
```

### Step 4: Deploy

```bash
# Build the app
npm run build

# Deploy to Cloud Foundry
cf push
```

---

## ✅ Quick Checklist

### For Local Development:
- [ ] `index.html` has mathbasics resource root pointing to Cloud Foundry URL
- [ ] `manifest.json` has mathbasics in dependencies
- [ ] Run `npm start`
- [ ] Test the library works

### For Deployment:
- [ ] `xs-app.json` exists with destination route
- [ ] Destination `mathbasics-library` exists in BTP Cockpit
- [ ] `manifest.yml` exists
- [ ] Build and deploy with `cf push`

---

## 🔧 Configuration Files Summary

### File: `webapp/index.html`
**Purpose:** Bootstrap configuration for local development
**Key Setting:** Resource root pointing to library URL

### File: `webapp/manifest.json`
**Purpose:** App configuration and dependencies
**Key Setting:** Library dependency declaration

### File: `xs-app.json` (root)
**Purpose:** Application router configuration for Cloud Foundry
**Key Setting:** Destination routing

### File: `manifest.yml` (root)
**Purpose:** Cloud Foundry deployment configuration
**Key Setting:** App name and buildpack

---

## 🧪 Testing

### Test Locally:
1. Run `npm start`
2. Open browser console (F12)
3. Check Network tab - should see requests to `mathbasics-library.cfapps.us10-001.hana.ondemand.com`
4. Click "Test BasicMath Library" button
5. Should see math results in message box

### Test After Deployment:
1. Deploy with `cf push`
2. Open deployed app URL
3. Test the library functionality
4. Check browser console for any errors

---

## 🐛 Troubleshooting

### Library Not Loading Locally

**Problem:** 404 errors for library.js

**Solution:**
- Check `index.html` resource root URL is correct
- Verify library is deployed and accessible
- Check browser console for exact error

### Library Not Loading After Deployment

**Problem:** Library fails to load when deployed

**Solution:**
- Verify destination `mathbasics-library` exists in BTP Cockpit
- Check destination URL is correct
- Verify `xs-app.json` route is configured
- Check app logs: `cf logs com-genpact-app --recent`

### CORS Errors

**Problem:** Cross-origin request blocked

**Solution:**
- This shouldn't happen with Cloud Foundry apps
- If it does, check destination configuration
- Verify destination allows requests from your app

---

## 📝 Example Usage

### In Controller:

```javascript
sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "mathbasics/BasicMath"
], function (BaseController, MessageBox, BasicMath) {
    return BaseController.extend("com.genpact.controller.Main", {
        onTestMath: function () {
            try {
                var sum = BasicMath.add(10, 20);
                var product = BasicMath.multiply(5, 4);
                var diff = BasicMath.subtract(50, 30);
                var quotient = BasicMath.divide(100, 5);

                MessageBox.show(
                    "Sum: " + sum + "\n" +
                    "Product: " + product + "\n" +
                    "Difference: " + diff + "\n" +
                    "Quotient: " + quotient
                );
            } catch (error) {
                MessageBox.show("Error: " + error.message);
            }
        }
    });
});
```

### Available Methods:

- `BasicMath.add(a, b)` - Addition
- `BasicMath.subtract(a, b)` - Subtraction  
- `BasicMath.multiply(a, b)` - Multiplication
- `BasicMath.divide(a, b)` - Division (throws error if b = 0)

---

## 🎯 Summary

**Local Development:**
1. Add resource root in `index.html` → Direct URL to Cloud Foundry
2. Add dependency in `manifest.json`
3. Run `npm start`

**Cloud Foundry Deployment:**
1. Create `xs-app.json` → Destination routing
2. Create `manifest.yml` → Deployment config
3. Deploy with `cf push`

That's it! Your app can now use the `mathbasics` library both locally and when deployed! 🎉

