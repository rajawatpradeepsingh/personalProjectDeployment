package rcp_portal.Pages.ManageUserPage;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class manageUserAddRole {

    WebDriver driver;

    public manageUserAddRole(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    @FindBy(id = "name")
    WebElement username;

    @FindBy(id = "password")
    WebElement password;

    @FindBy(id = "login")
    WebElement ClickLogin;

    @FindBy(id = "roleName")
    WebElement CreateRole;

    @FindBy(css = "input[value='Submit']")
    WebElement ClickSubmit;

    // @FindBy(css= "input[value='Reset']")
    // WebElement ClickReset;

    @FindBy(xpath = "//button[@class='modalBtn ']")
    WebElement ClickOk;

    public void setUserinput(String user) {
        username.sendKeys("Admin");
    }

    public void setUserPassword(String pwd) {
        password.sendKeys("123456");
    }

    public void getClik() {
        ClickLogin.click();
    }

    public void GetCreateRole(String role) {
        CreateRole.sendKeys("HR");
    }

    public void GetSubmit() {
        ClickSubmit.click();
    }

    // public void GetReset(){
    // ClickReset.click();
    // }

    public void GetClickOk() {
        ClickOk.click();
    }

}
