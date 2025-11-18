# Deployment Requirements - Three Mandatory Points

## ✅ Correct! These Three Are Required for Deployment

For a **deployed UI5 application** consuming a custom UI5 library via destination, you need exactly **three mandatory configurations**. Nothing else is required.

---

## 📋 The Three Mandatory Points

### 1. **index.html** - Resource Root Declaration

**File:** `webapp/index.html`

**Required Entry:**
```html
<script
    id="sap-ui-bootstrap"
    src="resources/sap-ui-core.js"
    data-sap-ui-resource-roots='{
        "com.genpact": "./",
        "mathbasics": "/destinations/mathbasics-library/resources/mathbasics/"
    }'
    ...>
</script>
```

**Key Line:**
```html
"mathbasics": "/destinations/mathbasics-library/resources/mathbasics/"
```

**Purpose:** Tells UI5 runtime where to find the library resources.

---

### 2. **xs-app.json** - Destination Routing

**File:** `xs-app.json` (root folder)

**Required Route:**
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

**Key Configuration:**
- `source`: `"^/destinations/mathbasics-library/(.*)$"`
- `destination`: `"mathbasics-library"`
- `target`: `"/$1"`

**Purpose:** Routes requests from your app to the destination configured in BTP Cockpit.

---

### 3. **manifest.json** - Library Dependency

**File:** `webapp/manifest.json`

**Required Entry:**
```json
{
  "sap.ui5": {
    "dependencies": {
      "libs": {
        "sap.ui.core": {},
        "sap.m": {},
        "mathbasics": {}
      }
    }
  }
}
```

**Key Entry:**
```json
"mathbasics": {}
```

**Purpose:** Declares that your application depends on the `mathbasics` library, so UI5 loads it at runtime.

---

## ✅ Summary

| # | File | Required Entry | Purpose |
|---|------|---------------|---------|
| 1 | `index.html` | Resource root path | Tells UI5 where library is located |
| 2 | `xs-app.json` | Destination route | Routes requests to destination |
| 3 | `manifest.json` | Library dependency | Declares library dependency |

**These three are mandatory and sufficient for deployment!**

---

## 🚀 Deployment Steps

1. ✅ Ensure all three files are configured correctly
2. ✅ Ensure destination `mathbasics-library` exists in BTP Cockpit
3. ✅ Build: `npm run build`
4. ✅ Deploy: `cf push`

**That's it!** No other configuration needed for deployment.

---

## 📝 Notes

### What's NOT Required for Deployment:

- ❌ `ui5.yaml` proxy middleware (only needed for local development)
- ❌ `manifest.yml` (optional, only if using custom Cloud Foundry config)
- ❌ Any other files

### What IS Required:

- ✅ `index.html` - Resource root
- ✅ `xs-app.json` - Destination route
- ✅ `manifest.json` - Library dependency
- ✅ Destination configured in BTP Cockpit

---

## 🎯 Verification Checklist

Before deploying, verify:

- [ ] `index.html` has resource root: `"mathbasics": "/destinations/mathbasics-library/resources/mathbasics/"`
- [ ] `xs-app.json` has route with source pattern matching `/destinations/mathbasics-library/`
- [ ] `manifest.json` has `"mathbasics": {}` in dependencies.libs
- [ ] Destination `mathbasics-library` exists in BTP Cockpit
- [ ] Destination URL points to your deployed library

---

## ✅ Conclusion

**Your understanding is 100% correct!**

These three points are:
- ✅ Mandatory
- ✅ Sufficient
- ✅ Nothing else required

Perfect summary! 🎉

