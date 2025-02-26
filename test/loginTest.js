const { Builder} = require("selenium-webdriver");
const assert = require("assert");
const LoginPage = require("../pages/loginPage");
const InventoryPage = require("../pages/inventoryPage")
const testData = require("../fixtures/testData.json");
const fs = require("fs")
const path = require("path")

async function saucedemoLoginTest() {
    describe("Saucedemo Login Test", function () {
        let driver;
        let browserName = "chrome";
        let loginPage;
        let inventoryPage;
    
        beforeEach(async function () {
          // create timeout
          this.timeout(30000); // 10.000 ms = 10 detik
    
          // create webdriver
          driver = await new Builder().forBrowser(browserName).build();
          loginPage = new LoginPage(driver);
          inventoryPage = new InventoryPage(driver);
          // Open url
          await loginPage.open(testData.baseUrl);
        });

        it('TC01_Successfully Login and Verify On The Dashboard',async function () {
            await loginPage.login(testData.validUser.username, testData.validUser.password);
            //assertion
            const logoTitle = await inventoryPage.getLogoTitle()
            assert.strictEqual(logoTitle.includes(testData.expectedTitle.logoTitle),true,testData.messages.logoError);

            console.log(testData.log.LoginSuccess)
        });

        it('TC02_Login failed with invalid username and password',async function () {
            await loginPage.login(testData.invalidUser.username, testData.invalidUser.password);
            //assertion
            await loginPage.verifyLoginFailed(
            testData.expectedLoginError.notMatch,
            testData.messages.invalidlogin
          );
  
          console.log(testData.log.LoginFailed);
        });

        it('TC03_Login failed with empty username and valid password',async function () {
            await loginPage.login(testData.invalidUser.emptyUser, testData.validUser.password);
            //assertion
            await loginPage.verifyLoginFailed(
            testData.expectedLoginError.emptyUser,
            testData.messages.emptyUser
          );
  
          console.log(testData.log.LoginFailed);
        });

        it('TC04_Login failed with valid username and empty password',async function () {
            await loginPage.login(testData.validUser.username, testData.invalidUser.emptyPass);
            //assertion
            await loginPage.verifyLoginFailed(
            testData.expectedLoginError.emptyPass,
            testData.messages.emptyPassword
          );
  
          console.log(testData.log.LoginFailed);
        });

        it('TC05_Login failed when user locked',async function () {
            await loginPage.login(testData.invalidUser.userLocked, testData.validUser.password);
            //assertion
            await loginPage.verifyLoginFailed(
            testData.expectedLoginError.userLocked,
            testData.messages.userLocked
          );
  
          console.log(testData.log.LoginFailed);
        });

        afterEach(async function () {
            const screenshotDir = path.join(__dirname, "../screenshots");
            if (!fs.existsSync(screenshotDir)) {
              fs.mkdirSync(screenshotDir);
            }
      
            // Use test case names for screenshots
            const testCaseName = this.currentTest.title.replace(/\s+/g, "_"); // Replace the spaces with underscore
      
            // Save the new screenshot with the name test case
            const image = await driver.takeScreenshot();
            fs.writeFileSync(
              path.join(screenshotDir, `${testCaseName}_new.png`),
              image,
              "base64"
            );
            await driver.quit();
          });
        });
    }
    saucedemoLoginTest();
