const { Builder} = require("selenium-webdriver");
const assert = require("assert");
const LoginPage = require("../pages/loginPage");
const InventoryPage = require("../pages/inventoryPage")
const testData = require("../fixtures/testData.json");
const fs = require("fs")
const path = require("path")

async function saucedemoInventoryTest() {
    describe("Saucedemo Inventory Test", function () {
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

          await loginPage.login(testData.validUser.username, testData.validUser.password);
        });

        it('TC06_verify UI Elements and product list visible on dashboard page',async function () {

            // Verify on the dashboard page that the "Burger Button" is visible 
            const isBurgerButtonVisible = await inventoryPage.isBurgerButtonVisible();
            assert.strictEqual(isBurgerButtonVisible, true, testData.messages.burgerButtonError);

             // Verify on the dashboard page that the "cart icon" is visible
             const isCartIconVisible = await inventoryPage.isCartIconVisible();
             assert.strictEqual(isCartIconVisible, true, testData.messages.cartButtonError);

             //Verify that the product list is visible on the dashboard page
             const isProductListVisible = await inventoryPage.isProductListVisible();
             assert.strictEqual(isProductListVisible, true, testData.messages.productsListError);

        });
        
        it('TC07_Add item to cart on dashboard page',async function () {

            // add item to cart
            await inventoryPage.addItemsToCart();

            //verify count item on cart badge
            // Retrieve the number of items in the cart
            const cartCount = await inventoryPage.getCartItemCount();
            assert.strictEqual(
            cartCount,
            testData.addCart.expectedCount.toString(),
            `Expected ${testData.addCart.expectedCount} items, but found ${cartCount} in the cart`
    );
        });

        it('TC08_Remove item to cart on dashboard page',async function () {

          // add item to cart
          await inventoryPage.addItemsToCart();

          //verify count item on cart badge
          // Retrieve the number of items in the cart
          const cartCount = await inventoryPage.getCartItemCount();
          assert.strictEqual(
          cartCount,
          testData.addCart.expectedCount.toString(),
          `Expected ${testData.addCart.expectedCount} items, but found ${cartCount} in the cart`
            );
          //remove item 
          await inventoryPage.removeItem();
  
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
    saucedemoInventoryTest();
