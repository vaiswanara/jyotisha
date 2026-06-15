const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

if (process.platform !== 'linux') {
  console.log('Not on Linux. Skipping compilation of swetest binary.');
  process.exit(0);
}

const projectDir = process.env.npm_package_json ? path.dirname(process.env.npm_package_json) : process.cwd();

const tarPath = path.join(projectDir, 'libswe_source.tar.gz');
const buildDir = path.join(projectDir, 'libswe-2.10.03');
const destPath = path.join(projectDir, 'swetest');

console.log(`Starting compilation of swetest binary for Linux in ${projectDir}...`);

// Clean up any old files
if (fs.existsSync(tarPath)) fs.unlinkSync(tarPath);
if (fs.existsSync(buildDir)) fs.rmSync(buildDir, { recursive: true, force: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    client.get(url, function(response) {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        return reject(new Error(`Server responded with status code: ${response.statusCode}`));
      }

      response.pipe(file);
      file.on('finish', function() {
        file.close();
        resolve();
      });
    }).on('error', function(err) {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function main() {
  try {
    console.log('Downloading Swiss Ephemeris lightweight source tarball (3.8 MB)...');
    await downloadFile('https://archive.ubuntu.com/ubuntu/pool/universe/libs/libswe/libswe_2.10.03.orig.tar.gz', tarPath);
    console.log('Downloaded successfully. Size:', fs.statSync(tarPath).size);

    console.log('Extracting archive...');
    execSync(`tar -xf "${tarPath}" -C "${projectDir}"`);

    console.log('Compiling swetest...');
    execSync('make swetest', { cwd: buildDir, stdio: 'inherit' });

    console.log('Copying compiled binary to destination...');
    fs.copyFileSync(path.join(buildDir, 'swetest'), destPath);

    console.log('Cleaning up temporary files...');
    if (fs.existsSync(tarPath)) fs.unlinkSync(tarPath);
    if (fs.existsSync(buildDir)) fs.rmSync(buildDir, { recursive: true, force: true });

    fs.chmodSync(destPath, '755');
    console.log('✅ swetest binary compiled and configured successfully.');
  } catch (error) {
    console.log('❌ Failed to compile swetest binary:', error.message);
    if (fs.existsSync(tarPath)) fs.unlinkSync(tarPath);
    if (fs.existsSync(buildDir)) fs.rmSync(buildDir, { recursive: true, force: true });
  }
}

main();
