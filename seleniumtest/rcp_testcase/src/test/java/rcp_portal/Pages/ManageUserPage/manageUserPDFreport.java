package rcp_portal.Pages.ManageUserPage;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class manageUserPDFreport {
    WebDriver driver;

    public manageUserPDFreport(WebDriver driver) {
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
    WebElement cliGeneratePDF;

    @FindBy(xpath = "(//select[@class='report-select-options'])[1]")
    WebElement CliFullReport;

    @FindBy(xpath = "(//select[@class='report-select-options'])[2]")
    WebElement CliDefaultPDF;

    @FindBy(xpath = "//button[@class='generate-btn']")
    WebElement CliExportPDF;

    @FindBy(xpath = "//button[@class='download-btn']")
    WebElement CliDownloadPDF;

    @FindBy(css = "input[value='Reset']")
    WebElement CliReset;

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

    public void GetcliGeneratePDF() {
        cliGeneratePDF.click();
    }

    public void GetDefaultPDF() {
        Select select = new Select(CliDefaultPDF);
        select.selectByIndex(0);
    }

    public void GetCliFullReport() {
        Select select = new Select(CliFullReport);
        select.selectByIndex(0);
    }

    public void GetCliExportPDF() {
        CliExportPDF.click();
    }

    public void GetCliDownloadPDF() {
        CliDownloadPDF.click();
    }

    // public void GetCliReset(){
    // CliReset.click();
    // }

}
