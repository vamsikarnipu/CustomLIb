# How to Consume mathbasics Library - File-by-File Guide

This guide shows exactly which files to change, what to add, why, and where when consuming the `mathbasics` library in your UI5/Fiori application.

---

## 📋 Overview: 3 Files to Change

When consuming the library, you need to modify **exactly 3 files**:

1. **`webapp/index.html`** - Add resource root (tells UI5 where library is)
2. **`webapp/manifest.json`** - Add library dependency (declares library is needed)
3. **`xs-app.json`** - Add destination route (routes requests to destination)

**That's it!** No hardcoded URLs needed.

---

## 📄 File 1: `webapp/index.html`

### Where: `com.genpact/webapp/index.html`

### What to Change:

**Find this section (around line 14):**
```html
data-sap-ui-resource-roots='{
    "com.genpact": "./"
}'
```

**Change to:**
```html
data-sap-ui-resource-roots='{
    "com.genpact": "./",
    "mathbasics": "/destinations/mathbasics-library/resources/mathbasics/"
}'
```

### Why:
- Tells UI5 runtime where to find the `mathbasics` library
- Uses destination path (no hardcoded URL!)
- Destination name: `mathbasics-library` (configured in BTP Cockpit)

### Complete Example:

```html
<script
    id="sap-ui-bootstrap"
    src="https://ui5.sap.com/1.142.1/resources/sap-ui-core.js"
    data-sap-ui-resource-roots='{
        "com.genpact": "./",
        "mathbasics": "/destinations/mathbasics-library/resources/mathbasics/"
    }'
    data-sap-ui-on-init="module:sap/ui/core/ComponentSupport"
    data-sap-ui-compat-version="edge"
    data-sap-ui-frame-options="trusted"
    data-sap-ui-async="true"
></script>
```

---

## 📄 File 2: `webapp/manifest.json`

### Where: `com.genpact/webapp/manifest.json`

### What to Change:

**Find this section (around line 36-43):**
```json
"dependencies": {
    "minUI5Version": "1.142.1",
    "libs": {
        "sap.ui.core": {},
        "sap.m": {}
    }
}
```

**Change to:**
```json
"dependencies": {
    "minUI5Version": "1.142.1",
    "libs": {
        "sap.ui.core": {},
        "sap.m": {},
        "mathbasics": {}
    }
}
```

### Why:
- Declares that your app depends on the `mathbasics` library
- UI5 will load the library when your app starts
- The name `"mathbasics"` must match the library namespace (from library's `library.js`)

### Complete Example:

```json
{
    "sap.ui5": {
        "dependencies": {
            "minUI5Version": "1.142.1",
            "libs": {
                "sap.ui.core": {},
                "sap.m": {},
                "mathbasics": {}
            }
        }
    }
}
```

---

## 📄 File 3: `xs-app.json`

### Where: `com.genpact/xs-app.json` (root folder - create if doesn't exist)

### What to Add:

**If file doesn't exist, create it with:**
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

**If file exists, add this route to the `routes` array:**
```json
{
  "source": "^/destinations/mathbasics-library/(.*)$",
  "destination": "mathbasics-library",
  "target": "/$1",
  "authenticationType": "none"
}
```

### Why:
- Routes requests from `/destinations/mathbasics-library/` to the destination
- Only works when deployed to Cloud Foundry
- `destination: "mathbasics-library"` must match destination name in BTP Cockpit

### Complete Example:

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

---

## ✅ Summary Table

| File | Location | What to Change | Why | When |
|------|----------|---------------|-----|------|
| **index.html** | `webapp/index.html` | Add resource root | Tells UI5 where library is | Always |
| **manifest.json** | `webapp/manifest.json` | Add library dependency | Declares library is needed | Always |
| **xs-app.json** | Root folder | Add destination route | Routes to destination | Deployment only |

---

## 🎯 Step-by-Step Checklist

### Step 1: Update `index.html`
- [ ] Open `webapp/index.html`
- [ ] Find `data-sap-ui-resource-roots`
- [ ] Add: `"mathbasics": "/destinations/mathbasics-library/resources/mathbasics/"`
- [ ] Save file

### Step 2: Update `manifest.json`
- [ ] Open `webapp/manifest.json`
- [ ] Find `dependencies.libs`
- [ ] Add: `"mathbasics": {}`
- [ ] Save file

### Step 3: Create/Update `xs-app.json`
- [ ] Check if `xs-app.json` exists in root folder
- [ ] If not exists: Create file with route
- [ ] If exists: Add route to routes array
- [ ] Save file

### Step 4: Use Library in Code
- [ ] Import: `"mathbasics/BasicMath"`
- [ ] Use: `BasicMath.add(10, 20)`

---

## 📝 What Each File Does

### `index.html` - Resource Root
**Purpose:** Maps library namespace to URL path
**Path:** `/destinations/mathbasics-library/resources/mathbasics/`
**Resolves to:** Destination URL + `/resources/mathbasics/`

### `manifest.json` - Dependency Declaration
**Purpose:** Tells UI5 to load the library
**Name:** Must match library namespace (`mathbasics`)

### `xs-app.json` - Destination Routing
**Purpose:** Routes destination requests to actual destination
**Only for:** Cloud Foundry deployment
**Not needed for:** Local development (if using direct URL)

---

## 🔍 Understanding the Path

```
/destinations/mathbasics-library/resources/mathbasics/
│           │                    │              │
│           │                    │              └─ Library namespace folder
│           │                    └─ UI5 resources folder
│           └─ Destination name (from BTP Cockpit)
└─ Destination prefix (handled by xs-app.json)
```

**Flow:**
1. App requests: `/destinations/mathbasics-library/resources/mathbasics/library.js`
2. `xs-app.json` routes to: Destination `mathbasics-library`
3. Destination forwards to: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/library.js`

---

## 🚀 After Making Changes

### For Local Development:
```bash
npm start
```

### For Deployment:
```bash
npm run build
cf push
```

---

## ❓ Common Questions

### Q: Why 3 files?
**A:** Each file has a specific purpose:
- `index.html` = Where to find library
- `manifest.json` = What library to load
- `xs-app.json` = How to route requests

### Q: Can I skip `xs-app.json`?
**A:** Only if you use direct URL in `index.html` (not recommended - hardcodes URL)

### Q: What if destination name is different?
**A:** Change `mathbasics-library` to your destination name in all 3 places

### Q: What if library namespace is different?
**A:** Change `mathbasics` to your library namespace in `index.html` and `manifest.json`

---

## ✅ Verification

After making changes, verify:

1. **index.html** has resource root with destination path
2. **manifest.json** has `mathbasics` in dependencies
3. **xs-app.json** has route for destination
4. **Destination** exists in BTP Cockpit with name `mathbasics-library`

**All set!** Your app can now consume the library via destination! 🎉

