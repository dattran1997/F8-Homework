const saveDataToLocalStorage = function (key, data) {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
}

const getDataFromLocalStorage = function (itemKey) {
    const data = localStorage.getItem(itemKey);
    const parsedData = JSON.parse(data);

    return parsedData ? parsedData : null;
}

export { saveDataToLocalStorage, getDataFromLocalStorage };