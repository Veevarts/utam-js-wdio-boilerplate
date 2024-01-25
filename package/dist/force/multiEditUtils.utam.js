// @ts-check

/** @typedef {Object} UtamUtilitiesContext
 * @property{import("utam-force/pageObjects/multiEdit").default} pageObject
 */
import ListViewManagerPrimaryDisplayManager from 'utam-force/pageObjects/listViewManagerPrimaryDisplayManager';
import ActionButton from 'utam-force/pageObjects/actionButton';

/**
 * this function sets value to smart input number inside cell grid <br>
 * @param {UtamUtilitiesContext} utilityContext holds properties that utility require for page object interactions
 * @param {number} rowIndex row index of the table cell, starts from 0
 * @param {number} colIndex column index of the cell, starts from 0
 * @param {string} valueToSet new value to set
 */
export async function setSmartInputValue(utilityContext, rowIndex, colIndex, valueToSet) {
    // instead of calling getInstance(), use utilityContext.pageObject to interact with the PO APIs
    const { pageObject: multiEditPO } = utilityContext;

    await multiEditPO.waitForVisible();
    const listViewManager = await multiEditPO.getListViewManager();
    const listViewContainer = await listViewManager.getListViewContainer(ListViewManagerPrimaryDisplayManager);
    const managerGrid = await listViewContainer.getManagerGrid();
    const inlineEditGrid = await managerGrid.getInlineEditGrid();
    const table = await inlineEditGrid.getTable();

    const button = await table.getCellComponent(rowIndex, colIndex, ActionButton);
    await button.click();
    const inputField = await table.getCellInput(rowIndex, colIndex);

    // read current value and use back spaces to erase it from cell
    const fieldLength = (await inputField.getValue()).length;
    for (let i = 0; i < fieldLength; i++) {
        await inputField.press('Backspace');
    }
    await inputField.setText(valueToSet);
    await inputField.press('Enter');
}
