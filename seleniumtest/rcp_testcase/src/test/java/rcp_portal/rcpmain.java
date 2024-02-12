
package rcp_portal;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.Select;
import org.testng.Assert;

import io.github.bonigarcia.wdm.WebDriverManager;
import rcp_portal.Pages.CandidatePage.CandidateEditPage;
import rcp_portal.Pages.CandidatePage.GenerateCandidateCustomizeCSV;
import rcp_portal.Pages.CandidatePage.GenerateCandidateCustomizeExcel;
import rcp_portal.Pages.CandidatePage.GenerateCandidateCustomizePDFFullReport;
import rcp_portal.Pages.CandidatePage.GenerateCandidateCustomizePDFIndividualReport;
import rcp_portal.Pages.CandidatePage.GenerateCandidateDefaultExcel;
import rcp_portal.Pages.CandidatePage.GenerateCandidateDefaultPDF;
import rcp_portal.Pages.CandidatePage.GenerateCandidateDefaultPDFIndividualReport;
import rcp_portal.Pages.CandidatePage.GenerateCandidateReport;
import rcp_portal.Pages.CandidatePage.ViewCandidate;
import rcp_portal.Pages.CandidatePage.addCandidate;
import rcp_portal.Pages.Clientpage.GenerateClientCustomizeCSV;
import rcp_portal.Pages.Clientpage.GenerateClientCustomizeExcel;
import rcp_portal.Pages.Clientpage.GenerateClientCustomizePDFFullReport;
import rcp_portal.Pages.Clientpage.GenerateClientCustomizePDFIndividualReport;
import rcp_portal.Pages.Clientpage.GenerateClientDefaultExcel;
import rcp_portal.Pages.Clientpage.GenerateClientDefaultIndividualPDF;
import rcp_portal.Pages.Clientpage.GenerateClientDefaultPDF;
import rcp_portal.Pages.Clientpage.GenerateClientReport;
import rcp_portal.Pages.Clientpage.createClient;
import rcp_portal.Pages.Clientpage.viewClient;
import rcp_portal.Pages.InterviewersPage.GenerateInterviewerCustomizePDFFullReport;
import rcp_portal.Pages.InterviewersPage.GenerateInterviewerCustomizePDFIndividualReport;
import rcp_portal.Pages.InterviewersPage.GenerateInterviewerDefaultPDFIndividualReport;
import rcp_portal.Pages.InterviewersPage.GenerateInterviewersCustomizeCSV;
import rcp_portal.Pages.InterviewersPage.GenerateInterviewersCustomizeExcel;
import rcp_portal.Pages.InterviewersPage.GenerateInterviewersDefaultExcel;
import rcp_portal.Pages.InterviewersPage.GenerateInterviewersDefaultPDF;
import rcp_portal.Pages.InterviewersPage.GenerateInterviewersreport;
import rcp_portal.Pages.InterviewersPage.createInterviewer;
import rcp_portal.Pages.InterviewersPage.viewInterviewer;
import rcp_portal.Pages.InterviewsPage.ScheduleInterview;
import rcp_portal.Pages.JobPage.GenerateJobCustomizeCSV;
import rcp_portal.Pages.JobPage.GenerateJobCustomizeExcel;
import rcp_portal.Pages.JobPage.GenerateJobDefaultCSV;
import rcp_portal.Pages.JobPage.GenerateJobDefaultExcel;
import rcp_portal.Pages.JobPage.GenerateJobDefaultPDF;
import rcp_portal.Pages.JobPage.GenerateJobIndividualPDF;
import rcp_portal.Pages.JobPage.addJob;
import rcp_portal.Pages.JobPage.addjob;
import rcp_portal.Pages.JobPage.createJob;
import rcp_portal.Pages.JobPage.viewJob;
import rcp_portal.Pages.LoginPage.Forgotpassword;
import rcp_portal.Pages.LoginPage.RegisterPage;
import rcp_portal.Pages.LoginPage.loginPage;
import rcp_portal.Pages.ManageUserPage.manageUser;
import rcp_portal.Pages.ManageUserPage.manageUserAddRole;
import rcp_portal.Pages.ManageUserPage.manageUserArchived;
import rcp_portal.Pages.ManageUserPage.manageUserCustomCSV;
import rcp_portal.Pages.ManageUserPage.manageUserCustomizeExcel;
import rcp_portal.Pages.ManageUserPage.manageUserCustomizePDF;
import rcp_portal.Pages.ManageUserPage.manageUserDefaultPDFIndividualReport;
import rcp_portal.Pages.ManageUserPage.manageUserExcelReport;
import rcp_portal.Pages.ManageUserPage.manageUserGenerateReport;
import rcp_portal.Pages.ManageUserPage.manageUserPDFreport;
import rcp_portal.Pages.ManageUserPage.manageUserViewRole;
import rcp_portal.Pages.ManageUserPage.manageUserViewRoleArchive;
import rcp_portal.Pages.ManageUserPage.manageUserViewRoleGenerateReport;

public class rcpmain {
    WebDriver driver;

    // @BeforeTest

    // public void setup(){
    // WebDriverManager.chromedriver().setup();
    // driver = new ChromeDriver();
    // }

    // @AfterTest

    // public void teardown(){
    // driver.quit();
    // }

    @Test
    public void loginPage() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        loginPage loginfield = new loginPage(driver);
        loginfield.setUserinput("user");
        loginfield.setUserPassword("pwd");
        loginfield.getClik();
        driver.quit();
    }

    @Test

    public void RegisterPage() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        RegisterPage register = new RegisterPage(driver);
        register.clickregister();
        register.enterUserName("user");
        register.gRole("rol");
        register.enterPasswd("pwd");
        register.getPassword("pwd1");
        register.firstName("user2");
        register.lastName("user3");
        register.setEmail("email");
        register.getNumber("no");
        register.GetSecurityQuestion();
        register.GetAnswer("User");
        register.getCliRegi();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // register.GetClickCancel();
        register.GetRegisterButtonClose();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        String Expected = ("http://localhost:3000/register");
        String Actual = driver.getCurrentUrl();
        Assert.assertEquals(Actual, Expected);

    }

    @Test

    public void Forgotpassword() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        Forgotpassword forgotpasswordfield = new Forgotpassword(driver);
        forgotpasswordfield.setUserinput("user");
        forgotpasswordfield.GetReset();
        forgotpasswordfield.GetResetEmail("rEmail");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        forgotpasswordfield.GetClickNext();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        forgotpasswordfield.GetenterNextSecurityQuestion("resetQuestion");
        forgotpasswordfield.GetSendReset();
        // String expected= ("http://localhost:3000/login");
        // String actual = driver.getCurrentUrl();
        // Assert.assertEquals(actual, expected);
        // forgotpasswordfield.getClik();

    }

    @Test

    public void manageUser() {

        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        manageUser manageuser = new manageUser(driver);
        manageuser.setUserinput("user");
        manageuser.setUserPassword("pwd");
        manageuser.getClik();
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewusers");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        manageuser.GetClickcheckbox();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // manageuser.GetClickEnable();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        manageuser.GetClickDelete();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        manageuser.GetClickAlertDelete();
        // manageuser.GetClickAlertCancel();
    }

    @Test

    public void manageUserArchived() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        manageUserArchived mUserArchived = new manageUserArchived(driver);
        mUserArchived.setUserinput("user");
        mUserArchived.setUserPassword("pwd");
        mUserArchived.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewusers");
        mUserArchived.GetClickArchieve();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        mUserArchived.GetClikUnArchive();
        mUserArchived.GetClickArchiveWindow();

    }

    @Test

    public void manageUserGenerateReport() {

        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        manageUserGenerateReport GenerateReport = new manageUserGenerateReport(driver);
        GenerateReport.setUserinput("user");
        GenerateReport.setUserPassword("pwd");
        GenerateReport.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewusers");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e2) {
            e2.printStackTrace();
        }
        GenerateReport.GetGenerateReport();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        GenerateReport.GetClickCSV();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        GenerateReport.GetClickDefault();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        GenerateReport.GetClickExportCSV();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        GenerateReport.GetClickTag();

    }

    @Test

    public void manageUserCustomCSV() {

        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        manageUserCustomCSV customCSV = new manageUserCustomCSV(driver);
        customCSV.setUserinput("user");
        customCSV.setUserPassword("pwd");
        customCSV.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        driver.get("http://localhost:3000/viewusers");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        customCSV.GetGenerateReport();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        customCSV.GetClickCSV();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        customCSV.GetClickCustomReport();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        customCSV.GetCustomSelect();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // customCSV.GetCliSelectedAllRight();
        customCSV.GetClickSelectedRight();
        customCSV.GetDeselectListFromRightToLeft();
        customCSV.GetClickSelectedLeft();
        customCSV.GetClickSelectAllLeft();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        customCSV.GetCustomizeCSVButton();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        customCSV.GetCustomizeDownload();

    }

    @Test

    public void manageUserExcelReport() {

        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        manageUserExcelReport manageUserExcelReport = new manageUserExcelReport(driver);
        manageUserExcelReport.setUserinput("user");
        manageUserExcelReport.setUserPassword("pwd");
        manageUserExcelReport.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        driver.get("http://localhost:3000/viewusers");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        manageUserExcelReport.GetGenerateReport();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        manageUserExcelReport.GetcliGenerateExcel();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        manageUserExcelReport.GetcliDefaultExcel();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        manageUserExcelReport.GetcliExportExcel();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        manageUserExcelReport.GetcliExportDownloadExcel();
        // manageUserExcelReport.GetClickReset();

    }

    @Test

    public void manageUserCustomizeExcel() {

        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        manageUserCustomizeExcel mUserExcelCustom = new manageUserCustomizeExcel(driver);
        mUserExcelCustom.setUserinput("user");
        mUserExcelCustom.setUserPassword("pwd");
        mUserExcelCustom.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        driver.get("http://localhost:3000/viewusers");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mUserExcelCustom.GetGenerateReport();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mUserExcelCustom.GetcliGenerateExcel();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mUserExcelCustom.GetCliCustomizeExcel();
        {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        mUserExcelCustom.GetCustomExcelReport();
        {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        // mUserExcelCustomCsv.GetCliCustomAllRight();
        mUserExcelCustom.GetCustomSelect();
        // mUserExcelCustom.GetCliCustomLeft();
        // mUserExcelCustom.GetCliSelectLeft();
        // mUserExcelCustom.GetCliSelectAllLeft();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mUserExcelCustom.GetCustomExportExcel();
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        mUserExcelCustom.GetCustomExcelDownload();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

    }

    @Test

    public void manageUserPDFreport() {

        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        manageUserPDFreport mUserPDFreport = new manageUserPDFreport(driver);
        mUserPDFreport.setUserinput("user");
        mUserPDFreport.setUserPassword("pwd");
        mUserPDFreport.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewusers");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mUserPDFreport.GetGenerateReport();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mUserPDFreport.GetcliGeneratePDF();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mUserPDFreport.GetDefaultPDF();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mUserPDFreport.GetCliFullReport();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mUserPDFreport.GetCliExportPDF();
        {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        mUserPDFreport.GetCliDownloadPDF();
        // mUserPDFreport.GetCliReset();
    }

    @Test

    public void manageUserCustomizePDF() {

        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        manageUserCustomizePDF mUserCustomizePDF = new manageUserCustomizePDF(driver);
        mUserCustomizePDF.setUserinput("user");
        mUserCustomizePDF.setUserPassword("pwd");
        mUserCustomizePDF.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewusers");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mUserCustomizePDF.GetGenerateReport();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mUserCustomizePDF.GetcliGenerateCustomizePDF();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mUserCustomizePDF.GetCliStyleFullReport();
        mUserCustomizePDF.GetCliCustomize();
        mUserCustomizePDF.GetSelectCustomList();
        // mUserCustomizePDF.GetCliSelectedAllRight();
        mUserCustomizePDF.GetCliSelcetedRight();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        // mUserCustomizePDF.GetDeselectListFromRightToLeft();

        // mUserCustomizePDF.GetCliSelectedLeft();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // mUserCustomizePDF.GetCliSelectList();

        mUserCustomizePDF.GetCliExportPDF();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mUserCustomizePDF.GetCliDownloadPDF();
        // mUserCustomizePDF.GetCliReset();
    }

    @Test

    public void manageUserDefaultPDFIndividualReport() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        manageUserDefaultPDFIndividualReport mUserDefaultPDFIndividualReport = new manageUserDefaultPDFIndividualReport(
                driver);
        mUserDefaultPDFIndividualReport.setUserinput("user");
        mUserDefaultPDFIndividualReport.setUserPassword("pwd");
        mUserDefaultPDFIndividualReport.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewusers");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mUserDefaultPDFIndividualReport.GetGenerateReport();
        mUserDefaultPDFIndividualReport.GetCliPDFReport();
        mUserDefaultPDFIndividualReport.GetCliIndividualPDF();
        mUserDefaultPDFIndividualReport.GetCliSelectUser();
        mUserDefaultPDFIndividualReport.GetCliPDFDefault();
        mUserDefaultPDFIndividualReport.GetCliExportIndividualPDF();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mUserDefaultPDFIndividualReport.GetCliDownloadIndividualPDF();

    }

    @Test

    public void manageUserAddRole() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        manageUserAddRole mUserAddRole = new manageUserAddRole(driver);
        mUserAddRole.setUserinput("user");
        mUserAddRole.setUserPassword("pwd");
        mUserAddRole.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/addrole");
        mUserAddRole.GetCreateRole("role");
        mUserAddRole.GetSubmit();
        // mUserCreateRole.GetReset();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mUserAddRole.GetClickOk();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

    }

    @Test

    public void manageUserViewRole() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        manageUserViewRole mUserViewRole = new manageUserViewRole(driver);
        mUserViewRole.setUserinput("user");
        mUserViewRole.setUserPassword("pwd");
        mUserViewRole.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewroles");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // mUserViewRole.GetCliChecked();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // mUserViewRole.GetClickDeletebutton();
        // mUserViewRole.GetCliDel();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // mUserViewRole.GetCliCancel();

        mUserViewRole.GetClickEditButton();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mUserViewRole.GetEditRole("role");
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mUserViewRole.GetClickSave();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        // mUserViewRole.GetCliReset();
    }

    @Test

    public void manageUserViewRoleArchive() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        manageUserViewRoleArchive mUserViewRoleArchive = new manageUserViewRoleArchive(driver);
        mUserViewRoleArchive.setUserinput("user");
        mUserViewRoleArchive.setUserPassword("pwd");
        mUserViewRoleArchive.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewroles");
        mUserViewRoleArchive.GetClickArchieve();
        mUserViewRoleArchive.GetClickUnArchieve();
        mUserViewRoleArchive.GetClickArchiveWindow();
    }

    @Test

    public void addCandidate() {

        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        addCandidate addcandidate = new addCandidate(driver);
        addcandidate.setUserinput("user");
        addcandidate.setUserPassword("pwd");
        addcandidate.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/addcandidate");
        addcandidate.GetfirstName("firstname");
        addcandidate.GetLastName("Lastname");
        addcandidate.GetEnterEmail("Email");
        addcandidate.GetEnterPhoneNumber("Phonenumber");
        addcandidate.GetGender();
        addcandidate.GetWorkStatus();
        addcandidate.GetLinkedInProfile("Linkedin");
        addcandidate.GetPortfolioLink("portfolio");
        addcandidate.GetSelectSource();
        addcandidate.GetClickNext();
        // addcandidate.GetClickReset();
        addcandidate.GetclickCountry();
        addcandidate.GetclickState();
        addcandidate.GetEnterCity();
        // addcandidate.GetClickSubmit();
        addcandidate.GetAddressNextButton();
        addcandidate.GetTotalExperience("experience");
        addcandidate.GetReleventExperience("Relevent");
        addcandidate.GetJobTitle("title");
        addcandidate.GetEmployer("Employer");
        addcandidate.GetChooseFile("ChooseFile");
        addcandidate.GetReasonForJobChange("Reason");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e2) {
            e2.printStackTrace();
        }
        // addcandidate.GetPrimarySkills();

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        // addcandidate.GetSelectListFromPrimary();
        // addcandidate.GetSecondarySkills();
        addcandidate.GetSelectOffer();
        addcandidate.GetNoticeperiod("Noticeperiod");
        addcandidate.GetMothsOrWeeks();
        addcandidate.GetSelectCurrentCTC();
        addcandidate.GetTypeCurrentCTC("CurrentCTC");
        addcandidate.GetSelectCurrencyType();
        addcandidate.GetTaxType();
        addcandidate.GetSelectExpectedCTC();
        addcandidate.GetTypeCurrentCTC("CurrentCTC");
        addcandidate.GetExpectedCurrencyType();
        addcandidate.GetExpectedTaxType();
        // addcandidate.GetPreviousButton();
        // addcandidate.GetClickSubmitprofessionalDetails();
        // addcandidate.GetResetProfessionalDetails();
        addcandidate.GetProfessionalDetailsNextButton();
        addcandidate.GetWriteComment("Comment");
        // addcandidate.GetCommentPreviousButton();
        addcandidate.GetClickSubmit();
        // addcandidate.GetClickCommentReset();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        addcandidate.GetClickOk();

    }

    @Test

    public void ViewCandidate() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        ViewCandidate vCandidate = new ViewCandidate(driver);
        vCandidate.setUserinput("user");
        vCandidate.setUserPassword("pwd");
        vCandidate.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewcandidates");
        vCandidate.GetCandidateClick();
        vCandidate.GetClickDeleteButton();
        // vCandidate.GetClickDelete();
        vCandidate.GetClickCancel();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        vCandidate.GetClickFilterCandidate();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        vCandidate.GetClickRecruiterfromdropdown();
        vCandidate.GetClickStatusFromDropDown();
        vCandidate.GetSelectStatusFromDropDown();
        vCandidate.GetClickSkillsFromDropDown();
        // vCandidate.GetSelectSkills();
        // vCandidate.GetFilterList();
        // try {
        // Thread.sleep(1000);
        // } catch (InterruptedException e) {
        // e.printStackTrace();
        // }
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // vCandidate.GetResetButton();
        vCandidate.GetCloseFilter();
        vCandidate.GetClickArchiveButton();
        vCandidate.GetClickUnarchive();
        vCandidate.GetCloseUnarchieveWindow();
    }

    @Test
    public void GenerateCandidateReport() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateCandidateReport CandidateReport = new GenerateCandidateReport(driver);
        CandidateReport.setUserinput("user");
        CandidateReport.setUserPassword("pwd");
        CandidateReport.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        driver.get("http://localhost:3000/viewcandidates");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        CandidateReport.GetClickGenerateReportButton();
        CandidateReport.GetClickCSVbutton();
        CandidateReport.GetClickDefaultCSV();
        CandidateReport.GetExportCSV();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        CandidateReport.GetDownloadCSV();
        // CandidateReport.GetClickReset();

    }

    @Test
    public void GenerateCandidateCustomizeCSV() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateCandidateCustomizeCSV CustomCSV = new GenerateCandidateCustomizeCSV(driver);
        CustomCSV.setUserinput("user");
        CustomCSV.setUserPassword("pwd");
        CustomCSV.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        driver.get("http://localhost:3000/viewcandidates");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        CustomCSV.GetClickGenerateReportButton();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        CustomCSV.GetClickCSVbutton();
        CustomCSV.GetClickCustomizeCSV();
        // CustomCSV.GetClickCustomAllRightArrow();
        CustomCSV.GetSelectCustomListRight();
        CustomCSV.GetSelectedListRight();
        CustomCSV.GetSelectCustomListFromRightToLeft();
        CustomCSV.GetSelectedListLeft();
        // CustomCSV.GetClickAllLeftArrow();
        CustomCSV.GetExportCSV();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        CustomCSV.GetDownloadCSV();
        // CustomCSV.GetClickReset();
    }

    @Test
    public void GenerateCandidateDefaultExcel() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateCandidateDefaultExcel GenerateDefaultExcel = new GenerateCandidateDefaultExcel(driver);
        GenerateDefaultExcel.setUserinput("user");
        GenerateDefaultExcel.setUserPassword("pwd");
        GenerateDefaultExcel.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        driver.get("http://localhost:3000/viewcandidates");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        GenerateDefaultExcel.GetClickGenerateReportButton();
        GenerateDefaultExcel.GetClickExcelButton();
        GenerateDefaultExcel.GetClickDefault();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        GenerateDefaultExcel.GetClickExportExcel();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        GenerateDefaultExcel.GetClickDownloadExcel();
        // GenerateDefaultExcel.GetClickReset();
    }

    @Test

    public void GenerateCandidateCustomizeExcel() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateCandidateCustomizeExcel GenerateCustomizeExcel = new GenerateCandidateCustomizeExcel(driver);
        GenerateCustomizeExcel.setUserinput("user");
        GenerateCustomizeExcel.setUserPassword("pwd");
        GenerateCustomizeExcel.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewcandidates");
        GenerateCustomizeExcel.GetClickGenerateReportButton();
        GenerateCustomizeExcel.GetClickExcelButton();
        GenerateCustomizeExcel.GetClickCustomExcel();
        // GenerateCustomizeExcel.GetClickCustomAllRightArrow();
        GenerateCustomizeExcel.GetSelectCustomListRight();
        GenerateCustomizeExcel.GetSelectedListRight();
        GenerateCustomizeExcel.GetSelectCustomListFromRightToLeft();
        GenerateCustomizeExcel.GetSelectedListLeft();
        // GenerateCustomizeExcel.GetClickAllLeftArrow();
        GenerateCustomizeExcel.GetExportExcel();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        GenerateCustomizeExcel.GetDownloadExcel();
        // GenerateCustomizeExcel.GetClikReset();

    }

    @Test

    public void GenerateCandidateDefaultPDF() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateCandidateDefaultPDF GenerateDefaultPDF = new GenerateCandidateDefaultPDF(driver);
        GenerateDefaultPDF.setUserinput("user");
        GenerateDefaultPDF.setUserPassword("pwd");
        GenerateDefaultPDF.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewcandidates");
        GenerateDefaultPDF.GetClickGenerateReportButton();
        GenerateDefaultPDF.GetClickPDFButton();
        GenerateDefaultPDF.GetClickDefault();
        GenerateDefaultPDF.GetCliFullReport();
        GenerateDefaultPDF.GetClickExportPDF();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        GenerateDefaultPDF.GetClickDownloadPDF();

    }

    @Test

    public void GenerateCandidateCustomizePDFFullReport() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateCandidateCustomizePDFFullReport customizePDFFullReport = new GenerateCandidateCustomizePDFFullReport(
                driver);
        customizePDFFullReport.setUserinput("user");
        customizePDFFullReport.setUserPassword("pwd");
        customizePDFFullReport.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewcandidates");
        customizePDFFullReport.GetGenerateReport();
        customizePDFFullReport.GetcliGenerateCustomizePDF();
        customizePDFFullReport.GetCliCustomize();
        customizePDFFullReport.GetSelectCustomList();
        // customizePDFFullReport.GetCliSelectedAllRight();
        customizePDFFullReport.GetCliSelcetedRight();
        // customizePDFFullReport.GetDeselectListFromRightToLeft();
        // customizePDFFullReport.GetCliSelectedLeft();
        customizePDFFullReport.GetCliExportPDF();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        customizePDFFullReport.GetCliDownloadPDF();
    }

<<<<<<< HEAD
  }

  @Test

  public void CandidateEditPage(){
      WebDriverManager.chromedriver().setup();
      driver = new ChromeDriver();

      driver.get("http://localhost:3000/login");
      CandidateEditPage candidateEditPage= new CandidateEditPage(driver);
      candidateEditPage.setUserinput("user");
      candidateEditPage.setUserPassword("pwd");
      candidateEditPage.getClik();
      try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    driver.get("http://localhost:3000/viewcandidates");
    candidateEditPage.GetEditButton();
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e1) {
        e1.printStackTrace();
    }
    candidateEditPage.GetClickEdit();
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e1) {
        e1.printStackTrace();
    }
    candidateEditPage.GetFirstName("firstName");
    candidateEditPage.GetLastName("lastname");
    candidateEditPage.GetSelectRecruitment();
    candidateEditPage.GetEditEmail("email");
    candidateEditPage.GetEditPhoneNumber("PhoneNo");
    candidateEditPage.GetEditLinkedInProfile("LinkedIn");
    candidateEditPage.GetEditPortfolioProfile("portFolio");
    candidateEditPage.GetEditStatus();
    candidateEditPage.GetEditGender();
   // candidateEditPage.GetSaveAllChanges();
   // candidateEditPage.GetCancelAllChanges();
     try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    candidateEditPage.GetClickEditAddressButton();
    candidateEditPage.GetclickEditCountry();
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    candidateEditPage.GetclickEditState();
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
   // candidateEditPage.GetclickEditCity();
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    candidateEditPage.GetEditCityIfNotListed("city");
  // candidateEditPage.GetSaveAllChangesInAddress();
   // candidateEditPage.GetCancelAllInAddressChanges();
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
     candidateEditPage.GetClickEditProfessionalDetails();
    candidateEditPage.GetEditTotalExperience("experience");
    candidateEditPage.GetEditReleventExperience("Relevent");
    candidateEditPage.GetEditJobTitle("title");
    candidateEditPage.GetEditEmployer("Employer");
   // candidateEditPage.GetEditUploadFile("file");
   // candidateEditPage.GetChooseDeleteResume();
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    //candidateEditPage.GetChooseReplaceResume();
    candidateEditPage.GetEditOffer();
    candidateEditPage.GetEditReasonForJobChange("Reason");
   // candidateEditPage.GetEditPrimarySkills();
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
   // candidateEditPage.GetEditSecondarySkills();
   candidateEditPage.GetEditNoticeperiod("Noticeperiod");
    candidateEditPage.GetEditMothsOrWeeks();
    candidateEditPage.GetEditSelectCurrentCTC();
   candidateEditPage.GetEditTypeCurrentCTC("CurrentCTC");
     candidateEditPage.GetEditSelectCurrencyType();
   try {
    Thread.sleep(1000);
} catch (InterruptedException e1) {
    e1.printStackTrace();
}
   candidateEditPage.GetEditTaxType();
    candidateEditPage.GetEditSelectExpectedCTC();
    candidateEditPage.GetTypeExpectedCTC();
    candidateEditPage.GetEditExpectedCurrencyType();
    candidateEditPage.GetSelectEditExpectedTax();
   try {
    Thread.sleep(1000);
} catch (InterruptedException e) {
    e.printStackTrace();
}
 // candidateEditPage.GetSaveAllChangesinProfessionalDetails();
  try {
    Thread.sleep(1000);
} catch (InterruptedException e) {
    e.printStackTrace();
}
 // candidateEditPage.GetCancelAllChangesinProfessionalDetails();
 try {
    Thread.sleep(1000);
} catch (InterruptedException e) {
    e.printStackTrace();
}
  candidateEditPage.GetClickStatusAndcomments();
  candidateEditPage.GetClickEditStatus();
  //candidateEditPage.GetClickSubmitfromdropdown();
  //candidateEditPage.GetClickEditClientName();
  //candidateEditPage.GetEnterTeamManagerInEditStatus("manager");
  candidateEditPage.GetClickEditComment("status");
  candidateEditPage.GetClickFlag();

  candidateEditPage.GetSaveChangesInStatusAndComments();
 // candidateEditPage.GetCancelAllChangesInStatusAndComments();
 driver.get("http://localhost:3000/viewcandidates");
  }
=======
    @Test

    public void GenerateCandidateDefaultPDFIndividualReport() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
>>>>>>> dev

        driver.get("http://localhost:3000/login");
        GenerateCandidateDefaultPDFIndividualReport DefaultPDFIndividualReport = new GenerateCandidateDefaultPDFIndividualReport(
                driver);
        DefaultPDFIndividualReport.setUserinput("user");
        DefaultPDFIndividualReport.setUserPassword("pwd");
        DefaultPDFIndividualReport.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewcandidates");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        DefaultPDFIndividualReport.GetGenerateReport();
        DefaultPDFIndividualReport.GetCliPDFReport();
        DefaultPDFIndividualReport.GetCliIndividualPDF();
        DefaultPDFIndividualReport.GetCliSelectUser();
        DefaultPDFIndividualReport.GetCliPDFDefault();
        DefaultPDFIndividualReport.GetCliExportIndividualPDF();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        DefaultPDFIndividualReport.GetCliDownloadIndividualPDF();
        // DefaultPDFIndividualReport.GetCliReset();
    }

    @Test

    public void CandidateEditPage() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        CandidateEditPage candidateEditPage = new CandidateEditPage(driver);
        candidateEditPage.setUserinput("user");
        candidateEditPage.setUserPassword("pwd");
        candidateEditPage.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewcandidates");
        candidateEditPage.GetEditButton();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        candidateEditPage.GetClickEdit();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        candidateEditPage.GetFirstName("firstName");
        candidateEditPage.GetLastName("lastname");
        candidateEditPage.GetSelectRecruitment();
        candidateEditPage.GetEditEmail("email");
        candidateEditPage.GetEditPhoneNumber("PhoneNo");
        candidateEditPage.GetEditLinkedInProfile("LinkedIn");
        candidateEditPage.GetEditPortfolioProfile("portFolio");
        candidateEditPage.GetEditStatus();
        candidateEditPage.GetEditGender();
        // candidateEditPage.GetSaveAllChanges();
        // candidateEditPage.GetCancelAllChanges();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        candidateEditPage.GetClickEditAddressButton();
        candidateEditPage.GetclickEditCountry();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        candidateEditPage.GetclickEditState();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        candidateEditPage.GetclickEditCity();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // candidateEditPage.GetEditCityIfNotListed("city");
        // candidateEditPage.GetSaveAllChangesInAddress();
        // candidateEditPage.GetCancelAllInAddressChanges();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        candidateEditPage.GetClickEditProfessionalDetails();
        candidateEditPage.GetEditTotalExperience("experience");
        candidateEditPage.GetEditReleventExperience("Relevent");
        candidateEditPage.GetEditJobTitle("title");
        candidateEditPage.GetEditEmployer("Employer");
        // candidateEditPage.GetEditUploadFile("file");
        // candidateEditPage.GetChooseDeleteResume();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // candidateEditPage.GetChooseReplaceResume();
        candidateEditPage.GetEditOffer();
        candidateEditPage.GetEditReasonForJobChange("Reason");
        // candidateEditPage.GetEditPrimarySkills();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // candidateEditPage.GetEditSecondarySkills();
        candidateEditPage.GetEditNoticeperiod("Noticeperiod");
        candidateEditPage.GetEditMothsOrWeeks();
        candidateEditPage.GetEditSelectCurrentCTC();
        candidateEditPage.GetEditTypeCurrentCTC("CurrentCTC");
        candidateEditPage.GetEditSelectCurrencyType();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        candidateEditPage.GetEditTaxType();
        candidateEditPage.GetEditSelectExpectedCTC();
        candidateEditPage.GetTypeExpectedCTC();
        candidateEditPage.GetEditExpectedCurrencyType();
        candidateEditPage.GetSelectEditExpectedTax();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // candidateEditPage.GetSaveAllChangesinProfessionalDetails();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // candidateEditPage.GetCancelAllChangesinProfessionalDetails();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        candidateEditPage.GetClickStatusAndcomments();
        candidateEditPage.GetClickEditStatus();
        candidateEditPage.GetClickJobTypefromdropdown();
        candidateEditPage.GetClickJobType();
        candidateEditPage.GetClickEditClientName();
        candidateEditPage.GetselectClientName();
        candidateEditPage.GetClickJobOpening();
        candidateEditPage.GetselectJobOpening();
        candidateEditPage.GetClickEditComment("status");
        // candidateEditPage.GetClickFlag();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // candidateEditPage.GetSaveChangesInStatusAndComments();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // candidateEditPage.GetCancelAllChangesInStatusAndComments();
        candidateEditPage.GetClickActivity();
        // candidateEditPage.GetSaveActivity();
        candidateEditPage.GetCancelActivity();
        // driver.get("http://localhost:3000/viewcandidates");
    }

    @Test

    public void createInterviewer() {

        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        createInterviewer cInterviewer = new createInterviewer(driver);
        cInterviewer.setUserinput("user");
        cInterviewer.setUserPassword("pwd");
        cInterviewer.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/addinterviewer");
        cInterviewer.GetfirstName("firstname");
        cInterviewer.GetLastName("lastname");
        cInterviewer.getClient();
        // cInterviewer.GetPhonenumber("number");
        cInterviewer.GetEnterEmail("email");
        cInterviewer.Getexperience("experience");
        cInterviewer.Getcountry();
        cInterviewer.GetState();
        cInterviewer.GetCity();
        cInterviewer.GetPostalcode("postalCode");
        cInterviewer.GetInterviewSkills("skills");
        cInterviewer.GetSubmit();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        cInterviewer.GetClickOk();
    }

    @Test

    public void viewInterviewer() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        viewInterviewer vInterviewer = new viewInterviewer(driver);
        vInterviewer.setUserinput("user");
        vInterviewer.setUserPassword("pwd");
        vInterviewer.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewinterviewers");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        vInterviewer.GetClickCheck();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // vInterviewer.GetClickDelete();
        // vInterviewer.GetClickDel();
        // vInterviewer.GetClickCancel();
        vInterviewer.GetClickFilter();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        vInterviewer.GetClickClient();
        vInterviewer.GetSelectClient();
        vInterviewer.GetClickInterviewSkills();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // vInterviewer.GetSelectInterviewer();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        vInterviewer.GetCloseFilter();
        // vInterviewer.GetClickReset();
        vInterviewer.GetClickArchieve();
        vInterviewer.GetSelectRecordFroArchive();
        vInterviewer.GetClickCloseArchiveButton();
        vInterviewer.GetClickGenerateReport();
    }

    @Test

    public void GenerateInterviewersreport() {

        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateInterviewersreport InterviewerDefaultCSV = new GenerateInterviewersreport(driver);
        InterviewerDefaultCSV.setUserinput("user");
        InterviewerDefaultCSV.setUserPassword("pwd");
        InterviewerDefaultCSV.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewinterviewers");
        InterviewerDefaultCSV.GetClickGenerateReportButton();
        InterviewerDefaultCSV.GetClickCSVbutton();
        InterviewerDefaultCSV.GetClickCSVbutton();
        InterviewerDefaultCSV.GetExportCSV();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        InterviewerDefaultCSV.GetDownloadCSV();
        // InterviewerDefaultCSV.GetClickReset();

    }

    @Test

    public void GenerateInterviewersCustomizeCSV() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateInterviewersCustomizeCSV InterviewerCustomizeCSV = new GenerateInterviewersCustomizeCSV(driver);
        InterviewerCustomizeCSV.setUserinput("user");
        InterviewerCustomizeCSV.setUserPassword("pwd");
        InterviewerCustomizeCSV.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewinterviewers");
        InterviewerCustomizeCSV.GetClickGenerateReportButton();
        InterviewerCustomizeCSV.GetClickCSVbutton();
        InterviewerCustomizeCSV.GetClickCustomizeCSV();
        // InterviewerCustomizeCSV.GetClickCustomAllRightArrow();
        InterviewerCustomizeCSV.GetSelectOptionFromList();
        InterviewerCustomizeCSV.GetMoveRightFromList();
        InterviewerCustomizeCSV.GetSelectOptionFromRightToLeft();
        InterviewerCustomizeCSV.GetMoveRightFromLeft();
        // InterviewerCustomizeCSV.GetMoveAllLeft();
        InterviewerCustomizeCSV.GetClickExportCSV();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        InterviewerCustomizeCSV.GetDownloadCSV();

    }

    @Test

    public void GenerateInterviewersDefaultExcel() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateInterviewersDefaultExcel InterviewerDefaultExcel = new GenerateInterviewersDefaultExcel(driver);
        InterviewerDefaultExcel.setUserinput("user");
        InterviewerDefaultExcel.setUserPassword("pwd");
        InterviewerDefaultExcel.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewinterviewers");
        InterviewerDefaultExcel.GetClickGenerateReportButton();
        InterviewerDefaultExcel.GetClickExcelButton();
        InterviewerDefaultExcel.GetClickDefault();
        InterviewerDefaultExcel.GetClickExportExcel();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        InterviewerDefaultExcel.GetClickDownloadExcel();

    }

    @Test

    public void GenerateInterviewersCustomizeExcel() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateInterviewersCustomizeExcel InterviewerCustomizeExcel = new GenerateInterviewersCustomizeExcel(driver);
        InterviewerCustomizeExcel.setUserinput("user");
        InterviewerCustomizeExcel.setUserPassword("pwd");
        InterviewerCustomizeExcel.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewinterviewers");
        InterviewerCustomizeExcel.GetClickGenerateReportButton();
        InterviewerCustomizeExcel.GetClickExcel();
        InterviewerCustomizeExcel.GetClickCustomizeExcel();
        // InterviewerCustomizeExcel.GetClickCustomAllRightArrow();
        InterviewerCustomizeExcel.GetSelectOptionFromList();
        InterviewerCustomizeExcel.GetMoveRightFromList();
        InterviewerCustomizeExcel.GetSelectOptionFromRightToLeft();
        InterviewerCustomizeExcel.GetMoveRightFromLeft();
        // InterviewerCustomizeExcel.GetMoveAllLeft();
        InterviewerCustomizeExcel.GetClickExportExcel();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        InterviewerCustomizeExcel.GetDownloadExcel();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

    }

    @Test
    public void GenerateInterviewersDefaultPDF() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateInterviewersDefaultPDF InterviewerDefaultPDF = new GenerateInterviewersDefaultPDF(driver);
        InterviewerDefaultPDF.setUserinput("user");
        InterviewerDefaultPDF.setUserPassword("pwd");
        InterviewerDefaultPDF.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewinterviewers");
        InterviewerDefaultPDF.GetClickGenerateReportButton();
        InterviewerDefaultPDF.GetClickPDFButton();
        InterviewerDefaultPDF.GetClickDefault();
        InterviewerDefaultPDF.GetCliFullReport();
        InterviewerDefaultPDF.GetClickExportPDF();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        InterviewerDefaultPDF.GetClickDownloadPDF();

    }

    @Test

    public void GenerateInterviewerDefaultPDFIndividualReport() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateInterviewerDefaultPDFIndividualReport InterviewerDefaultPDFIndividual = new GenerateInterviewerDefaultPDFIndividualReport(
                driver);
        InterviewerDefaultPDFIndividual.setUserinput("user");
        InterviewerDefaultPDFIndividual.setUserPassword("pwd");
        InterviewerDefaultPDFIndividual.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewinterviewers");
        InterviewerDefaultPDFIndividual.GetGenerateReport();
        InterviewerDefaultPDFIndividual.GetCliPDFReport();
        InterviewerDefaultPDFIndividual.GetCliIndividualPDF();
        InterviewerDefaultPDFIndividual.GetCliSelectUser();
        InterviewerDefaultPDFIndividual.GetCliPDFDefault();
        InterviewerDefaultPDFIndividual.GetCliExportIndividualPDF();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        InterviewerDefaultPDFIndividual.GetCliDownloadIndividualPDF();

    }

    @Test

    public void GenerateInterviewerCustomizePDFFullReport() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateInterviewerCustomizePDFFullReport CustomizePDFFullReport = new GenerateInterviewerCustomizePDFFullReport(
                driver);
        CustomizePDFFullReport.setUserinput("user");
        CustomizePDFFullReport.setUserPassword("pwd");
        CustomizePDFFullReport.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewinterviewers");
        CustomizePDFFullReport.GetGenerateReport();
        CustomizePDFFullReport.GetcliGenerateCustomizePDF();
        CustomizePDFFullReport.GetCliCustomize();
        CustomizePDFFullReport.GetCliStyleFullReport();
        CustomizePDFFullReport.GetSelectCustomList();
        // CustomizePDFFullReport.GetCliSelectedAllRight();
        CustomizePDFFullReport.GetCliSelcetedRight();
        CustomizePDFFullReport.GetDeselectListFromRightToLeft();
        CustomizePDFFullReport.GetCliSelectedLeft();
        CustomizePDFFullReport.GetCliExportPDF();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        CustomizePDFFullReport.GetCliDownloadPDF();
        // CustomizePDFFullReport.GetCliReset();

    }

    @Test

    public void createClient() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        createClient createClientpage = new createClient(driver);
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        createClientpage.setUserinput("user");
        createClientpage.setUserPassword("pwd");
        createClientpage.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // driver.get("http://localhost:3000/createclient");
        driver.get("http://localhost:3000/addclient");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        createClientpage.GetClientName("Clientname");
        createClientpage.GetSelectCountry();
        // createClientpage.GetSelectStateBySendingInputs("state");
        createClientpage.GetSelectCountry();
        createClientpage.GetCity("city");
        createClientpage.GetEnterAddress("Address");
        createClientpage.GetEnterAddress2("Address2");
        createClientpage.GetEnterZipCode("ZipCode");
        createClientpage.GetEnterSubmitButton();
        // createClientpage.GetEnterResetButton();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        createClientpage.GetClientsave();
        // createClientpage.GetDuplicateGenerationOk();

    }

    @Test

    public void viewClient() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        viewClient viewClientpage = new viewClient(driver);
        viewClientpage.setUserinput("user");
        viewClientpage.setUserPassword("pwd");
        viewClientpage.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewclients");
        viewClientpage.GetClickRow();
        viewClientpage.GetclickDeletebutton();
        // viewClientpage.GetClickDelete();
        viewClientpage.GetClickCancel();
        viewClientpage.GetEditButton();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        viewClientpage.GetEditClientName("ClientName");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        viewClientpage.GetEditCountry();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        viewClientpage.GetEditState();
        // viewClientpage.GetEditCountryWithoutState("state");
        viewClientpage.GetselectCity();
        // viewClientpage.GetEditCitiesIfThereIsNoCity();
        viewClientpage.GetEditAddress("Address");
        viewClientpage.GetEditAddress2("Address2");
        viewClientpage.GetEditPostalCode("PostalCode");
        viewClientpage.GetSave();
        // viewClientpage.GetCancel();
        viewClientpage.GetClickFilterButton();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        viewClientpage.GetClickClientFilter();
        viewClientpage.GetSelectFromDropDown();
        // viewClientpage.GetSelectReset();
        viewClientpage.GetClickClosefilter();
        viewClientpage.GetClickArchieve();
        viewClientpage.GetClickUnarchive();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        viewClientpage.GetClickUnarchieveClosebutton();
        viewClientpage.GetClickReportsbutton();
    }

    @Test

    public void GenerateClientReport() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateClientReport CSVClientReport = new GenerateClientReport(driver);
        CSVClientReport.setUserinput("user");
        CSVClientReport.setUserPassword("pwd");
        CSVClientReport.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewclients");
        CSVClientReport.GetClickReportsbutton();
        CSVClientReport.GetClickCSVbutton();
        CSVClientReport.GetClickDefaultCSV();
        CSVClientReport.GetExportCSV();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        CSVClientReport.GetDownloadCSV();
        // CSVClientReport.GetClickReset();

    }

    @Test
    public void GenerateClientCustomizeCSV() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateClientCustomizeCSV ClientCustomizeCSV = new GenerateClientCustomizeCSV(driver);
        ClientCustomizeCSV.setUserinput("user");
        ClientCustomizeCSV.setUserPassword("pwd");
        ClientCustomizeCSV.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewclients");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e2) {
            e2.printStackTrace();
        }
        ClientCustomizeCSV.GetClickReportsbutton();
        ClientCustomizeCSV.GetClickCSVbutton();
        ClientCustomizeCSV.GetClickCustomizeCSV();
        // ClientCustomizeCSV.GetClickCustomAllRightArrow();
        ClientCustomizeCSV.GetSelectCustomListRight();
        ClientCustomizeCSV.GetSelectedListRight();
        ClientCustomizeCSV.GetSelectCustomListFromRightToLeft();
        // ClientCustomizeCSV.GetSelectedListLeft();
        // ClientCustomizeCSV.GetClickAllLeftArrow();
        ClientCustomizeCSV.GetExportCSV();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        ClientCustomizeCSV.GetDownloadCSV();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // ClientCustomizeCSV.GetClickReset();
    }

    @Test

    public void GenerateClientDefaultExcel() {

        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateClientDefaultExcel ClientDefaultExcel = new GenerateClientDefaultExcel(driver);
        ClientDefaultExcel.setUserinput("user");
        ClientDefaultExcel.setUserPassword("pwd");
        ClientDefaultExcel.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewclients");
        ClientDefaultExcel.GetClickGenerateReportButton();
        ClientDefaultExcel.GetClickExcelButton();
        ClientDefaultExcel.GetClickDefault();
        ClientDefaultExcel.GetClickExportExcel();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        ClientDefaultExcel.GetClickDownloadExcel();
        // ClientDefaultExcel.GetClickReset();

    }

    @Test

    public void GenerateClientCustomizeExcel() {

        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateClientCustomizeExcel ClientCustomizeExcel = new GenerateClientCustomizeExcel(driver);
        ClientCustomizeExcel.setUserinput("user");
        ClientCustomizeExcel.setUserPassword("pwd");
        ClientCustomizeExcel.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewclients");
        ClientCustomizeExcel.GetClickGenerateReportButton();
        ClientCustomizeExcel.GetClickExcelButton();
        ClientCustomizeExcel.GetClickCustomExcel();
        // ClientCustomizeExcel.GetClickCustomAllRightArrow();
        ClientCustomizeExcel.GetSelectCustomListRight();
        ClientCustomizeExcel.GetSelectedListRight();
        // ClientCustomizeExcel.GetSelectCustomListFromRightToLeft();
        // ClientCustomizeExcel.GetSelectedListLeft();
        // ClientCustomizeExcel.GetClickAllLeftArrow();
        ClientCustomizeExcel.GetExportExcel();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        ClientCustomizeExcel.GetDownloadExcel();
        // ClientCustomizeExcel.GetClickReset();

    }

    @Test

    public void GenerateClientDefaultPDF() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateClientDefaultPDF ClientDefaultPDF = new GenerateClientDefaultPDF(driver);
        ClientDefaultPDF.setUserinput("user");
        ClientDefaultPDF.setUserPassword("pwd");
        ClientDefaultPDF.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewclients");
        ClientDefaultPDF.GetClickGenerateReportButton();
        ClientDefaultPDF.GetClickPDFButton();
        ClientDefaultPDF.GetCliFullReport();
        ClientDefaultPDF.GetClickDefault();
        ClientDefaultPDF.GetClickExportPDF();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        ClientDefaultPDF.GetClickDownloadPDF();
        // ClientDefaultPDF.GetClickReset();
    }

    @Test

    public void GenerateClientDefaultIndividualPDF() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateClientDefaultIndividualPDF ClientDefaultIndividualPDF = new GenerateClientDefaultIndividualPDF(driver);
        ClientDefaultIndividualPDF.setUserinput("user");
        ClientDefaultIndividualPDF.setUserPassword("pwd");
        ClientDefaultIndividualPDF.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewclients");
        ClientDefaultIndividualPDF.GetGenerateReport();
        ClientDefaultIndividualPDF.GetCliPDFReport();
        ClientDefaultIndividualPDF.GetCliIndividualPDF();
        ClientDefaultIndividualPDF.GetCliClient();
        ClientDefaultIndividualPDF.GetCliReportDetailsPDFDefault();
        ClientDefaultIndividualPDF.GetCliExportIndividualPDF();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        ClientDefaultIndividualPDF.GetCliDownloadIndividualPDF();
        // ClientDefaultIndividualPDF.GetCliReset();

    }

    @Test

    public void GenerateClientCustomizePDFFullReport() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateClientCustomizePDFFullReport ClientCustomizePDFFullReport = new GenerateClientCustomizePDFFullReport(
                driver);
        ClientCustomizePDFFullReport.setUserinput("user");
        ClientCustomizePDFFullReport.setUserPassword("pwd");
        ClientCustomizePDFFullReport.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewclients");
        ClientCustomizePDFFullReport.GetGenerateReport();
        ClientCustomizePDFFullReport.GetcliGenerateCustomizePDF();
        ClientCustomizePDFFullReport.GetCliCustomize();
        ClientCustomizePDFFullReport.GetCliStyleFullReport();
        ClientCustomizePDFFullReport.GetSelectCustomList();
        // ClientCustomizePDFFullReport.GetCliSelectedAllRight();
        ClientCustomizePDFFullReport.GetCliSelcetedRight();
        // ClientCustomizePDFFullReport.GetDeselectListFromRightToLeft();
        // ClientCustomizePDFFullReport.GetCliSelectedLeft();
        ClientCustomizePDFFullReport.GetCliExportPDF();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        ClientCustomizePDFFullReport.GetCliDownloadPDF();
        // ClientCustomizePDFFullReport.GetCliReset();

    }

    @Test

    public void addJob() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        addjob addjob = new addjob(driver);
        addjob.setUserinput("user");
        addjob.setUserPassword("pwd");
        addjob.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/addjob");
        addjob.GetEnterJobTitle("jobTitle");
        addjob.GetEnterNumberOfOpenings("noOfOpeningd");
        // createjob.GetSelectFromCurrencyType();
        addjob.GetEnterBillRate("billRate");
        addjob.GetSelectWorkType();
        addjob.GetSelectPriority();
        addjob.GetEnterHiringManager("hiringManager");
        addjob.GetEnterClient();
        addjob.GetSelectJobType();
        addjob.GetSelectFLSAType();
        addjob.GetSelectTaxType();
        addjob.GetEnterDescription("desc");
        // createjob.GetEnterCountry("Country");
        // createjob.GetEnterState("state");
        // createjob.GetEnterCity("city");
        // createjob.GetPostalCode("postalCode");
        addjob.GetClickSubmit();
        // createjob.GetClickReset();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // addjob.GetClickSaveOk();
        addjob.GetCliCkDuplicateGenerationOk();

    }

    @Test

    public void viewJob() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        viewJob viewjob = new viewJob(driver);
        viewjob.setUserinput("user");
        viewjob.setUserPassword("pwd");
        viewjob.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewjobs");
        viewjob.GetClickRow();
        viewjob.GetclickDeletebutton();
        viewjob.GetClickDelete();
        // viewjob.GetClickCancel();
        viewjob.GetEditButton();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        viewjob.GetEnterJobTitle("jobTitle");
        viewjob.GetSelectJobType();
        viewjob.GetSelectWorkType();
        // viewjob.GetSelectFromCurrencyType();
        viewjob.GetEnterBillRate("billRate");
        viewjob.GetEnterHiringManager("hiringManager");
        viewjob.GetEnterNumberOfOpenings("noOfOpenings");
        viewjob.GetSelectPriority();
        viewjob.GetSelectFLSAType();
        viewjob.GetStatus();
        viewjob.GetEnterClient();
        viewjob.GetEnterDescription("desc");
        // viewjob.GetEnterCountry("Country");
        // viewjob.GetEnterState("state");
        // viewjob.GetEnterCity("city");
        // viewjob.GetPostalCode("PostalCode");
        // viewjob.GetClickSave();
        viewjob.GetClickReset();
        viewjob.GetClickFilter();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        viewjob.GetClickClientInFilter();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e1) {
            e1.printStackTrace();
        }
        viewjob.GetSelectClientFromFilter();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        viewjob.GetClickPriorityFromFilter();
        viewjob.GetSelectPriorityFromFilter();
        viewjob.GetClickStatusFromFilter();
        viewjob.GetSelectStatusFromFilter();
        // viewjob.GetClickResetFronFilter();
        viewjob.GetClickCloseFilter();
        viewjob.GetClickOnReportFilter();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

    }

    @Test

    public void GenerateJobDefaultCSV() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateJobDefaultCSV JobModuleDefaultCSV = new GenerateJobDefaultCSV(driver);
        JobModuleDefaultCSV.setUserinput("user");
        JobModuleDefaultCSV.setUserPassword("pwd");
        JobModuleDefaultCSV.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewjobs");
        JobModuleDefaultCSV.GetClickOnReportFilter();
        JobModuleDefaultCSV.GetClickGenerateDefaultCSV();
        JobModuleDefaultCSV.GetGenerateReport();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        JobModuleDefaultCSV.GetClickDownload();
    }

    @Test

    public void GenerateJobCustomizeCSV() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateJobCustomizeCSV JobCustomizeCSV = new GenerateJobCustomizeCSV(driver);
        JobCustomizeCSV.setUserinput("user");
        JobCustomizeCSV.setUserPassword("pwd");
        JobCustomizeCSV.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewjobs");
        JobCustomizeCSV.GetClickOnReportFilter();
        JobCustomizeCSV.GetClickCSVButton();
        JobCustomizeCSV.GetClickGenerateCustomizeCSV();
        // JobCustomizeCSV.GetClickCustomAllRightArrow();
        JobCustomizeCSV.GetSelectOptionFromList();
        JobCustomizeCSV.GetMoveRightFromList();
        JobCustomizeCSV.GetSelectOptionFromRightToLeft();
        // JobCustomizeCSV.GetMoveAllLeft();
        JobCustomizeCSV.GetGenerateReport();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        JobCustomizeCSV.GetClickDownload();

    }

    @Test

    public void GenerateJobDefaultExcel() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateJobDefaultExcel JobDefaultExcel = new GenerateJobDefaultExcel(driver);
        JobDefaultExcel.setUserinput("user");
        JobDefaultExcel.setUserPassword("pwd");
        JobDefaultExcel.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewjobs");
        JobDefaultExcel.GetClickOnReportFilter();
        JobDefaultExcel.GetClickOnExcel();
        JobDefaultExcel.GetClickGenerateExcelCSV();
        JobDefaultExcel.GetGenerateReport();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        JobDefaultExcel.GetClickDownload();

    }

    @Test

    public void GenerateJobCustomizeExcel() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateJobCustomizeExcel JobCustomizeExcel = new GenerateJobCustomizeExcel(driver);
        JobCustomizeExcel.setUserinput("user");
        JobCustomizeExcel.setUserPassword("pwd");
        JobCustomizeExcel.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewjobs");
        JobCustomizeExcel.GetClickOnReportFilter();
        JobCustomizeExcel.GetClickOnExcel();
        // JobCustomizeExcel.GetClickGenerateCustomizeExcel();
        JobCustomizeExcel.GetClickCustomizeReportsFromExcel();
        // JobCustomizeExcel.GetClickCustomAllRightArrow();
        JobCustomizeExcel.GetSelectOptionFromList();
        JobCustomizeExcel.GetMoveRightFromList();
        JobCustomizeExcel.GetSelectOptionFromRightToLeft();
        // JobCustomizeExcel.GetMoveAllLeft();
        JobCustomizeExcel.GetClickGenerateReportCustomizeExcel();
        JobCustomizeExcel.GetGenerateReport();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        JobCustomizeExcel.GetClickDownload();

    }

    @Test

    public void GenerateJobDefaultPDF() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateJobDefaultPDF JobDefaultPDF = new GenerateJobDefaultPDF(driver);
        JobDefaultPDF.setUserinput("user");
        JobDefaultPDF.setUserPassword("pwd");
        JobDefaultPDF.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewjobs");
        JobDefaultPDF.GetClickOnReportFilter();
        JobDefaultPDF.GetClickOnPDF();
        JobDefaultPDF.GetSelectReportTypeFromPDF();
        JobDefaultPDF.GetSelectReportDetailsFromPDF();
        JobDefaultPDF.GetClickGenerateReport();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        JobDefaultPDF.GetClickDownload();

    }

    @Test

    public void GenerateJobIndividualPDF() {

        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        GenerateJobIndividualPDF JobIndividualPDF = new GenerateJobIndividualPDF(driver);
        JobIndividualPDF.setUserinput("user");
        JobIndividualPDF.setUserPassword("pwd");
        JobIndividualPDF.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewjobs");
        JobIndividualPDF.GetClickOnReportFilter();
        JobIndividualPDF.GetClickOnPDF();
        JobIndividualPDF.GetSelectReportTypeFromPDF();
        JobIndividualPDF.GetSelectJobOpeningFromPDF();
        JobIndividualPDF.GetSelectReportDetailsFromPDF();
        JobIndividualPDF.GetClickGenerateReport();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        JobIndividualPDF.GetClickDownload();

    }

    @Test

    public void ScheduleInterview() {

        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");
        ScheduleInterview scheduleInterviews = new ScheduleInterview(driver);
        scheduleInterviews.setUserinput("user");
        scheduleInterviews.setUserPassword("pwd");
        scheduleInterviews.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/scheduleinterview");
        scheduleInterviews.GetSelectCandidateInScheduleInterview();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        scheduleInterviews.GetSelectInterviewerFromList();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        scheduleInterviews.GetSelectInterviewer();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        scheduleInterviews.GetSelectInterviewerFromListagain();
        // scheduleInterviews.GetSelectInterviewer2();
        scheduleInterviews.GetSelectJobOpeningsFromList();
        scheduleInterviews.GetRoundType();
        scheduleInterviews.GetSelectDate("date");
        scheduleInterviews.GetSelectStartTime("Time");
        scheduleInterviews.GetEndTime("endTime");
        scheduleInterviews.GetMeetingURL();
        scheduleInterviews.GetURLForZoommeet();
        // scheduleInterviews.GetEnterMeetingURL("meetURL");
        scheduleInterviews.ClickSubmit();
        // scheduleInterviews.GEtclickReset();
        try {
            Thread.sleep(25000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // scheduleInterviews.GetClickCloseAfterURLCreated();

    }

    @Test

    public void viewinterviewers() {

        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.get("http://localhost:3000/login");
        viewInterviewer vInterviewer = new viewInterviewer(driver);
        vInterviewer.setUserinput("user");
        vInterviewer.setUserPassword("pwd");
        vInterviewer.getClik();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get("http://localhost:3000/viewinterviews");

    }

}
