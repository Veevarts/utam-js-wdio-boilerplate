const MAX_NUM_OF_SCROLL = 25;
const FLICK_UP_OFFSET = -400;
const FLICK_DOWN_OFFSET = 400;

/**
 * Utility function that to check if the search result list includes
 * the record that has target title
 * @typedef {Object} UtamUtilitiesContext 
 * @property {import("salesforceapp-pageobjects/pageObjects/record/searchResult").default} pageObject
 * @param {UtamUtilitiesContext} utilityContext  
 * @param {string} title record title
 */
export async function hasRecord(
        utilityContext, 
        title) {
    const { pageObject: SearchResult } = utilityContext;
    const onScreenItems = await SearchResult.getVisibleRecordCards();
    // Find the record on the current page
    let matchedItem = await getRecordsMatchingTitle(onScreenItems, title);
    if (!matchedItem) {
        matchedItem = await scrollUpIntoView(SearchResult, title) ?? 
            await scrollDownIntoView(SearchResult, title);
    }
    return !!matchedItem;
}

/**
 * Utility function that to click the record that has target title 
 * from search result list
 * @property {import("salesforceapp-pageobjects/pageObjects/record/searchResult").default} pageObject
 * @param {UtamUtilitiesContext} utilityContext  
 * @param {string} title record title
 */
export async function clickRecord(
        utilityContext, 
        title) {
    const { pageObject: SearchResult } = utilityContext;
    const onScreenItems = await SearchResult.getVisibleRecordCards();
    // Find the record on the current page
    let matchedItem = await getRecordsMatchingTitle(onScreenItems, title);
    if (!matchedItem) {
        matchedItem = await scrollUpIntoView(SearchResult, title) ?? 
            await scrollDownIntoView(SearchResult, title);
    }
    if (!matchedItem) {
        throw new Error(`Unable to scroll to and click on record with label: ${title}`);
    }
    await matchedItem.click();
}

/**
 * @param {import("salesforceapp-pageobjects/pageObjects/record/searchResult").default} searchResult
 * @param {string} title item title
 */
async function scrollUpIntoView(searchResult, title) {
    let isFlicked = false;
    let scrollCount = 0;
    let matchedVisibleItem;

    do {
            let onScreenItems= await searchResult.getVisibleRecordCards()
            if (onScreenItems.length > 1) {
                // scroll down and check
                const lastBeforeFlick = await onScreenItems[onScreenItems.length - 1].getText();
                // ideally flick offset should be factor of display size, but there is no way to determine the size in imperative extension
                // 400 pixels gives a balance between phone and tablet, where we don't scroll too much that some items get skipped or too less that it is slow.
                const rootElement = await searchResult.getRoot();
                await rootElement.flick(0, FLICK_UP_OFFSET);
                onScreenItems = await searchResult.getVisibleRecordCards();
                if (onScreenItems.length > 1) {
                    const lastAfterFlick = await onScreenItems[onScreenItems.length - 1].getText();
                    // if last item has changed after flick, more items are loaded
                    isFlicked = lastAfterFlick !== lastBeforeFlick ? true : false;
                }
            }
            matchedVisibleItem = await getRecordsMatchingTitle(onScreenItems, title);
    } while(isFlicked && !matchedVisibleItem && scrollCount++ < MAX_NUM_OF_SCROLL);

    if (scrollCount > MAX_NUM_OF_SCROLL) {
        throw new Error(`Failed to scroll element into view due to maximum scroll count reached`);
    }

    return matchedVisibleItem;
}

/**
 * @param {import("salesforceapp-pageobjects/pageObjects/record/searchResult").default} searchResult
 * @param {string} title item title
 */
async function scrollDownIntoView(searchResult, title) {
    let isFlicked = false;
    let scrollCount = 0;
    let matchedVisibleItem;

    do {
            let onScreenItems = await searchResult.getVisibleRecordCards();
            if (onScreenItems.length > 1) {
                const firstBeforeFlick = await onScreenItems[0].getText();
                // ideally flick offset should be factor of display size, but there is no way to determine the size in imperative extension
                // 400 pixels gives a balance between phone and tablet, where we don't scroll too much that some items get skipped or too less that it is slow.
                const rootElement = await searchResult.getRoot();
                await rootElement.flick(0, FLICK_DOWN_OFFSET);
                onScreenItems = await searchResult.getVisibleRecordCards();
                if (onScreenItems.length > 0) {
                    const firstAfterFlick = await onScreenItems[0].getText();
                    // if first item has changed after flick, more items are loaded
                    isFlicked = firstAfterFlick !== firstBeforeFlick ? true : false;
                }
            }
            matchedVisibleItem = await getRecordsMatchingTitle(onScreenItems, title);
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
 * @param {string} title item title
 */
async function getRecordsMatchingTitle(
        items,
        title) {
    for (const item of items) {
        if ((await item.getText())?.trim().toLocaleUpperCase() === title.toLocaleUpperCase()) {
            // return the first matched one
            return item;
        }
    }
}
