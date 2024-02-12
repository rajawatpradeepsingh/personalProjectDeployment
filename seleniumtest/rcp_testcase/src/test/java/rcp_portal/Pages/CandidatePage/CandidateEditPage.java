package rcp_portal.Pages.CandidatePage;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

public class CandidateEditPage {

    WebDriver driver;

    public CandidateEditPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    @FindBy(id = "name")
    WebElement username;

    @FindBy(id = "password")
    WebElement password;

    @FindBy(id = "login")
    WebElement ClickLogin;

    @FindBy(xpath = "(//button[@class='more-btn'])[1]")
    WebElement ClickEditButton;

    @FindBy(xpath = "//button[@class='outline edit-btn btn']")
    WebElement ClickEdit;

    @FindBy(id = "firstName")
    WebElement enterFirstName;

    @FindBy(id = "lastName")
    WebElement enterLastName;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[1]")
    WebElement selectRecruitment;

    @FindBy(id = "email")
    WebElement editEmail;

    @FindBy(css = "input[type='tel']")
    WebElement editPhoneNumber;

    @FindBy(id = "linkedinProfile")
    WebElement editLinkedInProfile;

    @FindBy(id = "portfolioProfile")
    WebElement editPortfolioProfile;

    @FindBy(id = "workAuthStatus")
    WebElement EditStatus;

    @FindBy(id = "gender")
    WebElement EditGender;

    @FindBy(xpath = "//button[@class='edit-modal-btn mod-btn-submit']")
    WebElement saveAllChanges;

    @FindBy(xpath = "//button[@class='edit-modal-btn mod-btn-reset']")
    WebElement cancelAllChanges;

    @FindBy(xpath = "//button[@class='modal-nav-btn modal-nav-btn-undefined create-form-btn']")
    WebElement clickEditAddressButton;

    @FindBy(xpath = "(//select[@class='select-dropdown']) [1]")
    WebElement ClickEditCountry;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[2]")
    WebElement ClickEditState;

    @FindBy(id = "city")
    WebElement ClickEditCity;

    @FindBy(id = "city")
    WebElement ClickEditEnterCityIfCityIsNotListed;

    @FindBy(xpath = "//button[@class='edit-modal-btn mod-btn-submit']")
    WebElement saveAllChangesinAddress;

    @FindBy(xpath = "//button[@class='edit-modal-btn mod-btn-reset']")
    WebElement cancelAllChangesinAddress;

    @FindBy(name = "Professional Details")
    WebElement ClickEditProfessionalDetails;

    @FindBy(id = "totalExperience")
    WebElement EnterTotalExperienceinEditProfessionalDetails;

    @FindBy(id = "relevantExperience")
    WebElement EnterReveleventExperienceinEditProfessionalDetails;

    @FindBy(id = "currentJobTitle")
    WebElement EnterJobTitleinEditProfessionalDetails;

    @FindBy(id = "currentEmployer")
    WebElement EnterEmployerinEditProfessionalDetails;

    @FindBy(id = "replace-resume-invisible")
    WebElement ChooseEditResume;

    @FindBy(xpath = "(//*[@class='btn-replace-resume'])[1]")
    WebElement ChooseDeleteResume;

    @FindBy(xpath = "(//*[@class='btn-replace-resume'])[2]")
    WebElement ChooseReplaceResume;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[1]")
    WebElement EditOffer;

    @FindBy(id = "reasonForJobChange")
    WebElement EnterEditReason;

    @FindBy(xpath = "(//div[@class=' css-tlfecz-indicatorContainer'])[1]")
    WebElement EnterEditPrimarySkills;

    @FindBy(xpath = "(//div[@class=' css-tlfecz-indicatorContainer'])[2]")
    WebElement EnterEditSecondarySkills;

    @FindBy(id = "noticePeriodCount")
    WebElement EnterEditNoticePeriod;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[2]")
    WebElement EnterEdittimeWeeksOrMonths;

    @FindBy(xpath = "(//select[@class='stacked select-dropdown'])[2]")
    WebElement SelectEditCurrentCTC;

    @FindBy(id = "currentCtcValue")
    WebElement TypeEditCurrentCTC;

    @FindBy(id = "currentCtcCurrency")
    WebElement SelectEditCurrencyType;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[2]")
    WebElement SelectEditTaxType;

    @FindBy(id = "expectedCtcType")
    WebElement SelectEditExpectedCTC;

    @FindBy(id = "expectedCtcValue")
    WebElement TypeEditExpectedCTC;

    @FindBy(id = "expectedCtcCurrency")
    WebElement SelectEditExpectedCurrency;

    @FindBy(id = "expectedCtcTax")
    WebElement SelectEditExpectedTax;

    @FindBy(xpath = "//button[@class='submit large btn']")
    WebElement saveAllChangesinProfessionalDetails;

    @FindBy(xpath = "//button[@class='warning btn']")
    WebElement cancelAllChangesinProfessionalDetails;

    @FindBy(xpath = "(//div[@class='nav-wrap'])[4]")
    WebElement ClickEditStatusAndComments;

    @FindBy(id = "status")
    WebElement ClickEditStatus;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[2]")
    WebElement ClickJobTypefromdropdown;

    @FindBy(id = "activity")
    WebElement ClickJobType;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[3]")
    WebElement ClickEditClientName;

    @FindBy(id = "clientName")
    WebElement selectClientName;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[4]")
    WebElement ClickJobOpening;

    @FindBy(id = "manager")
    WebElement selectJobOpening;

    @FindBy(xpath = "//textarea[@class='textarea']")
    WebElement ClickEditComment;

    @FindBy(id = "isSuspicious")
    WebElement ClickFlag;

    @FindBy(xpath = "//button[@class='submit large btn']")
    WebElement ClickSaveChangesInStatusAndComments;

    @FindBy(xpath = "//button[@class='warning btn']")
    WebElement ClickCancelAllChangesInStatusAndComments;

    @FindBy(xpath = "//button[@class='modal-nav-btn create-form-btn']")
    WebElement ClickActivity;

    @FindBy(xpath = "//button[@class='submit large btn']")
    WebElement SaveActivity;

    @FindBy(xpath = "//button[@class='warning btn']")
    WebElement CancelActivity;

    public void setUserinput(String user) {
        username.sendKeys("Admin");
    }

    public void setUserPassword(String pwd) {
        password.sendKeys("123456");
    }

    public void getClik() {
        ClickLogin.click();
    }

    public void GetEditButton() {
        ClickEditButton.click();
    }

    public void GetClickEdit() {
        ClickEdit.click();
    }

    public void GetFirstName(String firstName) {
        enterFirstName.clear();
        enterFirstName.sendKeys("CNA");
    }

    public void GetLastName(String lastname) {
        enterLastName.clear();
        enterLastName.sendKeys("ajay");
    }

    public void GetSelectRecruitment() {
        Select select = new Select(selectRecruitment);
        select.selectByIndex(0);
    }

    public void GetEditEmail(String email) {
        editEmail.clear();
        editEmail.sendKeys("cnajay@gmail.com");
    }

    public void GetEditPhoneNumber(String PhoneNo) {
        editPhoneNumber.sendKeys("5756787688");
    }

    public void GetEditLinkedInProfile(String LinkedIn) {
        editLinkedInProfile.clear();
        editLinkedInProfile.sendKeys("xxx.LinkedIn");
    }

    public void GetEditPortfolioProfile(String portFolio) {
        editPortfolioProfile.clear();
        editPortfolioProfile.sendKeys("xyz.com");
    }

    public void GetEditStatus() {
        Select select = new Select(EditStatus);
        select.selectByIndex(6);

    }

    public void GetEditGender() {
        Select select = new Select(EditGender);
        select.selectByIndex(1);
    }

    public void GetSaveAllChanges() {
        saveAllChanges.click();
    }
    // public void GetCancelAllChanges(){
    // cancelAllChanges.click();
    // }

    public void GetClickEditAddressButton() {
        clickEditAddressButton.click();
    }

    public void GetclickEditCountry() {
        Select select = new Select(ClickEditCountry);
        select.selectByVisibleText("India");
    }

    public void GetclickEditState() {
        Select select = new Select(ClickEditState);
        select.selectByIndex(20);
    }

    public void GetclickEditCity() {
        Select select = new Select(ClickEditCity);
        select.selectByIndex(10);

    }

    // public void GetEditCityIfNotListed(String city){
    // ClickEditEnterCityIfCityIsNotListed.clear();
    // ClickEditEnterCityIfCityIsNotListed.sendKeys("Amarwara");
    // }
    public void GetSaveAllChangesInAddress() {
        saveAllChangesinAddress.click();
    }
    // public void GetCancelAllInAddressChanges(){
    // cancelAllChangesinAddress.click();
    // }

    public void GetClickEditProfessionalDetails() {
        ClickEditProfessionalDetails.click();
    }

    public void GetEditTotalExperience(String experience) {
        EnterTotalExperienceinEditProfessionalDetails.clear();
        EnterTotalExperienceinEditProfessionalDetails.sendKeys("7.3");
    }

    public void GetEditReleventExperience(String Relevent) {
        EnterReveleventExperienceinEditProfessionalDetails.clear();
        EnterReveleventExperienceinEditProfessionalDetails.sendKeys("5.4");
    }

    public void GetEditJobTitle(String title) {
        EnterJobTitleinEditProfessionalDetails.clear();
        EnterJobTitleinEditProfessionalDetails.sendKeys("Tester");
    }

    public void GetEditEmployer(String Employer) {
        EnterEmployerinEditProfessionalDetails.clear();
        EnterEmployerinEditProfessionalDetails.sendKeys("GAP");
    }

    public void GetEditUploadFile(String file) {
        // ChooseEditResume.clear();
        ChooseEditResume.sendKeys("C:/Users/nrupi/Downloads");
    }

    public void GetChooseDeleteResume() {
        ChooseDeleteResume.click();

    }
    // public void GetChooseReplaceResume(){
    // ChooseReplaceResume.click();
    // WebDriverWait wait = new WebDriverWait(driver, 10);
    // ChooseReplaceResume.sendKeys("C:/Users/nrupi/OneDrive/Desktop/New folder");
    // }

    public void GetEditOffer() {
        Select select = new Select(EditOffer);
        select.selectByIndex(1);
    }

    public void GetEditReasonForJobChange(String Reason) {
        EnterEditReason.sendKeys("want to switch my carrier");
    }

    public void GetEditPrimarySkills() {
        EnterEditPrimarySkills.click();
    }

    public void GetEditSecondarySkills() {
        EnterEditSecondarySkills.click();
    }

    public void GetEditNoticeperiod(String Noticeperiod) {
        EnterEditNoticePeriod.clear();
        EnterEditNoticePeriod.sendKeys("6");
    }

    public void GetEditMothsOrWeeks() {
        Select select = new Select(EnterEdittimeWeeksOrMonths);
        select.selectByIndex(1);
    }

    public void GetEditSelectCurrentCTC() {
        Select select = new Select(SelectEditCurrentCTC);
        select.selectByIndex(1);
    }

    public void GetEditTypeCurrentCTC(String CurrentCTC) {
        TypeEditCurrentCTC.clear();
        TypeEditCurrentCTC.sendKeys("20");
    }

    public void GetEditSelectCurrencyType() {
        Select select = new Select(SelectEditCurrencyType);
        select.selectByIndex(1);
    }

    public void GetEditTaxType() {
        Select select = new Select(SelectEditTaxType);
        select.selectByIndex(1);
    }

    public void GetEditSelectExpectedCTC() {
        Select select = new Select(SelectEditExpectedCTC);
        select.selectByIndex(2);
    }

    public void GetTypeExpectedCTC() {
        TypeEditExpectedCTC.clear();
        TypeEditExpectedCTC.sendKeys("15");
    }

    public void GetEditExpectedCurrencyType() {
        Select select = new Select(SelectEditExpectedCurrency);
        select.selectByIndex(0);
    }

    public void GetSelectEditExpectedTax() {
        Select select = new Select(SelectEditExpectedTax);
        select.selectByIndex(1);
    }

    public void GetSaveAllChangesinProfessionalDetails() {
        saveAllChangesinProfessionalDetails.click();
    }
    // public void GetCancelAllChangesinProfessionalDetails(){
    // cancelAllChangesinProfessionalDetails.click();
    // }

    public void GetClickStatusAndcomments() {
        ClickEditStatusAndComments.click();
    }

    public void GetClickEditStatus() {
        Select select = new Select(ClickEditStatus);
        // select.selectByIndex(1);
        select.selectByIndex(2);
    }

    public void GetClickJobTypefromdropdown() {
        ClickJobTypefromdropdown.click();

    }

    public void GetClickJobType() {
        Select select = new Select(ClickJobType);
        select.selectByIndex(2);

    }

    public void GetClickEditClientName() {
        ClickEditClientName.click();

    }

    public void GetselectClientName() {
        Select select = new Select(selectClientName);
        select.selectByIndex(0);
    }

    public void GetClickJobOpening() {
        ClickJobOpening.click();
    }

    public void GetselectJobOpening() {
        Select select = new Select(selectJobOpening);
        select.selectByIndex(0);
    }

    public void GetClickEditComment(String status) {
        ClickEditComment.clear();
        ClickEditComment.sendKeys("new resume");
        // ClickEditComment.click();
    }

    public void GetClickFlag() {
        ClickFlag.click();
        // ClickFlag.click();
    }

    public void GetSaveChangesInStatusAndComments() {
        ClickSaveChangesInStatusAndComments.submit();
    }

    // public void GetCancelAllChangesInStatusAndComments() {
    // ClickCancelAllChangesInStatusAndComments.click();
    // }

    public void GetClickActivity() {
        ClickActivity.click();
    }

    public void GetSaveActivity() {
        SaveActivity.submit();
    }

    public void GetCancelActivity() {
        CancelActivity.submit();
    }

}
