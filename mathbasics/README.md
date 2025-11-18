# mathbasics - UI5 Library

Custom SAPUI5 library providing BasicMath utility module for mathematical operations.

## Library Components

- **BasicMath.js** - Math operations module (add, subtract, multiply, divide)

## Quick Start

### Local Development

```bash
npm install
npm start
```

Opens test page at `http://localhost:8080`

### Build Library

```bash
npm run build
```

Creates `dist/resources/mathbasics/` with compiled library files.

### Deploy to Cloud Foundry

```bash
npm run build
cf push
```

**Application Name:** `mathbasics-library`

**Library URL:** `https://mathbasics-library.cfapps.us10-001.hana.ondemand.com/resources/mathbasics/`

## Using BasicMath

```javascript
sap.ui.require(["mathbasics/BasicMath"], function(BasicMath) {
    var sum = BasicMath.add(10, 20);        // Returns 30
    var product = BasicMath.multiply(5, 4); // Returns 20
    var diff = BasicMath.subtract(50, 30); // Returns 20
    var quotient = BasicMath.divide(100, 5); // Returns 20
});
```

## Available Methods

- `BasicMath.add(a, b)` - Addition
- `BasicMath.subtract(a, b)` - Subtraction
- `BasicMath.multiply(a, b)` - Multiplication
- `BasicMath.divide(a, b)` - Division (throws error if dividing by zero)

## Project Structure

```
mathbasics/
├── src/
│   └── mathbasics/
│       ├── library.js      # Library initialization
│       ├── BasicMath.js     # Math operations module
│       └── Example.js       # Sample control
├── dist/                    # Build output
├── manifest.yml            # Cloud Foundry deployment
├── Staticfile              # Buildpack configuration
└── ui5.yaml                # UI5 build configuration
```

## Deployment

1. **Build:** `npm run build`
2. **Deploy:** `cf push`
3. **Create Destination:** In BTP Cockpit, create destination `mathbasics-library` pointing to deployed URL
4. **Consume:** Use in consuming apps via destination path

## License

Apache Software License, version 2.0
