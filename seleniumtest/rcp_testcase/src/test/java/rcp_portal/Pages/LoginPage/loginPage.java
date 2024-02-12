package rcp_portal.Pages.LoginPage;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class loginPage {
    WebDriver driver;
    public loginPage(WebDriver driver){
         this.driver= driver;
         PageFactory.initElements(driver, this);
    }
    
    @FindBy(id="name")
    WebElement username;

    @FindBy(id="password")
    WebElement password;

    @FindBy(id="login")
    WebElement ClickLogin;


    public void setUserinput(String user){
        username.sendKeys("Admin");
    }
    public void setUserPassword(String pwd){
        password.sendKeys("123456");
    }
    public void getClik(){
        ClickLogin.click();
    }
}
