package rcp_portal.Pages.CandidatePage;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class GenerateCandidateDefaultExcel {
    WebDriver driver;

    public GenerateCandidateDefaultExcel(WebDriver driver) {
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

    @FindBy(xpath = "(//button[@class='outline small reports btn'])[1]")
    WebElement ClickExcelButton;

    @FindBy(xpath = "//select[@class='report-select-options']")
    WebElement ClickDefaultExcel;

    @FindBy(xpath = "//button[@class='generate-btn']")
    WebElement ClickExportExcel;

    @FindBy(xpath = "//button[@class='download-btn']")
    WebElement ClickDownloadExcel;

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

    public void GetClickExcelButton() {
        ClickExcelButton.click();
    }

    public void GetClickDefault() {
        Select select = new Select(ClickDefaultExcel);
        select.selectByIndex(0);
    }

    public void GetClickExportExcel() {
        ClickExportExcel.click();
    }

    public void GetClickDownloadExcel() {
        ClickDownloadExcel.click();
    }

    // public void GetClickReset(){
    // ClickReset.click();
    // }

}
