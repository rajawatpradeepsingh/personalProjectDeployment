package rcp_portal.Pages.ManageUserPage;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class manageUserCustomizeExcel {

    WebDriver driver;

    public manageUserCustomizeExcel(WebDriver driver) {
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
    WebElement CliCustomizeExcel;

    @FindBy(className = "rdl-control")
    WebElement CustomExcelReport;

    // @FindBy(xpath = "//button[@class='rdl-move rdl-move-all rdl-move-right']")
    // WebElement CliCustomAllRight;

    @FindBy(xpath = "//button[@class='rdl-move rdl-move-right']")
    WebElement CliCustomSelectRight;

    // @FindBy(className = "rdl-control")
    // List<WebElement> deSelectCustomRightToLeft;

    // @FindBy(xpath="//button[@class='rdl-move rdl-move-left']")
    // WebElement CliSelectLeft;

    // @FindBy(xpath = "//button[@class='rdl-move rdl-move-all rdl-move-left']")
    // WebElement CliSelectAllLeft;

    @FindBy(xpath = "//button[@class='generate-btn']")
    WebElement ExportCustomExcel;

    @FindBy(xpath = "//button[@class='download-btn']")
    WebElement DownloadCustomExcel;

    // @FindBy(css="input[value='Reset']")
    // WebElement CliReset;

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

    public void GetCliCustomizeExcel() {
        Select select = new Select(CliCustomizeExcel);
        select.selectByIndex(1);
    }

    public void GetCustomExcelReport() {
        Select select = new Select(CustomExcelReport);
        select.selectByIndex(1);
        select.selectByIndex(2);

    }

    // public void GetCliCustomAllRight(){
    // CliCustomAllRight.click();
    // }

    public void GetCustomSelect() {
        CliCustomSelectRight.click();
    }

    // public void GetCliCustomLeft(){
    // deSelectCustomRightToLeft.get(1).click();
    // }

    // public void GetCliSelectLeft(){
    // CliSelectLeft.click();
    // }

    // public void GetCliSelectAllLeft(){
    // CliSelectAllLeft.click();
    // }

    public void GetCustomExportExcel() {
        ExportCustomExcel.click();
    }

    public void GetCustomExcelDownload() {
        DownloadCustomExcel.click();
    }

    // public void GetCliReset(){
    // CliReset.click();
    // }

}
