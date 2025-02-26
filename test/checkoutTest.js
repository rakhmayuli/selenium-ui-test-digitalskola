const { Builder} = require("selenium-webdriver");
const assert = require("assert");
const LoginPage = require("../pages/loginPage");
const InventoryPage = require("../pages/inventoryPage")
const CartPage = require("../pages/cartPage")
const CheckoutPage = require("../pages/checkoutPage")
const testData = require("../fixtures/testData.json");
const fs = require("fs")
const path = require("path")

async function saucedemoCartTest() {
    describe("Saucedemo Checkout Test", function () {
        let driver;
        let browserName = "chrome";
        let loginPage;
        let inventoryPage;
        let cartPage;
        let checkoutPage;
    
        beforeEach(async function () {
          // create timeout
          this.timeout(30000); // 10.000 ms = 10 detik
    
          // create webdriver
          driver = await new Builder().forBrowser(browserName).build();
          loginPage = new LoginPage(driver);
          inventoryPage = new InventoryPage(driver);
          cartPage = new CartPage(driver);
          checkoutPage = new CheckoutPage(driver);

          // Open url
          await loginPage.open(testData.baseUrl);
          //login website saucedemo
          await loginPage.login(testData.validUser.username, testData.validUser.password);
          //add items to cart
          await inventoryPage.addItemsToCart();
          //click cart icon
          await inventoryPage.goToCart();
          //click button checkout on cart page
          await cartPage.checkoutButton();
        });
            
        it('TC10_verify checkout successfully',async function () {
            
            //get text from element checkout title
            const checkoutTitle = await checkoutPage.getCheckoutTitle()
            assert.strictEqual(checkoutTitle.includes(testData.expectedTitle.checkoutInformationTitle),true,testData.messages.checkoutInformationError);

             //fill first name, last name and zip/Postal Code
             await checkoutPage.fillInformationField(
                testData.customer.firstName,
                testData.customer.lastName, 
                testData.customer.postalCode
                );

             // verify button "cancel" visible on Checkout: Your Information
             const CancelVisible = await checkoutPage.isCancelButtonVisible();
             assert.strictEqual(CancelVisible, true, testData.messages.cancelButtonError);

             // click button continue
             await checkoutPage.continueButton();

             //Verify that user is on the Checkout Overview page (Checkout: Overview)
             const overviewTitle = await checkoutPage.checkoutOverviewTitle()
             assert.strictEqual(overviewTitle.includes(testData.expectedTitle.checkoutOverviewTitle),true,testData.messages.checkoutOverviewError);
            
             // verify information Quantity visible on Checkout: Your Information
             await checkoutPage.isQuantityVisible();
            
             // verify information Description visible on Checkout: Your Information
             await checkoutPage.isdascriptionVisible();
             
             // verify Payment information visible on Checkout: Your Information
             await checkoutPage.ispaymentInfoVisible();

             // verify Shipping information visible on Checkout: Your Information
             await checkoutPage.isshippingInfoVisible();

             // verify price total information visible on Checkout: Your Information
             await checkoutPage.ispriceTotalVisible();

             // verify summary total information visible on Checkout: Your Information
             const summaryTotal = await checkoutPage.summaryTotalInfo()
             assert.strictEqual(summaryTotal.includes(testData.expectedText.priceElement), true, testData.messages.totalPriceError);

             //click button finish
             await checkoutPage.finishButton();

             //get text from element checkout complete title
            const checkoutCompleteTitle = await checkoutPage.completeTitle()
            assert.strictEqual(checkoutCompleteTitle.includes(testData.expectedTitle.checkoutCompleteTitle),true,testData.messages.completeTitleError);

            //get text from element checkout complete title
            const completeHeader = await checkoutPage.completeHeader()
            assert.strictEqual(completeHeader.includes(testData.expectedText.completeOrder),true,testData.messages.completeError);

            //click back home
            await checkoutPage.backHomeButton();

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