const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function scanDirectory(dir, extensions) {
    let results = [];
    
    try {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                // Recursively scan subdirectories
                results = results.concat(scanDirectory(filePath, extensions));
            } else if (extensions.some(ext => file.endsWith(ext))) {
                results.push(filePath);
            }
        }
    } catch (error) {
        console.log(`⚠️  Could not read directory ${dir}`);
    }
    
    return results;
}

function findAllFiles(dirs, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
    let results = [];
    
    for (const dir of dirs) {
        if (!fs.existsSync(dir)) {
            console.log(`⚠️  Directory ${dir} not found, skipping...`);
            continue;
        }
        
        console.log(`📂 Scanning ${dir}...`);
        results = results.concat(scanDirectory(dir, extensions));
    }
    
    return results;
}

function extractImports(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const imports = new Set();
        
        // More comprehensive regex patterns for TSX/TypeScript
        const patterns = [
            // import ... from 'package'
            /import\s+(?:[^'"]*\s+from\s+)?['"`]([^'"`]+)['"`]/g,
            // import('package')
            /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
            // require('package')
            /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
            // const ... = await import('package')
            /await\s+import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g
        ];
        
        for (const pattern of patterns) {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const importPath = match[1];
                
                // Skip relative imports and built-in modules
                if (!importPath.startsWith('.') && 
                    !importPath.startsWith('/') && 
                    !importPath.startsWith('node:') &&
                    !isBuiltInModule(importPath)) {
                    
                    // Handle scoped packages like @radix-ui/react-dialog
                    const packageName = importPath.startsWith('@') 
                        ? importPath.split('/').slice(0, 2).join('/')
                        : importPath.split('/')[0];
                    
                    imports.add(packageName);
                }
            }
        }
        
        return Array.from(imports);
    } catch (error) {
        console.log(`⚠️  Error reading file ${filePath}: ${error.message}`);
        return [];
    }
}

function isBuiltInModule(moduleName) {
    const builtInModules = new Set([
        'fs', 'path', 'http', 'https', 'url', 'crypto', 'os', 'util', 
        'events', 'stream', 'buffer', 'child_process', 'cluster', 'dgram',
        'dns', 'domain', 'net', 'punycode', 'querystring', 'readline',
        'repl', 'string_decoder', 'tls', 'tty', 'v8', 'vm', 'worker_threads',
        'zlib', 'assert', 'async_hooks', 'console', 'constants', 'diagnostics_channel',
        'inspector', 'module', 'perf_hooks', 'process', 'timers', 'trace_events'
    ]);
    
    return builtInModules.has(moduleName.split('/')[0]);
}

function getInstalledPackages() {
    try {
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            console.log('❌ No package.json found. Make sure you\'re in a React project directory.');
            process.exit(1);
        }
        
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const installed = new Set();
        
        if (packageJson.dependencies) {
            Object.keys(packageJson.dependencies).forEach(pkg => installed.add(pkg));
        }
        if (packageJson.devDependencies) {
            Object.keys(packageJson.devDependencies).forEach(pkg => installed.add(pkg));
        }
        
        return installed;
    } catch (error) {
        console.log('❌ Error reading package.json:', error.message);
        process.exit(1);
    }
}

function installPackage(packageName) {
    try {
        console.log(`⬇️  Installing ${packageName}...`);
        execSync(`npm install ${packageName}`, { 
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: 60000 // 60 second timeout
        });
        return true;
    } catch (error) {
        return false;
    }
}

function main() {
    console.log('🚀 Auto NPM Package Installer for Components');
    console.log('='.repeat(50));
    
    // Define directories to scan
    const dirsToScan = [
        path.join(process.cwd(), 'components'),
        path.join(process.cwd(), 'components', 'ui')
    ];
    
    // Find all React/TS files in components folders
    console.log('🔍 Scanning components folders...');
    const files = findAllFiles(dirsToScan);
    console.log(`📁 Found ${files.length} component files`);
    
    if (files.length === 0) {
        console.log('❌ No component files found in:');
        dirsToScan.forEach(dir => console.log(`   - ${dir}`));
        console.log('Make sure you\'re in the project root directory.');
        return;
    }
    
    // Show found files
    console.log('📄 Files found:');
    files.forEach(file => console.log(`   - ${path.relative(process.cwd(), file)}`));
    
    // Extract all imports
    console.log('\n📦 Extracting imports...');
    const allImports = new Set();
    
    files.forEach(file => {
        const imports = extractImports(file);
        console.log(`   ${path.basename(file)}: ${imports.length} imports`);
        imports.forEach(imp => allImports.add(imp));
    });
    
    const uniqueImports = Array.from(allImports);
    console.log(`\n🎯 Found ${uniqueImports.length} unique package imports:`);
    uniqueImports.forEach(imp => console.log(`   - ${imp}`));
    
    // Check what's already installed
    console.log('\n🔍 Checking installed packages...');
    const installedPackages = getInstalledPackages();
    const missingPackages = uniqueImports.filter(pkg => !installedPackages.has(pkg));
    
    if (missingPackages.length === 0) {
        console.log('✅ All packages are already installed!');
        return;
    }
    
    console.log(`\n📋 Missing packages (${missingPackages.length}):`);
    missingPackages.forEach(pkg => console.log(`   - ${pkg}`));
    console.log('\n' + '-'.repeat(50));
    
    // Install missing packages
    let successCount = 0;
    let failCount = 0;
    
    for (const pkg of missingPackages) {
        if (installPackage(pkg)) {
            console.log(`✅ ${pkg} - SUCCESS`);
            successCount++;
        } else {
            console.log(`❌ ${pkg} - FAILED`);
            failCount++;
        }
    }
    
    console.log('-'.repeat(50));
    console.log(`🎉 Installation complete!`);
    console.log(`📊 Installed: ${successCount} | Failed: ${failCount}`);
    
    if (failCount > 0) {
        console.log(`\n⚠️  ${failCount} packages failed. Common reasons:`);
        console.log('   - Package doesn\'t exist on npm');
        console.log('   - Typo in package name');
        console.log('   - Need to install manually with specific version');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✨ Done! Your components should now work without import errors.');
}

if (require.main === module) {
    main();
}