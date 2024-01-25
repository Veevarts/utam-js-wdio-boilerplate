// @ts-check

/** @typedef {Object} UtamUtilitiesContext
 * @property{import("utam-lst/pageObjects/relatedListQuickLinksGrid").default} pageObject
 */

/**
 * Get a quick link by the name of the link within a quick link grid container.
 *
 * @param {UtamUtilitiesContext} utilityContext holds properties that utility require for page object interactions
 * @param {string} relatedListName the name of the link to find
 * @return the related list quick link matching the given name
 */
export async function getLink(utilityContext, relatedListName) {
    // instead of calling getInstance(), use utilityContext.pageObject to interact with the PO APIs
    const { pageObject : relatedListQuickLinksGridPO } = utilityContext;
    const quickLinks = await relatedListQuickLinksGridPO.getQuickLinks();
    await relatedListQuickLinksGridPO.toggleShowAll();
    for await (let quickLink of quickLinks) {
        /** hoverableLink PO is being updated as part of bug #W-9462918, this utility to be revisited once the bug resolved*/
        const hoverableLink = await quickLink.getHoverableLink()
        if ((await hoverableLink.getLinkTextWhenNotNavigable()).startsWith(relatedListName)) {
            return quickLink;
        }
    }
    throw new Error('Could not find related list with name '+ relatedListName);
}