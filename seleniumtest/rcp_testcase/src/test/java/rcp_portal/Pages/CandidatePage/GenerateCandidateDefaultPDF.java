package rcp_portal.Pages.CandidatePage;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class GenerateCandidateDefaultPDF {

    WebDriver driver;

    public GenerateCandidateDefaultPDF(WebDriver driver) {
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
    WebElement ClickGenerateReportButton;

    @FindBy(xpath = "(//button[@class='outline small reports btn'])[2]")
    WebElement ClickPDFButton;

    @FindBy(xpath = "(//select[@class='report-select-options'])[1]")
    WebElement CliFullReport;

    @FindBy(xpath = "(//select[@class='report-select-options'])[2]")
    WebElement clickDefaultPDF;

    @FindBy(xpath = "//button[@class='generate-btn']")
    WebElement ClickExportPDF;

    @FindBy(xpath = "//button[@class='download-btn']")
    WebElement ClickDownloadPDF;

    public void setUserinput(String user) {
        username.sendKeys("Admin");
    }

    public void setUserPassword(String pwd) {
        password.sendKeys("123456");
    }

    public void getClik() {
        ClickLogin.click();

    }

    public void GetClickGenerateReportButton() {
        ClickGenerateReportButton.click();
    }

    public void GetClickPDFButton() {
        ClickPDFButton.click();
    }

    public void GetClickDefault() {
        Select select = new Select(clickDefaultPDF);
        select.selectByIndex(0);
    }

    public void GetCliFullReport() {
        Select select = new Select(CliFullReport);
        select.selectByIndex(0);
    }

    public void GetClickExportPDF() {
        ClickExportPDF.click();
    }

    public void GetClickDownloadPDF() {
        ClickDownloadPDF.click();
    }

}