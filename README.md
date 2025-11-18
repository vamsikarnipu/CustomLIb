# com.genpact - UI5 Application

UI5/Fiori application consuming the `mathbasics` library.

## Quick Start

### Local Development

```bash
npm install
npm start
```

Open `http://localhost:8080`

### Deploy to Cloud Foundry

```bash
npm run build
cf push
```

## Library Consumption

This app consumes the `mathbasics` library deployed on Cloud Foundry.

### Configuration Files

1. **`webapp/index.html`** - Resource root configured
2. **`webapp/manifest.json`** - Library dependency declared
3. **`xs-app.json`** - Destination routing (for deployment)

### Using BasicMath

```javascript
sap.ui.require(["mathbasics/BasicMath"], function(BasicMath) {
    var sum = BasicMath.add(10, 20);
    var product = BasicMath.multiply(5, 4);
});
```

## Documentation

- **`QUICK_START.md`** - Quick setup guide
- **`SETUP_GUIDE.md`** - Complete setup instructions
- **`DEPLOYMENT_REQUIREMENTS.md`** - Deployment requirements

## Project Structure

```
com.genpact/
├── webapp/              # Application source
│   ├── index.html      # Bootstrap (resource root configured)
│   ├── manifest.json   # App manifest (library dependency)
│   ├── controller/     # Controllers
│   └── view/           # Views
├── xs-app.json         # Destination routing
├── manifest.yml        # Cloud Foundry deployment
└── Staticfile          # Buildpack configuration
```
