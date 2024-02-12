package rcp_portal.Pages.CandidatePage;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class GenerateCandidateDefaultPDFIndividualReport {
    WebDriver driver;

    public GenerateCandidateDefaultPDFIndividualReport(WebDriver driver) {
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

    @FindBy(xpath = "(//button[@class='outline small reports btn'])[2]")
    WebElement CliPDFReport;

    @FindBy(xpath = "(//select[@class='report-select-options'])[1]")
    WebElement CliIndividualPDF;

    @FindBy(xpath = "(//select[@class='report-select-options'])[2]")
    WebElement CliSelectUser;

    @FindBy(xpath = "(//select[@class='report-select-options'])[3]")
    WebElement CliDefaultPDF;

    @FindBy(xpath = "//button[@class='generate-btn']")
    WebElement CliExportIndividualPDF;

    @FindBy(xpath = "//button[@class='download-btn']")
    WebElement CliDownloadIndividualPDF;

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

    public void GetCliPDFReport() {
        CliPDFReport.click();
    }

    public void GetCliIndividualPDF() {
        Select select = new Select(CliIndividualPDF);
        select.selectByIndex(1);
    }

    public void GetCliSelectUser() {
        Select select = new Select(CliSelectUser);
        select.selectByIndex(2);
    }

    public void GetCliPDFDefault() {
        Select select = new Select(CliDefaultPDF);
        select.selectByIndex(0);
    }

    public void GetCliExportIndividualPDF() {
        CliExportIndividualPDF.click();
    }

    public void GetCliDownloadIndividualPDF() {
        CliDownloadIndividualPDF.click();
    }

    // public void GetCliReset(){
    // CliReset.click();
    // }

}
