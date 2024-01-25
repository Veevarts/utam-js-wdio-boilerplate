const MAX_NUM_OF_SCROLL = 25;
const FLICK_UP_OFFSET = -400;
const FLICK_DOWN_OFFSET = 400;

/**
 * Utility function that to click an record item with target title 
 * from favorite list
 * @typedef {Object} UtamUtilitiesContext 
 * @property {import("salesforceapp-pageobjects/pageObjects/record/favoriteList").default} pageObject
 * @param {UtamUtilitiesContext} utilityContext
 * @param {string} title record title
 */
export async function clickRecord(utilityContext, title) {
    const { pageObject: FavoriteList } = utilityContext;
    if (!await FavoriteList.hasRecord(title)) {
        throw new Error(`Unable to find record with title: ${title}`);
    } else {
        const onScreenItems = await FavoriteList.getVisibleFavoriteRecords();
        // Find item on the current page
        let matchedItem = await getRecordsWithTitle(onScreenItems, title);
        if (!matchedItem) {
            // Scroll page to find item
            matchedItem = await scrollUpIntoView(FavoriteList, title) ?? 
                await scrollDownIntoView(FavoriteList, title);
            if (!matchedItem) {
                throw new Error(`Unable to scroll to and click on record with title: ${title}`);
            }
        }
        await matchedItem.click();
    }
}

/**
 * @param {UtamUtilitiesContext["pageObject"]} favoriteList
 * @param {string} title item title
 */
async function scrollUpIntoView(favoriteList, title) {
    let isFlicked = false;
    let scrollCount = 0;
    let matchedVisibleItem;

    do {
          let onScreenItems = await favoriteList.getVisibleFavoriteRecords();
          if (onScreenItems.length > 1) {
              // scroll down and check
              const lastBeforeFlick = await onScreenItems[onScreenItems.length - 1].getText();
              // ideally flick offset should be factor of display size, but there is no way to determine the size in imperative extension
              // 400 pixels gives a balance between phone and tablet, where we don't scroll too much that some items get skipped or too less that it is slow.
              const rootElement = await favoriteList.getRoot();
              await rootElement.flick(0, FLICK_UP_OFFSET);
              onScreenItems = await favoriteList.getVisibleFavoriteRecords();
              if (onScreenItems.length > 1) {
                  const lastAfterFlick = await onScreenItems[onScreenItems.length - 1].getText();
                  isFlicked = lastAfterFlick !== lastBeforeFlick;
              }
          }
          matchedVisibleItem = await getRecordsWithTitle(onScreenItems, title);
    } while(isFlicked && !matchedVisibleItem && scrollCount++ < MAX_NUM_OF_SCROLL);
    
    if (scrollCount > MAX_NUM_OF_SCROLL) {
        throw new Error(`Failed to scroll element into view due to maximum scroll count reached`);
    }

    return matchedVisibleItem;
}

/**
 * @param {UtamUtilitiesContext["pageObject"]} favoriteList
 * @param {string} title item title
 */
async function scrollDownIntoView(favoriteList, title) {
    let isFlicked = false;
    let scrollCount = 0;
    let matchedVisibleItem;

    do {
            let onScreenItems = await favoriteList.getVisibleFavoriteRecords();
            if (onScreenItems.length > 1) {
                const firstBeforeFlick = await onScreenItems[0].getText();
                // ideally flick offset should be factor of display size, but there is no way to determine the size in imperative extension
                // 400 pixels gives a balance between phone and tablet, where we don't scroll too much that some items get skipped or too less that it is slow.
                const rootElement = await favoriteList.getRoot();
                await rootElement.flick(0, FLICK_DOWN_OFFSET);
                onScreenItems = await favoriteList.getVisibleFavoriteRecords();
                if (onScreenItems.length > 0) {
                    const firstAfterFlick = await onScreenItems[0].getText();
                    isFlicked = firstAfterFlick !== firstBeforeFlick;
                }
            }
             matchedVisibleItem = await getRecordsWithTitle(onScreenItems, title);
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
async function getRecordsWithTitle(items, title) {
    for (const item of items) {
        if ((await item.getText())?.trim().toUpperCase() === title.toUpperCase()) {
            // return the first matched one
            return item;
        }
    }
}
