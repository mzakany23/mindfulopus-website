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

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 16.x or higher) - [Download here](https://nodejs.org/)
  - To check your version: `node --version`
- **npm** (comes with Node.js)
  - To check your version: `npm --version`

### Quick Setup (3 Steps)

1. **Clone and navigate to the project:**
   ```bash
   git clone https://github.com/yourusername/mindfulopus-website.git
   cd mindfulopus-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This will install all required packages including 11ty, Sass, and other build tools.

3. **Start the development server:**
   ```bash
   npm run develop
   ```

**That's it!** The development server will:
- ✅ Start the 11ty development server with live reload
- ✅ Watch and compile SASS files automatically
- ✅ Open your browser to `http://localhost:8080`

### Verify Everything is Working

After running `npm run develop`, you should see:
1. Terminal output showing "Local: http://localhost:8080"
2. Your browser automatically opens to the site
3. The MindfulOpus website loads correctly
4. Changes to files in `src/` automatically refresh the browser

**To stop the server:** Press `Ctrl + C` in the terminal.

### Available Development Scripts

| Command | What it does |
|---------|-------------|
| `npm run develop` | **Main development command** - Starts dev server + SASS watching |
| `npm run run:dev` | Start 11ty dev server only (without SASS watching) |
| `npm run watch:sass` | Watch and compile SASS files only |
| `npm run build:sass` | Compile SASS files once |
| `npm run build:eleventy` | Build 11ty site once |
| `npm run build` | **Production build** - Full build for deployment |

### Troubleshooting

**Port 8080 already in use?**
```bash
# Kill any process using port 8080
lsof -ti:8080 | xargs kill -9
# Then try npm run develop again
```

**SASS compilation errors?**
- Check that all SASS files in `src/assets/styles/` have valid syntax
- Look for missing semicolons or unclosed brackets

**Site not loading?**
- Ensure you're in the correct directory (`mindfulopus-website`)
- Try deleting `node_modules` and running `npm install` again
- Check that no other process is using port 8080

**Need help?**
- Check the terminal output for specific error messages
- Ensure all prerequisites are installed with the correct versions

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