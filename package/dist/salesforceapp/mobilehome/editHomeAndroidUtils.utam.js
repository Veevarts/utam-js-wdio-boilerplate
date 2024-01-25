/**
 * @typedef {Object} UtamUtilitiesContext
 * @property {import("salesforceapp-pageobjects/pageObjects/mobileHome/editHome").default} pageObject
 */

/**
 * Utility function that to remove a card with target label
 * from badge card list
 * @param {UtamUtilitiesContext} utilityContext
 * @param {string} cardName card Name
 */
export async function removeCardWithName(
    utilityContext,
    cardName) {
    const { pageObject: EditHome } = utilityContext;
    const deleteButtons = await EditHome.getDeleteCardButtons();
    if (deleteButtons.length === 0) {
        throw new Error(("No delete card buttons were found"));
    }
    const labelCells = await EditHome.getBadgeLabels();
    if (labelCells.length === 0) {
        throw new Error("No cards were found");
    }
    let uppercaseCardName = cardName.toUpperCase();
    for (const cell of labelCells) {
        if (uppercaseCardName === (await cell.getText()).toUpperCase()) {
            return await deleteButtons.get(labelCells.indexOf(cell)).click();
        }
    }
    throw new Error("No cards were found with a matching label");
}

