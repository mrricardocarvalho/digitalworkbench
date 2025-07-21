# 🚀 Digital Workbench - Modern Portfolio Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://mrricardocarvalho.github.io/digitalworkbench/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/mrricardocarvalho/digitalworkbench)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

A high-performance React portfolio showcasing modern web development practices and technical expertise. Built with cutting-edge technologies to demonstrate both Business Central development skills and full-stack capabilities.

## ✨ Features

### 🎨 **Modern UI/UX**
- Interactive 3D components with hardware-accelerated animations
- Smooth page transitions using Framer Motion
- Responsive design optimized for all device sizes
- Dark/Light theme support with system preference detection
- Custom cursor with performance optimizations

### ⚡ **Performance Optimized**
- Lighthouse scores: 95+ across all metrics
- Code splitting and lazy loading implementation
- Optimized asset bundling with Vite
- Real-time Web Vitals monitoring
- Efficient caching strategies

### 🔍 **SEO & Accessibility**
- Comprehensive meta tags and Open Graph optimization
- Structured data (JSON-LD) for better search visibility
- ARIA-compliant accessibility features
- Semantic HTML structure
- Progressive Web App capabilities

### 🛠️ **Developer Experience**
- 100% TypeScript coverage with strict type checking
- Comprehensive testing suite with Vitest
- ESLint configuration with modern rules
- Automated CI/CD pipeline with GitHub Actions
- Hot module replacement for fast development

## 🚀 Live Demo

**Visit the portfolio**: [https://mrricardocarvalho.github.io/digitalworkbench/](https://mrricardocarvalho.github.io/digitalworkbench/)

## 🛠️ Tech Stack

### **Frontend**
- **React 19** - Latest React features and concurrent rendering
- **TypeScript 5.8** - Type safety and enhanced developer experience
- **Vite 6.3** - Lightning-fast build tool and dev server
- **Framer Motion 12** - Production-ready motion library

### **Styling & Design**
- **CSS3** - Modern CSS features with Grid and Flexbox
- **CSS Animations** - Hardware-accelerated transforms and transitions
- **Responsive Design** - Mobile-first approach with breakpoints

### **Development Tools**
- **Vitest** - Fast unit testing framework
- **ESLint** - Code linting with TypeScript support
- **GitHub Actions** - Automated testing and deployment
- **Web Vitals API** - Performance monitoring

### **Deployment**
- **GitHub Pages** - Static site hosting
- **GitHub Actions** - Automated CI/CD pipeline
- **Vercel-ready** - Alternative deployment option

## 📊 Performance Metrics

```
Lighthouse Scores:
├── Performance: 95+
├── Accessibility: 100
├── Best Practices: 100
└── SEO: 100

Bundle Analysis:
├── Initial Bundle: ~96KB (gzipped)
├── Vendor Chunk: ~12KB (gzipped)
├── Motion Chunk: ~36KB (gzipped)
└── Load Time: <2s on 3G
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CustomCursor/   # Performance-optimized cursor
│   ├── Header/         # Navigation and branding
│   ├── Footer/         # Contact and social links
│   └── Layout/         # Main layout wrapper
├── pages/              # Route components
│   ├── HomePage/       # Landing page with 3D elements
│   ├── ResumePage/     # Professional experience
│   ├── ProjectsPage/   # Development projects showcase
│   └── InsightPostPage/# Technical blog posts
├── hooks/              # Custom React hooks
├── utils/              # Utility functions and helpers
└── styles/             # Global styles and themes
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrricardocarvalho/digitalworkbench.git
   cd digitalworkbench
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run test suite
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
npm run lint         # Run ESLint
```

## 🧪 Testing

The project includes comprehensive testing with Vitest and React Testing Library:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📈 Performance Optimizations

### **Bundle Optimization**
- Manual chunk splitting for vendor libraries
- Tree shaking for unused code elimination
- Terser minification with console removal

### **Runtime Performance**
- `requestAnimationFrame` for smooth animations
- Passive event listeners for better scrolling
- Efficient re-render prevention with `useCallback`

### **Loading Performance**
- Route-based code splitting
- Font preloading with `font-display: swap`
- Image optimization and lazy loading

## 🌐 Deployment

The project is automatically deployed to GitHub Pages using GitHub Actions:

1. **Push to main branch** triggers deployment
2. **Build process** runs with optimizations
3. **Deploy to GitHub Pages** with custom domain support

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to GitHub Pages (if configured)
npm run deploy
```

## 🤝 Contributing

This is a personal portfolio project, but feedback and suggestions are welcome:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 About the Developer

**Ricardo Carvalho** - Senior Dynamics 365 Business Central Developer

- 🔗 **Portfolio**: [https://mrricardocarvalho.github.io/digitalworkbench/](https://mrricardocarvalho.github.io/digitalworkbench/)
- 💼 **LinkedIn**: [Connect with me](https://linkedin.com/in/ricardocarvalho)
- 🐱 **GitHub**: [@mrricardocarvalho](https://github.com/mrricardocarvalho)

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
