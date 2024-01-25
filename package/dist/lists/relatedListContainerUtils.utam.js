// @ts-check

/** @typedef {Object} UtamUtilitiesContext
 * @property{import("utam-lst/pageObjects/relatedListContainer").default} pageObject
 */

/**
 * Retruns the relatedlist container with the given name, throws error if the container with given name is not found
 * @param {UtamUtilitiesContext} utilityContext holds properties that utility require for page object interactions
 * @param {string} name - container name to be returned
 */
export async function getRelatedList(utilityContext, name) {
    // instead of calling getInstance(), use utilityContext.pageObject to interact with the PO APIs
    const { pageObject: relatedListContainerPO } = utilityContext;

    const relatedLists = await relatedListContainerPO.getRelatedLists();

    for (let container of relatedLists) {
        if ((await container.getAuraRelatedList()) !== null) {
            // We don't support searching through the Aura LPOP objects, so we are unable to check names
            continue;
        }
        await container.waitForAppBuilderListToLoad();
        const relatedListViewManager = await container.getRelatedListViewManager();
        const commonListInternal = await relatedListViewManager.getCommonListInternal();
        const header = await commonListInternal.getHeader();

        const title = await header.getTitle();
        const titleText = await title.getText();

        if (titleText === name) {
            return container;
        }
    }
    throw new Error(`Could not find LWC related list with name: ${name}`);
}