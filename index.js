const apiEndpointCurrent = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?date=${moment().format('DD.MM.YYYY')}`;
const apiEndpointTomorrow = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?date=${moment().add(1, 'days').format('DD-MM-YYYY')}`;

let intervalId = null;
const addedPincode = []

const callGovtApi = (pinCode, Api) => {
    return new Promise((resolve, reject) => {
        fetch(`${Api}&pincode=${pinCode}`, {
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
    console.log(`Vaccine slots availability: ${pinCode} ${allData}`)
    return allData;
};

intervalId = setInterval(() => {
    if (addedPincode.length) {
        const promises = [];
        addedPincode.forEach(pinCode => {
            promises.push(callGovtApi(pinCode, apiEndpointCurrent));
            promises.push(callGovtApi(pinCode, apiEndpointTomorrow));
        })

        Promise.all(promises).then((allResponses) => {
            allResponses.forEach((res, index) => checkForCenter(res, addedPincode[index]));
        });
    }
}, 5000);
const onAddPincodeClick = (e) => {

    const addPincodeInput = document.querySelector('.add-pincode-input');
    const addPincodeContainer = document.querySelector('.added-pincode-container');
    const addPincodeNote = document.querySelector('.added-pincode-note');
    addPincodeNote.style.display = 'block';
    const searchBtn = document.querySelector('.search-btn');

    const pincodeText = document.createElement('p');
    pincodeText.className = 'pincode-text';
    pincodeText.textContent = addPincodeInput.value;
    addPincodeContainer.appendChild(pincodeText);

    addedPincode.push(pincodeText.textContent);
    searchBtn.removeAttribute('disabled');
    addPincodeInput.value = '';
};

const onkeypressEvent = (e) => {
    if (e.keyCode === 13) {
        onAddPincodeClick();
    }
}