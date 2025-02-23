const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");
//browser configuration.
const chrome = require("selenium-webdriver/chrome");
const firefox = require("selenium-webdriver/firefox");
const edge = require("selenium-webdriver/edge");

async function saucedemoTest() {

  // Cross-Browser in Selenium with Headless Mode
  //const browsers = ["chrome", "firefox", "MicrosoftEdge"];
  const browsers = [
    {
      name: "chrome",
      Options: new chrome.Options().addArguments("--headless"),
    },
    {
      name: "firefox",
      Options: new firefox.Options().addArguments("--headless"),
    },
    {
      name: "MicrosoftEdge",
      Options: new edge.Options().addArguments("--headless"),
    },
  ];
      //// Iterate for each browser in the `browsers` array.
      browsers.forEach(async (browser) => {
        describe("Saucedemo Test", function () {
          let driver;
          let cookies; // Variable for storing cookies after login
          this.timeout(100000); // Set timeout for the entire test suite

          // `beforeEach` will be executed before each test case.
          beforeEach(async function () {
            //// Creates a WebDriver instance for the browser being tested.
            driver = await new Builder()
              .forBrowser(browser.name) //// Specifies the browser to use.
              //Setting browser options
              .setChromeOptions(
                browser.name === "chrome" ? browser.Options : undefined
              )
              .setEdgeOptions(
                browser.name === "MicrosoftEdge" ? browser.Options : undefined
              )
              .setFirefoxOptions(
                browser.name === "firefox" ? browser.Options : undefined
              )
              .build();
    
            // // Open Saucedemo URL
            await driver.get("https://www.saucedemo.com");
          });

      it('TC01 : User Successfully Login and Verify User On The Dashboard', async function () {
        // -------------------- SCENARIO USER SUCCESSFULLY LOGIN --------------------//
        // Exception Handling & Conclusion
        try {
        // login to app with valid credentials
        await driver.findElement(By.id("user-name")).sendKeys("standard_user");
        await driver.findElement(By.id("password")).sendKeys("secret_sauce");
        await driver.findElement(By.id("login-button")).click();

        // Save cookies after login for login test case 2
        cookies = await driver.manage().getCookies();
        console.log("Cookies saved after login.");

        //User has entered the dashboard page
        let titleText = await driver.findElement(By.css(".app_logo")).getText();
        assert.strictEqual(titleText.includes("Swag Labs"),true,'Title does not include "Swag Labs"');
          
        // -------------------- SCENARIO VALIDATE USER ON THE DASHBOARD AFTER LOGIN --------------------//
        // Verify on the dashboard page that the "Burger Button" is visible 
        let burgerButton = await driver.findElement(By.id("react-burger-menu-btn"));
        assert.strictEqual(await burgerButton.isDisplayed(), true, "menu burger button is not visible");

        // Verify on the dashboard page that the "cart icon" is visible 
        let cartIcon = await driver.findElement(By.css(".shopping_cart_link"));
        assert.strictEqual(await cartIcon.isDisplayed(), true, "cart is not visible");

        //Verify that the product list is visible on the dashboard page
        let productList = await driver.wait(until.elementsLocated(By.className('inventory_item')), 5000); 
        assert.ok(productList.length > 0, "Product list is not displayed");

        console.log(`Test on ${browser.name} passed!`);

        } catch (error) {
          console.error(` Test failed on ${browser.name}:`, error);
        } 
      });

      it('TC02 : Items Successfully Checkout ', async function () {
        // ------------------------------ SCENARIO ADD ITEM TO CART ------------------------------//
        // Exception Handling & Conclusion
        try {
           // Set of cookies stored from TC01
           await driver.manage().deleteAllCookies(); // Delete existing cookies
           for (const cookie of cookies) {
             // If the cookie has SameSite=None, set the Secure flag
             if (cookie.sameSite === "None") {
               cookie.secure = true; // Set Secure flag
             }
             await driver.manage().addCookie(cookie);
           }
           console.log("Cookies restored from TC01.");

           //After the cookies are restored, the dashboard page (/inventory.html) is reopened to ensure that the login state remains valid.
           await driver.get("https://www.saucedemo.com/inventory.html");
          
          // ------------------------------ SCENARIO ADD ITEM TO CART ------------------------------//
          //Add item to cart on dashboard page
          //1.Select multiple items based on button "add to cart" ID
          const itemsToAdd = [
            'add-to-cart-sauce-labs-backpack',
            'add-to-cart-sauce-labs-bike-light',
            'add-to-cart-sauce-labs-bolt-t-shirt'
          ]
        
          // 2.Click the "Add to cart" button for each item selected
          for (const itemId of itemsToAdd) {
          await driver.findElement(By.id(itemId)).click();
          }

          // -------------------- SCENARIO ITEMS SUCCESSFULY ADDED TO CART --------------------//

          //Verify items successfully added to cart with a cart icon showing the number of items added
          let cartBadge = await driver.findElement(By.css('.shopping_cart_badge'));
          let cartCount = await cartBadge.getText();
          assert.strictEqual(cartCount, itemsToAdd.length.toString(), `Expected ${itemsToAdd.length} items, but found ${cartCount} on cart`);

          //Verify Item on the cart
          await driver.findElement(By.css(".shopping_cart_link")).click();

          let cartTitle = await driver.findElement(By.css(".title")).getText();
          assert.strictEqual(cartTitle.includes("Your Cart"),true,'Title does not include "Your Cart"');

          let cartItem = await driver.findElement(By.className("inventory_item_name"));
          assert.strictEqual(await cartItem.isDisplayed(), true, "items is not found on the cart");

          // -------------------- SCENARIO ITEMS SUCCESSFULY CHECKOUT --------------------//
          //click button checkout
          await driver.findElement(By.id("checkout")).click();

          //Verify that user is on the checkout page (Checkout: Your Information)
          let checkoutTitle = await driver.findElement(By.css(".title")).getText();
          assert.strictEqual(checkoutTitle.includes("Checkout: Your Information"),true,'Title does not include "Checkout: Your Information"');

          //user fill first name, last name and zip/Postal Code
          await driver.findElement(By.id("first-name")).sendKeys("Rakhma");
          await driver.findElement(By.id("last-name")).sendKeys("Yuli");
          await driver.findElement(By.id("postal-code")).sendKeys("52321");

          //click button continue
          await driver.findElement(By.id("continue")).click();

          //Verify that user is on the Checkout Overview page (Checkout: Overview)
          let OverviewTitle = await driver.findElement(By.css(".title")).getText();
          assert.strictEqual(OverviewTitle.includes("Checkout: Overview"),true,'Title does not include "Checkout: Overview"');

          //Verify the total price on the checkout overview page.
          let totalpriceElement = await driver.findElement(By.css(".summary_total_label")).getText();
          assert.strictEqual(totalpriceElement.includes("$"),true,'Total price is NOT displayed"');

          //click button finish
          await driver.findElement(By.id("finish")).click();

          //Verify that the checkout is successful
          let completeTitle = await driver.findElement(By.css(".title")).getText();
          assert.strictEqual(completeTitle.includes("Checkout: Complete!"),true,'Title does not include "Checkout: Complete!"');
          let completeMessage = await driver.findElement(By.css(".complete-header")).getText();
          assert.strictEqual(completeMessage.includes("Thank you for your order!"),true,'Title does not include "Thank you for your order!"');

          //back home
          await driver.findElement(By.id("back-to-products")).click();

          console.log(`Test on ${browser.name} passed!`);
        
        } catch (error) {
          console.error(` Test failed on ${browser.name}:`, error);
        } 
      });

      afterEach(async function () {
        await driver.quit();
        });
    })
  })
}
saucedemoTest();