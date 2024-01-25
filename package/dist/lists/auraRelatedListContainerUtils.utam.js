// @ts-check

/**
 * @typedef {Object} UtamUtilitiesContext
 * @property {import("utam-lst/pageObjects/auraRelatedListContainer").default} pageObject
 */

/**
 * Clicks on view less button, if exists and returns true, false otherwise
 *
 * @param {UtamUtilitiesContext} utilityContext holds properties that utility require for page object interactions
 * @returns {Promise<boolean>}
 */
export async function viewLess(utilityContext) {
    const { pageObject } = utilityContext;
    if (await pageObject.canViewLess()) {
        const viewMoreOrLessBtn = await pageObject.getViewMoreOrLessBtn();
        await viewMoreOrLessBtn.click();
        return true;
    }
    return false;
}

/**
 * Clicks on view more button, if exists and returns true, false otherwise
 * @returns {Promise<boolean>}
 */
export async function viewMore(utilityContext) {
    const { pageObject } = utilityContext;
    if (await pageObject.canViewMore()) {
        const viewMoreOrLessBtn = await pageObject.getViewMoreOrLessBtn();
        await viewMoreOrLessBtn.click();
        return true;
    }
    return false;
}

/**
 * Checks for given related list item on the current screen.
 * If not found, clicks on view more (if exists) and looks
 * for the respective item and clicks on it once found.
 *
 * @param {UtamUtilitiesContext} utilityContext holds properties that utility require for page object interactions
 * @param {string} itemName search string
 */
export async function clickRelatedListItem(utilityContext, itemName) {
    const { pageObject } = utilityContext;
    if (await pageObject.hasRelatedListItem(itemName)) {
        const relatedListItem = await pageObject.getRelatedListItemByLabel(itemName);
        await relatedListItem.click();
        return;
    }
    while (await pageObject.canViewMore()) {
        await viewMore(utilityContext);
        if (await pageObject.hasRelatedListItem(itemName)) {
            const relatedListItem = await pageObject.getRelatedListItemByLabel(itemName);
            await relatedListItem.click();
            return;
        }
    }
    throw new Error(`Could not find related list with name ${itemName}`);
}