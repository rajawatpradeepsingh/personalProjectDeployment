package rcp_portal.Pages.ManageUserPage;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class manageUserExcelReport {

    WebDriver driver;

    public manageUserExcelReport(WebDriver driver) {
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

    @FindBy(xpath = "(//button[@class='outline small reports btn'])[1]")
    WebElement cliGenerateExcel;

    @FindBy(xpath = "//select[@class='report-select-options']")
    WebElement cliDefaultExcel;

    @FindBy(xpath = "//button[@class='generate-btn']")
    WebElement cliExportExcel;

    @FindBy(xpath = "//button[@class='download-btn']")
    WebElement cliExportDownloadExcel;

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

    public void GetcliGenerateExcel() {
        cliGenerateExcel.click();
    }

    public void GetcliDefaultExcel() {
        cliDefaultExcel.click();
    }

    public void GetcliExportExcel() {
        cliExportExcel.click();
    }

    public void GetcliExportDownloadExcel() {
        cliExportDownloadExcel.click();

    }

    // public void GetClickReset(){
    // CliReset.click();
    // }

}
