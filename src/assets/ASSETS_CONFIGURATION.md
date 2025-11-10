# Assets Configuration for SVG Generator

## Overview
This document describes the assets configuration for the Angular SVG Generator application.

## Directory Structure

```
src/assets/
├── README.md                 # This documentation
├── icons/                    # SVG icons for UI elements
│   ├── star.svg             # Star shape icon
│   ├── circle.svg           # Circle shape icon
│   ├── polygon.svg          # Polygon shape icon
│   ├── spiral.svg           # Spiral shape icon
│   ├── curved-star.svg      # Curved star icon
│   ├── copy.svg             # Copy action icon
│   ├── download.svg         # Download action icon
│   ├── refresh.svg          # Refresh/reset icon
│   ├── palette.svg          # Color palette icon
│   └── favicon.svg          # Application favicon
├── data/                    # JSON configuration files
│   ├── svg-presets.json     # Predefined SVG templates
│   └── color-palette.json   # Color palette definitions
├── images/                  # Application images
├── fonts/                   # Custom fonts (if needed)
└── templates/               # SVG template files
```

## Angular Configuration

The assets are configured in `angular.json`:

```json
"assets": [
  {
    "glob": "**/*",
    "input": "public"
  },
  {
    "glob": "**/*",
    "input": "src/assets",
    "output": "/assets/"
  }
]
```

## Asset Service

The `AssetService` provides methods to:
- Load SVG presets from JSON
- Load color palettes
- Get icon paths
- Validate asset existence
- Manage custom presets

### Usage Examples

```typescript
// Inject the service
constructor(private assetService: AssetService) {}

// Load presets
this.assetService.loadSvgPresets().subscribe(presets => {
  console.log('Loaded presets:', presets);
});

// Get icon path
const iconPath = this.assetService.getIconPath('star');

// Load color palette
this.assetService.loadColorPalette().subscribe(colors => {
  this.availableColors = colors;
});
```

## Asset Constants

Use the constants from `assets.constants.ts`:

```typescript
import { ASSET_PATHS, SHAPE_ICONS } from './constants/assets.constants';

// Get icon for shape type
const shapeIcon = SHAPE_ICONS['polygon'];

// Get data file path
const presetsPath = ASSET_PATHS.DATA.SVG_PRESETS;
```

## Predefined Presets

The following presets are available in `svg-presets.json`:

1. **Simple Polygon** - Basic hexagon
2. **Golden Star** - Classic 5-pointed star
3. **Flower Spiral** - Decorative spiral pattern
4. **Curved Sunburst** - Multi-pointed curved star
5. **Geometric Circle** - Perfect circle with gradient
6. **Complex Star** - 8-pointed detailed star

## Color Palette

40 carefully selected colors are available in `color-palette.json`, including:
- Material Design colors
- Gradient-friendly combinations
- High contrast options
- Accessibility-compliant choices

## Icon Guidelines

All icons follow these standards:
- 24x24px viewBox
- 2px stroke-width
- Consistent line caps and joins
- Scalable SVG format
- Monochrome design (uses currentColor)

## Adding New Assets

### Adding Icons
1. Place SVG file in `/src/assets/icons/`
2. Update `ASSET_PATHS.ICONS` in constants
3. Add to `AssetPaths['icons']` interface
4. Update `AssetService.getIconPath()` method

### Adding Presets
1. Add new preset object to `svg-presets.json`
2. Follow the existing structure:
   ```json
   {
     "name": "Preset Name",
     "description": "Description",
     "shape": "polygon|star|circle|spiral|curved-star",
     "parameters": { ... }
   }
   ```

### Adding Colors
1. Add hex color values to `color-palette.json`
2. Ensure colors are accessibility compliant
3. Test with different shape types

## Performance Considerations

- Icons are loaded on-demand
- JSON data is cached after first load
- Asset validation uses HEAD requests
- Custom presets stored in localStorage
- File size limit: 5MB per asset

## Browser Support

- Modern browsers with SVG support
- IE11+ for JSON loading
- ES6+ for asset constants
- HTTP client for dynamic loading

## Troubleshooting

### Assets Not Loading
1. Check `angular.json` configuration
2. Verify file paths are correct
3. Ensure assets are in correct directories
4. Check network requests in browser dev tools

### Icon Display Issues
1. Verify SVG syntax is valid
2. Check viewBox dimensions
3. Ensure `currentColor` is used for fills/strokes
4. Validate CSS applied to icon container

### Preset Loading Failures
1. Validate JSON syntax
2. Check HTTP client is imported
3. Verify asset service is properly injected
4. Check for CORS issues in development

## Development Commands

```bash
# Build with assets
ng build

# Serve with asset watching
ng serve

# Validate asset structure
npm run lint

# Test asset loading
ng test
```

## Production Deployment

- Assets are automatically copied to `/dist/assets/`
- Ensure CDN/server serves assets with correct MIME types
- Consider asset versioning for cache busting
- Compress SVG files for optimal performance