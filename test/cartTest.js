const { Builder} = require("selenium-webdriver");
const assert = require("assert");
const LoginPage = require("../pages/loginPage");
const InventoryPage = require("../pages/inventoryPage")
const CartPage = require("../pages/cartPage")
const testData = require("../fixtures/testData.json");
const fs = require("fs")
const path = require("path")

async function saucedemoCartTest() {
    describe("Saucedemo Inventory Test", function () {
        let driver;
        let browserName = "chrome";
        let loginPage;
        let inventoryPage;
        let cartPage
    
        beforeEach(async function () {
          // create timeout
          this.timeout(30000); // 10.000 ms = 10 detik
    
          // create webdriver
          driver = await new Builder().forBrowser(browserName).build();
          loginPage = new LoginPage(driver);
          inventoryPage = new InventoryPage(driver);
          cartPage = new CartPage(driver);
          // Open url
          await loginPage.open(testData.baseUrl);
          //login website saucedemo
          await loginPage.login(testData.validUser.username, testData.validUser.password);
          //add items to cart
          await inventoryPage.addItemsToCart();
          //click cart icon
          await inventoryPage.goToCart();
        });
            
        it('TC09_verify UI Elements and product list visible on Cart page',async function () {

            //get text from element cart title
            const cartTitle = await cartPage.getCartTitle()
            assert.strictEqual(cartTitle.includes(testData.expectedTitle.cartTitle),true,testData.messages.cartTitleError);


             // Verify cart item element must be more than 0 if there is an item add it
             const isItemsonCart = await cartPage.isItemsonCart();
             assert.strictEqual(isItemsonCart, true, testData.messages.cartItemsError);

             ////verify button "continue Shooping" is visible on the cart 
             const isContinueShoopingVisible = await cartPage.isContShoopingVisible();
             assert.strictEqual(isContinueShoopingVisible, true, testData.messages.contShoppingBtnError);

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
    saucedemoCartTest();