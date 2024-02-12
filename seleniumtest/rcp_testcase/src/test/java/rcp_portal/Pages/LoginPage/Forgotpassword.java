package rcp_portal.Pages.LoginPage;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class Forgotpassword {

    WebDriver driver;

    public Forgotpassword(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    @FindBy(id = "name")
    WebElement username;

    // @FindBy(id="password")
    // WebElement password;

    @FindBy(className = "reset")
    WebElement ResetEmail;

    @FindBy(id = "email")
    WebElement EnterResetEmail;

    @FindBy(xpath = "//button[@class='outline btn']")
    WebElement Clicknext;

    @FindBy(xpath = "//input[@class='large password input-field']")
    WebElement enterNextSecurityQuestion;

    @FindBy(id = "send-reset")
    WebElement clicksendReset;

    @FindBy(id = "cancel")
    WebElement ClickCancel;

    @FindBy(id = "login")
    WebElement ClickLogin;

    public void setUserinput(String user) {
        username.sendKeys("ssangeth");
    }
    // public void setUserPassword(String pwd){
    // password.sendKeys("123456");
    // }

    public void GetReset() {
        ResetEmail.click();

    }

    public void GetResetEmail(String rEmail) {
        EnterResetEmail.sendKeys("ssangeeth280@gmail.com");
    }

    public void GetClickNext() {
        Clicknext.click();
    }

    public void GetenterNextSecurityQuestion(String resetQuestion) {
        enterNextSecurityQuestion.sendKeys("holycross");
    }

    public void GetSendReset() {
        clicksendReset.click();
    }
    // public void GetClickCancel(){
    // ClickCancel.click();
    // }

    public void getClik() {
        ClickLogin.click();
    }

}
