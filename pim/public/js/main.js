let activeDataSet = '';

const getJSON = (editor, type) => {
    fetch(`${window.location.pathname}api/${type}`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            const title = `${type.charAt(0).toUpperCase()}${type.slice(1)} | `;
            document.getElementById('titlePrefix').innerText = title;
            document.title = `${title}ACME Product Information Management`;

            activeDataSet = type;
            editor.set(data);
            editor.expandAll();

            showNotify(`Loaded all ${type} data!`);
        })
        .catch(e => {
            showNotify(`Error getting ${type} data!`, 'red');
            console.error(e);
        });
};

const saveJSON = (data, type) => {
    fetch(`${window.location.pathname}api/${type}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(() => {
            showNotify(`Saved all ${type} data!`);
        })
        .catch(e => {
            showNotify(`Error saving ${type} data!`, 'red');
            console.error(e);
        });
};

const showNotify = (text, color = 'green') => {
    const el = document.getElementById('notify');
    el.classList.remove('green');
    el.classList.remove('red');

    el.classList.add(color);
    el.innerText = text;
    el.classList.add('visible');

    setTimeout(() => {
        el.classList.remove('visible');
    }, 2500);
};

const load = () => {
    const container = document.getElementById('jsoneditor');
    const options = {
        enableSort: false,
        enableTransform: false,
        templates: [
            {
                text: 'Product',
                title: 'Insert a Product Node',
                value: {
                    name: "",
                    description: "",
                    image: "",
                    id: "0",
                    options: [],
                    slug: "",
                    price: {
                        value: 0,
                        currencyCode: "EUR"
                    }
                }
            },
            {
                text: 'Stock',
                title: 'Insert a Stock Node',
                value: {
                    id: "0",
                    slug: "",
                    stock: 0
                }
            }
        ]
    };
    const editor = new JSONEditor(container, options);

    document.getElementById('openProduct').onclick = () => {
        getJSON(editor, 'product');
    };
    document.getElementById('openStock').onclick = () => {
        getJSON(editor, 'stock');
    };

    document.getElementById('save').onclick = () => {
        const json = editor.get();

        if(activeDataSet !== '') {
            saveJSON(json, activeDataSet);
        } else {
            showNotify(`Make sure to load a dataset first!`, 'red');
        }
    };
};

window.addEventListener('load', load);
