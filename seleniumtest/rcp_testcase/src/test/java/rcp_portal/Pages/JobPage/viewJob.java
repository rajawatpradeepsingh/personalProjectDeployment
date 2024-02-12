package rcp_portal.Pages.JobPage;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class viewJob {

    WebDriver driver;

    public viewJob(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    @FindBy(id = "name")
    WebElement username;

    @FindBy(id = "password")
    WebElement password;

    @FindBy(id = "login")
    WebElement ClickLogin;

    @FindBy(xpath = "//input[@class='check']")
    List<WebElement> ClickRow;

    @FindBy(className = "trashcan")
    WebElement clickDeletebutton;

    @FindBy(xpath = "//button[@class='MuiButton-root MuiButton-outlined MuiButton-outlinedWarning MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButtonBase-root  css-5rgykb-MuiButtonBase-root-MuiButton-root']")
    List<WebElement> clickDelete;

    @FindBy(xpath = "//button[@class='MuiButton-root MuiButton-outlined MuiButton-outlinedWarning MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButtonBase-root  css-5rgykb-MuiButtonBase-root-MuiButton-root']")
    List<WebElement> clickCancel;

    @FindBy(xpath = "(//button[@class='editBtn'])[1]")
    WebElement ClickEditButton;

    @FindBy(id = "jobTitle")
    WebElement EnterJobTitle;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[4]")
    WebElement selectJobType;

    @FindBy(id = "noOfJobopenings")
    WebElement EnterNoOfOpenings;

    @FindBy(xpath = "(//select[@class='select-dropdown']) [1]")
    WebElement selectWorkType;

    @FindBy(className = "list-container")
    List<WebElement> selectCurrencyType;

    @FindBy(xpath = "//input[@class=' currency-input']")
    WebElement EnterBillRate;

    @FindBy(id = "hiringManager")
    WebElement enterHiringManager;

    @FindBy(xpath = "(//select[@class='select-dropdown']) [2]")
    WebElement selectPriority;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[5]")
    WebElement selectFLSAType;

    @FindBy(id = "status")
    WebElement SelectStatus;

    @FindBy(id = "client")
    WebElement selectClient;

    @FindBy(id = "jobDescription")
    WebElement enterDescription;

    @FindBy(id = "country")
    WebElement enterCountry;

    @FindBy(id = "state")
    WebElement enterState;

    @FindBy(id = "city")
    WebElement enterCity;

    @FindBy(id = "postalCode")
    WebElement enterPostalCode;

    @FindBy(xpath = "//button[@class='edit-modal-btn mod-btn-submit']")
    WebElement ClickSave;

    @FindBy(xpath = "//button[@class='edit-modal-btn mod-btn-reset']")
    WebElement ClickReset;

    @FindBy(xpath = "//button[@class='outline filter archive btn']")
    WebElement ClickFilter;

    @FindBy(xpath = "(//label[@class='MuiFormControlLabel-root MuiFormControlLabel-labelPlacementEnd css-j204z7-MuiFormControlLabel-root'])[1]")
    WebElement ClickClientInFilter;

    @FindBy(xpath = "//select[@class='filter-dropdown select-dropdown']")
    WebElement SelectClientFromFilter;

    @FindBy(xpath = "(//label[@class='MuiFormControlLabel-root MuiFormControlLabel-labelPlacementEnd css-j204z7-MuiFormControlLabel-root'])[2]")
    WebElement ClickPriorityInFilter;

    @FindBy(xpath = "//select[@name='priority']")
    WebElement SelectPriorityFromFilter;

    @FindBy(xpath = "(//label[@class='MuiFormControlLabel-root MuiFormControlLabel-labelPlacementEnd css-j204z7-MuiFormControlLabel-root'])[3]")
    WebElement ClickStatusInFilter;

    @FindBy(xpath = "//select[@name='status']")
    WebElement SelectStatusFromFilter;

    @FindBy(xpath = "//button[@class='outline warning small reset-filters btn']")
    WebElement clickResetFromFilter;

    @FindBy(xpath = "//button[@class='drawer-close btn']")
    WebElement ClickCloseFilter;

    @FindBy(xpath = "(//button[@class='outline archive btn'])[2]")
    WebElement ClickOnReportFilter;

    @FindBy(xpath = "(//button[@class='outline small reports selected btn'])")
    WebElement ClickCSVFormat;

    @FindBy(xpath = "//select[@class='report-select-options']")
    WebElement ClickCSVDefaultFormat;

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

    public void GetClickRow() {
        ClickRow.get(0).click();
    }

    public void GetclickDeletebutton() {
        clickDeletebutton.click();
    }

    public void GetClickDelete() {
        clickDelete.get(0).click();
    }

    public void GetClickCancel() {
        clickCancel.get(0).click();
    }

    public void GetEditButton() {
        ClickEditButton.click();
    }

    public void GetEnterJobTitle(String jobTitle) {
        EnterJobTitle.clear();
        EnterJobTitle.sendKeys("Hiring manager");
    }

    public void GetSelectJobType() {
        Select select = new Select(selectJobType);
        select.selectByIndex(1);
    }

    public void GetEnterNumberOfOpenings(String noOfOpenings) {
        EnterNoOfOpenings.sendKeys("1");
    }

    public void GetSelectWorkType() {
        Select select = new Select(selectWorkType);
        select.selectByIndex(2);
    }

    public void GetSelectFromCurrencyType() {
        selectCurrencyType.get(4).click();
    }

    public void GetEnterBillRate(String billRate) {
        EnterBillRate.sendKeys("7600.76");
    }

    public void GetEnterHiringManager(String hiringManager) {
        enterHiringManager.sendKeys("Praveen");
    }

    public void GetSelectPriority() {
        Select select = new Select(selectPriority);
        select.selectByIndex(2);
    }

    public void GetSelectFLSAType() {
        Select select = new Select(selectFLSAType);
        select.selectByIndex(2);
    }

    public void GetStatus() {
        Select select = new Select(SelectStatus);
        select.selectByIndex(1);
    }

    public void GetEnterClient() {
        Select select = new Select(selectClient);
        select.selectByIndex(2);
    }

    public void GetEnterDescription(String desc) {
        enterDescription.clear();
        enterDescription.sendKeys("f4446q66577878909090-99787w88w989@#$%^&*()_");
    }

    // public void GetEnterCountry(String Country) {
    // enterCountry.clear();
    // enterCountry.sendKeys("India");
    // }

    // public void GetEnterState(String state) {
    // enterState.clear();
    // enterState.sendKeys("TamilNAdu");

    // }

    // public void GetEnterCity(String city) {
    // enterCity.clear();
    // enterCity.sendKeys("Chennai");

    // }

    // public void GetPostalCode(String PostalCode) {
    // enterPostalCode.sendKeys("12345");
    // }

    public void GetClickSave() {
        ClickSave.click();
    }

    public void GetClickReset() {
        ClickReset.click();
    }

    public void GetClickFilter() {
        ClickFilter.click();
    }

    public void GetClickClientInFilter() {
        ClickClientInFilter.click();
    }

    public void GetSelectClientFromFilter() {
        Select select = new Select(SelectClientFromFilter);
        select.selectByIndex(3);
    }

    public void GetClickPriorityFromFilter() {
        ClickPriorityInFilter.click();
    }

    public void GetSelectPriorityFromFilter() {
        Select select = new Select(SelectPriorityFromFilter);
        select.selectByIndex(2);
    }

    public void GetClickStatusFromFilter() {
        ClickStatusInFilter.click();
    }

    public void GetSelectStatusFromFilter() {
        Select select = new Select(SelectStatusFromFilter);
        select.selectByIndex(2);
    }

    public void GetClickResetFronFilter() {
        clickResetFromFilter.click();
    }

    public void GetClickCloseFilter() {
        ClickCloseFilter.click();
    }

    public void GetClickOnReportFilter() {
        ClickOnReportFilter.click();
    }

}
