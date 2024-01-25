/**
 * @typedef {Object} UtamUtilitiesContext 
 * @property {import("salesforceapp-pageobjects/pageObjects/record/actionBarOverflow").default} pageObject
 */

const MAX_NUM_OF_SCROLL = 25;
const FLICK_UP_OFFSET = -200;

/**
 * Utility function that to click an action item with target label 
 * from action overflow menu
 * @param {UtamUtilitiesContext} utilityContext
 * @param {string} label action label
 */
export async function clickAction(
    utilityContext, 
    label) {
    const { pageObject: ActionBarOverflow } = utilityContext;
    const actions = await ActionBarOverflow.getVisibleActions();
    // Find item on the current page, otherwise scroll page to find item
    let targetAction = await getActionWithLabel(actions, label) ?? 
        await scrollIntoView(ActionBarOverflow, label);
    if (!targetAction) {
        throw new Error(`Unable to find action with label: ${label}`);
    }
    await targetAction.click();
}

/**
 * Utililit function that to get all action labels back from action overflow menu
 * @param {UtamUtilitiesContext} utilityContext utilityContext UTAM context object for utilities
 */
 export async function getLabels(utilityContext) {
    let isFlicked = false;
    let scrollCount = 0;
    /**
     * @type {(string | null)[]}
     */
    let visibleLabels = [];
    const { pageObject: ActionBarOverflow } = utilityContext;
    do {
        const actions = await ActionBarOverflow.getVisibleActions();
        for (const action of actions) {
            visibleLabels.push(await action.getText())
        }
        isFlicked = await flickList(ActionBarOverflow, actions);
    } while (isFlicked && scrollCount++ < MAX_NUM_OF_SCROLL);
    return visibleLabels;
}

/**
 * @param {UtamUtilitiesContext["pageObject"]} actionBarOverflow
 * @param {string} label item label
 */
async function scrollIntoView(
    actionBarOverflow,
    label) {
    let isFlicked = false;
    let scrollCount = 0;
    let targetAction;
  
    do {
        let actions = await actionBarOverflow.getVisibleActions()
        isFlicked = await flickList(actionBarOverflow, actions);
        if (isFlicked) {
            targetAction = await getActionWithLabel(actions, label);
        }
    } while(isFlicked && !targetAction && scrollCount++ < MAX_NUM_OF_SCROLL);

    if (scrollCount > MAX_NUM_OF_SCROLL) {
        throw new Error(`Failed to scroll element into view due to maximum scroll count reached`);
    }

    return targetAction;
}

/**
 * @typedef {import('@utam/core').BaseUtamElement} BaseUtamElement
 * @typedef {import('@utam/core').ActionableUtamElement} ActionableUtamElement
 * @typedef {import('@utam/core').ClickableUtamElement} ClickableUtamElement
 * @param {(BaseUtamElement & ActionableUtamElement & ClickableUtamElement)[]} actions
 * @param {string} actionLabel action label
 */
async function getActionWithLabel(
    actions, 
    actionLabel) {
    for (const action of actions) {
        if ((await action.getText())?.trim().toUpperCase() === actionLabel.toUpperCase()) {
            // return the first matched one
            return action;
        }
    }
}

/**
 * @param {UtamUtilitiesContext["pageObject"]} actionBarOverflow
 * @param {(BaseUtamElement & ActionableUtamElement & ClickableUtamElement)[]} actions
 */
async function flickList(
    actionBarOverflow, 
    actions) {
    if (actions.length > 1) {
        const lastBeforeFlick = await actions[actions.length - 1].getText();
        const rootElement = await actionBarOverflow.getRoot();
        await rootElement.flick(0, FLICK_UP_OFFSET);
        const visibleActions = await actionBarOverflow.getVisibleActions();
        if (visibleActions.length > 1) {
            const lastAfterFlick = await visibleActions[visibleActions.length - 1].getText();
            return lastAfterFlick !== lastBeforeFlick;
        }
    }
    // end of list is reached
    return false;
}
