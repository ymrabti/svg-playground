/**
 * Asset paths and constants for the SVG Generator application
 */

export const ASSET_PATHS = {
    // Icons
    ICONS: {
        STAR: 'assets/icons/star.svg',
        CIRCLE: 'assets/icons/circle.svg',
        POLYGON: 'assets/icons/polygon.svg',
        SPIRAL: 'assets/icons/spiral.svg',
        CURVED_STAR: 'assets/icons/curved-star.svg',
        COPY: 'assets/icons/copy.svg',
        DOWNLOAD: 'assets/icons/download.svg',
        REFRESH: 'assets/icons/refresh.svg',
        PALETTE: 'assets/icons/palette.svg',
        FAVICON: 'assets/icons/favicon.svg',
    },

    // Data files
    DATA: {
        SVG_PRESETS: 'assets/data/svg-presets.json',
        COLOR_PALETTE: 'assets/data/color-palette.json',
    },

    // Template directories
    TEMPLATES: 'assets/templates',
    IMAGES: 'assets/images',
    FONTS: 'assets/fonts',
} as const;

/**
 * Shape type to icon mapping
 */
export const SHAPE_ICONS = {
    polygon: ASSET_PATHS.ICONS.POLYGON,
    star: ASSET_PATHS.ICONS.STAR,
    circle: ASSET_PATHS.ICONS.CIRCLE,
    spiral: ASSET_PATHS.ICONS.SPIRAL,
    'curved-star': ASSET_PATHS.ICONS.CURVED_STAR,
} as const;

/**
 * Default asset configuration
 */
export const ASSET_CONFIG = {
    // Maximum file size for uploads (in bytes)
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB

    // Supported image formats
    SUPPORTED_IMAGE_FORMATS: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'],

    // Asset loading timeout (ms)
    LOAD_TIMEOUT: 5000,

    // Cache duration for assets (ms)
    CACHE_DURATION: 60 * 60 * 1000, // 1 hour
} as const;

/**
 * Helper function to get asset URL
 */
export function getAssetUrl(relativePath: string): string {
    return relativePath.startsWith('assets/') ? relativePath : `assets/${relativePath}`;
}

/**
 * Helper function to validate asset path
 */
export function isValidAssetPath(path: string): boolean {
    return path.startsWith('assets/') && path.length > 'assets/'.length;
}

/**
 * Helper function to get file extension from path
 */
export function getFileExtension(path: string): string {
    return path.split('.').pop()?.toLowerCase() || '';
}

/**
 * Helper function to check if file is an image
 */
export function isImageFile(path: string): boolean {
    const extension = getFileExtension(path);
    return ASSET_CONFIG.SUPPORTED_IMAGE_FORMATS.includes(extension as any);
}
