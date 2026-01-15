/**
 * Helper script to extract Firebase Admin credentials for Vercel deployment
 * Run: node scripts/extract-firebase-key.js
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'three-star-driving-firebase-adminsdk-fbsvc-9d319171c1.json');

if (!fs.existsSync(jsonPath)) {
  console.error('❌ Firebase Admin JSON file not found at:', jsonPath);
  process.exit(1);
}

try {
  const serviceAccount = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  console.log('\n📋 Firebase Admin Credentials for Vercel:\n');
  console.log('='.repeat(60));
  console.log('\n1. FIREBASE_ADMIN_PROJECT_ID');
  console.log(serviceAccount.project_id);
  
  console.log('\n2. FIREBASE_ADMIN_CLIENT_EMAIL');
  console.log(serviceAccount.client_email);
  
  console.log('\n3. FIREBASE_ADMIN_PRIVATE_KEY');
  console.log('(Copy the entire key below, including BEGIN/END markers)');
  console.log('-'.repeat(60));
  console.log(serviceAccount.private_key);
  console.log('-'.repeat(60));
  
  console.log('\n✅ Copy these values to Vercel Environment Variables\n');
  console.log('='.repeat(60));
  
} catch (error) {
  console.error('❌ Error reading JSON file:', error.message);
  process.exit(1);
}
