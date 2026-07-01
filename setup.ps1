# setup.ps1 - Simple Working Version
Write-Host "🚀 Setting up Course Allocation System..." -ForegroundColor Green

# Create directories
Write-Host "📁 Creating directory structure..." -ForegroundColor Yellow

# Backend directories
$backendDirs = @(
    "backend\src\domain\entities",
    "backend\src\domain\enums",
    "backend\src\domain\interfaces",
    "backend\src\application\services",
    "backend\src\application\dtos",
    "backend\src\application\ports",
    "backend\src\infrastructure\database\prisma",
    "backend\src\infrastructure\database\migrations",
    "backend\src\infrastructure\repositories",
    "backend\src\infrastructure\external",
    "backend\src\presentation\controllers",
    "backend\src\presentation\middlewares",
    "backend\src\presentation\routes",
    "backend\src\config",
    "backend\src\utils",
    "backend\prisma",
    "backend\tests\unit",
    "backend\tests\integration",
    "backend\tests\fixtures"
)

foreach ($dir in $backendDirs) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

# Frontend directories
$frontendDirs = @(
    "apps\web\src\app\(auth)\login",
    "apps\web\src\app\(auth)\register",
    "apps\web\src\app\(dashboard)\dashboard",
    "apps\web\src\app\(dashboard)\lecturers",
    "apps\web\src\app\(dashboard)\courses",
    "apps\web\src\app\(dashboard)\allocations",
    "apps\web\src\app\(dashboard)\reports",
    "apps\web\src\app\(dashboard)\policies",
    "apps\web\src\app\api\lecturers",
    "apps\web\src\app\api\courses",
    "apps\web\src\app\api\allocations",
    "apps\web\src\app\api\reports",
    "apps\web\src\app\api\policies",
    "apps\web\src\components\common",
    "apps\web\src\components\lecturers",
    "apps\web\src\components\courses",
    "apps\web\src\components\allocations",
    "apps\web\src\components\reports",
    "apps\web\src\lib\services\api",
    "apps\web\src\lib\validations",
    "apps\web\src\lib\utils",
    "apps\web\src\hooks",
    "apps\web\src\store",
    "apps\web\src\types",
    "apps\web\src\styles",
    "apps\web\prisma",
    "apps\web\tests\unit",
    "apps\web\tests\integration"
)

foreach ($dir in $frontendDirs) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

# Docs directories
$docsDirs = @(
    "docs\requirements",
    "docs\design",
    "docs\uml",
    "docs\api"
)

foreach ($dir in $docsDirs) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

Write-Host "✅ Directory structure created!" -ForegroundColor Green

# Create .gitignore
Write-Host "📄 Creating .gitignore..." -ForegroundColor Yellow
$gitignoreContent = @"
# Dependencies
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml

# Build outputs
dist/
build/
.next/
out/

# Environment files
.env
.env.local
.env.production
.env.development.local

# Logs
logs/
*.log
npm-debug.log*

# Testing
coverage/
.nyc_output/

# Database
*.db
*.sqlite
*.sqlite3
prisma/*.db

# IDE
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Temporary files
tmp/
temp/
*.tmp
"@
$gitignoreContent | Out-File -FilePath ".gitignore" -Encoding UTF8

# Initialize Backend
Write-Host "📦 Initializing Backend..." -ForegroundColor Yellow
Set-Location backend

# Create package.json
$backendPackage = @"
{
  "name": "course-allocation-backend",
  "version": "1.0.0",
  "description": "Course Allocation Management System - Backend API",
  "main": "dist/app.js",
  "scripts": {
    "dev": "nodemon src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.9.0",
    "@types/cors": "^2.8.16",
    "typescript": "^5.2.2",
    "ts-node": "^10.9.1",
    "nodemon": "^3.0.1"
  }
}
"@
$backendPackage | Out-File -FilePath "package.json" -Encoding UTF8

# Create tsconfig.json
$tsconfig = @"
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
"@
$tsconfig | Out-File -FilePath "tsconfig.json" -Encoding UTF8

# Create .env
$envContent = @"
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/course_allocation"
JWT_SECRET="your-super-secret-jwt-key"
"@
$envContent | Out-File -FilePath ".env" -Encoding UTF8

# Create app.ts
$appContent = @"
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Course Allocation System'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

export default app;
"@
$appContent | Out-File -FilePath "src\app.ts" -Encoding UTF8

# Install dependencies
Write-Host "📦 Installing Backend dependencies..." -ForegroundColor Yellow
npm install
npm install -D typescript @types/node ts-node nodemon

Set-Location ..

# Initialize Frontend (Next.js)
Write-Host "📦 Creating Next.js Frontend..." -ForegroundColor Yellow
if (-not (Test-Path "apps\web")) {
    npx create-next-app@latest apps/web --typescript --tailwind --app --src-dir --import-alias @/* --yes
}

# Install frontend deps
Write-Host "📦 Installing Frontend dependencies..." -ForegroundColor Yellow
Set-Location apps\web
npm install

Set-Location ..\..

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. cd backend"
Write-Host "2. Update DATABASE_URL in .env with your PostgreSQL connection string"
Write-Host "3. npm run dev"
Write-Host ""
Write-Host "In another terminal:" -ForegroundColor Cyan
Write-Host "4. cd apps/web"
Write-Host "5. npm run dev"
Write-Host ""
Write-Host "🌐 Access the application:" -ForegroundColor Yellow
Write-Host "Backend: http://localhost:5000"
Write-Host "Frontend: http://localhost:3000"