const MAX_NUM_OF_SCROLL = 25;
const FLICK_UP_OFFSET = -400;
const FLICK_DOWN_OFFSET = 400;

/**
 * Utility function that to click an app item with target title 
 * from app launcher list
 * @typedef {Object} UtamUtilitiesContext 
 * @property {import("salesforceapp-pageobjects/pageObjects/navigation/appItemsList").default} pageObject
 * @param {UtamUtilitiesContext} utilityContext
 * @param {string} appTitle app title
 */
export async function clickAppItem(
        utilityContext, 
        appTitle) {
    const { pageObject: AppItemsList } = utilityContext;
    if (!await AppItemsList.hasAppItemWithTitle(appTitle)) {
        throw new Error(`Unable to find app item with title: ${appTitle}`);
    } else {
        // Find app on current page
        const onScreenItems = await AppItemsList.getVisibleAppItems();
        let matchedItem = await getAppItemWithTitle(onScreenItems, appTitle);
        if (!matchedItem) {
          // Scroll page to find the app
          matchedItem = await scrollUpIntoView(AppItemsList, appTitle) ?? 
            await scrollDownIntoView(AppItemsList, appTitle);
          if (!matchedItem) {
            throw new Error(`Unable to scroll to and click on app item with title: ${appTitle}`);
            }
        }
        await matchedItem.click();
    }
}

/**
 * @param {UtamUtilitiesContext["pageObject"]} appItemsList
 * @param {string} appTitle app title
 */
async function scrollUpIntoView(
        appItemsList,
        appTitle) {
    let isFlicked = false;
    let scrollCount = 0;
    let matchedVisibleItem;

    do {
          let onScreenItems = await appItemsList.getVisibleAppItems();
          if (onScreenItems.length > 1) {
              // scroll down and check
              const lastBeforeFlick = await onScreenItems[onScreenItems.length - 1].getText();
              // ideally flick offset should be factor of display size, but there is no way to determine the size in imperative extension
              // 400 pixels gives a balance between phone and tablet, where we don't scroll too much that some items get skipped or too less that it is slow.
              const rootElement = await appItemsList.getRoot();
              await rootElement.flick(0, FLICK_UP_OFFSET);
              onScreenItems = await appItemsList.getVisibleAppItems();
              if (onScreenItems.length > 1) {
                  const lastAfterFlick = await onScreenItems[onScreenItems.length - 1].getText();
                  isFlicked = lastAfterFlick !== lastBeforeFlick;
              }
          }
          matchedVisibleItem = await getAppItemWithTitle(onScreenItems, appTitle);
    } while(isFlicked && !matchedVisibleItem && scrollCount++ < MAX_NUM_OF_SCROLL);

    if (scrollCount > MAX_NUM_OF_SCROLL) {
      throw new Error(`Failed to scroll element into view due to maximum scroll count reached`);
    }

    return matchedVisibleItem;
}

/**
 * @param {UtamUtilitiesContext["pageObject"]} appItemsList
 * @param {string} appTitle app title
 */
async function scrollDownIntoView(
        appItemsList,
        appTitle) {
    let isFlicked = false;
    let scrollCount = 0;
    let matchedVisibleItem;

    do {
            let onScreenItems = await appItemsList.getVisibleAppItems();
            if (onScreenItems.length > 1) {
                const firstBeforeFlick = await onScreenItems[0].getText();
                // ideally flick offset should be factor of display size, but there is no way to determine the size in imperative extension
                // 400 pixels gives a balance between phone and tablet, where we don't scroll too much that some items get skipped or too less that it is slow.
                const rootElement = await appItemsList.getRoot();
                await rootElement.flick(0, FLICK_DOWN_OFFSET);
                onScreenItems = await appItemsList.getVisibleAppItems();
                if (onScreenItems.length > 0) {
                    const firstAfterFlick = await onScreenItems[0].getText();
                    isFlicked = firstAfterFlick !== firstBeforeFlick;
                }
            }
            matchedVisibleItem = await getAppItemWithTitle(onScreenItems, appTitle);
    } while(isFlicked && !matchedVisibleItem && scrollCount++ < MAX_NUM_OF_SCROLL);

    if (scrollCount > MAX_NUM_OF_SCROLL) {
      throw new Error(`Failed to scroll element into view due to maximum scroll count reached`);
    }

    return matchedVisibleItem;
}

/**
 * @typedef {import('@utam/core').BaseUtamElement} BaseUtamElement
 * @typedef {import('@utam/core').ClickableUtamElement} ClickableUtamElement
 * @typedef {import('@utam/core').TouchableUtamElement} TouchableUtamElement
 * @param {(BaseUtamElement & ClickableUtamElement & TouchableUtamElement)[]} items
 * @param {string} itemTitle app title
 */
async function getAppItemWithTitle(
        items,
        itemTitle) {
    for (const item of items) {
        if ((await item.getText())?.trim().toUpperCase() === itemTitle.toUpperCase()) {
            // return the first matched one
            return item;
        }
    }
}
