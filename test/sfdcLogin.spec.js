'use strict';
require('dotenv').config();
const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

/* Testing Salesforce.com (SFDC) Apps in browsers
*/
const browsers = process.env.TEST_BROWSERS.split(',');
const headless = ['true', 't', 'y', 'yes', '1'].includes(
	process.env.TEST_BROWSER_HEADLESS.toString().toLowerCase()
);
const screen = {
	width: 1280,
	height: 1024
};

console.log(browsers, headless);
// TODO: Capture screenshot on error
function browserTest(
	description = '',
	browsers = ['chrome'],
	headless = false,
	screenSize = screen,
	timeoutSLA = 30000
) {
	// TODO: Run separate browser tests concurrently
	for (const i in browsers) {
		const browser = browsers[i];
		const chromeOptions = new chrome.Options();
		const firefoxOptions = new firefox.Options();
		if (headless) {
			chromeOptions.headless().windowSize(screenSize);
			firefoxOptions.headless().windowSize(screenSize);
		}

		const driver = new Builder()
			.forBrowser(browser)
			.setChromeOptions(chromeOptions)
			.setFirefoxOptions(firefoxOptions)
			.build();

		// TODO: Load in test case logic from yml files
		const desc = headless
			? '[' + browser + ':headless] ' + description
			: '[' + browser + '] ' + description;

		/* Describe the nature of the test suite
		 *
		 * Collection of browser based tests with the
		 * above configured browser webdriver.
		*/
		describe(desc, function() {
			this.timeout(0);
			this.slow(timeoutSLA / 0.25);
			/* Before all tests Setup Browser WebDriver
			*/
			before(async function() {
				const capabilities = await driver.getCapabilities();
				const browserName = capabilities.get('browserName');
				const browserVersion = capabilities.get('version') || capabilities.get('browserVersion');
				const platform = capabilities.get('platform') || capabilities.get('platformName');
				console.log('browser:\t', browserName);
				console.log('version:\t', browserVersion);
				console.log('os:\t\t', platform);
			});

			it('should load SFDC login screen', async function() {
				await driver.get('https://login.salesforce.com');
				const title = await driver.getTitle();
				assert.equal(title, 'Login | Salesforce');
			});

			it('should login to SFDC org', async function() {
				const username = process.env.TEST_ORG_USERNAME;
				const password = process.env.TEST_ORG_PASSWORD;

				await driver.get('https://login.salesforce.com');
				const title = await driver.getTitle();
				await driver.findElement(By.css('#username')).sendKeys(username);
				await driver.findElement(By.css('#password')).sendKeys(password);
				await driver.findElement(By.css('#Login')).click();
				const sessionTitle = await driver.getTitle();
				assert.notEqual(sessionTitle, title);
			});

			it('should login and wait for UI Elements', async function() {
				const username = process.env.TEST_ORG_USERNAME;
				const password = process.env.TEST_ORG_PASSWORD;

				await driver.get('https://login.salesforce.com');
				const title = await driver.getTitle();
				await driver.findElement(By.css('#username')).sendKeys(username);
				await driver.findElement(By.css('#password')).sendKeys(password);
				await driver.findElement(By.css('#Login')).click();

				const setupElements = ['div.setupGear', '#setupLink'];
				for (const i in setupElements) {
					const element = setupElements[i];
					try {
						await driver.wait(until.elementLocated(By.css(element)), timeoutSLA);
						await driver.findElement(By.css(element)).click();
					} catch (e) {
						console.log('Not Found: ' + element);
					}
				}
				const sessionTitle = await driver.getTitle();
				console.log(sessionTitle);
				assert.notEqual(sessionTitle, title);
			});

			it('should be an incomplete pending test');

			/* After all tests destroy the WebDriver */
			after(async () => {
				await driver.quit();
			});
		});
	}
}

browserTest('SFDC Login', browsers, headless);
