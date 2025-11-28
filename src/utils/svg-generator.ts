/**
 * SVG Generator Utility
 * Generates SVG preview images from LED display wall calculation results
 * Requirements: 7.1, 7.2, 7.3
 * 
 * Extracted and adapted from src/products/led/DisplayWallPreview.tsx
 */

import * as fs from 'fs';
import * as path from 'path';
import { CalculationResult, RoomConfig } from '../types';
import { formatNumber } from './configurator-calculator';

/**
 * Cabinet color palette for multi-cabinet mode
 */
const CABINET_COLORS = [
  "#3B82F6",  // Blue
  "#10B981",  // Green
  "#F59E0B",  // Yellow
  "#EF4444",  // Red
  "#8B5CF6",  // Purple
  "#06B6D4"   // Cyan
];

/**
 * SVG generation options
 */
export interface SVGGeneratorOptions {
  showDimensions?: boolean;      // Show dimension annotations, default true
  showPerson?: boolean;          // Show person reference, default true
  canvasWidth?: number;          // Canvas width, default 800
  canvasHeight?: number;         // Canvas height, default 500
  language?: 'en' | 'zh';        // Language for labels, default 'en'
  personImageUrl?: string;       // Custom person image URL (optional)
  embedPersonImage?: boolean;    // Embed person image as base64, default true
}

/**
 * Display properties calculated for SVG rendering
 */
interface DisplayProps {
  canvasWidth: number;
  canvasHeight: number;
  wallWidth: number;
  wallHeight: number;
  wallOffsetX: number;
  wallOffsetY: number;
  wallScale: number;
  screenWidth: number;
  screenHeight: number;
  screenOffsetX: number;
  screenOffsetY: number;
  cabinetDisplayWidth: number;
  cabinetDisplayHeight: number;
  person: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  dynamicOffsets: {
    wallWidthLineOffset: number;
    wallWidthTextOffset: number;
    screenWidthLineOffset: number;
    screenWidthTextOffset: number;
    wallHeightLineOffset: number;
    wallHeightTextOffset: number;
    screenHeightLineOffset: number;
    screenHeightTextOffset: number;
  };
}

// Default online person image URL
const DEFAULT_PERSON_IMAGE_URL = 'https://file.unilumin-gtm.com/719dd328-3fee-4364-80a7-fb7a2a4e2881/1764300939867-women.png';

// Cache for base64 encoded person image
let cachedPersonImageBase64: string | null = null;

/**
 * Load and cache the person image as base64 from local file
 */
function getPersonImageBase64(): string {
  if (cachedPersonImageBase64) {
    return cachedPersonImageBase64;
  }
  
  try {
    const imagePath = path.join(__dirname, '..', '..', 'public', 'women.png');
    const imageBuffer = fs.readFileSync(imagePath);
    cachedPersonImageBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    return cachedPersonImageBase64;
  } catch (error) {
    console.warn('Could not load local person image, using online URL');
    return DEFAULT_PERSON_IMAGE_URL;
  }
}

/**
 * Calculate display properties for SVG rendering
 */
function calculateDisplayProps(
  calculationResult: CalculationResult,
  roomConfig: RoomConfig,
  options: SVGGeneratorOptions
): DisplayProps {
  const canvasWidth = options.canvasWidth || 800;
  const canvasHeight = options.canvasHeight || 500;
  
  const { wallDimensions } = calculationResult;
  const layout = calculationResult.cabinetCount;
  
  // Room wall dimensions (always stored in meters)
  const wallWidth = roomConfig.dimensions.width;
  const wallHeight = roomConfig.dimensions.height;
  
  // Reserve space for person and annotations
  const personSpaceWidth = 150;
  const availableWidth = canvasWidth - personSpaceWidth - 60;
  const availableHeight = canvasHeight - 140;
  
  // Person reference height (1.6m)
  const personRealHeight = 1.6;
  
  // Calculate scale to fit both wall and person
  const wallScaleX = availableWidth * 0.8 / wallWidth;
  const wallScaleY_wall = availableHeight * 0.8 / wallHeight;
  const wallScaleY_person = availableHeight * 0.8 / Math.max(wallHeight, personRealHeight);
  const wallScaleY = Math.min(wallScaleY_wall, wallScaleY_person);
  const wallScale = Math.min(wallScaleX, wallScaleY);
  
  // Calculate wall display dimensions
  const wallDisplayWidth = wallWidth * wallScale;
  const wallDisplayHeight = wallHeight * wallScale;
  
  // Calculate baseline for bottom alignment
  const maxDisplayHeight = Math.max(wallDisplayHeight, personRealHeight * wallScale);
  
  // Wall position
  const wallOffsetX = personSpaceWidth + (availableWidth - wallDisplayWidth) / 2;
  const baselineY = (canvasHeight - maxDisplayHeight) / 2 + maxDisplayHeight;
  const wallOffsetY = baselineY - wallDisplayHeight;
  
  // Screen dimensions and position
  const screenScale = wallScale;
  const screenDisplayWidth = wallDimensions.width * screenScale;
  const screenDisplayHeight = wallDimensions.height * screenScale;
  
  // Center screen within wall
  const screenOffsetX = wallOffsetX + (wallDisplayWidth - screenDisplayWidth) / 2;
  const screenOffsetY = wallOffsetY + (wallDisplayHeight - screenDisplayHeight) / 2;
  
  // Cabinet display dimensions
  const cabinetDisplayWidth = screenDisplayWidth / layout.horizontal;
  const cabinetDisplayHeight = screenDisplayHeight / layout.vertical;
  
  // Person dimensions - maintain real proportions
  const personHeight = personRealHeight * wallScale;
  const personWidth = personHeight * 0.3;
  const personX = wallOffsetX - personWidth - 85;
  const personY = baselineY - personHeight;
  
  // Calculate dynamic annotation offsets
  const widthRatio = wallDimensions.width / wallWidth;
  const heightRatio = wallDimensions.height / wallHeight;
  
  const baseLineSpacing = 15;
  const baseTextOffset = 5;
  
  const widthSpacingMultiplier = widthRatio > 0.9 ? 1 / (1.2 - widthRatio) : 1;
  const heightSpacingMultiplier = heightRatio > 0.9 ? 1 / (1.2 - heightRatio) : 1;
  
  const maxSpacingMultiplier = 2;
  const clampedWidthSpacing = Math.min(widthSpacingMultiplier, maxSpacingMultiplier);
  const clampedHeightSpacing = Math.min(heightSpacingMultiplier, maxSpacingMultiplier);
  
  const dynamicWidthSpacing = baseLineSpacing * clampedWidthSpacing;
  const dynamicHeightSpacing = baseLineSpacing * clampedHeightSpacing;
  
  return {
    canvasWidth,
    canvasHeight,
    wallWidth: wallDisplayWidth,
    wallHeight: wallDisplayHeight,
    wallOffsetX,
    wallOffsetY,
    wallScale,
    screenWidth: screenDisplayWidth,
    screenHeight: screenDisplayHeight,
    screenOffsetX,
    screenOffsetY,
    cabinetDisplayWidth,
    cabinetDisplayHeight,
    person: {
      x: personX,
      y: personY,
      width: personWidth,
      height: personHeight,
    },
    dynamicOffsets: {
      wallWidthLineOffset: dynamicWidthSpacing + 15,
      wallWidthTextOffset: dynamicWidthSpacing + 15 + baseTextOffset,
      screenWidthLineOffset: 10,
      screenWidthTextOffset: 10 + baseTextOffset,
      wallHeightLineOffset: dynamicHeightSpacing + 15,
      wallHeightTextOffset: dynamicHeightSpacing + 15 + baseTextOffset,
      screenHeightLineOffset: 10,
      screenHeightTextOffset: 10 + baseTextOffset,
    },
  };
}

/**
 * Get display dimension with unit conversion
 */
function getDisplayDimension(metersValue: number, unit: 'meters' | 'feet'): number {
  if (unit === 'feet') {
    return metersValue * 3.28084;
  }
  return metersValue;
}

/**
 * Generate SVG gradient definition
 */
function generateGradientDef(gradientId: string): string {
  return `
    <defs>
      <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3B82F6" />
        <stop offset="50%" stop-color="#8B5CF6" />
        <stop offset="100%" stop-color="#EC4899" />
      </linearGradient>
    </defs>`;
}

/**
 * Generate wall background SVG element
 */
function generateWallBackground(props: DisplayProps): string {
  return `
    <rect
      x="${props.wallOffsetX}"
      y="${props.wallOffsetY}"
      width="${props.wallWidth}"
      height="${props.wallHeight}"
      fill="#E5E7EB"
      stroke="none"
    />`;
}

/**
 * Generate screen background SVG element
 */
function generateScreenBackground(props: DisplayProps): string {
  return `
    <rect
      x="${props.screenOffsetX}"
      y="${props.screenOffsetY}"
      width="${props.screenWidth}"
      height="${props.screenHeight}"
      fill="white"
      stroke="#D1D5DB"
      stroke-width="1"
    />`;
}


/**
 * Generate person reference SVG element with real image
 */
function generatePersonReference(
  props: DisplayProps, 
  roomConfig: RoomConfig, 
  language: string,
  options: SVGGeneratorOptions
): string {
  const label = roomConfig.unit === 'meters'
    ? (language === 'zh' ? '女性: 1.60 m' : 'Woman: 1.60 m')
    : (language === 'zh' ? '女性: 5.25 ft' : 'Woman: 5.25 ft');
  
  const embedImage = options.embedPersonImage !== false;
  let imageSource = options.personImageUrl || '';
  
  // Determine image source
  if (!imageSource) {
    if (embedImage) {
      // Try to load local image as base64
      imageSource = getPersonImageBase64();
    } else {
      // Use online URL when not embedding
      imageSource = DEFAULT_PERSON_IMAGE_URL;
    }
  }
  
  // If we have an image source, use the real image
  if (imageSource) {
    return `
    <g opacity="0.8">
      <!-- Person Image -->
      <image
        x="${props.person.x}"
        y="${props.person.y}"
        width="${props.person.width}"
        height="${props.person.height}"
        href="${imageSource}"
        preserveAspectRatio="xMidYMax meet"
      />
      <!-- Label -->
      <text
        x="${props.person.x + props.person.width / 2}"
        y="${props.person.y + props.person.height + 15}"
        text-anchor="middle"
        font-size="11"
        fill="#6B7280"
        font-family="Arial, sans-serif"
        font-weight="500"
      >${label}</text>
    </g>`;
  }
  
  // Fallback: Simple person silhouette using basic shapes
  const personCenterX = props.person.x + props.person.width / 2;
  const headRadius = props.person.width * 0.35;
  const bodyTop = props.person.y + headRadius * 2.5;
  const bodyHeight = props.person.height * 0.4;
  const legHeight = props.person.height * 0.45;
  
  return `
    <g opacity="0.7">
      <!-- Head -->
      <circle
        cx="${personCenterX}"
        cy="${props.person.y + headRadius + 5}"
        r="${headRadius}"
        fill="#9CA3AF"
      />
      <!-- Body -->
      <rect
        x="${personCenterX - props.person.width * 0.25}"
        y="${bodyTop}"
        width="${props.person.width * 0.5}"
        height="${bodyHeight}"
        rx="5"
        fill="#9CA3AF"
      />
      <!-- Left leg -->
      <rect
        x="${personCenterX - props.person.width * 0.2}"
        y="${bodyTop + bodyHeight - 5}"
        width="${props.person.width * 0.15}"
        height="${legHeight}"
        rx="3"
        fill="#9CA3AF"
      />
      <!-- Right leg -->
      <rect
        x="${personCenterX + props.person.width * 0.05}"
        y="${bodyTop + bodyHeight - 5}"
        width="${props.person.width * 0.15}"
        height="${legHeight}"
        rx="3"
        fill="#9CA3AF"
      />
      <!-- Label -->
      <text
        x="${personCenterX}"
        y="${props.person.y + props.person.height + 15}"
        text-anchor="middle"
        font-size="11"
        fill="#6B7280"
        font-family="Arial, sans-serif"
      >${label}</text>
    </g>`;
}

/**
 * Generate cabinet grid for single cabinet mode
 */
function generateSingleCabinetGrid(
  props: DisplayProps,
  calculationResult: CalculationResult,
  gradientId: string
): string {
  const layout = calculationResult.cabinetCount;
  let cabinets = '';
  
  for (let row = 0; row < layout.vertical; row++) {
    for (let col = 0; col < layout.horizontal; col++) {
      const x = props.screenOffsetX + col * props.cabinetDisplayWidth;
      const y = props.screenOffsetY + row * props.cabinetDisplayHeight;
      
      // Calculate font size based on cabinet dimensions
      const fontSize = Math.min(props.cabinetDisplayWidth / 12, props.cabinetDisplayHeight / 12, 8);
      const showLabels = props.cabinetDisplayWidth > 30 && props.cabinetDisplayHeight > 20;
      
      cabinets += `
        <g>
          <rect
            x="${x}"
            y="${y}"
            width="${props.cabinetDisplayWidth}"
            height="${props.cabinetDisplayHeight}"
            fill="url(#${gradientId})"
            stroke="#1F2937"
            stroke-width="1"
          />`;
      
      // Add cabinet dimension labels if space allows
      if (showLabels && calculationResult.physical) {
        // Get cabinet dimensions from calculation result
        const cabinetWidthMm = Math.round((calculationResult.wallDimensions.width * 1000) / layout.horizontal);
        const cabinetHeightMm = Math.round((calculationResult.wallDimensions.height * 1000) / layout.vertical);
        
        cabinets += `
          <text
            x="${x + props.cabinetDisplayWidth / 2}"
            y="${y + props.cabinetDisplayHeight / 2 - 3}"
            text-anchor="middle"
            dominant-baseline="middle"
            font-size="${fontSize}"
            fill="white"
            font-family="Arial, sans-serif"
            font-weight="bold"
            opacity="0.9"
          >${cabinetWidthMm}</text>
          <text
            x="${x + props.cabinetDisplayWidth / 2}"
            y="${y + props.cabinetDisplayHeight / 2 + 6}"
            text-anchor="middle"
            dominant-baseline="middle"
            font-size="${fontSize}"
            fill="white"
            font-family="Arial, sans-serif"
            font-weight="bold"
            opacity="0.9"
          >${cabinetHeightMm}</text>`;
      }
      
      cabinets += `</g>`;
    }
  }
  
  return `<g>${cabinets}</g>`;
}

/**
 * Generate cabinet grid for multi-cabinet mode
 */
function generateMultiCabinetGrid(
  props: DisplayProps,
  calculationResult: CalculationResult
): string {
  if (!calculationResult.arrangement) {
    return '';
  }
  
  const cabinets = calculationResult.arrangement.cabinets;
  const { wallDimensions } = calculationResult;
  
  // Get unique cabinet IDs for color mapping
  const uniqueCabinetIds = [...new Set(cabinets.map(c => c.cabinetId))];
  
  let cabinetElements = '';
  
  for (let index = 0; index < cabinets.length; index++) {
    const cabinet = cabinets[index];
    const cabinetX = props.screenOffsetX + (cabinet.position.x / 1000) * props.wallScale;
    
    // Coordinate transformation: from top-left to bottom-left origin
    const screenHeightMm = wallDimensions.height * 1000;
    const flippedY = screenHeightMm - cabinet.position.y - cabinet.size.height;
    const cabinetY = props.screenOffsetY + (flippedY / 1000) * props.wallScale;
    
    const cabinetWidth = (cabinet.size.width / 1000) * props.wallScale;
    const cabinetHeight = (cabinet.size.height / 1000) * props.wallScale;
    
    // Get color based on cabinet type
    const colorIndex = uniqueCabinetIds.indexOf(cabinet.cabinetId) % CABINET_COLORS.length;
    const color = CABINET_COLORS[colorIndex];
    
    // Calculate font size based on cabinet dimensions
    const fontSize = Math.min(cabinetWidth / 12, cabinetHeight / 12, 8);
    
    cabinetElements += `
      <g>
        <rect
          x="${cabinetX}"
          y="${cabinetY}"
          width="${cabinetWidth}"
          height="${cabinetHeight}"
          fill="${color}"
          stroke="#1F2937"
          stroke-width="1"
        />
        <text
          x="${cabinetX + cabinetWidth / 2}"
          y="${cabinetY + cabinetHeight / 2 - 3}"
          text-anchor="middle"
          dominant-baseline="middle"
          font-size="${fontSize}"
          fill="white"
          font-family="Arial, sans-serif"
          font-weight="bold"
          opacity="0.9"
        >${cabinet.specs.dimensions.width}</text>
        <text
          x="${cabinetX + cabinetWidth / 2}"
          y="${cabinetY + cabinetHeight / 2 + 6}"
          text-anchor="middle"
          dominant-baseline="middle"
          font-size="${fontSize}"
          fill="white"
          font-family="Arial, sans-serif"
          font-weight="bold"
          opacity="0.9"
        >${cabinet.specs.dimensions.height}</text>
      </g>`;
  }
  
  return `<g>${cabinetElements}</g>`;
}


/**
 * Generate dimension annotations
 */
function generateDimensionAnnotations(
  props: DisplayProps,
  calculationResult: CalculationResult,
  roomConfig: RoomConfig,
  _language: string
): string {
  const { wallDimensions } = calculationResult;
  const offsets = props.dynamicOffsets;
  
  const unitLabel = roomConfig.unit === 'meters' ? 'm' : 'ft';
  
  // Wall width annotation (top, gray)
  const wallWidthAnnotation = `
    <g>
      <line
        x1="${props.wallOffsetX}"
        y1="${props.wallOffsetY - offsets.wallWidthLineOffset}"
        x2="${props.wallOffsetX + props.wallWidth}"
        y2="${props.wallOffsetY - offsets.wallWidthLineOffset}"
        stroke="#9CA3AF"
        stroke-width="1"
      />
      <line
        x1="${props.wallOffsetX}"
        y1="${props.wallOffsetY - offsets.wallWidthLineOffset + 5}"
        x2="${props.wallOffsetX}"
        y2="${props.wallOffsetY - offsets.wallWidthLineOffset - 5}"
        stroke="#9CA3AF"
        stroke-width="1"
      />
      <line
        x1="${props.wallOffsetX + props.wallWidth}"
        y1="${props.wallOffsetY - offsets.wallWidthLineOffset + 5}"
        x2="${props.wallOffsetX + props.wallWidth}"
        y2="${props.wallOffsetY - offsets.wallWidthLineOffset - 5}"
        stroke="#9CA3AF"
        stroke-width="1"
      />
      <text
        x="${props.wallOffsetX + props.wallWidth / 2}"
        y="${props.wallOffsetY - offsets.wallWidthTextOffset}"
        text-anchor="middle"
        font-size="12"
        fill="#9CA3AF"
        font-family="Arial, sans-serif"
        font-weight="600"
      >${formatNumber(getDisplayDimension(roomConfig.dimensions.width, roomConfig.unit), 3)} ${unitLabel}</text>
    </g>`;
  
  // Screen width annotation (top, black)
  const screenWidthAnnotation = `
    <g>
      <line
        x1="${props.screenOffsetX}"
        y1="${props.screenOffsetY - offsets.screenWidthLineOffset}"
        x2="${props.screenOffsetX + props.screenWidth}"
        y2="${props.screenOffsetY - offsets.screenWidthLineOffset}"
        stroke="#000000"
        stroke-width="2"
      />
      <line
        x1="${props.screenOffsetX}"
        y1="${props.screenOffsetY - offsets.screenWidthLineOffset + 5}"
        x2="${props.screenOffsetX}"
        y2="${props.screenOffsetY - offsets.screenWidthLineOffset - 5}"
        stroke="#000000"
        stroke-width="2"
      />
      <line
        x1="${props.screenOffsetX + props.screenWidth}"
        y1="${props.screenOffsetY - offsets.screenWidthLineOffset + 5}"
        x2="${props.screenOffsetX + props.screenWidth}"
        y2="${props.screenOffsetY - offsets.screenWidthLineOffset - 5}"
        stroke="#000000"
        stroke-width="2"
      />
      <text
        x="${props.screenOffsetX + props.screenWidth / 2}"
        y="${props.screenOffsetY - offsets.screenWidthTextOffset}"
        text-anchor="middle"
        font-size="11"
        fill="#000000"
        font-family="Arial, sans-serif"
        font-weight="bold"
      >${roomConfig.unit === 'meters' 
        ? `${formatNumber(wallDimensions.width, 4)} m`
        : `${formatNumber(wallDimensions.width * 3.28084, 4)} ft`
      }</text>
    </g>`;
  
  // Wall height annotation (left, gray)
  const wallHeightAnnotation = `
    <g>
      <line
        x1="${props.wallOffsetX - offsets.wallHeightLineOffset}"
        y1="${props.wallOffsetY}"
        x2="${props.wallOffsetX - offsets.wallHeightLineOffset}"
        y2="${props.wallOffsetY + props.wallHeight}"
        stroke="#9CA3AF"
        stroke-width="1"
      />
      <line
        x1="${props.wallOffsetX - offsets.wallHeightLineOffset + 5}"
        y1="${props.wallOffsetY}"
        x2="${props.wallOffsetX - offsets.wallHeightLineOffset - 5}"
        y2="${props.wallOffsetY}"
        stroke="#9CA3AF"
        stroke-width="1"
      />
      <line
        x1="${props.wallOffsetX - offsets.wallHeightLineOffset + 5}"
        y1="${props.wallOffsetY + props.wallHeight}"
        x2="${props.wallOffsetX - offsets.wallHeightLineOffset - 5}"
        y2="${props.wallOffsetY + props.wallHeight}"
        stroke="#9CA3AF"
        stroke-width="1"
      />
      <text
        x="${props.wallOffsetX - offsets.wallHeightTextOffset}"
        y="${props.wallOffsetY + props.wallHeight / 2}"
        text-anchor="middle"
        font-size="12"
        fill="#9CA3AF"
        font-family="Arial, sans-serif"
        font-weight="600"
        transform="rotate(-90 ${props.wallOffsetX - offsets.wallHeightTextOffset} ${props.wallOffsetY + props.wallHeight / 2})"
      >${formatNumber(getDisplayDimension(roomConfig.dimensions.height, roomConfig.unit), 3)} ${unitLabel}</text>
    </g>`;
  
  // Screen height annotation (left, black)
  const screenHeightAnnotation = `
    <g>
      <line
        x1="${props.screenOffsetX - offsets.screenHeightLineOffset}"
        y1="${props.screenOffsetY}"
        x2="${props.screenOffsetX - offsets.screenHeightLineOffset}"
        y2="${props.screenOffsetY + props.screenHeight}"
        stroke="#000000"
        stroke-width="2"
      />
      <line
        x1="${props.screenOffsetX - offsets.screenHeightLineOffset + 5}"
        y1="${props.screenOffsetY}"
        x2="${props.screenOffsetX - offsets.screenHeightLineOffset - 5}"
        y2="${props.screenOffsetY}"
        stroke="#000000"
        stroke-width="2"
      />
      <line
        x1="${props.screenOffsetX - offsets.screenHeightLineOffset + 5}"
        y1="${props.screenOffsetY + props.screenHeight}"
        x2="${props.screenOffsetX - offsets.screenHeightLineOffset - 5}"
        y2="${props.screenOffsetY + props.screenHeight}"
        stroke="#000000"
        stroke-width="2"
      />
      <text
        x="${props.screenOffsetX - offsets.screenHeightTextOffset}"
        y="${props.screenOffsetY + props.screenHeight / 2}"
        text-anchor="middle"
        font-size="11"
        fill="#000000"
        font-family="Arial, sans-serif"
        font-weight="bold"
        transform="rotate(-90 ${props.screenOffsetX - offsets.screenHeightTextOffset} ${props.screenOffsetY + props.screenHeight / 2})"
      >${roomConfig.unit === 'meters' 
        ? `${formatNumber(wallDimensions.height, 4)} m`
        : `${formatNumber(wallDimensions.height * 3.28084, 4)} ft`
      }</text>
    </g>`;
  
  return wallWidthAnnotation + screenWidthAnnotation + wallHeightAnnotation + screenHeightAnnotation;
}

/**
 * Generate complete SVG string from calculation result
 * @param calculationResult Calculation result from LED calculator
 * @param roomConfig Room configuration
 * @param options SVG generation options
 * @returns Complete SVG string
 */
export function generateSVGPreview(
  calculationResult: CalculationResult,
  roomConfig: RoomConfig,
  options: SVGGeneratorOptions = {}
): string {
  const {
    showDimensions = true,
    showPerson = true,
    canvasWidth = 800,
    canvasHeight = 500,
    language = 'en',
  } = options;
  
  // Calculate display properties
  const displayProps = calculateDisplayProps(calculationResult, roomConfig, {
    ...options,
    canvasWidth,
    canvasHeight,
  });
  
  // Generate unique gradient ID
  const gradientId = `ledGradient-${Date.now()}`;
  
  // Determine if multi-cabinet mode
  const isMultiCabinetMode = !!calculationResult.arrangement;
  
  // Build SVG content
  let svgContent = '';
  
  // Add gradient definition
  svgContent += generateGradientDef(gradientId);
  
  // Add wall background
  svgContent += generateWallBackground(displayProps);
  
  // Add screen background
  svgContent += generateScreenBackground(displayProps);
  
  // Add person reference
  if (showPerson) {
    svgContent += generatePersonReference(displayProps, roomConfig, language, options);
  }
  
  // Add cabinet grid
  if (isMultiCabinetMode) {
    svgContent += generateMultiCabinetGrid(displayProps, calculationResult);
  } else {
    svgContent += generateSingleCabinetGrid(displayProps, calculationResult, gradientId);
  }
  
  // Add dimension annotations
  if (showDimensions) {
    svgContent += generateDimensionAnnotations(displayProps, calculationResult, roomConfig, language);
  }
  
  // Wrap in SVG element
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${canvasWidth}"
  height="${canvasHeight}"
  viewBox="0 0 ${canvasWidth} ${canvasHeight}"
  style="background: #F3F4F6;"
>
${svgContent}
</svg>`;
  
  return svg;
}

/**
 * Count the number of cabinet rectangles in the SVG
 * Useful for testing
 */
export function countCabinetsInSVG(svgString: string): number {
  // Count rect elements that are cabinet rectangles (not wall/screen backgrounds)
  // Cabinet rects have fill that's either a gradient URL or a color from CABINET_COLORS
  const cabinetRectPattern = /<rect[^>]*fill="(url\(#ledGradient|#3B82F6|#10B981|#F59E0B|#EF4444|#8B5CF6|#06B6D4)[^"]*"[^>]*>/g;
  const matches = svgString.match(cabinetRectPattern);
  return matches ? matches.length : 0;
}

/**
 * Check if SVG contains dimension annotations
 */
export function hasDimensionAnnotations(svgString: string): boolean {
  // Check for dimension text elements (contain 'm' or 'ft' unit)
  return svgString.includes('font-weight="600"') || svgString.includes('font-weight="bold"');
}

/**
 * Check if SVG contains person reference image
 */
export function hasPersonImage(svgString: string): boolean {
  return svgString.includes('<image') || svgString.includes('<circle');
}

export default {
  generateSVGPreview,
  countCabinetsInSVG,
  hasDimensionAnnotations,
  hasPersonImage,
  CABINET_COLORS,
};
