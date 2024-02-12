package rcp_portal.Pages.InterviewersPage;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindAll;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class GenerateInterviewersCustomizeExcel {

    WebDriver driver;

    public GenerateInterviewersCustomizeExcel(WebDriver driver) {
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
    WebElement ClickExcel;

    @FindBy(xpath = "//select[@class='report-select-options']")
    WebElement ClickCustomizeExcel;

    // @FindBy(xpath = "//button[@class='rdl-move rdl-move-all rdl-move-right']")
    // WebElement ClickCustomAllRightArrow;

    @FindBy(xpath = "(//*[@class='rdl-control'])[1]")
    WebElement SelectOptionFromList;

    @FindBy(xpath = "//*[@class='rdl-move rdl-move-right']")
    WebElement MoveRightFromList;

    @FindBy(xpath = "(//*[@class='rdl-control'])[2]")
    WebElement SelectOptionFromRightToLeft;

    @FindBy(xpath = "//*[@class='rdl-move rdl-move-left']")
    WebElement MoveRightToLeft;

    // @FindBy(xpath = "//*[@class='rdl-move rdl-move-all rdl-move-left']")
    // WebElement MoveAllLeft;

    @FindBy(xpath = "//button[@class='generate-btn']")
    WebElement ClickExportCSV;

    @FindBy(xpath = "//button[@class='download-btn']")
    WebElement ClickDownloadCSV;

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

    public void GetClickExcel() {
        ClickExcel.click();
    }

    public void GetClickCustomizeExcel() {
        Select select = new Select(ClickCustomizeExcel);
        select.selectByIndex(1);
    }

    // public void GetClickCustomAllRightArrow() {
    // ClickCustomAllRightArrow.click();
    // }

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

    public void GetMoveRightFromLeft() {
        MoveRightToLeft.click();

    }

    // public void GetMoveAllLeft() {
    // MoveAllLeft.click();
    // }

    public void GetClickExportExcel() {
        ClickExportCSV.click();
    }

    public void GetDownloadExcel() {
        ClickDownloadCSV.click();
    }

}
