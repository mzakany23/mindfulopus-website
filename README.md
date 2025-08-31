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

This site is deployed automatically using Netlify's continuous deployment pipeline.

### How It Works

1. **Production Deployment**: 
   - Any push to the `master` branch automatically triggers a production deployment
   - Changes are live at your production URL within minutes

2. **Preview Deployments**:
   - Create a new branch for your changes: `git checkout -b feature/your-feature`
   - Push the branch to GitHub: `git push -u origin feature/your-feature`
   - Netlify automatically creates a preview deployment with a unique URL
   - Preview URLs look like: `https://deploy-preview-{PR-number}--{your-site-name}.netlify.app`

3. **Pull Request Workflow**:
   - Open a pull request on GitHub
   - Netlify adds a deployment preview link directly in the PR
   - Review changes on the preview URL before merging
   - Once merged to `master`, changes deploy to production automatically

### Manual Deployment

To deploy changes through the standard workflow:

```bash
# Create a feature branch
git checkout -b feature/your-update

# Make your changes and commit
git add .
git commit -m "your commit message"

# Push to GitHub (creates preview deployment)
git push -u origin feature/your-update

# After review, merge to master for production deployment
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request