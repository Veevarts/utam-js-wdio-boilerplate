const MAX_NUM_OF_SCROLL = 25;
const FLICK_UP_OFFSET = -400;
const FLICK_DOWN_OFFSET = 400;

/**
 * Utility function that to click a navigation item with target label 
 * from navigation menu
 * @typedef {Object} UtamUtilitiesContext 
 * @property {import("salesforceapp-pageobjects/pageObjects/navigation/navItemsList").default} pageObject
 * @param {UtamUtilitiesContext} utilityContext
 * @param {string} itemLabel item label
 */
export async function clickNavItem(
        utilityContext, 
        itemLabel) {
    const { pageObject: NavItemsList } = utilityContext;
    if (!await NavItemsList.hasNavItemWithLabel(itemLabel)) {
        throw new Error(`Unable to find nav item with label: ${itemLabel}`);
    } else {
        // Find the item on the current page
        const onScreenItems = await NavItemsList.getVisibleNavItems();
        let matchedItem = await getNavItemWithLabel(onScreenItems, itemLabel);
        if (!matchedItem) {
            // Scroll the page to find the item
            matchedItem = await scrollUpIntoView(NavItemsList, itemLabel) ?? 
                await scrollDownIntoView(NavItemsList, itemLabel);
            if (!matchedItem) {
                throw new Error(`Unable to scroll to and click on nav item with label: ${itemLabel}`);
            }
        }
        await matchedItem.click();
    }
}

/**
 * @param {UtamUtilitiesContext["pageObject"]} navItemsList
 * @param {string} itemLabel app title
 */
async function scrollUpIntoView(
    navItemsList, 
    itemLabel) {
    let isFlicked = false;
    let scrollCount = 0;
    let matchedVisibleItem;

    do {
          let onScreenItems = await navItemsList.getVisibleNavItems();
          if (onScreenItems.length > 1) {
              // scroll down and check
              const lastBeforeFlick = await onScreenItems[onScreenItems.length - 1].getText();
              // ideally flick offset should be factor of display size, but there is no way to determine the size in imperative extension
              // 400 pixels gives a balance between phone and tablet, where we don't scroll too much that some items get skipped or too less that it is slow.
              const rootElement = await navItemsList.getRoot();
              await rootElement.flick(0, FLICK_UP_OFFSET);
              onScreenItems = await navItemsList.getVisibleNavItems();
              if (onScreenItems.length > 1) {
                  const lastAfterFlick = await onScreenItems[onScreenItems.length - 1].getText();
                  // if last item has changed after flick, more items are loaded
                  isFlicked = lastAfterFlick !== lastBeforeFlick;
              }
          }
          matchedVisibleItem = await getNavItemWithLabel(onScreenItems, itemLabel);
    } while(isFlicked && !matchedVisibleItem && scrollCount++ < MAX_NUM_OF_SCROLL);

    if (scrollCount > MAX_NUM_OF_SCROLL) {
      throw new Error(`Failed to scroll element into view due to maximum scroll count reached`);
    }

    return matchedVisibleItem;
}

/**
 * @param {UtamUtilitiesContext["pageObject"]} navItemsList
 * @param {string} itemLabel app title
 */
async function scrollDownIntoView(
    navItemsList, 
    itemLabel) {
    let isFlicked = false;
    let scrollCount = 0;
    let matchedVisibleItem;

    do {
            let onScreenItems = await navItemsList.getVisibleNavItems();
            if (onScreenItems.length > 1) {
                const firstBeforeFlick = await onScreenItems[0].getText();
                // ideally flick offset should be factor of display size, but there is no way to determine the size in imperative extension
                // 400 pixels gives a balance between phone and tablet, where we don't scroll too much that some items get skipped or too less that it is slow.
                const rootElement = await navItemsList.getRoot();
                await rootElement.flick(0, FLICK_DOWN_OFFSET);
                onScreenItems = await navItemsList.getVisibleNavItems();
                if (onScreenItems.length > 0) {
                    const firstAfterFlick = await onScreenItems[0].getText();
                    // if first item has changed after flick, more items are loaded
                    isFlicked = firstAfterFlick !== firstBeforeFlick;
                }
            }
            matchedVisibleItem = await getNavItemWithLabel(onScreenItems, itemLabel);
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
 * @param {string} itemLabel item label
 */
async function getNavItemWithLabel(
    items,
    itemLabel) {
    for (const item of items) {
        if ((await item.getText())?.trim().toUpperCase() === itemLabel.toUpperCase()) {
            // return the first matched one
            return item;
        }
    }
}
