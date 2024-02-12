package rcp_portal.Pages.Clientpage;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class viewClient {

    WebDriver driver;

    public viewClient(WebDriver driver) {
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
    List<WebElement> ClickRow;

    @FindBy(className = "trashcan")
    WebElement clickDeletebutton;

    @FindBy(xpath = "//button[@class='MuiButton-root MuiButton-outlined MuiButton-outlinedWarning MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButtonBase-root  css-5rgykb-MuiButtonBase-root-MuiButton-root']")
    List<WebElement> clickDelete;

    @FindBy(xpath = "//button[@class='MuiButton-root MuiButton-outlined MuiButton-outlinedWarning MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButtonBase-root  css-5rgykb-MuiButtonBase-root-MuiButton-root']")
    List<WebElement> clickCancel;

    @FindBy(xpath = "(//button[@class='editBtn'])[1]")
    WebElement ClickEditButton;

    @FindBy(id = "clientName")
    WebElement EditClientName;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[1]")
    WebElement EditClientCountry;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[2]")
    WebElement EditState;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[2]")
    WebElement EditClientCountrywithoutState;

    @FindBy(xpath = "(//select[@class='select-dropdown'])[3]")
    WebElement Editcity;

    @FindBy(id = "city")
    WebElement EditClientCities;

    @FindBy(id = "addressLine1")
    WebElement EditAddress;

    @FindBy(id = "addressLine2")
    WebElement EditAddress2;

    @FindBy(id = "postalCode")
    WebElement EditPostalCode;

    @FindBy(xpath = "(//button[@class='edit-modal-btn mod-btn-submit'])")
    WebElement ClickSave;

    @FindBy(xpath = "(//button[@class='edit-modal-btn mod-btn-reset'])")
    WebElement ClickCancel;

    @FindBy(xpath = "//button[@class='outline filter archive btn']")
    WebElement ClickFilter;

    @FindBy(css = "input[class='PrivateSwitchBase-input css-1m9pwf3']")
    WebElement ClickClientFilter;

    @FindBy(xpath = "//select[@class='filter-dropdown select-dropdown']")
    WebElement selectClientFromDropDown;

    @FindBy(xpath = "//button[@class='outline warning small reset-filters btn']")
    WebElement ClickReset;

    @FindBy(xpath = "//button[@class='drawer-close btn']")
    WebElement CloseFilter;

    @FindBy(xpath = "(//button[@class='outline archive btn'])[1]")
    WebElement ClickArchive;

    @FindBy(name = "un-archive-btn")
    WebElement ClickUnarchive;

    @FindBy(xpath = "//button[@class='modal-close-btn']")
    WebElement ClickUnArchiveCloseButton;

    @FindBy(xpath = "(//button[@class='outline archive btn'])[2]")
    WebElement ClickReportsButton;

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
        clickCancel.get(1).click();
    }

    public void GetEditButton() {
        ClickEditButton.click();
    }

    public void GetEditClientName(String ClientName) {
        EditClientName.clear();
        EditClientName.sendKeys("wallmart");
    }

    public void GetEditCountry() {
        // ClickEditButton.clear();
        Select Select = new Select(EditClientCountry);
        Select.selectByIndex(14);
    }

    public void GetEditState() {
        Select select = new Select(EditState);
        select.selectByIndex(4);
    }

    public void GetEditCountryWithoutState(String state) {
        Select select = new Select(EditClientCountrywithoutState);
        select.selectByIndex(3);
    }

    public void GetselectCity() {
        Select select = new Select(Editcity);
        select.selectByIndex(2);
    }

    // public void GetEditCitiesIfThereIsNoCity() {
    // EditClientCities.sendKeys("Ordino");

    // }

    public void GetEditAddress(String Address) {
        EditAddress.clear();
        EditAddress.sendKeys("No;5/A North Avenue");
    }

    public void GetEditAddress2(String Address2) {
        EditAddress2.clear();
        EditAddress2.sendKeys("irvine");
    }

    public void GetEditPostalCode(String PostalCode) {
        EditPostalCode.clear();
        EditPostalCode.sendKeys("456328");
    }

    public void GetSave() {
        ClickSave.click();
    }

    public void GetCancel() {
        ClickCancel.click();
    }

    public void GetClickFilterButton() {
        ClickFilter.click();
    }

    public void GetClickClientFilter() {
        ClickClientFilter.click();
    }

    public void GetSelectFromDropDown() {
        Select select = new Select(selectClientFromDropDown);
        select.selectByIndex(1);
    }

    public void GetSelectReset() {
        ClickReset.click();
    }

    public void GetClickClosefilter() {
        CloseFilter.click();
    }

    public void GetClickArchieve() {
        ClickArchive.click();
    }

    public void GetClickUnarchive() {
        ClickUnarchive.click();
    }

    public void GetClickUnarchieveClosebutton() {
        ClickUnArchiveCloseButton.click();
    }

    public void GetClickReportsbutton() {
        ClickReportsButton.click();
    }
}
