const apiEndpoint = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin`;
const searchBtn = document.querySelector('.search-btn');

let intervalId = null;
const addedPincode = []

const callGovtApi = (pinCode) => {
    return new Promise((resolve, reject) => {
        fetch(`${apiEndpoint}?date=${pinCode.date}&pincode=${pinCode.text}`, {
            method: 'GET'
        })
            .then((response) => response.json().then((data => resolve(data))))
            .catch((error) => {
                resolve({centers: []});
            });
    });
};

const checkForCenter = (data, pinCode = '') => {
    const allData = [];
    const copyMsg = `Slot is available for ${pinCode}`;
    data.centers.forEach(center => center.sessions.forEach(session => {
        if (session.min_age_limit === 18) {
            allData.push(session.available_capacity)
            if (session.available_capacity > 0) {
                alert(copyMsg)
            }
        }
    }));
    console.log(`Vaccine slots availability: ${pinCode} ${} ${data.centers}`, allData, data.centers)
    return allData;
};

intervalId = setInterval(() => {

    if (addedPincode.length) {
        searchBtn.textContent = 'Searching from Reminder list';
        searchBtn.setAttribute('disabled', true);
        const promises = [];
        addedPincode.forEach(pinCode => {
            promises.push(callGovtApi(pinCode));
        })

        Promise.all(promises).then((allResponses) => {
            searchBtn.textContent = 'Add in Reminder list';
            searchBtn.removeAttribute('disabled');
    
            allResponses.forEach((res, index) => checkForCenter(res, addedPincode[index].text));
        });
    }
}, 5000);
const onAddPincodeClick = (e) => {

    const addPincodeInput = document.querySelector('.add-pincode-input');
    const addPincodeContainer = document.querySelector('.added-pincode-container');
    const addPincodeNote = document.querySelector('.added-pincode-note');
    addPincodeNote.style.display = 'block';

    const pincodeText = document.createElement('p');
    pincodeText.className = 'pincode-text';
    pincodeText.textContent = addPincodeInput.value;
    addPincodeContainer.appendChild(pincodeText);

    addedPincode.push({
        text: pincodeText.textContent,
        date: moment().format('DD.MM.YYYY'),
    });
    addedPincode.push({
        text: pincodeText.textContent,
        date: moment().add(1, 'days').format('DD-MM-YYYY'),
    });

    searchBtn.removeAttribute('disabled');
    addPincodeInput.value = '';
};

const onkeypressEvent = (e) => {
    if (e.keyCode === 13) {
        onAddPincodeClick();
    }
}