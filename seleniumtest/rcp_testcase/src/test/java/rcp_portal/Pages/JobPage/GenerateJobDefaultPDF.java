package rcp_portal.Pages.JobPage;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class GenerateJobDefaultPDF {

    WebDriver driver;

    public GenerateJobDefaultPDF(WebDriver driver) {
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
    WebElement ClickOnReportFilter;

    @FindBy(xpath = "(//button[@class='outline small reports btn'])[2]")
    WebElement ClickOnPDF;

    @FindBy(xpath = "(//select[@class='report-select-options'])[1]")
    WebElement SelectReportTypeFromPDF;

    @FindBy(xpath = "(//select[@class='report-select-options'])[2]")
    WebElement SelectReportDetailsFromPDF;

    @FindBy(xpath = "(//button[@class='generate-btn'])")
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

    public void GetClickOnReportFilter() {
        ClickOnReportFilter.click();
    }

    public void GetClickOnPDF() {
        ClickOnPDF.click();

    }

    public void GetSelectReportTypeFromPDF() {
        Select select = new Select(SelectReportTypeFromPDF);
        select.selectByIndex(0);
    }

    public void GetSelectReportDetailsFromPDF() {
        Select select = new Select(SelectReportDetailsFromPDF);
        select.selectByIndex(0);
    }

    public void GetClickGenerateReport() {
        ClickGenerateReport.click();
    }

    public void GetClickDownload() {
        ClickDownload.click();
    }

}
