// // Import a PageObject from within the package
// const Login = require("salesforce-pageobjects/helpers/pageObjects/login");
// const RecordActionWrapper = require("salesforce-pageobjects/global/pageObjects/recordActionWrapper");
// const RecordHomeFlexipage2 = require("salesforce-pageobjects/global/pageObjects/recordHomeFlexipage2");
// const ConsoleObjectHome = require('salesforce-pageobjects/force/pageObjects/objectHome');

// describe("Demo UTAM", () => {
//   it("Create a new Membership Program", async () => {
    
//     // Load the website
//     await browser.url("https://login.salesforce.com");

//     const loginPage = await utam.load(Login);
//     await loginPage.login(
//       "dev@veevqaone.com",
//       "Veevart2024"
//     );

//     const recordType = {name: 'Auctifera__Membership_Programs__c'};

//     console.log(`Navigate to an Object Home for ${recordType.name}`);
//     await browser.navigateTo(
//       `https://veevqaone.lightning.force.com/lightning/o/Auctifera__Membership_Programs__c/home`
//     );
//     console.log(`Load ${recordType.name} Object Home page`);

//     const objectHome = await utam.load(ConsoleObjectHome);
//     const listView = await objectHome.getListView();
//     const listViewHeader = await listView.getHeader();

//     console.log("List view header: click button 'New'");
//     const actionLink = await listViewHeader.waitForAction("New");
//     await actionLink.click();

//     console.log("Load Record Form Modal");
//     let recordFormModal = await utam.load(RecordActionWrapper);
//     const isRecordFormModalPresent = await recordFormModal.isPresent();
//     expect(isRecordFormModalPresent).toBe(true);

//     recordFormModal = await utam.load(RecordActionWrapper);
//     const recordForm = await recordFormModal.getRecordForm();
//     const recordLayout = await recordForm.getRecordLayout();

//     console.log("Access record form item by index (Name)");
//     let item = await recordLayout.getItem(1, 1, 1);

//     console.log("Enter Membership name");
//     const accountName = "TestUtam";
//     let input = await item.getTextInput();
//     await input.setText(accountName);

//     console.log("Access record form item by index (Status)");
//     item = await recordLayout.getItem(1, 1, 2);

//     console.log("Enter Membership status");
//     input = await item.getPicklist();

//     const comboBox = await input.getBaseCombobox();
//     await comboBox.expand();
//     const isComboBoxOpen = await comboBox.isOpen();
//     expect(isComboBoxOpen).toBe(true);
//     await comboBox.pickItemByLabel('Active');
    
//     console.log("Access record form item by index (Price)");
//     item = await recordLayout.getItem(1, 2, 2);

//     console.log("Enter Membership price");
//     input = await item.getTextInput();
//     await input.setText('100');

//     console.log("Access record form item by index (Available for Sale Online)");
//     item = await recordLayout.getItem(4, 1, 1);

//     console.log("Enter Membership Available for Sale Online");
//     input = await item.getRecordCheckbox();
//     const input2 = await input.getInput();
//     input2.click();

//     console.log("Save new record");
//     await recordForm.clickFooterButton("Save");
//     await recordFormModal.waitForAbsence();

//     console.log("Load Accounts Record Home page");
//     await utam.load(RecordHomeFlexipage2);
//   });
// });
