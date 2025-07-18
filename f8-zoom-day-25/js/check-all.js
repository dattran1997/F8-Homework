const mainCheckbox = /** @type {HTMLInputElement} */ (document.querySelector('thead tr th input'));
const itemCheckBoxs = /** @type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll('tbody tr td input'));

const handleMainCheckboxClick = function () {
    const isCheckboxChecked = mainCheckbox.checked;

    itemCheckBoxs.forEach(item => {
        item.checked = isCheckboxChecked;
    })
}

const handleItemClick = function () {
    const isAnyItemChecked = Array.from(itemCheckBoxs).some(item => item.checked);
    const isEveryItemChecked = Array.from(itemCheckBoxs).every(item => item.checked);

    if (isEveryItemChecked) {
        mainCheckbox.checked = true;
        mainCheckbox.indeterminate = false;
    } else if (isAnyItemChecked) {
        mainCheckbox.indeterminate = true;
    } else {
        // all Item not checked
        mainCheckbox.checked = false;
        mainCheckbox.indeterminate = false;
    }
}

// bind
mainCheckbox.addEventListener('click', handleMainCheckboxClick);
itemCheckBoxs.forEach(item => {
    item.addEventListener('click', () => handleItemClick(item))
})