package rcp_portal.Pages.CandidatePage;

import java.util.List;

import org.apache.commons.compress.archivers.examples.Expander;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class ViewCandidate {

    WebDriver driver;

    public ViewCandidate(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    @FindBy(id = "name")
    WebElement username;

    @FindBy(id = "password")
    WebElement password;

    @FindBy(id = "login")
    WebElement ClickLogin;

    @FindBy(css = "td:nth-child(1)")
    List<WebElement> clickCheckBox;

    @FindBy(xpath = "//button[@class='list-delete']")
    WebElement clickDeleteButton;

    @FindBy(xpath = "//button[@class='MuiButton-root MuiButton-outlined MuiButton-outlinedWarning MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButtonBase-root  css-5rgykb-MuiButtonBase-root-MuiButton-root']")
    List<WebElement> ClickCancel;

    @FindBy(xpath = "//button[@class='outline filter archive btn']")
    WebElement ClickFilterCandiadate;

    @FindBy(xpath = "(//input[@class='PrivateSwitchBase-input css-1m9pwf3'])[1]")
    WebElement ClickRecruiterfromdropdown;

    @FindBy(xpath = "//select[@class='filter-dropdown select-dropdown']")
    WebElement SelectCandidatenameFromFilter;

    @FindBy(xpath = "(//input[@class='PrivateSwitchBase-input css-1m9pwf3'])[2]")
    WebElement ClickStatusFromDropDown;

    @FindBy(xpath = "(//select[@class='filter-dropdown select-dropdown'])[2]")
    WebElement SelectStatusFromDropDown;

    @FindBy(xpath = "( //input[@class='PrivateSwitchBase-input css-1m9pwf3'])[3]")
    WebElement ClickSkillsFromDropDown;

    @FindBy(xpath = "//div[@class=' css-1h1u5b-ValueContainer']")
    WebElement SelectSkills;

    @FindBy(xpath = "//button[@class='outline warning small reset-filters btn']")
    WebElement ClickReset;

    @FindBy(xpath = "//button[@class='drawer-close btn']")
    WebElement CloseFilter;

    @FindBy(xpath = "//button[@class='outline archive btn']")
    WebElement ClickArchive;

    @FindBy(xpath = "//button[@class='outline archive btn']")
    List<WebElement> ClickUnArchive;

    @FindBy(xpath = "//button[@class='modal-close-btn']")
    WebElement ClickUnarchieveWindow;

    public void setUserinput(String user) {
        username.sendKeys("Admin");
    }

    public void setUserPassword(String pwd) {
        password.sendKeys("123456");
    }

    public void getClik() {
        ClickLogin.click();
    }

    public void GetCandidateClick() {
        clickCheckBox.get(0).click();
    }

    public void GetClickDeleteButton() {
        clickDeleteButton.click();
    }

    // public void GetClickDelete(){
    // ClickDelete.get(0).click();
    // }

    public void GetClickCancel() {
        ClickCancel.get(1).click();
    }

    public void GetClickFilterCandidate() {
        ClickFilterCandiadate.click();
    }

    public void GetClickRecruiterfromdropdown() {
        ClickRecruiterfromdropdown.click();
    }

    public void GetSelectCandidateNameFromFilter() {
        Select select = new Select(SelectCandidatenameFromFilter);
        select.selectByIndex(1);
    }

    public void GetClickStatusFromDropDown() {
        ClickStatusFromDropDown.click();
    }

    public void GetSelectStatusFromDropDown() {
        Select select = new Select(SelectStatusFromDropDown);
        select.selectByIndex(2);
    }

    public void GetClickSkillsFromDropDown() {
        ClickSkillsFromDropDown.click();

    }

    public void GetSelectSkills() {
        SelectSkills.sendKeys("Angular");
    }

    public void GetCloseFilter() {
        CloseFilter.click();
    }

    public void GetResetButton() {
        ClickReset.click();
    }

    public void GetClickArchiveButton() {
        ClickArchive.click();
    }

    public void GetClickUnarchive() {
        ClickUnArchive.get(2).click();
    }

    public void GetCloseUnarchieveWindow() {
        ClickUnarchieveWindow.click();
    }

}
