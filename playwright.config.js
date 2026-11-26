// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config= ({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  retries:1,
  timeout: 100*1000, //30seconds global timeout
  expect: {timeout: 5000 }, //40 seconds 
  reporter: 'html',
  
  use: {
    actionTimeout: 10*1000,
    navigationTimeout: 30*1000,
   browserName: 'chromium',
    headless: true,
    screenshot: 'on',
    trace: 'on', //off/on
    video: 'retain-on-failure',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */

  },

  
});

module.exports= config
