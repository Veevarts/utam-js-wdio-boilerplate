/**
 * @typedef {Object} UtamUtilitiesContext
 * @property {import("salesforceapp-pageobjects/pageObjects/mobileHome/homeCardList").default} pageObject
 */

const MAX_NUM_OF_FLICK = 25;

/**
 * Utility function that to click a card with target label
 * from badge card list
 * @param {UtamUtilitiesContext} utilityContext
 * @param {string} badgeLabel badge label
 */
export async function clickCardBadgeWithLabel(
    utilityContext,
    badgeLabel) {
    const { pageObject: HomeCardList } = utilityContext;
    if (!await HomeCardList.hasCardWithBadgeLabel(badgeLabel)) {
        throw new Error(`Unable to find nav item with label: ${badgeLabel}`);
    } else {
        const onScreenItems = await HomeCardList.getVisibleCardBadges();
        // Find item on current page
        const matchedVisibleItem = await getCardBadgeWithLabel(onScreenItems, badgeLabel) ??
            await scrollCardBadgeIntoView(HomeCardList, badgeLabel);
        if (!matchedVisibleItem) {
            throw new Error(`Unable to scroll to and click on nav item with label: ${badgeLabel}`);
        }
        await matchedVisibleItem.click();
    }
}

/**
 * Utility function that to check if there is card with target title
 * from badge card list
 * @param {UtamUtilitiesContext} utilityContext
 * @param {string} itemLabel card label
 */
export async function hasCardWithBadgeLabel(
    utilityContext,
    itemLabel) {
    const { pageObject: HomeCardList } = utilityContext;
    // Find the item on the current page
    const onScreenItems = await HomeCardList.getVisibleCardBadges();
    const matchedVisibleItem = await getCardBadgeWithLabel(onScreenItems, itemLabel) ??
        await scrollCardBadgeIntoView(HomeCardList, itemLabel);
    return !!matchedVisibleItem;
}

/**
 * Utility function that to scroll card with target title into view
 * from badge card list
 * @param {UtamUtilitiesContext} utilityContext
 * @param {string} itemLabel card label
 */
export async function scrollToElementToGetText(
    utilityContext,
    itemLabel) {
    const { pageObject: HomeCardList } = utilityContext;
    const onScreenCardBadges = await HomeCardList.getVisibleCardBadges();
    const matchedVisibleItem = await getCardBadgeWithLabel(onScreenCardBadges, itemLabel) ??
        await scrollCardBadgeIntoView(HomeCardList, itemLabel);
    if (!matchedVisibleItem) {
        return "";
    }
    return await matchedVisibleItem.getText();
}

/**
 * @param {UtamUtilitiesContext["pageObject"]} homeCardList
 * @param {string} itemLabel item label
 */
async function scrollCardBadgeIntoView(
    homeCardList,
    itemLabel) {
    // Ideally flick offset should be a factor of the display size, but there is no way to determine the size in
    // imperative extension |400| pixels gives a balance between phone and tablet, where automation doesn't flick too
    // much that some items get skipped or too less that it is slow
    // Flick down and try to find the card and then up if it didn't find the card
    const yFlick = 400
    return await scrollIntoView(homeCardList, itemLabel, -yFlick) ??
        await scrollIntoView(homeCardList, itemLabel, yFlick);
}

/**
 * @param {UtamUtilitiesContext["pageObject"]} homeCardList
 * @param {string} itemLabel item label
 * @param {int} yFlick how far to flick
 */
async function scrollIntoView(
    homeCardList,
    itemLabel,
    yFlick) {
    let onScreenCardBadges = await homeCardList.getVisibleCardBadges();
    let matchedVisibleItem;
    let length = onScreenCardBadges !== null ? onScreenCardBadges.length : 0;
    if (0 === length) {
        return null;
    } else {
        matchedVisibleItem = await getCardBadgeWithLabel(onScreenCardBadges, itemLabel);
        if (matchedVisibleItem !== null) {
            return matchedVisibleItem;
        }
        let directionalEndBeforeFlick = await onScreenCardBadges[length - 1].getText();
        let directionalEndAfterFlick = null
        let rootElement;
        let flickCount = 0;
        // Only enter if the item isn't already found and there's at least one card
        do {
            // Flick
            rootElement = await homeCardList.getRoot();
            await rootElement.flick(0, yFlick);
            flickCount++
            // Get the second card if one exists and if any cards exist, look if the desired card is on the screen
            onScreenCardBadges = await homeCardList.getVisibleCardBadges();
            length = onScreenCardBadges !== null ? onScreenCardBadges.length : 0;
            if (0 < length) {
                directionalEndAfterFlick = await onScreenCardBadges[length - 1].getText();
                matchedVisibleItem = await getCardBadgeWithLabel(onScreenCardBadges, itemLabel);
            }
            // If the card was found, or the list wasn't flicked, just return whatever was found
            if (
                matchedVisibleItem !== null ||
                (directionalEndBeforeFlick === null && directionalEndAfterFlick === null) ||
                (directionalEndBeforeFlick !== null && directionalEndBeforeFlick === directionalEndAfterFlick)
            ) {
                return matchedVisibleItem;
            }
            // --------------------------------------------------------------
            // The list was flicked and the desired card not found, try again
            // Get the first card if one exists
            onScreenCardBadges = await homeCardList.getVisibleCardBadges();
            length = onScreenCardBadges !== null ? onScreenCardBadges.length : 0;
            if (0 < length) {
                directionalEndBeforeFlick = await onScreenCardBadges[length - 1].getText();
            }
        } while(flickCount < MAX_NUM_OF_FLICK);
        throw new Error(`Failed to scroll element into view due to maximum scroll count reached`);
    }
}

/**
 * @typedef {import('@utam/core').BaseUtamElement} BaseUtamElement
 * @typedef {import('@utam/core').ActionableUtamElement} ActionableUtamElement
 * @typedef {import('@utam/core').ClickableUtamElement} ClickableUtamElement
 * @param {(BaseUtamElement & ActionableUtamElement & ClickableUtamElement)[]} items
 * @param {string} itemLabel item label
 */
async function getCardBadgeWithLabel(
    items,
    itemLabel) {
    for (const item of items) {
        if ((await item.getText())?.trim().toUpperCase() === itemLabel.toUpperCase()) {
            // return the first matched one
            return item;
        }
    }
}
