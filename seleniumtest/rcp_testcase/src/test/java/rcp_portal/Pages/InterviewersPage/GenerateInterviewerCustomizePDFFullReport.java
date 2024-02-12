package rcp_portal.Pages.InterviewersPage;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class GenerateInterviewerCustomizePDFFullReport {

  WebDriver driver;

  public GenerateInterviewerCustomizePDFFullReport(WebDriver driver) {
    this.driver = driver;
    PageFactory.initElements(driver, this);

  }

  @FindBy(id = "name")
  WebElement username;

  @FindBy(id = "password")
  WebElement password;

  @FindBy(id = "login")
  WebElement ClickLogin;

  @FindBy(xpath = "(//button[@class='outline archive btn'])[2]")
  WebElement GenerateReport;

  @FindBy(xpath = "(//button[@class='outline small reports btn'])[2]")
  WebElement cliGeneratePDF;

  @FindBy(xpath = "(//select[@class='report-select-options'])[1]")
  WebElement CliStyleFullReport;

  @FindBy(xpath = "(//select[@class='report-select-options'])[2]")
  WebElement CliCustomize;

  @FindBy(className = "rdl-control")
  WebElement SelectCustomList;

  // @FindBy(xpath = "//button[@Class='rdl-move rdl-move-all rdl-move-right']")
  // WebElement CliSelectedAllRight;

  @FindBy(xpath = "//button[@Class='rdl-move rdl-move-right']")
  WebElement CliSelectedRight;

  @FindBy(className = "rdl-control")
  List<WebElement> DeselectlistFromRightToLeft;

  @FindBy(xpath = "//button[@Class='rdl-move rdl-move-left']")
  WebElement CliSelectedLeft;

  @FindBy(xpath = "//button[@class='generate-btn']")
  WebElement CliExportPDF;

  @FindBy(xpath = "//button[@class='download-btn']")
  WebElement CliDownloadPDF;

  // @FindBy(css="input[value='Reset']")
  // WebElement CliReset;

  public void setUserinput(String user) {
    username.sendKeys("Admin");
  }

  public void setUserPassword(String pwd) {
    password.sendKeys("123456");
  }

  public void getClik() {
    ClickLogin.click();
  }

  public void GetGenerateReport() {
    GenerateReport.click();
  }

  public void GetcliGenerateCustomizePDF() {
    cliGeneratePDF.click();
  }

  public void GetCliCustomize() {
    Select select = new Select(CliCustomize);
    select.selectByIndex(1);
  }

  public void GetCliStyleFullReport() {
    Select select = new Select(CliStyleFullReport);
    select.selectByIndex(0);
  }

  public void GetSelectCustomList() {
    Select select = new Select(SelectCustomList);
    select.selectByIndex(0);
    select.selectByIndex(2);
    select.selectByIndex(3);
    select.selectByIndex(4);
  }

  // public void GetCliSelectedAllRight(){
  // CliSelectedAllRight.click();
  // }

  public void GetCliSelcetedRight() {
    CliSelectedRight.click();
  }

  public void GetDeselectListFromRightToLeft() {
    DeselectlistFromRightToLeft.get(1).click();
  }

  public void GetCliSelectedLeft() {
    CliSelectedLeft.click();
  }

  public void GetCliExportPDF() {
    CliExportPDF.click();
  }

  public void GetCliDownloadPDF() {
    CliDownloadPDF.click();
  }

  // public void GetCliReset(){
  // CliReset.click();
  // }
}
