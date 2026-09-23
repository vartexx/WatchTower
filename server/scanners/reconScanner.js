import fs from 'node:fs';
import path from 'node:path';

export function runReconScan(targetDir) {
  const endpoints = [];
  const logs = [];

  logs.push(`[RECON] Starting Attack Surface Mapping & Endpoint Discovery on: ${targetDir}`);

  const apiDir = path.join(targetDir, 'api');
  if (!fs.existsSync(apiDir)) {
    logs.push(`[RECON] Error: API directory not found at ${apiDir}`);
    return { endpoints, logs };
  }

  function scanDir(dir, routePrefix = '/api') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scanDir(fullPath, `${routePrefix}/${entry.name}`);
      } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.ts'))) {
        // Skip helper files starting with _ and test files
        if (entry.name.startsWith('_') || entry.name.includes('.test.') || entry.name.includes('.d.ts')) {
          continue;
        }

        const baseName = entry.name.replace(/\.(js|ts)$/, '');
        const routePath = baseName === 'index' ? routePrefix : `${routePrefix}/${baseName}`;

        let authRequired = false;
        let methods = ['GET'];
        let scopeArea = 'API security';
        let sensitive = false;

        try {
          const fileContent = fs.readFileSync(fullPath, 'utf8');

          if (fileContent.includes('req.method') || fileContent.includes('POST')) {
            methods.push('POST');
          }
          if (fileContent.includes('DELETE')) methods.push('DELETE');
          if (fileContent.includes('PUT')) methods.push('PUT');

          if (fileContent.includes('verifySession') || fileContent.includes('requireAuth') || fileContent.includes('sessionToken') || fileContent.includes('apiKey')) {
            authRequired = true;
          }

          if (routePath.includes('auth') || routePath.includes('session') || routePath.includes('oauth')) {
            scopeArea = 'Authentication & sessions';
            sensitive = true;
          } else if (routePath.includes('user') || routePath.includes('prefs') || routePath.includes('me')) {
            scopeArea = 'Authorization & access control';
            sensitive = true;
          } else if (routePath.includes('proxy') || routePath.includes('webhook') || routePath.includes('notify')) {
            scopeArea = 'Input validation';
            sensitive = true;
          } else if (routePath.includes('security') || routePath.includes('report')) {
            scopeArea = 'Client-side security';
          }

          endpoints.push({
            route: routePath,
            file: path.relative(targetDir, fullPath),
            methods: Array.from(new Set(methods)),
            authRequired,
            scopeArea,
            sensitive,
            lines: fileContent.split('\n').length
          });

          logs.push(`[RECON] Discovered endpoint: [${methods.join(',')}] ${routePath} (Auth: ${authRequired ? 'Yes' : 'No'})`);
        } catch (err) {
          // ignore read error
        }
      }
    }
  }

  scanDir(apiDir);

  logs.push(`[RECON] Recon complete. Discovered ${endpoints.length} active API endpoints.`);
  return { endpoints, logs };
}
