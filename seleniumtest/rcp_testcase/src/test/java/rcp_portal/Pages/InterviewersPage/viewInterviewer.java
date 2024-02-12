package rcp_portal.Pages.InterviewersPage;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class viewInterviewer {

    WebDriver driver;

    public viewInterviewer(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    @FindBy(id = "name")
    WebElement username;

    @FindBy(id = "password")
    WebElement password;

    @FindBy(id = "login")
    WebElement ClickLogin;

    @FindBy(css = "input[class='check']")
    List<WebElement> ClickCheck;

    @FindBy(className = "trashcan")
    WebElement ClickDelete;

    @FindBy(xpath = "//button[@class='MuiButton-root MuiButton-outlined MuiButton-outlinedWarning MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButtonBase-root  css-5rgykb-MuiButtonBase-root-MuiButton-root']")
    List<WebElement> ClickDel;

    @FindBy(xpath = "//button[@class='MuiButton-root MuiButton-outlined MuiButton-outlinedWarning MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButtonBase-root  css-5rgykb-MuiButtonBase-root-MuiButton-root']")
    List<WebElement> ClickCancel;

    @FindBy(xpath = "//button[@class='outline filter archive btn']")
    WebElement ClickFilter;

    @FindBy(xpath = "(//label[@class='MuiFormControlLabel-root MuiFormControlLabel-labelPlacementEnd css-j204z7-MuiFormControlLabel-root']) [1]")
    WebElement ClickClient;

    @FindBy(xpath = "//select[@class='filter-dropdown select-dropdown']")
    WebElement SelectClient;

    @FindBy(xpath = "(//label[@class='MuiFormControlLabel-root MuiFormControlLabel-labelPlacementEnd css-j204z7-MuiFormControlLabel-root']) [2]")
    WebElement ClickInterviewerSkills;

    @FindBy(className = "css-tj5bde-Svg")
    WebElement SelectInterviewerSkills;

    @FindBy(xpath = "(//button[@class='drawer-close btn']) ")
    WebElement CloseFilter;

    @FindBy(xpath = "(//button[@class='outline warning small reset-filters btn']) ")
    WebElement ClickReset;

    @FindBy(xpath = "(//button[@class='outline archive btn']) [1]")
    WebElement ClickArchive;

    @FindBy(xpath = "(//button[@class='outline archive btn']) [3]")
    WebElement SelectRecordFromArchive;

    @FindBy(xpath = "//button[@class='modal-close-btn']")
    WebElement ClickCloseButtonInArchive;

    @FindBy(xpath = "(//button[@class='outline archive btn']) [2]")
    WebElement ClickGenerateReportButton;

    public void setUserinput(String user) {
        username.sendKeys("Admin");
    }

    public void setUserPassword(String pwd) {
        password.sendKeys("123456");
    }

    public void getClik() {
        ClickLogin.click();

    }

    public void GetClickCheck() {
        ClickCheck.get(1).click();
    }

    public void GetClickDelete() {
        ClickDelete.click();
    }

    public void GetClickDel() {
        ClickDel.get(0).click();
    }

    // public void GetClickCancel(){
    // ClickCancel.get(1).click();
    // }
    public void GetClickFilter() {
        ClickFilter.click();
    }

    public void GetClickClient() {
        ClickClient.click();
    }

    public void GetSelectClient() {
        Select select = new Select(SelectClient);
        select.selectByIndex(1);
    }

    public void GetClickInterviewSkills() {
        ClickInterviewerSkills.click();
    }
    // public void GetSelectInterviewer(){
    // Select select = new Select(SelectInterviewerSkills);
    // select.selectByVisibleText("Testing");

    // }

    public void GetCloseFilter() {
        CloseFilter.click();
    }

    // public void GetClickReset(){
    // ClickReset.click();
    // }
    public void GetClickArchieve() {
        ClickArchive.click();
    }

    public void GetSelectRecordFroArchive() {
        SelectRecordFromArchive.click();
    }

    public void GetClickCloseArchiveButton() {
        ClickCloseButtonInArchive.click();
    }

    public void GetClickGenerateReport() {
        ClickGenerateReportButton.click();
    }

}
