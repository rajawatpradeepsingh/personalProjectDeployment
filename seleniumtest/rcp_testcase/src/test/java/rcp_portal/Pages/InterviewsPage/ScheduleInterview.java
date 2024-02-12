package rcp_portal.Pages.InterviewsPage;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

import io.github.bonigarcia.wdm.WebDriverManager;

public class ScheduleInterview {

    WebDriver driver;

    public ScheduleInterview(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);

    }

    @FindBy(id = "name")
    WebElement username;

    @FindBy(id = "password")
    WebElement password;

    @FindBy(id = "login")
    WebElement ClickLogin;

    @FindBy(xpath = "(//select[@class='large select-dropdown'])[1]")
    WebElement SelectCandidate;

    @FindBy(xpath = "//div[@class=' css-tlfecz-indicatorContainer']")
    WebElement SelectInterviewerFromList;

    @FindBy(xpath = "(//div[@class=' css-1m553b7-option'])")
    List<WebElement> SelectInterviewer;

    @FindBy(xpath = "(//div[@class=' css-1gtu0rj-indicatorContainer'])[2]")
    WebElement SelectInterviewerFromListagain;

    @FindBy(xpath = "(//div[@class=' css-1fi74sr-option'])")
    List<WebElement> SelectInterviewer2;

    @FindBy(xpath = "(//select[@class='large select-dropdown'])[2]")
    WebElement SelectJobOpeningsFromList;

    @FindBy(xpath = "(//select[@class='large select-dropdown'])[3]")
    WebElement SelectRoundType;

    @FindBy(id = "schedule-date")
    WebElement SelectDate;

    @FindBy(xpath = "(//input[@class='time-input-field'])[1]")
    WebElement StartTime;

    @FindBy(xpath = "(//input[@class='time-input-field'])[2]")
    WebElement EndTime;

    @FindBy(xpath = "//select[@class='url-platform select-dropdown']")
    WebElement MeetingURL;

    @FindBy(xpath = "//button[@class='create-url-btn outline btn']")
    WebElement URLForZoommeet;

    @FindBy(xpath = "(//input[@class='create-url input-field'])[1]")
    WebElement enterMeetingURL;

    @FindBy(xpath = "//button[@class='outline submit large btn']")
    WebElement SaveInterview;

    @FindBy(xpath = "//button[@class='outline warning btn']")
    WebElement clickReset;

    @FindBy(className = "//span[@class='MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root']")
    WebElement ClickCloseAfterURLCreated;

    public void setUserinput(String user) {
        username.sendKeys("Admin");
    }

    public void setUserPassword(String pwd) {
        password.sendKeys("123456");
    }

    public void getClik() {
        ClickLogin.click();

    }

    public void GetSelectCandidateInScheduleInterview() {
        Select select = new Select(SelectCandidate);
        select.selectByIndex(1);
    }

    public void GetSelectInterviewerFromList() {
        SelectInterviewerFromList.click();
    }

    public void GetSelectInterviewer() {
        SelectInterviewer.get(0).click();

    }

    public void GetSelectInterviewerFromListagain() {
        SelectInterviewerFromListagain.click();
    }

    public void GetSelectInterviewer2() {
        SelectInterviewer2.get(1).click();
    }

    public void GetSelectJobOpeningsFromList() {
        Select select = new Select(SelectJobOpeningsFromList);
        select.selectByIndex(1);
    }

    public void GetRoundType() {
        Select select = new Select(SelectRoundType);
        select.selectByIndex(1);
    }

    public void GetSelectDate(String date) {
        SelectDate.sendKeys("17-06-2022");
    }

    public void GetSelectStartTime(String Time) {
        StartTime.sendKeys("10.30 AM");
    }

    public void GetEndTime(String endTime) {
        EndTime.sendKeys("11.30 AM");
    }

    public void GetMeetingURL() {
        Select select = new Select(MeetingURL);
        select.selectByIndex(2);
    }

    public void GetURLForZoommeet() {
        URLForZoommeet.click();
    }

    // public void GetEnterMeetingURL(String meetURL) {
    // enterMeetingURL.sendKeys("sky.com");
    // }

    public void ClickSubmit() {
        SaveInterview.submit();
    }

    public void GEtclickReset() {
        clickReset.click();
    }

    public void GetClickCloseAfterURLCreated() {
        ClickCloseAfterURLCreated.click();
    }
}