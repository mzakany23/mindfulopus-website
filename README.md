# MindfulOpus Website

A modern, responsive website built with 11ty (Eleventy) static site generator, featuring SASS styling and optimized build processes.

## Features

- Built with [11ty](https://www.11ty.dev/) - A simpler static site generator
- SASS/SCSS for stylesheets with automatic compilation
- SVG sprite generation for optimized icon usage
- Minified HTML in production builds
- RSS feed generation
- Responsive design with Bootstrap integration
- Material Design Icons and PE Icon 7 Stroke integration
- Development server with live reload
- Production-ready build process with asset optimization

## Project Structure

```
mindfulopus-website/
├── src/                    # Source files
│   ├── assets/            # Static assets
│   │   ├── styles/       # SASS/SCSS files
│   │   ├── images/       # Image files
│   │   ├── js/          # JavaScript files
│   │   └── icons/       # SVG icons for sprite generation
│   ├── data/             # Site data files
│   ├── includes/         # Reusable template parts
│   ├── filters/          # Custom 11ty filters
│   └── transforms/       # Build transforms (e.g., HTML minification)
├── dist/                  # Built files (generated)
└── .eleventy.js          # 11ty configuration
```

## Quickstart Guide

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- npm (comes with Node.js)

### Setup and Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mindfulopus-website.git
   cd mindfulopus-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run develop
   ```
   This will:
   - Start the 11ty development server
   - Watch for SASS changes
   - Open the site at http://localhost:8080

To stop the server at any time, press `Ctrl + C` in the terminal.

### Available Scripts

- `npm run develop` - Start development server with hot reload
- `npm run build` - Build site for production
- `npm run build:sass` - Compile SASS files only
- `npm run build:eleventy` - Build 11ty site only
- `npm run watch:sass` - Watch SASS files for changes

### Build for Production

To build the site for production:
```bash
npm run build
```

This will:
1. Install required dependencies
2. Clean the dist directory
3. Compile SASS files
4. Build and optimize the site for production

## Deployment

To deploy site changes:

```bash
git add . && git commit -m "your commit message" && git push
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request