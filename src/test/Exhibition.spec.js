const Login = require("salesforce-pageobjects/helpers/pageObjects/login");
const DatetimePicker = require("salesforce-pageobjects/lightning/pageObjects/datetimepicker");
const AppLauncherHeader = require('salesforce-pageobjects/global/pageObjects/appLauncherHeader')
const RecordActionWrapper = require("salesforce-pageobjects/global/pageObjects/recordActionWrapper");
const RecordHomeFlexipage2 = require("salesforce-pageobjects/global/pageObjects/recordHomeFlexipage2");
const Tab2 = require('salesforce-pageobjects/flexipage/pageObjects/tab2');
const ConsoleObjectHome = require('salesforce-pageobjects/force/pageObjects/objectHome');
const FileUpload = require('salesforce-pageobjects/lightning/pageObjects/fileUpload');
const RecordHomeTemplateDesktop = require('salesforce-pageobjects/global/pageObjects/recordHomeTemplateDesktop');
const Button = require('../__utam__/button.utam.json')


describe("Demo UTAM - Create New Exhibition", () => {
  it("Navigate to Inventory Service and click New", async () => {
    
    const equalsIgnoreCase = (str1, str2) => str1.toLowerCase() === str2.toLowerCase();
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

    console.log('Select button Confirm');
    const recordHome = await utam.load(RecordHomeFlexipage2);
    const tabset = await recordHome.getTabset();

    const detailsTabLabel = 'Ticketing';
    console.log('Select "Details" tab');
    const tabBar = await tabset.getTabBar();
    const activeTabName = await tabBar.getActiveTabText();
    if (!equalsIgnoreCase(activeTabName, detailsTabLabel)) {
        await tabBar.clickTab(detailsTabLabel);
    }

    const selector = ".slds-button.slds-button_brand"; 
    const confirmButton = await browser.$(selector);
    
    await confirmButton.waitForDisplayed({ timeout: 10000 });
    await confirmButton.waitForClickable({ timeout: 10000 });
    
    const overlaySelector = '.loading _loaderBar';
    const overlay = await browser.$(overlaySelector);
    if (await overlay.isDisplayed()) {
        await overlay.waitForDisplayed({ reverse: true, timeout: 10000 });
    }
  
    try {
        await confirmButton.click();
    } catch (clickInterceptedError) {
        await browser.execute((button) => button.click(), confirmButton);
    }

    const buttonLabel = 'Entire Week'; // The label of the button you want to click
await browser.execute((label) => {
    const buttons = Array.from(document.querySelectorAll('#\\36 84\\:0_content > article > div:nth-child(2) > div:nth-child(5) > fieldset > div.days-shortcut-cont'));
    const targetButton = buttons.find(button => button.label === label);
    if (targetButton) {
        targetButton.click();
    }
}, buttonLabel);


    
  
    await browser.debug();
  });
});
