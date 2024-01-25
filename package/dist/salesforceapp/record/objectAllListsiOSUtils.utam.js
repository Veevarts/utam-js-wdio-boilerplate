/**
 * @typedef {Object} UtamUtilitiesContext 
 * @property {import("salesforceapp-pageobjects/pageObjects/record/objectAllLists").default} pageObject
 */

const MAX_NUM_OF_SCROLL = 25;
const FLICK_UP_OFFSET = -400;
const FLICK_DOWN_OFFSET = 400;

/**
 * Utility function that to check if there is sobject list with target label 
 * from sobject all list
 * @param {UtamUtilitiesContext} utilityContext 
 * @param {string} label sobject list label
 */
export async function hasList(
    utilityContext,
    label) {
    const { pageObject: ObjectAllLists } = utilityContext;
    // Find item on the current page
    const onScreenItems = await ObjectAllLists.getVisibleListCells();
    let matchedItem = await getListCellWithTitle(onScreenItems, label);
    if (!matchedItem) {
        // Scroll page to find item
        matchedItem = await scrollUpIntoView(ObjectAllLists, label) ?? 
            await scrollDownIntoView(ObjectAllLists, label);
    }
    return !!matchedItem;
}

/**
 * Utility function that to click the sobject with target label 
 * from sobject all list 
 * @param {UtamUtilitiesContext} utilityContext 
 * @param {string} label sobject list label
 */
export async function clickListCell(
        utilityContext, 
        label) {
    const { pageObject: ObjectAllLists } = utilityContext;
    // Find item on the current page
    const onScreenItems = await ObjectAllLists.getVisibleListCells();
    let matchedItem = await getListCellWithTitle(onScreenItems, label);
    if (!matchedItem) {
        // Scroll page to find item
        matchedItem = await scrollUpIntoView(ObjectAllLists, label) ?? 
            await scrollDownIntoView(ObjectAllLists, label);
        if (!matchedItem) {
            throw new Error(`Unable to scroll to and click on list with label: ${label}`);
        }
    }
    await matchedItem.click();
}

/**
 * @param {UtamUtilitiesContext["pageObject"]} objectAllLists
 * @param {string} label item label
 */
async function scrollUpIntoView(
        objectAllLists, 
        label) {
    let isFlicked = false;
    let scrollCount = 0;
    let matchedVisibleItem;

    do {
            let onScreenItems = await objectAllLists.getVisibleListCells();
            if (onScreenItems.length > 1) {
                // scroll down and check
                const lastBeforeFlick = await onScreenItems[onScreenItems.length - 1].getText();
                // ideally flick offset should be factor of display size, but there is no way to determine the size in imperative extension
                // 400 pixels gives a balance between phone and tablet, where we don't scroll too much that some items get skipped or too less that it is slow.
                const rootElement = await objectAllLists.getRoot();
                await rootElement.flick(0, FLICK_UP_OFFSET);
                onScreenItems = await objectAllLists.getVisibleListCells();
                if (onScreenItems.length > 1) {
                    const lastAfterFlick = await onScreenItems[onScreenItems.length - 1].getText();
                    isFlicked = lastAfterFlick !== lastBeforeFlick;
                }
            }
            matchedVisibleItem = await getListCellWithTitle(onScreenItems, label);
    } while(isFlicked && !matchedVisibleItem && scrollCount++ < MAX_NUM_OF_SCROLL);

    if (scrollCount > MAX_NUM_OF_SCROLL) {
        throw new Error(`Failed to scroll element into view due to maximum scroll count reached`);
    }

    return matchedVisibleItem;
}

/**
 * @param {UtamUtilitiesContext["pageObject"]} objectAllLists
 * @param {string} label item label
 */
async function scrollDownIntoView(
        objectAllLists, 
        label) {
    let isFlicked = false;
    let scrollCount = 0;
    let matchedVisibleItem;

    do {
            let onScreenItems = await objectAllLists.getVisibleListCells();
            if (onScreenItems.length > 1) {
                const firstBeforeFlick = await onScreenItems[0].getText();
                // ideally flick offset should be factor of display size, but there is no way to determine the size in imperative extension
                // 400 pixels gives a balance between phone and tablet, where we don't scroll too much that some items get skipped or too less that it is slow.
                const rootElement = await objectAllLists.getRoot();
                await rootElement.flick(0, FLICK_DOWN_OFFSET);
                onScreenItems = await objectAllLists.getVisibleListCells();
                if (onScreenItems.length > 0) {
                    const firstAfterFlick = await onScreenItems[0].getText();
                    isFlicked = firstAfterFlick !== firstBeforeFlick;
                }
            }
            matchedVisibleItem = await getListCellWithTitle(onScreenItems, label);
    } while(isFlicked && !matchedVisibleItem && scrollCount++ < MAX_NUM_OF_SCROLL);

    if (scrollCount > MAX_NUM_OF_SCROLL) {
        throw new Error(`Failed to scroll element into view due to maximum scroll count reached`);
    }

    return matchedVisibleItem;
}

/**
 * @typedef {import('@utam/core').BaseUtamElement} BaseUtamElement
 * @typedef {import('@utam/core').ActionableUtamElement} ActionableUtamElement
 * @typedef {import('@utam/core').ClickableUtamElement} ClickableUtamElement
 * @param {(BaseUtamElement & ActionableUtamElement & ClickableUtamElement)[]} items
 * @param {string} label item label
 */
async function getListCellWithTitle(
    items,
    label) {
    for (const item of items) {
        if ((await item.getText())?.trim().toUpperCase() === label.toUpperCase()) {
            // return the first matched one
            return item;
        }
    }
}
