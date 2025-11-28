# Requirements Document

## Introduction

本文档定义了 LED 显示屏配置计算器 API 服务的需求。该服务将现有的前端箱体组合算法封装为独立的 HTTP API，供其他网站或系统调用。核心功能包括：单箱体配置计算、多箱体智能组合、最优排列算法等。

## Glossary

- **Cabinet（箱体）**: LED 显示屏的基本组成单元，具有固定的物理尺寸和像素分辨率
- **Wall（墙体）**: 安装 LED 显示屏的目标区域，以宽度和高度定义
- **Arrangement（排列）**: 箱体在墙体上的布局方案，包含每个箱体的位置信息
- **Coverage（覆盖率）**: 箱体总面积与墙体面积的比值
- **Multi-Cabinet Mode（多箱体模式）**: 使用多种不同尺寸的箱体组合填充墙体
- **Guillotine Algorithm（切割算法）**: 一种矩形装箱算法，通过递归切割剩余空间来放置箱体

## Requirements

### Requirement 1

**User Story:** As a third-party developer, I want to calculate single cabinet display wall specifications via API, so that I can integrate LED configuration into my own application.

#### Acceptance Criteria

1. WHEN a client sends a POST request to `/api/calculate/single` with cabinet specs, room config, and display config THEN the API SHALL return complete calculation results including wall dimensions, cabinet count, pixel info, power consumption, and physical parameters
2. WHEN the request body is missing required fields THEN the API SHALL return a 400 error with clear validation messages
3. WHEN the calculation completes successfully THEN the API SHALL return results within 500ms for typical configurations

### Requirement 2

**User Story:** As a third-party developer, I want to calculate multi-cabinet display wall specifications via API, so that I can support complex LED configurations with mixed cabinet sizes.

#### Acceptance Criteria

1. WHEN a client sends a POST request to `/api/calculate/multi` with cabinet selections and room config THEN the API SHALL return calculation results including arrangement details for each cabinet
2. WHEN multiple cabinet types are provided THEN the API SHALL use the guillotine packing algorithm to optimize placement
3. WHEN the arrangement direction is specified as 'left-to-right' or 'right-to-left' THEN the API SHALL apply the corresponding layout strategy
4. WHEN the total cabinet count exceeds 1000 THEN the API SHALL return a 400 error to prevent excessive computation

### Requirement 3

**User Story:** As a third-party developer, I want to get intelligent cabinet combination recommendations, so that I can achieve optimal wall coverage without manual calculation.

#### Acceptance Criteria

1. WHEN a client sends a POST request to `/api/calculate/smart-combination` with main cabinet, auxiliary cabinets, and wall dimensions THEN the API SHALL return the best combination with highest coverage
2. WHEN testing combinations THEN the API SHALL evaluate up to 4 auxiliary cabinet types progressively
3. WHEN the optimal combination is found THEN the API SHALL return coverage percentage and detailed cabinet counts

### Requirement 4

**User Story:** As a third-party developer, I want to calculate optimal layout based on room dimensions, so that I can quickly determine how many cabinets fit in a given space.

#### Acceptance Criteria

1. WHEN a client sends a POST request to `/api/calculate/optimal-layout` with cabinet specs and room config THEN the API SHALL return recommended columns and rows
2. WHEN the room dimensions are provided in feet THEN the API SHALL correctly convert to meters for calculation
3. WHEN the cabinet cannot fit in the room THEN the API SHALL return minimum values of 1 column and 1 row

### Requirement 5

**User Story:** As a system administrator, I want the API to have proper error handling and logging, so that I can monitor and debug issues effectively.

#### Acceptance Criteria

1. WHEN any calculation throws an error THEN the API SHALL return a structured error response with error code and message
2. WHEN a request is received THEN the API SHALL log the request method, path, and response time
3. WHEN the server starts THEN the API SHALL log the port number and environment

### Requirement 6

**User Story:** As a third-party developer, I want CORS support enabled, so that I can call the API from browser-based applications.

#### Acceptance Criteria

1. WHEN a request includes an Origin header THEN the API SHALL include appropriate CORS headers in the response
2. WHEN a preflight OPTIONS request is received THEN the API SHALL respond with allowed methods and headers

### Requirement 7

**User Story:** As a third-party developer, I want to generate SVG preview images of LED display wall configurations via API, so that I can embed visual previews in my own application without implementing rendering logic.

#### Acceptance Criteria

1. WHEN a client sends a POST request to `/api/preview/svg` with calculation result and room config THEN the API SHALL return a complete SVG string representing the display wall preview
2. WHEN the request includes cabinet arrangement data THEN the API SHALL render each cabinet with appropriate colors based on cabinet type
3. WHEN the request specifies `showDimensions: true` THEN the API SHALL include dimension annotations (wall width, height, screen width, height) in the SVG
4. WHEN the request specifies output format as 'svg' THEN the API SHALL return SVG markup with Content-Type `image/svg+xml`
5. WHEN the request specifies output format as 'json' THEN the API SHALL return the SVG string wrapped in a JSON response

### Requirement 8

**User Story:** As a third-party developer, I want to generate PNG preview images of LED display wall configurations via API, so that I can use the images in contexts where SVG is not supported.

#### Acceptance Criteria

1. WHEN a client sends a POST request to `/api/preview/png` with calculation result and room config THEN the API SHALL return a PNG image of the display wall preview
2. WHEN the request includes width and height parameters THEN the API SHALL generate the PNG at the specified dimensions
3. WHEN no dimensions are specified THEN the API SHALL use default dimensions of 800x500 pixels
