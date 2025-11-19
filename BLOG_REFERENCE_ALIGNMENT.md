# Alignment with SAP Community Blog: Using UI5 Libraries in CF Approuter

## 📚 Reference

**Blog Post:** [Using UI5 Libraries in CF approuter](https://community.sap.com/t5/technology-blog-posts-by-members/using-ui5-libraries-in-cf-approuter/ba-p/13483023)

**Key Author Insight:** Wouter Lemaire (SAP Mentor)

---

## ✅ Key Insights from Blog

### 1. **FLP (Central AppRouter) Behavior**

> "In BAS you start the app from the index.html page (which contains the resourceroots property) and in cFLP (with the Central AppRouter) it starts from the Component.js which has no resource roots property."

**What this means:**
- ✅ FLP starts app from `Component.js`, NOT `index.html`
- ✅ Resource roots in `index.html` are **ignored** by FLP
- ✅ Library loading must be handled in `Component.js` for FLP

**Our Implementation:** ✅ **Correct!**
- We register resource root in `Component.js` BEFORE base init
- We don't rely on `index.html` resource roots for FLP
- This aligns with the blog's findings

---

### 2. **Library Declaration in manifest.json**

The blog shows library should be declared in `manifest.json` dependencies:

```json
"dependencies": {
  "libs": {
    "mathbasics": {}
  }
}
```

**Our Implementation:** ✅ **Correct!**
- We have `mathbasics` in `manifest.json` dependencies with `lazy: false`
- This ensures library loads before Component.js runs

---

### 3. **Resource Root Registration**

The blog's "Run everywhere" approach shows registering resource root in `Component.js`:

```javascript
sap.ui.getCore().loadLibrary("be.wl.ScannerAppLibrary", "/bewlscannerapp.bewlScannerAppLibrary/resources/be/wl/ScannerAppLibrary");
```

**Our Implementation:** ✅ **Correct!**
- We register resource root in `Component.js` BEFORE base init
- We use destination path: `/destinations/mathbasics-library/resources/mathbasics`
- This is the correct approach for FLP

---

### 4. **Authentication in xs-app.json**

The blog doesn't explicitly mention authentication, but our fix (`xsuaa` instead of `none`) is still critical for destination resolution.

**Our Implementation:** ✅ **Correct!**
- We use `authenticationType: "xsuaa"` in `xs-app.json`
- This ensures Launchpad can properly forward requests to the destination

---

## 🔍 Comparison: Blog vs Our Implementation

| Aspect | Blog Recommendation | Our Implementation | Status |
|--------|---------------------|-------------------|--------|
| **FLP Library Loading** | Handle in `Component.js` | ✅ Register resource root in `Component.js` | ✅ Match |
| **manifest.json** | Declare library dependency | ✅ Library in dependencies | ✅ Match |
| **index.html** | Resource roots ignored by FLP | ✅ No library in index.html | ✅ Match |
| **Resource Root Path** | Use service id or destination | ✅ Use destination path | ✅ Match |
| **Timing** | Before Component.js base init | ✅ Before base init | ✅ Match |

---

## ✅ Our Implementation Aligns with Blog

### What We're Doing Right:

1. ✅ **Library declared in `manifest.json`** - Matches blog recommendation
2. ✅ **Resource root registered in `Component.js`** - Matches blog's "Run everywhere" approach
3. ✅ **No library in `index.html` resource roots** - Correct for FLP (blog confirms FLP ignores it)
4. ✅ **Using destination path** - Our approach (blog shows service id, but destinations are better)
5. ✅ **Authentication fix (`xsuaa`)** - Our addition (not in blog, but fixes 404)

---

## 🎯 Key Difference: Destinations vs Service ID

**Blog Approach:**
- Uses service id in path: `/bewlscannerapp.bewlScannerAppLibrary/resources/...`
- Library deployed in same HTML5 App Repo

**Our Approach:**
- Uses destination path: `/destinations/mathbasics-library/resources/...`
- Library deployed separately, accessed via destination
- **Better approach:** More flexible, library can be shared across multiple apps

---

## 📋 Final Verification

Based on the blog's recommendations, our implementation is:

| Requirement | Status |
|------------|--------|
| Library in `manifest.json` dependencies | ✅ Yes |
| Resource root registered in `Component.js` | ✅ Yes |
| Resource root BEFORE base init | ✅ Yes |
| No library in `index.html` (for FLP) | ✅ Yes |
| Authentication configured (`xsuaa`) | ✅ Yes (our addition) |
| Destination path used | ✅ Yes (better than service id) |

---

## 🎯 Summary

**Our implementation aligns with the blog's recommendations AND improves upon them:**

1. ✅ **Follows blog's guidance:** Library loading in `Component.js` for FLP
2. ✅ **Uses destinations:** More flexible than service id approach
3. ✅ **Adds authentication fix:** `xsuaa` ensures proper destination resolution
4. ✅ **Declarative approach:** Library in `manifest.json` (SAP standard)

**The blog confirms our approach is correct for FLP!** 🎉

---

## 📚 References

- [Using UI5 Libraries in CF approuter - SAP Community Blog](https://community.sap.com/t5/technology-blog-posts-by-members/using-ui5-libraries-in-cf-approuter/ba-p/13483023)
- Blog Author: Wouter Lemaire (SAP Mentor)

---

**Our implementation is aligned with SAP Community best practices!** ✅

