package rcp_portal.Pages.CandidatePage;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class GenerateCandidateCustomizeExcel {
    WebDriver driver;

    public GenerateCandidateCustomizeExcel(WebDriver driver) {
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
    WebElement ClickCustomExcel;

    // @FindBy(xpath = "//button[@class='rdl-move rdl-move-all rdl-move-right']")
    // WebElement ClickCustomAllRightArrow;

    @FindBy(xpath = "(//*[@class='rdl-control'])[1]")
    WebElement SelectCustomListRight;

    @FindBy(xpath = "//*[@class='rdl-move rdl-move-right']")
    WebElement ClickSelectedListRight;

    @FindBy(xpath = "(//*[@class='rdl-control'])[2]")
    WebElement SelectCustomFromRightToLeft;

    @FindBy(xpath = "//*[@class='rdl-move rdl-move-left']")
    WebElement ClickSelectedListLeft;

    @FindBy(xpath = "//*[@class='rdl-move rdl-move-all rdl-move-left']")
    WebElement ClickCustomAllLeftArrow;

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

    public void GetClickCustomExcel() {
        Select select = new Select(ClickCustomExcel);
        select.selectByIndex(1);
    }

    // public void GetClickCustomAllRightArrow(){
    // ClickCustomAllRightArrow.click();
    // }
    public void GetSelectCustomListRight() {
        Select select = new Select(SelectCustomListRight);
        select.selectByIndex(2);
        select.selectByIndex(4);
        select.selectByIndex(6);
        select.selectByIndex(7);
    }

    public void GetSelectedListRight() {
        ClickSelectedListRight.click();
    }

    public void GetSelectCustomListFromRightToLeft() {
        Select select = new Select(SelectCustomFromRightToLeft);
        select.selectByIndex(1);
    }

    public void GetSelectedListLeft() {
        ClickSelectedListLeft.click();
    }

    public void GetClickAllLeftArrow() {
        ClickCustomAllLeftArrow.click();
    }

    public void GetExportExcel() {
        ClickExportExcel.click();
    }

    public void GetDownloadExcel() {
        ClickDownloadExcel.click();
    }

}