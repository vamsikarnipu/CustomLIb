# Quick Start - 5 Minute Setup

## 🚀 Get Started in 5 Minutes

### Step 1: Update index.html (1 minute)

Open `webapp/index.html` and add this line inside the `data-sap-ui-resource-roots`:

```html
"mathbasics": "/destinations/mathbasics-library/resources/mathbasics/"
```

**Full example:**
```html
data-sap-ui-resource-roots='{
    "com.genpact": "./",
    "mathbasics": "/destinations/mathbasics-library/resources/mathbasics/"
}'
```

**Note:** This uses the destination (no hardcoded URL). For local development, install proxy middleware (see Step 1.5).

### Step 1.5: Install Proxy for Local Development (Optional)

For local development with destinations, install proxy middleware:

```bash
npm install --save-dev ui5-middleware-simpleproxy
```

**Note:** The `ui5.yaml` is already configured. After installing, restart `npm start`.

**Alternative:** You can temporarily use direct URL for local testing, then change to destination path before deploying.

### Step 2: Update manifest.json (1 minute)

Open `webapp/manifest.json` and add `"mathbasics": {}` to dependencies:

```json
"dependencies": {
    "libs": {
        "sap.ui.core": {},
        "sap.m": {},
        "mathbasics": {}  ← Add this line
    }
}
```

### Step 3: Use in Your Code (2 minutes)

In any controller file, import and use:

```javascript
sap.ui.define([
    "./BaseController",
    "mathbasics/BasicMath"  ← Add this
], function (BaseController, BasicMath) {
    return BaseController.extend("com.genpact.controller.Main", {
        onCalculate: function () {
            var result = BasicMath.add(10, 20);  // Returns 30
            console.log(result);
        }
    });
});
```

### Step 4: Test (1 minute)

```bash
npm start
```

Open browser → Click your button → See results! ✅

---

## ☁️ For Deployment (When Ready)

### Deploy (Uses Destination - No Hardcoded URL) ✅

**You're already configured to use destination!** Just deploy:

```bash
npm run build
cf push
```

**What you have:**
- ✅ `index.html` - Uses destination path (no hardcoded URL)
- ✅ `manifest.json` - Has mathbasics dependency
- ✅ `xs-app.json` - Routes destination requests

**That's it!** When deployed, `xs-app.json` will forward destination requests automatically.

---

### Summary

**Minimum Required for Deployment:**
- ✅ `xs-app.json` - Already created ✓
- ✅ `manifest.json` - Already has dependency ✓  
- ✅ `index.html` - Already has resource root ✓

**Just run:** `npm run build && cf push` 🚀

---

## 📄 Want to See Complete File Examples?

See `COMPLETE_FILE_EXAMPLES.md` to see exactly how each file should look!

---

## ❓ Need Help?

See `SETUP_GUIDE.md` for detailed instructions and troubleshooting.

