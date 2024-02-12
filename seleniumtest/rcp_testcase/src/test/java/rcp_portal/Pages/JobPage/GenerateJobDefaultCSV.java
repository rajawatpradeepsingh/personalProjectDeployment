package rcp_portal.Pages.JobPage;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class GenerateJobDefaultCSV {

    WebDriver driver;

    public GenerateJobDefaultCSV(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    @FindBy(id = "name")
    WebElement username;

    @FindBy(id = "password")
    WebElement password;

    @FindBy(id = "login")
    WebElement ClickLogin;

    // @FindBy(css = "td:nth-child(1)")
    // List<WebElement> ClickRow;

    @FindBy(xpath = "(//button[@class='outline archive btn'])[2]")
    WebElement ClickOnReportFilter;

    @FindBy(xpath = "(//button[@class='outline small reports selected btn'])")
    WebElement ClickCSVFormat;

    @FindBy(xpath = "//select[@class='report-select-options']")
    WebElement ClickCSVDefaultFormat;

    @FindBy(xpath = "//button[@class='generate-btn']")
    WebElement ClickGenerateReport;

    @FindBy(xpath = "//button[@class='download-btn']")
    WebElement ClickDownload;

    public void setUserinput(String user) {
        username.sendKeys("Admin");
    }

    public void setUserPassword(String pwd) {
        password.sendKeys("123456");
    }

    public void getClik() {
        ClickLogin.click();

    }

    // public void GetClickRow() {
    // ClickRow.get(0).click();
    // }

    public void GetClickOnReportFilter() {
        ClickOnReportFilter.click();
    }

    public void GetClickGenerateDefaultCSV() {
        ClickCSVDefaultFormat.click();
    }

    public void GetGenerateReport() {
        ClickGenerateReport.click();
    }

    public void GetClickDownload() {
        ClickDownload.click();
    }

}
