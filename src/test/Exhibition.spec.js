const Login = require("salesforce-pageobjects/helpers/pageObjects/login");
const DatetimePicker = require("salesforce-pageobjects/lightning/pageObjects/datetimepicker");
const AppLauncherHeader = require('salesforce-pageobjects/global/pageObjects/appLauncherHeader')
const RecordActionWrapper = require("salesforce-pageobjects/global/pageObjects/recordActionWrapper");
const RecordHomeFlexipage2 = require("salesforce-pageobjects/global/pageObjects/recordHomeFlexipage2");
const ConsoleObjectHome = require('salesforce-pageobjects/force/pageObjects/objectHome');
const FileUpload = require('salesforce-pageobjects/lightning/pageObjects/fileUpload');

describe("Demo UTAM - Create New Exhibition", () => {
  it("Navigate to Inventory Service and click New", async () => {
    
    await browser.url("https://login.salesforce.com");

    const loginPage = await utam.load(Login);
    await loginPage.login("dev@veevqaone.com", "Veevart2024");

    console.log("Navigating to Inventory Service page");
    await browser.navigateTo("https://veevqaone.lightning.force.com/lightning/o/Auctifera__Inventory_Service__c/list?filterName=Recent");

    console.log("Loading Inventory Service Object Home page");
    const objectHome = await utam.load(ConsoleObjectHome);
    const listView = await objectHome.getListView();
    const listViewHeader = await listView.getHeader();

    console.log("List view header: click button 'New'");
    const text = "New"; 
    const utamVar1 = await listViewHeader.getActions();
    const utamVar2 = await utamVar1.getActionLink(text);
    await utamVar2.click();

    console.log("Load Record Form Modal");
    let recordFormModal = await utam.load(RecordActionWrapper);
    const isRecordFormModalPresent = await recordFormModal.isPresent();
    expect(isRecordFormModalPresent).toBe(true);

    recordFormModal = await utam.load(RecordActionWrapper);
    const recordForm = await recordFormModal.getRecordForm();
    const recordLayout = await recordForm.getRecordLayout();

    console.log("Access record form item by index (Name)");
    let item = await recordLayout.getItem(1, 1, 1);
    console.log("mitem--|",item)

    //field *Exhibition/Event
    console.log("Enter Exhibition name");
    const accountName = "Exhibition Automation2";
    let input = await item.getTextInput();
    console.log("mirar el primer item",input)
    await input.setText(accountName);


    
    console.log("Save Exhibition");
    await recordForm.clickFooterButton("Save");
    await recordFormModal.waitForAbsence();

    console.log('Loading drop file');
    const fileUploader = await utam.load(FileUpload);
    await fileUploader.upload('');
    // const appLauncherHeader = await utam.load(AppLauncherHeader);
    // const appLauncher = await appLauncherHeader.getAppNav();
    // const launcher = await appLauncher.getAppLauncherHeader();
    // await launcher.getButton();
    await browser.debug();
  });
});
