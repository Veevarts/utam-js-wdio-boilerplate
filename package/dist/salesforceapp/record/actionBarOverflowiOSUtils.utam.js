const MAX_NUM_OF_SCROLL = 25;
const FLICK_UP_OFFSET = -200;

/**
 * Utility function that to click an action item with target label 
 * from action overflow menu
 * @typedef {Object} UtamUtilitiesContext 
 * @property {import("salesforceapp-pageobjects/pageObjects/record/actionBarOverflow").default} pageObject
 * @param {UtamUtilitiesContext} utilityContext 
 * @param {string} actionLabel action label
 */
export async function clickAction(
        utilityContext, 
        actionLabel) {
    const { pageObject: ActionBarOverflow } = utilityContext;
    if (!(await ActionBarOverflow.getAllActionLabels())
        .some(label => label === actionLabel)) {
        throw new Error(`Unable to find action with label: ${actionLabel}`);
    } else {
        const onScreenActions = await ActionBarOverflow.getVisibleActions();
        // Find item on the current page, otherwise scroll page to find item
        let matchedAction = await getActionWithLabel(onScreenActions, actionLabel) ?? 
            await scrollIntoView(ActionBarOverflow, actionLabel);
        if (!matchedAction) {
            throw new Error(`Unable to scroll to and click on action with label: ${actionLabel}`);
        } 
        await matchedAction.click();
    }
}

/**
 * @param {UtamUtilitiesContext["pageObject"]} actionBarOverflow
 * @param {string} actionLabel item label
 */
async function scrollIntoView(
        actionBarOverflow, 
        actionLabel) {
    let isFlicked = false;
    let scrollCount = 0;
    let matchedVisibleItem;

    do {
          let onScreenItems = await actionBarOverflow.getVisibleActions();
          if (onScreenItems.length > 1) {
              // scroll down and check
              const lastBeforeFlick = await onScreenItems[onScreenItems.length - 1].getText();
              // ideally flick offset should be factor of display size, but there is no way to determine the size in imperative extension
              // 200 pixels gives a balance between phone and tablet, where we don't scroll too much that some items get skipped or too less that it is slow.
              const rootElement = await actionBarOverflow.getRoot();
              await rootElement.flick(0, FLICK_UP_OFFSET);
              onScreenItems = await actionBarOverflow.getVisibleActions();
              if (onScreenItems.length > 1) {
                  const lastAfterFlick = await onScreenItems[onScreenItems.length - 1].getText();
                  isFlicked = lastAfterFlick !== lastBeforeFlick;
              }
          }
          matchedVisibleItem = await getActionWithLabel(onScreenItems, actionLabel);
    } while(isFlicked && !matchedVisibleItem && scrollCount++ < MAX_NUM_OF_SCROLL);

    if (scrollCount > MAX_NUM_OF_SCROLL) {
      throw new Error(`Failed to scroll element into view due to maximum scroll count reached`);
    }

    // If the scroll started from middle of the list, an item might be missed
    // Scrolling up can't be done because when the top of the list is reached, flick closes the overflow
    return matchedVisibleItem;
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
