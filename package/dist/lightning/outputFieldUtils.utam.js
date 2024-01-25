// @ts-check

/** @typedef {Object} UtamUtilitiesContext
 * @property{import("utam-lightning/outputField").default} pageObject
 */

const map = {
    name: (po) => po.getNameString(),
    address: (po) => po.getAddressString(),
    text: (po) => po.getTextString(),
    number: (po) => po.getNumberString(),
    email: (po) => po.getEmailString(),
    location: (po) => po.getLocationString(),
    phone: (po) => po.getPhoneString(),
    url: (po) => po.getUrlString(),
    richtext: (po) => po.getRichtextString(),
    lookup: (po) => po.getLookupString(),
};

/**
 * Routing function: runs dedicated function depending on fieldType value
 * @param {UtamUtilitiesContext} utilityContext
 * @param {string} fieldType - represents the type of field
 * @return {Promise<string | null>} the field value
 */
export async function getFieldValue(utilityContext, fieldType) {
    if (!map[fieldType]) {
        throw new Error(
            `OutputField page object utilities: unknown field type '${fieldType}'`
        );
    }
    const { pageObject: outputFieldPO } = utilityContext;
    const fieldValue = await map[fieldType](outputFieldPO);
    return fieldValue;
}

/**
 * Get the value of the address field. Remains imperative because if/else is not supported
 * @param {UtamUtilitiesContext} utilityContext
 * @return {Promise<string>}
 */
export async function getAddress(utilityContext) {
    const { pageObject: outputFieldPO } = utilityContext;
    const formattedAddress = await outputFieldPO.getFormattedAddress();
    let value = null;
    if (await formattedAddress.isEnabled()) {
        value = await formattedAddress.getAriaLabel();
    } else {
        const textSegments = await formattedAddress.getTextContent();
        value = textSegments.join('\r\n');
    }
    return value;
}
