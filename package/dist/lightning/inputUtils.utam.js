// @ts-check

/** @typedef {Object} UtamUtilitiesContext
 * @property{import("utam-lightning/pageObjects/input").default} pageObject
 */

/**
 * This function is to select date from datePicker
 * Date should be in 'yyyy-mm-dd' format
 * @param {UtamUtilitiesContext} utilityContext
 * @param {string} date
 */
export async function selectDate(utilityContext, date) {
    if (!isValidDate(date)) {
        throw new Error('Invalid date format: date format must be yyyy-mm-dd');
    }

    const { pageObject: inputPO } = utilityContext;
    const parts = date.split('-');
    const datePicker = await getDateOrTimepicker(inputPO, 'datepicker');
    await inputPO.scrollToCenter();
    await (await datePicker.getOpenButton()).clickButton();
    const calendar = await datePicker.getCalendar();
    const yearSelector = await calendar.getYearSelector();
    await yearSelector.selectByValue(parts[0]);

    //get month index from calendar and

    const monthText = await calendar.getMonthText();
    let actualMonth =
        new Date(`${monthText} ${new Date().getFullYear()}`).getMonth() + 1;
    let expectedMonth = new Date(date).getMonth() + 1;

    if (actualMonth < expectedMonth) {
        while (actualMonth !== expectedMonth) {
            const nextMonthButton = await calendar.getNextMonthButton();
            await nextMonthButton.clickButton();
            actualMonth++;
        }
    } else {
        while (actualMonth !== expectedMonth) {
            const prevMonthButton = await calendar.getPrevMonthButton();
            await prevMonthButton.clickButton();
            actualMonth--;
        }
    }
    await calendar.clickDayByDate(date);
}

/**
 * This function is to select time from input timePicker
 * time should be in H:MM XM format  ex: 10:30 AM and 2:45 PM
 * @param {UtamUtilitiesContext} utilityContext
 * @param {string} time
 */
export async function selectTime(utilityContext, time) {
    if (!isValidTime(time)) {
        throw new Error('Invalid time format: format must be H:MM XM');
    }
    const { pageObject: inputPO } = utilityContext;
    const timePicker = await getDateOrTimepicker(inputPO, 'timepicker');
    await timePicker.clear();
    const base = await timePicker.getTimeCombobox();
    const input = await base.getRoot();
    await input.click();

    const options = await base.getItems();
    // eslint-disable-next-line @lwc/lwc/no-for-of
    for (const option of options) {
        if (option.getItemByLabel(time)) {
            await input.setText(time);
            await input.blur();
            break;
        }
    }
}

/**
 * Returns either a datepicker or a timepicker PO from the input or datetimepicker PO
 * @param {UtamUtilitiesContext['pageObject']} inputPO
 * @param {string} componentName Either datepicker or timepicker, name of the component that will be returned
 * @returns either a datepicker or timepicker PO
 */
async function getDateOrTimepicker(inputPO, componentName) {
    if (!['datepicker', 'timepicker'].includes(componentName)) {
        throw Error("componentName must either 'datepicker' or 'timepicker'");
    }

    const capitalizedComponentName = `${componentName[0].toUpperCase()}${componentName.slice(
        1
    )}`;

    if (await inputPO.hasDatetimepicker()) {
        const datetimepicker = await inputPO.getDatetimepicker();
        // eslint-disable-next-line no-return-await
        return await datetimepicker[`get${capitalizedComponentName}`]();
        // eslint-disable-next-line no-else-return
    } else {
        // eslint-disable-next-line no-return-await
        return await inputPO[`get${capitalizedComponentName}`]();
    }
}

/**
 * This function is to set the status of input check box
 * @param {UtamUtilitiesContext} utilityContext
 * @param {boolean} state
 */
export async function setCheckboxState(utilityContext, state) {
    const { pageObject: inputPO } = utilityContext;
    const checkedState = await inputPO.getCheckedState();
    const isStateNotEqlCheckedState = !(state.toString() === checkedState);

    if (isStateNotEqlCheckedState) {
        await inputPO.toggleCheckbox();
    }
}

/**
 * Validates that thegiven date is in yyyy-mm-dd format
 * @param  {string} date date that is being validated
 * @returns {boolean} true if date is matching the format, false otherwise
 */
function isValidDate(date) {
    const matches =
        // eslint-disable-next-line no-useless-escape
        /^(?<year>\d{4})[-\/](?<month>\d{1,2})[-\/](?<day>\d{1,2})$/.exec(date);
    if (!matches) return false;

    const y = parseInt(matches[1], 10);
    const m = parseInt(matches[2], 10) - 1;
    const d = parseInt(matches[3], 10);
    const composedDate = new Date(y, m, d);

    return (
        composedDate.getDate() === d &&
        composedDate.getMonth() === m &&
        composedDate.getFullYear() === y
    );
}

/**
 * Validates that the given time is in H:MM XM format
 * @param  {string} time
 * @returns {boolean} true if time is matching the format, false otherwise
 */
function isValidTime(time) {
    return /^((0?[1-9]|1[012])(:[0-5]\d) [APap][mM]|(0?[1-9]|1\d|2[0123]):[0-5]\d)$/.test(
        time
    );
}
