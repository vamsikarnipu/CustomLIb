# Fix: 404 Error for mathbasics-library Destination

## 🔴 Problem

Your deployed Fiori app is getting **404 errors** when trying to access the `mathbasics-library`:

```
https://602b9a51trial.launchpad.cfapps.us10.hana.ondemand.com/destinations/mathbasics-library/resources/mathbasics/library.js
Status: 404 Not Found
```

## ✅ Root Cause

The **`mathbasics-library` destination was NOT configured** in your `mta.yaml` file!

Your `xs-app.json` has the route configured correctly:
```json
{
  "source": "^/destinations/mathbasics-library/(.*)$",
  "destination": "mathbasics-library",
  "target": "/$1",
  "authenticationType": "none"
}
```

But the destination itself doesn't exist because it wasn't defined in `mta.yaml`.

---

## ✅ Solution

### Fixed: Added Destination to `mta.yaml`

Added the `mathbasics-library` destination to the `customlib-destination-service` resource:

```yaml
resources:
- name: customlib-destination-service
  type: org.cloudfoundry.managed-service
  parameters:
    config:
      HTML5Runtime_enabled: true
      init_data:
        instance:
          destinations:
          - Authentication: NoAuthentication
            Name: ui5
            ProxyType: Internet
            Type: HTTP
            URL: https://ui5.sap.com
          - Authentication: NoAuthentication          # ← ADDED THIS
            Name: mathbasics-library                  # ← ADDED THIS
            ProxyType: Internet                       # ← ADDED THIS
            Type: HTTP                                # ← ADDED THIS
            URL: https://mathbasics-library.cfapps.us10-001.hana.ondemand.com  # ← ADDED THIS
          existing_destinations_policy: update
```

---

## 📋 Next Steps: Redeploy

### 1. Build and Deploy

```bash
cd CustomLIb
npm install
npm run build:cf
cf deploy mta_archives/customlib_0.0.1.mtar
```

Or if using MTA CLI:
```bash
mbt build
cf deploy mta_archives/customlib_0.0.1.mtar
```

### 2. Verify Destination Created

After deployment, check in **BTP Cockpit**:
1. Go to **Cloud Foundry** → **Destinations**
2. Find **`mathbasics-library`** destination
3. Verify URL: `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com`
4. Verify Authentication: **NoAuthentication**

---

## ✅ What This Fixes

After redeployment, these URLs will work:

✅ `https://602b9a51trial.launchpad.cfapps.us10.hana.ondemand.com/destinations/mathbasics-library/resources/mathbasics/library.js`

✅ `https://602b9a51trial.launchpad.cfapps.us10.hana.ondemand.com/destinations/mathbasics-library/resources/mathbasics/library-preload.js`

✅ `https://602b9a51trial.launchpad.cfapps.us10.hana.ondemand.com/destinations/mathbasics-library/resources/mathbasics/BasicMath.js`

---

## 📝 Summary

| File | Status | Action |
|------|--------|--------|
| `xs-app.json` | ✅ Correct | Route configured |
| `index.html` | ✅ Correct | Resource root configured |
| `manifest.json` | ✅ Correct | Library dependency added |
| `mta.yaml` | ✅ **FIXED** | **Added destination** |

**The destination is now configured. Redeploy to apply the fix!** 🚀


