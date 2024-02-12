package rcp_portal.Pages.Clientpage;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class createClient {

    WebDriver driver;

    public createClient(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    @FindBy(id = "name")
    WebElement username;

    @FindBy(id = "password")
    WebElement password;

    @FindBy(id = "login")
    WebElement ClickLogin;

    @FindBy(xpath = "(//input[@class='input-field'])[1]")
    WebElement EnterClientName;

    @FindBy(xpath = "(//select [@class='select-dropdown'])[1]")
    WebElement SelectCountry;

    @FindBy(xpath = "(//select [@class='select-dropdown'])[2]")
    WebElement SelectStateBysendingInputs;

    @FindBy(xpath = "(//select [@class='select-dropdown'])[2]")
    WebElement SelectState;

    @FindBy(id = "city")
    WebElement enterCity;

    @FindBy(id = "addressLine1")
    WebElement enterAddress;

    @FindBy(id = "addressLine2")
    WebElement enterAddress2;

    @FindBy(id = "postalCode")
    WebElement enterZipCode;

    @FindBy(id = "int-save-btn")
    WebElement pressSubmit;

    @FindBy(id = "int-reset-btn")
    WebElement pressReset;

    @FindBy(xpath = "//button[@class='modalBtn ']")
    WebElement ClickOk;

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

    public void GetClientName(String Clientname) {
        EnterClientName.sendKeys("Amazon");
    }

    public void GetSelectCountry() {
        Select select = new Select(SelectCountry);
        select.selectByIndex(6);
    }

    public void GetSelectStateBySendingInputs(String state) {
        SelectStateBysendingInputs.sendKeys("Ordino");
    }

    public void GetSelectState() {
        Select select = new Select(SelectState);
        select.selectByIndex(0);
    }

    public void GetCity(String city) {
        enterCity.sendKeys("Ordino");
    }

    public void GetEnterAddress(String Address) {
        enterAddress.sendKeys("no;2/A atlanta");
    }

    public void GetEnterAddress2(String Address2) {
        enterAddress2.sendKeys("Ordino");
    }

    public void GetEnterZipCode(String ZipCode) {
        enterZipCode.sendKeys("346587");
    }

    public void GetEnterSubmitButton() {
        pressSubmit.click();
    }

    // public void GetEnterResetButton(){
    // pressReset.click();
    // }

    public void GetClientsave() {
        ClickOk.click();
    }

    public void GetDuplicateGenerationOk() {
        CliCkDuplicateGenerationOk.click();
    }
}
