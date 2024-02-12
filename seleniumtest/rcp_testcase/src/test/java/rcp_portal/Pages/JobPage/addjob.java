package rcp_portal.Pages.JobPage;

import java.util.List;

import javax.crypto.SealedObject;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

import io.github.bonigarcia.wdm.WebDriverManager;
import net.bytebuddy.asm.Advice.Enter;

public class addjob {

    WebDriver driver;

    public addjob(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    @FindBy(id = "name")
    WebElement username;

    @FindBy(id = "password")
    WebElement password;

    @FindBy(id = "login")
    WebElement ClickLogin;

    @FindBy(id = "jobTitle")
    WebElement EnterJobTitle;

    @FindBy(id = "noOfJobopenings")
    WebElement EnterNoOfOpenings;

    @FindBy(className = "list-container")
    List<WebElement> selectCurrencyType;

    @FindBy(xpath = "//input[@class=' currency-input']")
    WebElement EnterBillRate;

    @FindBy(xpath = "(//select[@class='select-dropdown']) [1]")
    WebElement selectWorkType;

    @FindBy(xpath = "(//select[@class='select-dropdown']) [2]")
    WebElement selectPriority;

    @FindBy(id = "hiringManager")
    WebElement enterHiringManager;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[3]")
    WebElement selectClient;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[4]")
    WebElement selectJobType;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[5]")
    WebElement selectFLSAType;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[6]")
    WebElement selectTaxType;

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

    @FindBy(css = "input[type='submit']")
    WebElement clickSubmit;

    @FindBy(css = "input[type='reset']")
    WebElement clickReset;

    @FindBy(xpath = "//button[@class='modalBtn ']")
    WebElement clickSaveOk;

    @FindBy(xpath = "//button[@class='modalBtn modal-btn-err']")
    WebElement CliCkDuplicateGenerationOk;

    public void setUserinput(String user) {
        username.sendKeys("Admin");
    }

    public void setUserPassword(String pwd) {
        password.sendKeys("123456");
    }

    public void getClik() {
        ClickLogin.click();

    }

    public void GetEnterJobTitle(String jobTitle) {
        EnterJobTitle.sendKeys("frontend developer");
    }

    public void GetEnterNumberOfOpenings(String noOfOpenings) {
        EnterNoOfOpenings.sendKeys("5");
    }

    public void GetSelectFromCurrencyType() {
        selectCurrencyType.get(4).click();
    }

    public void GetEnterBillRate(String billRate) {
        EnterBillRate.sendKeys("6000.76");
    }

    public void GetSelectWorkType() {
        Select select = new Select(selectWorkType);
        select.selectByIndex(3);
    }

    public void GetSelectPriority() {
        Select select = new Select(selectPriority);
        select.selectByIndex(1);
    }

    public void GetEnterHiringManager(String hiringManager) {
        enterHiringManager.sendKeys("sam");
    }

    public void GetEnterClient() {
        Select select = new Select(selectClient);
        select.selectByIndex(1);
    }

    public void GetSelectJobType() {
        Select select = new Select(selectJobType);
        select.selectByIndex(1);
    }

    public void GetSelectFLSAType() {
        Select select = new Select(selectFLSAType);
        select.selectByIndex(1);
    }

    public void GetSelectTaxType() {
        Select select = new Select(selectTaxType);
        select.selectByIndex(1);
    }

    public void GetEnterDescription(String desc) {
        enterDescription.sendKeys(
                "ghjdgk;sxkaAAHDXUKW124344258767HDGASDAHSVDHJXVADSJHJASVXHSVGCVASHCHJGCHJASVCHJACHJVCHDVGJCHJCVVHJDGCHJASBCHDGCKASVCHAGFKAWSHDXKJDILUQEDY37I47390829W8TE37TRI3UHCBMNZX M,XKANCJKDSVCHD MNM,MSDNBCJKDSVHJ Mz XM,AMBXHDVCHJDS ZXM M,XJDSVBBC N NDB NMCX CXN SAMNMX.kaMS/,K.CNCJ,DBCSJFJKESNM,SSNMDVCHVASJSZXJSA");
    }

    public void GetEnterCountry(String Country) {
        enterCountry.sendKeys("Australia");
    }

    public void GetEnterState(String state) {
        enterState.sendKeys("Australia");
    }

    public void GetEnterCity(String city) {
        enterCity.sendKeys("123456");

    }

    public void GetPostalCode(String PostalCode) {
        enterPostalCode.sendKeys("12345");
    }

    public void GetClickSubmit() {
        clickSubmit.click();
    }

    public void GetClickReset() {
        clickReset.click();
    }

    public void GetClickSaveOk() {
        clickSaveOk.click();

    }

    public void GetCliCkDuplicateGenerationOk() {
        CliCkDuplicateGenerationOk.click();
    }
}
