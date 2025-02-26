const {By} = require ("selenium-webdriver")

class CheckoutPage {
    constructor(driver) {
        this.driver = driver;
        //Checkout page element
        this.checkoutTitle = By.css(".title");
        this.firstNameInput = By.id("first-name"); 
        this.lastNameInput = By.id("last-name");
        this.postalCodeInput = By.id("postal-code");
        this.continueBtn = By.id("continue");
        this.cancelBtn = By.id("cancel");
        this.OverviewTitle = By.css(".title");
        this.qtyText = By.css(".cart_quantity_label");
        this.descText = By.css(".cart_desc_label");
        this.paymentInformation = By.xpath("//div[.='Payment Information:']");  
        this.shippingInformation = By.xpath("//div[.='Shipping Information:']"); 
        this.priceTotal = By.xpath("//div[.='Price Total']"); 
        this.summaryTotal = By.css(".summary_total_label");
        this.finishBtn = By.id("finish");
        this.completeTitleTxt = By.css(".title");
        this.completeHeaderTxt = By.css(".complete-header");
        this.backHomeBtn = By.id("back-to-products")
      }

      //get text from element checkout title
      async getCheckoutTitle() {
        return await this.driver.findElement(this.checkoutTitle).getText();
      }
     
      //fill first name, last name and zip/Postal Code
      async fillInformationField(firstName, lastName, postalCode) {
        await this.driver.findElement(this.firstNameInput).sendKeys(firstName);
        await this.driver.findElement(this.lastNameInput).sendKeys(lastName);
        await this.driver.findElement(this.postalCodeInput).sendKeys(postalCode);
      }

      //click continue button
      async continueButton() {
        await this.driver.findElement(this.continueBtn).click();
      }

      //Verify cancel button visible on the cart
      async isCancelButtonVisible() {
        const cancelButton = await this.driver.findElement(this.cancelBtn);
        return await cancelButton.isDisplayed();
      }

      //Verify that user is on the Checkout Overview page (Checkout: Overview)
      async checkoutOverviewTitle() {
        return await this.driver.findElement(this.OverviewTitle).getText();
      }

      // Verify Quantity information visible on Checkout Overview page
      async isQuantityVisible() {
        const quantityInfo = await this.driver.findElement(this.qtyText);
        return await quantityInfo.isDisplayed();
      }

      // Verify Description information visible on Checkout Overview page
      async isdascriptionVisible() {
        const descriptionInfo = await this.driver.findElement(this.descText);
        return await descriptionInfo.isDisplayed();
      }

      // Verify payment information visible on Checkout Overview page
      async ispaymentInfoVisible() {
        const paymentInfo = await this.driver.findElement(this.paymentInformation);
        return await paymentInfo.isDisplayed();
      }

      // Verify shipping information visible on Checkout Overview page
      async isshippingInfoVisible() {
        const shippingInfo = await this.driver.findElement(this.shippingInformation);
        return await shippingInfo.isDisplayed();
      }

      // Verify price total information visible on Checkout Overview page
      async ispriceTotalVisible() {
        const priceTotalInfo = await this.driver.findElement(this.priceTotal);
        return await priceTotalInfo.isDisplayed();
      }

      //verify information sumarry total on Checkout Overview page
      async summaryTotalInfo() {
        return await this.driver.findElement(this.summaryTotal).getText();
      }

       //click continue button
       async finishButton() {
        await this.driver.findElement(this.finishBtn).click();
      }

      //get text from element complete title
      async completeTitle() {
        return await this.driver.findElement(this.completeTitleTxt).getText();
      }

      //get text from element complete Header
      async completeHeader() {
        return await this.driver.findElement(this.completeHeaderTxt).getText();
      }

      //back home
      async backHomeButton() {
        await this.driver.findElement(this.backHomeBtn).click();
      }
    }
module.exports = CheckoutPage;