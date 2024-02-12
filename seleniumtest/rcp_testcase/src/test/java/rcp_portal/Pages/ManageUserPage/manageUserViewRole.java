package rcp_portal.Pages.ManageUserPage;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class manageUserViewRole {
    WebDriver driver;

    public manageUserViewRole(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    @FindBy(id = "name")
    WebElement username;

    @FindBy(id = "password")
    WebElement password;

    @FindBy(id = "login")
    WebElement ClickLogin;

    @FindBy(css = "tr:nth-child(5) input")
    WebElement CliChecked;

    @FindBy(className = "trashcan")
    WebElement ClickDeleteButton;

    @FindBy(xpath = "//button[@class='MuiButton-root MuiButton-outlined MuiButton-outlinedWarning MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButtonBase-root  css-5rgykb-MuiButtonBase-root-MuiButton-root']")
    List<WebElement> CliDel;

    @FindBy(xpath = "//button[@class='MuiButton-root MuiButton-outlined MuiButton-outlinedWarning MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButtonBase-root  css-5rgykb-MuiButtonBase-root-MuiButton-root']")
    List<WebElement> CliCancel;

    @FindBy(xpath = "(//button[@class='editBtn'])")
    WebElement ClikEditButton;

    @FindBy(xpath = "//input[@class='input-field']")
    WebElement editrole;

    @FindBy(xpath = "//button[@class='edit-modal-btn'] ")
    WebElement ClickSave;

    // @FindBy(css="input[value='Reset']")
    // WebElement ClickReset;

    public void setUserinput(String user) {
        username.sendKeys("Admin");
    }

    public void setUserPassword(String pwd) {
        password.sendKeys("123456");
    }

    public void getClik() {
        ClickLogin.click();
    }

    // public void GetClickDeletebutton() {
    // ClickDeleteButton.click();
    // }

    // public void GetCliDel() {
    // CliDel.get(0).click();
    // }

    // public void GetCliCancel() {
    // CliCancel.get(1).click();
    // }

    public void GetClickEditButton() {
        ClikEditButton.click();

    }

    public void GetEditRole(String role) {
        editrole.clear();
        editrole.sendKeys("frontend developer");
    }

    public void GetClickSave() {
        ClickSave.click();
    }

    // public void GetCliReset(){
    // ClickReset.click();
    // }

}
