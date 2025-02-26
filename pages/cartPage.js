const {By} = require ("selenium-webdriver")

class CartPage {
    constructor(driver) {
        this.driver = driver;
        //cart page element
        this.cartTitle = By.css(".title");
        this.cartItem = By.className("inventory_item_name");
        this.checkoutBtn = By.id("checkout");
        this.continueShopButton = By.id("continue-shopping");
      }

      //get text from element cart title
      async getCartTitle() {
        return await this.driver.findElement(this.cartTitle).getText();
      }
      //// Verify cart item element must be more than 0 if there is an item add it
      async isItemsonCart() {
      const cartItems = await this.driver.findElements(this.cartItem);
      return cartItems.length > 0; 
      }

      //verify button "continue Shooping" is visible on the cart 
      async isContShoopingVisible() {
        const continueShopButton = await this.driver.findElement(this.continueShopButton);
        return await continueShopButton.isDisplayed();
      }

      // Verify go to the checkout page
      async checkoutButton() {
        await this.driver.findElement(this.checkoutBtn).click();
      
      }
    }
module.exports = CartPage;