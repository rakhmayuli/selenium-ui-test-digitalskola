const {By} = require ("selenium-webdriver")

class InventoryPage {
    constructor(driver) {
        this.driver = driver;
        //dashboard page element 
        this.logoTitle = By.css(".app_logo");
        this.burgerButton = By.id("react-burger-menu-btn");
        this.cartIcon = By.css(".shopping_cart_link");
        this.productList = By.className('inventory_item');
        this.cartBadge = By.css('.shopping_cart_badge');
        // Initialize the required elements
        this.addToCartButtons = {
          backpack: By.id("add-to-cart-sauce-labs-backpack"),
          bikeLight: By.id("add-to-cart-sauce-labs-bike-light"),
          boltTShirt: By.id("add-to-cart-sauce-labs-bolt-t-shirt"),
        };
        this.remove1Button = By.id("remove-sauce-labs-backpack")
      }
    
      //get text from element logo title
      async getLogoTitle() {
        return await this.driver.findElement(this.logoTitle).getText();
      }

      // Verify on the dashboard page that the "Burger Button" is visible 
      async isBurgerButtonVisible() {
        const burgerButton = await this.driver.findElement(this.burgerButton);
        return await burgerButton.isDisplayed();
      }

      // Verify on the dashboard page that the "cart icon" is visible 
      async isCartIconVisible() {
        const cartIcon = await this.driver.findElement(this.cartIcon);
        return await cartIcon.isDisplayed();
      }

      //Verify that the product list is visible on the dashboard page
      async isProductListVisible() {
        const productList = await this.driver.findElement(this.productList);
        return await productList.isDisplayed();
      }

      //Add item to cart on dashboard page
     // mwthod for add items to cart
      async addItemsToCart() {
        for (const key in this.addToCartButtons) {
        await this.driver.findElement(this.addToCartButtons[key]).click();
        }
      }

      //Verify cart badge showing the number of items added on dashborad page
      // Method for retrieving the number of items in the cart
      async getCartItemCount() {
            const cartBadge = await this.driver.findElement(this.cartBadge);
            return await cartBadge.getText();
      }
      
      async removeItem() {
        await this.driver.findElement(this.remove1Button).click();
      }

      // Verify go to the cart page
      async goToCart() {
        await this.driver.findElement(this.cartIcon).click();
      }
}

module.exports = InventoryPage;
