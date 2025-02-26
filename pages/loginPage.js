const {By} = require ("selenium-webdriver")
const assert = require ("assert")

class LoginPage {
    constructor(driver) {
      this.driver = driver;
      //login page element
      this.usernameInput = By.id("user-name");
      this.passwordInput = By.id("password");
      this.loginButton = By.id("login-button");
      this.errorMessage = By.css(".error-message-container");
    }

    async open(url) {
      await this.driver.get(url);
    }

    async login(username, password) {
      await this.driver.findElement(this.usernameInput).sendKeys(username);
      await this.driver.findElement(this.passwordInput).sendKeys(password);
      await this.driver.findElement(this.loginButton).click();
    }

    async getErrorMessage() {
      return await this.driver.findElement(this.errorMessage).getText();
    }

    async verifyLoginFailed(expectedText, message) {
      const errorMessage = await this.getErrorMessage();
      assert.strictEqual(errorMessage.includes(expectedText), true, message);
    }
}

module.exports = LoginPage;