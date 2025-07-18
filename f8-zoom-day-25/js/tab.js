const tabContainer = document.querySelector('.tab-container');
const tabItems = document.querySelectorAll('.tab-item');
const contentContainer = document.querySelector('.content-container');

let currentTabIndex = 0;

const tabs = [
    { name: 'tab1', content: 'content 1' },
    { name: 'tab2', content: 'content 2' },
    { name: 'tab3', content: 'content 3' },
    { name: 'tab4', content: 'content 4' },
    { name: 'tab5', content: 'content 5' },
]

const handleTabClick = (event) => {
    const clickedTab = event.target.closest('.tab-item');
    const tabIndex = clickedTab.dataset.index;

    // set active tab
    currentTabIndex = Number.parseInt(tabIndex);

    render();
}

const handleKeyBoardClick = (event) => {
    const keyName = Number.parseInt(event.key);

    if (!keyName) {
        return;
    }

    if (keyName > 0 && keyName < tabs.length + 1) {
        const tabIndex = keyName - 1

        currentTabIndex = tabIndex;
        render();

        return;
    }
}

const render = () => {
    const tabList = tabs.map((tab, index) => (`
        <li class="tab-item ${currentTabIndex === index ? "active" : ""}" data-index="${index}" >${tab.name}</li>
    `)).join("");

    const content = tabs[currentTabIndex].content;

    // update tab status
    tabContainer.innerHTML = tabList;

    // update content 
    contentContainer.innerHTML = escapeHTML(content);
}

const escapeHTML = (value) => {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
}

tabContainer.onclick = handleTabClick;
document.addEventListener('keydown', handleKeyBoardClick)

// first render
render();

