package rcp_portal.Pages.ManageUserPage;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class manageUser {

    WebDriver driver;

    public manageUser(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    @FindBy(id = "name")
    WebElement username;

    @FindBy(id = "password")
    WebElement password;

    @FindBy(id = "login")
    WebElement ClickLogin;

    @FindBy(css = "tr:nth-child(4) input")
    WebElement ClickCheckbox;

    // @FindBy(css="td:nth-child(7)")
    // List<WebElement> ClickEnable;

    @FindBy(className = "trashcan")
    WebElement ClickDelete;

    @FindBy(xpath = "//button[@class='MuiButton-root MuiButton-outlined MuiButton-outlinedWarning MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButtonBase-root  css-5rgykb-MuiButtonBase-root-MuiButton-root']")
    WebElement ClickAlertDelete;

    // @FindBy(xpath ="//button[@class='MuiButton-root MuiButton-outlined
    // MuiButton-outlinedWarning MuiButton-sizeSmall MuiButton-outlinedSizeSmall
    // MuiButtonBase-root css-5rgykb-MuiButtonBase-root-MuiButton-root']")
    // WebElement ClickAlertCancel;

    public void setUserinput(String user) {
        username.sendKeys("Admin");
    }

    public void setUserPassword(String pwd) {
        password.sendKeys("123456");
    }

    public void getClik() {
        ClickLogin.click();
    }

    public void GetClickcheckbox() {
        ClickCheckbox.click();
    }

    // public void GetClickEnable(){
    // ClickEnable.get(4).click();
    // }

    public void GetClickDelete() {
        ClickDelete.click();
    }

    public void GetClickAlertDelete() {
        ClickAlertDelete.click();
    }

    // public void GetClickAlertCancel(){
    // ClickAlertCancel.click();
    // }

}
