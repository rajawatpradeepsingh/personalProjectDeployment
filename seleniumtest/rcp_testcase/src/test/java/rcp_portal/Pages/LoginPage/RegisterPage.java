package rcp_portal.Pages.LoginPage;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class RegisterPage {

    WebDriver driver;

    public RegisterPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    @FindBy(id = "register")
    WebElement cliregister;

    @FindBy(id = "username")
    WebElement entUserName;

    @FindBy(id = "role")
    WebElement getRole;

    @FindBy(id = "password")
    WebElement entePasswd;

    @FindBy(id = "password2")
    WebElement passwrd;

    @FindBy(id = "firstName")
    WebElement getFirstname;

    @FindBy(id = "lastName")
    WebElement getLastName;

    @FindBy(id = "email")
    WebElement setEmail;

    @FindBy(name = "phoneNumber")
    WebElement getNumber;

    @FindBy(id = "question")
    WebElement GetSecurityQuestion;

    @FindBy(id = "answer")
    WebElement EnterAnswer;

    @FindBy(css = "input[value='Register']")
    WebElement clickToRegister;

    // @FindBy(id="cancel")
    // WebElement ClickCancel;

    @FindBy(xpath = "//button[@class='MuiButton-root MuiButton-outlined MuiButton-outlinedSuccess MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButtonBase-root  css-1k9gzqu-MuiButtonBase-root-MuiButton-root']")
    WebElement ClickClose;

    public void clickregister() {
        cliregister.click();
    }

    public void enterUserName(String user) {
        entUserName.sendKeys("sangavi");
    }

    public void gRole(String rol) {
        Select select = new Select(getRole);
        select.selectByIndex(2);
    }

    public void enterPasswd(String pwd) {
        entePasswd.sendKeys("123456");
    }

    public void getPassword(String pwd1) {
        passwrd.sendKeys("123456");
    }

    public void firstName(String user2) {
        getFirstname.sendKeys("sam");
    }

    public void lastName(String user3) {
        getLastName.sendKeys("ruth");
    }

    public void setEmail(String email) {
        setEmail.sendKeys("samruth@gmail.com");
    }

    public void getNumber(String no) {
        getNumber.sendKeys("15334556895");
    }

    public void GetSecurityQuestion() {
        Select select = new Select(GetSecurityQuestion);
        select.selectByIndex(3);

    }

    public void GetAnswer(String User) {
        EnterAnswer.sendKeys("holycross");
    }

    public void getCliRegi() {
        clickToRegister.click();
    }

    // public void GetClickCancel(){
    // ClickCancel.click();
    // }
    public void GetRegisterButtonClose() {
        ClickClose.click();
    }

}
