# Files to Change - Quick Reference

## 🎯 3 Files to Change (No Hardcoded URLs!)

When consuming the `mathbasics` library, change these 3 files:

---

## 1️⃣ `webapp/index.html`

### What to Add:
```html
"mathbasics": "/destinations/mathbasics-library/resources/mathbasics/"
```

### Where:
Inside `data-sap-ui-resource-roots` object

### Why:
Tells UI5 where to find the library (via destination, not hardcoded URL)

---

## 2️⃣ `webapp/manifest.json`

### What to Add:
```json
"mathbasics": {}
```

### Where:
Inside `sap.ui5.dependencies.libs` object

### Why:
Declares library dependency so UI5 loads it

---

## 3️⃣ `xs-app.json` (root folder)

### What to Add:
```json
{
  "source": "^/destinations/mathbasics-library/(.*)$",
  "destination": "mathbasics-library",
  "target": "/$1",
  "authenticationType": "none"
}
```

### Where:
In `routes` array

### Why:
Routes destination requests to actual destination (only for deployment)

---

## 📋 Quick Copy-Paste

### File 1: `webapp/index.html`
```html
data-sap-ui-resource-roots='{
    "com.genpact": "./",
    "mathbasics": "/destinations/mathbasics-library/resources/mathbasics/"
}'
```

### File 2: `webapp/manifest.json`
```json
"dependencies": {
    "libs": {
        "sap.ui.core": {},
        "sap.m": {},
        "mathbasics": {}
    }
}
```

### File 3: `xs-app.json`
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

## ✅ That's It!

**3 files, 3 changes, no hardcoded URLs!** 🎉

See `CONSUME_LIBRARY_GUIDE.md` for detailed explanations.

