package rcp_portal.Pages.ManageUserPage;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class manageUserCustomCSV {

    WebDriver driver;

    public manageUserCustomCSV(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    @FindBy(id = "name")
    WebElement username;

    @FindBy(id = "password")
    WebElement password;

    @FindBy(id = "login")
    WebElement ClickLogin;

    @FindBy(xpath = "(//button[@class='outline archive btn'])[2]")
    WebElement GenerateReport;

    @FindBy(xpath = "//button[@class='outline small reports selected btn']")
    WebElement cliGenerateCustomCSV;

    @FindBy(xpath = "//select[@class='report-select-options']")
    WebElement CliCustom;

    @FindBy(className = "rdl-control")
    WebElement CustomSelect;

    // @FindBy(xpath = "//button[@class='rdl-move rdl-move-all rdl-move-right']")
    // WebElement CliSelectedAllRight;

    @FindBy(xpath = "//button[@class='rdl-move rdl-move-right']")
    WebElement ClickSelectedRight;

    @FindBy(className = "rdl-control")
    List<WebElement> DeselectFromRightToLeft;

    @FindBy(xpath = "//button[@class='rdl-move rdl-move-left']")
    WebElement ClickSelectedLeft;

    @FindBy(xpath = "//button[@class='rdl-move rdl-move-all rdl-move-left']")
    WebElement ClickSelectAllLeft;

    @FindBy(xpath = "//button[@class='generate-btn']")
    WebElement CustomizeCSVButton;

    @FindBy(xpath = "//button[@class='download-btn']")
    WebElement CustomizeDownLoad;

    public void setUserinput(String user) {
        username.sendKeys("Admin");
    }

    public void setUserPassword(String pwd) {
        password.sendKeys("123456");
    }

    public void getClik() {
        ClickLogin.click();
    }

    public void GetGenerateReport() {
        GenerateReport.click();
    }

    public void GetClickCSV() {
        cliGenerateCustomCSV.click();
    }

    public void GetClickCustomReport() {
        Select select = new Select(CliCustom);
        select.selectByIndex(1);
    }

    public void GetCustomSelect() {
        Select select = new Select(CustomSelect);
        select.selectByIndex(0);
        select.selectByIndex(2);
    }

    // public void GetCliSelectedAllRight(){
    // CliSelectedAllRight.click();
    // }
    public void GetClickSelectedRight() {
        ClickSelectedRight.click();
    }

    public void GetDeselectListFromRightToLeft() {
        DeselectFromRightToLeft.get(1).click();
    }

    public void GetClickSelectedLeft() {
        ClickSelectedLeft.click();
    }

    public void GetClickSelectAllLeft() {
        ClickSelectAllLeft.click();
    }

    public void GetCustomizeCSVButton() {
        CustomizeCSVButton.click();
    }

    public void GetCustomizeDownload() {
        CustomizeDownLoad.click();
    }

}
