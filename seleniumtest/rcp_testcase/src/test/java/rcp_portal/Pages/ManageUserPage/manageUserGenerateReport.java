package rcp_portal.Pages.ManageUserPage;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class manageUserGenerateReport {
    WebDriver driver;

    public manageUserGenerateReport(WebDriver driver) {
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
    WebElement cliGenerateCSV;

    @FindBy(xpath = "//select[@class='report-select-options']")
    WebElement CliDefault;

    // @FindBy(className = "rdl-control")
    // WebElement CliDefaultselect;

    @FindBy(xpath = "//button[@class='generate-btn']")
    WebElement ClickExportCSV;

    @FindBy(xpath = "//button[@class='download-btn']")
    WebElement ClickDownLoad;

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
        cliGenerateCSV.click();
    }

    public void GetClickDefault() {
        Select select = new Select(CliDefault);
        select.selectByIndex(0);
    }

    // public void GetCliDefaultselect(){
    // Select select= new Select(CliDefaultselect);
    // select.selectByValue("1");
    // }
    public void GetClickExportCSV() {
        ClickExportCSV.click();

    }

    public void GetClickTag() {
        ClickDownLoad.click();
    }

}
