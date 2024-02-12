package rcp_portal.Pages.ManageUserPage;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class manageUserViewRoleArchive {
    
    WebDriver driver;
    public manageUserViewRoleArchive(WebDriver driver){
        this.driver= driver;
        PageFactory.initElements(driver, this);
    }

    @FindBy(id="name")
    WebElement username;

    @FindBy(id="password")
    WebElement password;

    @FindBy(id="login")
    WebElement ClickLogin;

    @FindBy(xpath="//button[@class='outline archive btn']")
    WebElement ClickArchive;

    @FindBy(xpath = "//button[@class='outline archive btn']")
    List<WebElement> ClickUnArchive;

    @FindBy(xpath = "//button[@class='modal-close-btn']")
    WebElement ClickCloseArchiveWindow;

     
    public void setUserinput(String user){
        username.sendKeys("Admin");
    }
    public void setUserPassword(String pwd){
        password.sendKeys("123456");
    }
    public void getClik(){
        ClickLogin.click();
    }
    public void GetClickArchieve(){
        ClickArchive.click();
    }
    public void GetClickUnArchieve(){
        ClickUnArchive.get(1).click();
    }
    public void GetClickArchiveWindow(){
        ClickCloseArchiveWindow.click();
    }

}