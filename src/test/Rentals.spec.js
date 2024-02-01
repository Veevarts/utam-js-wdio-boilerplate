const DesktopLayoutContainer = require("salesforce-pageobjects/navex/pageObjects/desktopLayoutContainer");
const AppLauncherHeader = require("salesforce-pageobjects/global/pageObjects/appLauncherHeader");
const Login = require("salesforce-pageobjects/helpers/pageObjects/login");
const ConsoleObjectHome = require('salesforce-pageobjects/force/pageObjects/objectHome');
const RecordActionWrapper = require("salesforce-pageobjects/global/pageObjects/recordActionWrapper");
const RecordLayoutBaseInput = require('salesforce-pageobjects/records/pageObjects/recordLayoutBaseInput');


describe("main", () => {
    it("create an Rental Events/Groups", async () => {
        await browser.url("https://login.salesforce.com");
        const loginPage = await utam.load(Login);
        await loginPage.login("dev@veevqaone.com", "Veevart2024");

        //Search NavItems
        console.log("Loading Rental Events/Groups");
        const pageObject = await utam.load(DesktopLayoutContainer);
        const navApp = await pageObject.getAppNav();
        const navAppBar = await navApp.getAppNavBar();
        const navAppItem = await navAppBar.getNavItem("Rental Events/Groups");
        await navAppItem.clickAndWaitForUrl('lightning/o/Auctifera__Rental_Event__c/home');;

        console.log("Loading Inventory Service Object Home page");
        const objectHome = await utam.load(ConsoleObjectHome);
        const listView = await objectHome.getListView();
        const listViewHeader = await listView.getHeader();

        console.log("List view header: click button 'New'");
        const text = "New"; 
        const utamVar1 = await listViewHeader.getActions();
        const utamVar2 = await utamVar1.getActionLink(text);
        await utamVar2.click();

        console.log("loading recordFormModal")
        const recordFormModal = await utam.load(RecordActionWrapper);
        const recordForm = await recordFormModal.getRecordForm();
        const recordLayout = await recordForm.getRecordLayout();
        let item = await recordLayout.getItem(1, 1, 1);
        console.log("Enter Rentals name");
        const rentalName = "Rentals 2";
        let input = await item.getTextInput();
        await input.setText(rentalName);

        console.log("Record index item Invoice Number");
        item = await recordLayout.getItem(1, 2, 2);
    
        console.log("Enter Membership price");
        input = await item.getTextInput();
        await input.setText('100');

        await browser.debug();

    })
})