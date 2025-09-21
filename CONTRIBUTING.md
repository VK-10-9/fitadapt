# Contributing to FitAdapt

Thank you for your interest in contributing to FitAdapt! We welcome contributions from the community to help make adaptive fitness accessible to everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Contributing Guidelines](#contributing-guidelines)
- [Reporting Issues](#reporting-issues)
- [Pull Request Process](#pull-request-process)

## 🤝 Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. By participating, you agree to:

- Be respectful and inclusive
- Focus on constructive feedback
- Accept responsibility for mistakes
- Show empathy towards other contributors
- Help create a positive community

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A Supabase account (for database features)

### Local Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/fitadapt.git
   cd fitadapt
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

5. **Set up the database**:
   - Create a Supabase project
   - Run the `schema.sql` file in your Supabase SQL editor
   - Update environment variables with your project details

6. **Start the development server**:
   ```bash
   npm run dev
   ```

7. **Open your browser** to `http://localhost:3000`

## 🔄 Development Workflow

### 1. Choose an Issue

- Check the [Issues](https://github.com/yourusername/fitadapt/issues) page
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to indicate you're working on it

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### 3. Make Your Changes

- Write clear, concise commit messages
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

### 4. Test Your Changes

```bash
# Run the development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

### 5. Commit Your Changes

```bash
git add .
git commit -m "feat: add new workout adaptation algorithm"
```

Follow conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting
- `refactor:` for code restructuring
- `test:` for testing
- `chore:` for maintenance

## 📝 Contributing Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused

### Component Guidelines

- Use functional components with hooks
- Follow the existing component structure
- Implement proper error handling
- Add loading states where appropriate
- Ensure accessibility (ARIA labels, keyboard navigation)

### Database Changes

- Never modify production database directly
- Test schema changes locally first
- Include migration scripts for schema changes
- Update TypeScript types when changing database schema

### Testing

- Write unit tests for utility functions
- Test components with React Testing Library
- Ensure all tests pass before submitting PR
- Test on multiple browsers/devices

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Clear title** describing the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Environment details**:
   - Browser and version
   - Operating system
   - Node.js version
   - Supabase version (if applicable)
5. **Screenshots** if visual issues
6. **Console errors** or logs

### Feature Requests

For feature requests, please include:

1. **Clear description** of the proposed feature
2. **Use case** - why would this be valuable?
3. **Implementation ideas** if you have any
4. **Mockups or examples** if applicable

## 🔄 Pull Request Process

### Before Submitting

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Update CHANGELOG.md** if applicable
5. **Self-review** your code

### Submitting a PR

1. **Push your branch** to your fork
2. **Create a Pull Request** from your branch to `main`
3. **Fill out the PR template** completely
4. **Link related issues** using keywords like "Closes #123"
5. **Request review** from maintainers

### PR Review Process

1. **Automated checks** will run (linting, tests, build)
2. **Maintainer review** will be requested
3. **Address feedback** and make requested changes
4. **PR will be merged** once approved

## 🎯 Areas for Contribution

### High Priority

- **Exercise Database**: Add more exercises with proper form instructions
- **Mobile Optimization**: Improve mobile experience and PWA features
- **Performance**: Optimize bundle size and loading times
- **Accessibility**: Improve screen reader support and keyboard navigation

### Medium Priority

- **Social Features**: Workout sharing, leaderboards, challenges
- **Advanced Analytics**: More detailed progress insights
- **Wearable Integration**: Connect with fitness trackers
- **Nutrition Integration**: Basic meal planning features

### Low Priority

- **Multi-language Support**: Internationalization
- **Offline Mode**: Work without internet connection
- **Advanced Customization**: Custom workout templates
- **AI Integration**: Enhanced personalization with ML

## 📞 Getting Help

- **GitHub Discussions**: Ask questions and get community help
- **Discord**: Join our community chat (link in README)
- **Documentation**: Check the [docs](docs/) folder
- **Issues**: Search existing issues before creating new ones

## 🙏 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Featured in our community showcase
- Eligible for contributor swag (when available)

Thank you for contributing to FitAdapt and helping make fitness more accessible and enjoyable for everyone! 💪🚀