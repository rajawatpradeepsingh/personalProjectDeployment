package rcp_portal.Pages.JobPage;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class GenerateJobCustomizeExcel {

    WebDriver driver;

    public GenerateJobCustomizeExcel(WebDriver driver) {
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

    @FindBy(xpath = "(//button[@class='outline small reports btn'])[1]")
    WebElement ClickOnExcel;

    @FindBy(xpath = "//button[@class='outline small reports selected btn']")
    WebElement ClickCustomizeExcelFormat;

    @FindBy(xpath = "//select[@class='report-select-options']")
    WebElement ClickCustomizeExcelFromReports;

    @FindBy(xpath = "//button[@class='rdl-move rdl-move-all rdl-move-right']")
    WebElement ClickCustomAllRightArrow;

    @FindBy(xpath = "(//select[@class='rdl-control']) [1]")
    WebElement SelectOptionFromList;

    @FindBy(xpath = "//button[@class='rdl-move rdl-move-right']")
    WebElement MoveRightFromList;

    @FindBy(xpath = "(//select[@class='rdl-control'])[2]")
    WebElement SelectOptionFromRightToLeft;

    @FindBy(xpath = "(//button[@class='rdl-move rdl-move-all rdl-move-left'])")
    WebElement MoveAllLeft;

    @FindBy(xpath = "//select[@class='report-select-options']")
    WebElement ClickCSVCustomizeFormat;

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

    public void GetClickOnReportFilter() {
        ClickOnReportFilter.click();
    }

    public void GetClickOnExcel() {
        ClickOnExcel.click();

    }

    public void GetClickGenerateCustomizeExcel() {
        ClickCustomizeExcelFormat.click();
    }

    public void GetClickCustomizeReportsFromExcel() {
        Select select = new Select(ClickCustomizeExcelFromReports);
        select.selectByIndex(1);
    }

    public void GetClickCustomAllRightArrow() {
        ClickCustomAllRightArrow.click();
    }

    public void GetSelectOptionFromList() {
        Select select = new Select(SelectOptionFromList);
        select.selectByIndex(0);
        select.selectByIndex(2);
        select.selectByIndex(3);
        select.selectByIndex(4);
    }

    public void GetMoveRightFromList() {
        MoveRightFromList.click();
    }

    public void GetSelectOptionFromRightToLeft() {
        Select select = new Select(SelectOptionFromRightToLeft);
        select.selectByIndex(1);

    }

    public void GetMoveAllLeft() {
        MoveAllLeft.click();
    }

    public void GetClickGenerateReportCustomizeExcel() {
        ClickCSVCustomizeFormat.click();
    }

    public void GetGenerateReport() {
        ClickGenerateReport.click();
    }

    public void GetClickDownload() {
        ClickDownload.click();
    }
}
