package rcp_portal.Pages.CandidatePage;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class addCandidate {

    WebDriver driver;

    public addCandidate(WebDriver driver) {
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

    @FindBy(id = "email")
    WebElement enterEmail;

    @FindBy(xpath = "//input[@class='PhoneInputInput']")
    WebElement EnterPhoneNumber;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[1]")
    WebElement SelectGender;

    @FindBy(id = "workAuthStatus")
    WebElement SelectWorkStatus;

    @FindBy(id = "linkedinProfile")
    WebElement enterLinkedInProfile;

    @FindBy(id = "portfolioProfile")
    WebElement enterPortfolioLink;

    @FindBy(id = "source")
    WebElement selectSource;

    @FindBy(xpath = "//button[@class='btn-slider outline next btn']")
    WebElement ClickNextButton;

    // @FindBy(xpath = "//button[@class='outline warning btn']")
    // WebElement ClickReset;

    @FindBy(xpath = "(//select[@class='select-dropdown']) [1]")
    WebElement ClickCountry;

    @FindBy(xpath = "(//select[@class='select-dropdown']) [2]")
    WebElement ClickState;

    @FindBy(id = "city")
    WebElement ClickCity;

    // @FindBy(xpath = "//button[@class='outline submit large btn']")
    // WebElement ClickSubmit;

    @FindBy(xpath = "//button[@class='btn-slider outline next btn']")
    WebElement ClickAddressNextButton;

    @FindBy(id = "totalExperience")
    WebElement EnterTotalExperience;

    @FindBy(id = "relevantExperience")
    WebElement EnterReveleventExperience;

    @FindBy(id = "currentJobTitle")
    WebElement EnterJobTitle;

    @FindBy(id = "currentEmployer")
    WebElement EnterEmployer;

    @FindBy(id = "file")
    WebElement ChooseResume;

    @FindBy(id = "reasonForJobChange")
    WebElement EnterReason;

    @FindBy(xpath = "(//div[@class=' css-tlfecz-indicatorContainer'])[1]")
    WebElement EnterPrimarySkills;

    @FindBy(xpath = "(//div[@class=' css-1h1u5b-ValueContainer'])[1]")
    WebElement SelectListFromPrimary;

    @FindBy(xpath = "(//div[@class=' css-tlfecz-indicatorContainer'])[2]")
    WebElement EnterSecondarySkills;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[1]")
    WebElement SelectOffer;

    @FindBy(xpath = "(//input[@class='stacked input-field'])[1]")
    WebElement EnterNoticePeriod;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[2]")
    WebElement EntertimeWeeksOrMonths;

    @FindBy(xpath = "(//select[@class='stacked select-dropdown'])[1]")
    WebElement SelectCurrentCTC;

    @FindBy(xpath = "(//input[@class='stacked input-field'])[2]")
    WebElement TypeCurrentCTC;

    @FindBy(xpath = "(//select[@class='stacked select-dropdown'])[2]")
    WebElement SelectCurrencyType;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[3]")
    WebElement SelectTaxType;

    @FindBy(xpath = "(//select[@class='stacked select-dropdown'])[3]")
    WebElement SelectExpectedCTC;

    @FindBy(xpath = "(//input[@class='stacked input-field'])[3]")
    WebElement TypeExpectedCTC;

    @FindBy(xpath = "(//select[@class='stacked select-dropdown'])[4]")
    WebElement SelectExpectedCurrency;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[4]")
    WebElement SelectExpectedTaxType;

    // @FindBy(xpath = "//button[@class='outline submit large btn']")
    // WebElement ClickSubmitProfessionalDetails;

    // @FindBy(xpath = "(//button[@class='outline warning btn'])[1]")
    // WebElement ClickResetProfessionDetails;

    // @FindBy(xpath="(//button[@class='btn-slider outline btn'])[1]")
    // WebElement SelectPreviousButton;

    @FindBy(xpath = "//button[@class='btn-slider outline next btn']")
    WebElement ClickprofessionalNextButton;

    @FindBy(xpath = "//textarea[@class='textarea full-width']")
    WebElement WriteComment;

    @FindBy(xpath = "(//button[@class='btn-slider outline btn'])[1]")
    WebElement SelectCommentPreviousButton;

    @FindBy(xpath = "//button[@class='outline submit large btn']")
    WebElement ClickSubmit;

    // @FindBy(xpath = "//button[@class='outline warning btn']")
    // WebElement ClickCommentsReset;

    @FindBy(xpath = "//button[@class='modalBtn ']")
    WebElement ClickOk;

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
        enterFirstName.sendKeys("raghuman");
    }

    public void GetLastName(String lastname) {
        enterLastName.sendKeys("raghu");
    }

    public void GetEnterEmail(String Email) {
        enterEmail.sendKeys("raghumanraghu123@gmail.com");
    }

    public void GetEnterPhoneNumber(String phonenumber) {
        EnterPhoneNumber.sendKeys("657 989 8989");
    }

    public void GetGender() {
        Select select = new Select(SelectGender);
        select.selectByIndex(1);
    }

    public void GetWorkStatus() {
        Select select = new Select(SelectWorkStatus);
        select.selectByIndex(3);
    }

    public void GetLinkedInProfile(String Linkedin) {
        enterLinkedInProfile.sendKeys("raghumanraghu.linkedin");
    }

    public void GetPortfolioLink(String portfolio) {
        enterPortfolioLink.sendKeys("raghumanraghu desinger");
    }

    public void GetSelectSource() {
        Select select = new Select(selectSource);
        select.selectByIndex(3);

    }

    public void GetClickNext() {
        ClickNextButton.click();
    }

    // public void GetClickReset(){
    // ClickReset.click();
    // }
    public void GetclickCountry() {
        Select select = new Select(ClickCountry);
        select.selectByVisibleText("United States");
    }

    public void GetclickState() {
        Select select = new Select(ClickState);
        select.selectByVisibleText("Arizona");
    }

    public void GetEnterCity() {
        Select select = new Select(ClickCity);
        select.selectByIndex(10);

    }

    // public void GetClickSubmit(){
    // ClickSubmit.click();
    // }
    public void GetAddressNextButton() {
        ClickAddressNextButton.click();
    }

    public void GetTotalExperience(String experience) {
        EnterTotalExperience.sendKeys("3");
    }

    public void GetReleventExperience(String Relevent) {
        EnterReveleventExperience.sendKeys("3");
    }

    public void GetJobTitle(String title) {
        EnterJobTitle.sendKeys("Java");
    }

    public void GetEmployer(String Employer) {
        EnterEmployer.sendKeys("Gap");
    }

    public void GetChooseFile(String ChooseFile) {
        ChooseResume.sendKeys("C:/Users/nrupi/Downloads");
    }

    public void GetReasonForJobChange(String Reason) {
        EnterReason.sendKeys("want to change in different sector");
    }

    public void GetPrimarySkills() {
        EnterPrimarySkills.click();
        EnterPrimarySkills.sendKeys("Selenium");

        // EnterPrimarySkills.getCssValue("arg0");
    }

    // public void GetSelectListFromPrimary(){
    // driver.findElement(by.)
    // }
    // public void GetSecondarySkills() {
    // EnterSecondarySkills.click();
    // }

    public void GetSelectOffer() {
        Select select = new Select(SelectOffer);
        select.selectByIndex(1);
    }

    public void GetNoticeperiod(String Noticeperiod) {
        EnterNoticePeriod.sendKeys("3");
    }

    public void GetMothsOrWeeks() {
        Select select = new Select(EntertimeWeeksOrMonths);
        select.selectByIndex(0);
    }

    public void GetSelectCurrentCTC() {
        Select select = new Select(SelectCurrentCTC);
        select.selectByIndex(0);
    }

    public void GetTypeCurrentCTC(String CurrentCTC) {
        TypeCurrentCTC.sendKeys("10");
    }

    public void GetSelectCurrencyType() {
        Select select = new Select(SelectCurrencyType);
        select.selectByIndex(2);
    }

    public void GetTaxType() {
        Select select = new Select(SelectTaxType);
        select.selectByIndex(2);
    }

    public void GetSelectExpectedCTC() {
        Select select = new Select(SelectExpectedCTC);
        select.selectByIndex(0);
    }

    public void GetTypeExpectedCTC() {
        TypeExpectedCTC.sendKeys("15");
    }

    public void GetExpectedCurrencyType() {
        Select select = new Select(SelectExpectedCurrency);
        select.selectByIndex(0);
    }

    public void GetExpectedTaxType() {
        Select select = new Select(SelectExpectedTaxType);
        select.selectByIndex(2);
    }
    // public void GetPreviousButton(){
    // SelectPreviousButton.click();
    // }

    // public void GetClickSubmitprofessionalDetails(){
    // ClickSubmitProfessionalDetails.click();
    // }

    // public void GetResetProfessionalDetails(){
    // ClickResetProfessionDetails.click();

    // }

    public void GetProfessionalDetailsNextButton() {
        ClickprofessionalNextButton.click();
    }

    public void GetWriteComment(String Comment) {
        WriteComment.sendKeys("given all information which is needed");
    }

    // public void GetCommentPreviousButton(){
    // SelectCommentPreviousButton.click();
    // }
    public void GetClickSubmit() {
        ClickSubmit.click();
    }

    // public void GetClickCommentReset(){
    // ClickCommentsReset.click();
    // }
    public void GetClickOk() {
        ClickOk.click();
    }

}
