package rcp_portal.Pages.InterviewersPage;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class createInterviewer {

    WebDriver driver;

    public createInterviewer(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    @FindBy(id = "name")
    WebElement username;

    @FindBy(id = "password")
    WebElement password;

    @FindBy(id = "login")
    WebElement ClickLogin;

    @FindBy(id = "firstName")
    WebElement enterFirstName;

    @FindBy(id = "lastName")
    WebElement enterLastName;

    @FindBy(id = "clientId")
    WebElement enterClient;

    @FindBy(xpath = "//input[@class='PhoneInputInput']")
    WebElement enterPhonenumber;

    @FindBy(id = "email")
    WebElement enteremail;

    @FindBy(id = "totalExperience")
    WebElement enterExperience;

    @FindBy(id = "country")
    WebElement enterCountry;

    @FindBy(id = "state")
    WebElement enterState;

    @FindBy(id = "city")
    WebElement enterCity;

    @FindBy(id = "postalCode")
    WebElement enterPostalcode;

    @FindBy(id = "react-select-2-input")
    WebElement enterInterviewSkills;

    @FindBy(id = "int-save-btn")
    WebElement enterSubmit;

    @FindBy(xpath = "//button[@class='modalBtn ']")
    WebElement clickOk;

    public void setUserinput(String user) {
        username.sendKeys("Admin");
    }

    public void setUserPassword(String pwd) {
        password.sendKeys("123456");
    }

    public void getClik() {
        ClickLogin.click();

    }

    public void GetfirstName(String firstname) {
        enterFirstName.sendKeys("ramani");
    }

    public void GetLastName(String lastname) {
        enterLastName.sendKeys("raju");

    }

    public void getClient() {
        Select select = new Select(enterClient);
        select.selectByIndex(1);
    }

    public void GetPhonenumber(String number) {
        enterPhonenumber.sendKeys("6365656677");
    }

    public void GetEnterEmail(String email) {
        enteremail.sendKeys("ramaniraju@gmail.com");
    }

    public void Getexperience(String experience) {
        enterExperience.sendKeys("2");
    }

    public void Getcountry() {
        Select select = new Select(enterCountry);
        select.selectByVisibleText("United States");
    }

    public void GetState() {
        Select select = new Select(enterState);
        select.selectByVisibleText("California");
    }

    public void GetCity() {
        Select select = new Select(enterCity);
        select.selectByVisibleText("Acton");
    }

    public void GetPostalcode(String postalCode) {
        enterPostalcode.sendKeys("290808");
    }

    public void GetInterviewSkills(String skills) {
        enterInterviewSkills.sendKeys("Java");
    }

    public void GetSubmit() {
        enterSubmit.click();
    }

    public void GetClickOk() {
        clickOk.click();
    }
}
