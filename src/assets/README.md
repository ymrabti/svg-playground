# SVG Generator Assets

This directory contains static assets for the SVG Generator application.

## Structure

- `/images/` - Application images and graphics
- `/icons/` - SVG icons and UI elements  
- `/fonts/` - Custom fonts (if any)
- `/templates/` - Predefined SVG templates and presets
- `/data/` - JSON configuration files and data

## Usage

Assets can be referenced using the `/assets/` path prefix in templates:

```html
<img src="assets/images/logo.png" alt="Logo">
<link rel="icon" href="assets/icons/favicon.ico">
```

In TypeScript/JavaScript:
```typescript
const iconPath = 'assets/icons/star.svg';
```