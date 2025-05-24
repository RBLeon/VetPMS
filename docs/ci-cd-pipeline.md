# VetPMS CI/CD Pipeline Documentation

## Overview

Our CI/CD pipeline is built using GitHub Actions and consists of two main workflows:

1. Pull Request Checks
2. Deployment Pipeline

## Branch Strategy

### Branch Naming Convention

All branches must follow the pattern: `type/name`

- Types allowed:
  - `feature/` - New features
  - `bugfix/` - Bug fixes
  - `hotfix/` - Urgent production fixes
  - `release/` - Release preparation
  - `chore/` - Maintenance tasks
  - `docs/` - Documentation updates
  - `test/` - Adding or modifying tests
  - `refactor/` - Code refactoring
  - `style/` - Code style changes
  - `perf/` - Performance improvements
  - `ci/` - CI configuration changes
  - `build/` - Build system changes

### Protected Branches

- `main` - Production branch
- `development` - Development branch

## Pull Request Checks

### Trigger Conditions

- When a PR is opened
- When new commits are pushed to the PR
- When a PR is reopened

### Validation Steps

1. **Code Quality**

   - Linting check (`pnpm lint`)
   - Type checking (`pnpm build`)
   - Unit tests (`pnpm test:headless`)

2. **Branch Naming**
   - Validates branch name against convention
   - Must match pattern: `(type)/[a-z0-9-]+`

### Requirements for PR Approval

- All checks must pass
- Branch name must follow convention
- No merge conflicts
- At least one reviewer approval

## Deployment Pipeline

### Trigger Conditions

- Push to `main` branch
- Manual trigger via workflow dispatch

### Deployment Steps

1. **Build Process**

   - Node.js setup (v20)
   - PNPM setup (v8)
   - Dependency installation
   - Build process (`pnpm build`)

2. **Deployment**
   - Automatic deployment to GitHub Pages
   - Static site generation using Vite
   - Artifact upload and deployment

### Environment

- Production: GitHub Pages
- URL: Automatically generated and updated

## Development Workflow

1. Create feature branch following naming convention
2. Make changes and commit
3. Push changes and create PR
4. Wait for CI checks to pass
5. Get code review approval
6. Merge to development branch
7. After testing in development, merge to main for production deployment

## Best Practices

### Code Quality

- Write meaningful commit messages
- Keep PRs focused and small
- Include tests for new features
- Follow existing code style

### Performance

- Cache dependencies using PNPM store
- Optimize build process
- Monitor build times

### Security

- No sensitive data in code
- Use environment variables for secrets
- Regular dependency updates

## Troubleshooting

### Common Issues

1. **Failed Branch Name Check**

   - Ensure branch name follows convention
   - Rename branch if needed

2. **Failed Build**

   - Check for type errors
   - Verify all tests pass
   - Check for linting issues

3. **Deployment Issues**
   - Verify build artifacts
   - Check GitHub Pages settings
   - Review deployment logs

## Maintenance

### Regular Tasks

- Update dependencies
- Review and update CI configurations
- Monitor build times
- Clean up old artifacts

### Monitoring

- Watch for failed builds
- Monitor deployment success rates
- Track build times
- Review error logs

## Contact

For CI/CD related issues or questions, please contact the development team or create an issue in the repository.
