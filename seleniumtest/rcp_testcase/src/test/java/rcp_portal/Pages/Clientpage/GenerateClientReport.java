package rcp_portal.Pages.Clientpage;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class GenerateClientReport {

    WebDriver driver;

    public GenerateClientReport(WebDriver driver) {
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
    WebElement ClickReportsButton;

    @FindBy(xpath = "(//button[@class='outline small reports selected btn'])")
    WebElement ClickCSVButton;

    @FindBy(xpath = "//select[@class='report-select-options']")
    WebElement ClickDefaultCSV;

    @FindBy(xpath = "//button[@class='generate-btn']")
    WebElement ClickExportCSV;

    @FindBy(xpath = "//button[@class='download-btn']")
    WebElement ClickDownloadCSV;

    // @FindBy(css = "input[value='Reset']")
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

    public void GetClickReportsbutton() {
        ClickReportsButton.click();
    }

    public void GetClickCSVbutton() {
        ClickCSVButton.click();
    }

    public void GetClickDefaultCSV() {
        Select select = new Select(ClickDefaultCSV);
        select.selectByIndex(0);

    }

    public void GetExportCSV() {
        ClickExportCSV.click();

    }

    public void GetDownloadCSV() {
        ClickDownloadCSV.click();
    }

    public void GetClickReset() {
        ClickReset.click();
    }
}
