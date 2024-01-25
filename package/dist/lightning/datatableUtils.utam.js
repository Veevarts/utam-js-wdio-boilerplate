// @ts-check

/** @typedef {Object} UtamUtilitiesContext
 * @property{import("utam-lightning/pageObjects/datatable").default} pageObject
 */

/**
 * Utility function that returns the content of the cell at position rowIndex, columnIndex.
 * This method checks if the element in the datable is either a text, url or a number.
 *
 * @param {UtamUtilitiesContext} utilityContext UTAM context object for utilities
 * @param {number} rowIndex cell row index in the datatable
 * @param {number} columnIndex cell column index in the datatable
 * @returns {Promise<unknown>}
 */
export async function getCellValueByIndex(
    utilityContext,
    rowIndex,
    columnIndex
) {
    const { pageObject: Datatable } = utilityContext;

    const formattedText = await Datatable.getFormattedTextByColumnIndex(
        rowIndex,
        columnIndex
    );

    if (formattedText) {
        return formattedText.getInnerText();
    }

    const formattedUrl = await Datatable.getFormattedUrlByColumnIndex(
        rowIndex,
        columnIndex
    );
    if (formattedUrl) {
        return formattedUrl.getUrl();
    }

    const formattedNumber = await Datatable.getFormattedNumberByColumnIndex(
        rowIndex,
        columnIndex
    );
    if (formattedNumber) {
        return formattedNumber.getInnerText();
    }

    return null;
}

/**
 * Utility function that returns the content of a given cell in a row if it matches a certain label.
 * This method checks if the element in the datable is either a text, url or a number.
 *
 * @param {UtamUtilitiesContext} utilityContext UTAM context object for utilities
 * @param {number} rowIndex cell row index in the datatable
 * @param {string} fieldLabel label of the cell field
 */
export async function getCellValueByLabel(
    utilityContext,
    rowIndex,
    fieldLabel
) {
    const { pageObject: Datatable } = utilityContext;

    try {
        await Datatable.getCellByLabel(rowIndex, fieldLabel);
    } catch {
        return null;
    }

    const formattedText = await Datatable.getFormattedTextByLabel(
        rowIndex,
        fieldLabel
    );
    if (formattedText) {
        return formattedText.getInnerText();
    }

    const formattedUrl = await Datatable.getFormattedUrlByLabel(
        rowIndex,
        fieldLabel
    );
    if (formattedUrl) {
        return formattedUrl.getUrl();
    }

    const formattedNumber = await Datatable.getFormattedNumberByLabel(
        rowIndex,
        fieldLabel
    );
    if (formattedNumber) {
        return formattedNumber.getInnerText();
    }

    return null;
}

export async function getAttributeAsNumber(utilityContext, element, attr) {
    const attributeAsString = await element.getAttribute(attr);
    return Number(attributeAsString);
}

/**
 * Uses info from attributes and the currently last rendered row to scroll down table
 * We could avoid using lastRenderedRow for JS, but we need it for the Java implementation
 * since the data-last-rendered-row is updated after lastRenderedRow; the reason for this
 * is uncertain, but one possibility is that the Java tests handle one render at a time
 * while the Javascript tests may perform all related re-renders at once
 */
export async function scrollToLastRow(
    utilityContext,
    tableElement,
    lastRenderedRow
) {
    const { pageObject: Datatable } = utilityContext;
    const numRows = await Datatable.getNumRows();

    let lastRowNumber = await getAttributeAsNumber(
        utilityContext,
        lastRenderedRow,
        'data-row-number'
    );
    let lastRow = await Datatable.getRow(lastRowNumber);
    await lastRow.scrollToCenter();

    while (lastRowNumber < numRows) {
        lastRowNumber = await getAttributeAsNumber(
            utilityContext,
            tableElement,
            'data-last-rendered-row'
        );
        lastRow = await Datatable.getRow(lastRowNumber);
        await lastRow.scrollToCenter();
    }
    lastRow = await Datatable.getRow(numRows);
    await lastRow.moveTo();
}
