window.onload = function() {
    chrome.storage.local.get({ profiles: [], activeProfile: null, enabled: false, settings: {}, fillEnabled: false, autosubmit: false }, (results) => {
        activeProfile = results.activeProfile;
        profile = results.profiles[`${activeProfile}`];
        settings = results.settings;
        if (results.fillEnabled) {
            if (profile) {

                /* general */

                fill('email', profile.email);
                fill('name', `${profile.fName} ${profile.lName}`);

                fill('fullName', `${profile.firstName} ${profile.lName}`);

                fill('first-name', profile.fName);
                fill('firstname', profile.fName);
                fill('firstName', profile.fName);

                fill('last-name', profile.lName);
                fill('lastname', profile.lName);
                fill('lastName', profile.lName);

                fill('tel', profile.phone);

                fill('address-line1', `${profile.address}, ${profile.address2}`);
                fill('address-level2', profile.city);
                fill('city', profile.city);
                fill('state', profile.state);
                fill('address-level1', profile.state);

                fill('postal-code', profile.zip);
                fill('zipcode', profile.zip);
                fill('postcode', profile.zip);
                fill('post-code', profile.zip);

                /* stripe */

                const elements = document.getElementsByTagName('input');
                for (let i = 0; i < elements.length; i++) {
                    let name = elements[i].getAttribute('name');
                    switch (name) {
                        case 'address.line1':
                            autofill(elements[i], profile.address);
                            break;
                        case 'address.line2':
                            autofill(elements[i], profile.address2);
                            break;
                        case 'address.city':
                            autofill(elements[i], profile.city);
                            break;
                        case 'address.state':
                            autofill(elements[i], profile.state);
                            break;
                        case 'address.postal_code':
                            autofill(elements[i], profile.zip);
                            break;
                    }
                }

                let fields = {
                    'cardnumber': profile.CC,
                    'exp-date': `${profile.expiry.split("-")[1]} / ${profile.expiry.split("-")[0].slice(-2)}`,
                    'cvc': profile.cvv,
                    'postal': profile.zip
                }

                Object.keys(fields).forEach(id => {
                    fillField(id, fields[id]);
                });

                let payButton = document.getElementsByTagName('button');
                if (results.autosubmit && payButton.length > 0 && payButton[0].getAttribute('id') === 'purchase') {
                    setTimeout(() => { payButton[0].click(); }, 1000);
                }

                /* shopify */

                const shopify_elements = document.getElementsByTagName('input');
                for (let i = 0; i < shopify_elements.length; i++) {
                    let name = shopify_elements[i].getAttribute('name');
                    switch (name) {
                        case 'number':
                            autofill(shopify_elements[i], profile.CC);
                            break;
                        case 'expiry':
                            autofill(shopify_elements[i], `${profile.expiry.split("-")[1]} / ${profile.expiry.split("-")[0].slice(-2)}`);
                            break;
                        case 'verification_value':
                            autofill(shopify_elements[i], profile.cvv);
                            break;
                    }
                }
            }
        }
    });
}

/* general */

function fill(name, value) {
    fillByAutocomplete(name, value);
    fillByName(name, value);
    fillById(name, value);
}

function fillByName(name, value) {
    let element = document.getElementsByName(name)[0];
    if (element) {
        autofill(element, value);
    }
}

function fillById(name, value) {
    let element = document.getElementById(name);
    if (element) {
        autofill(element, value);
    }
}

function fillByAutocomplete(name, value) {
    let elements = document.querySelectorAll(`[autocomplete=${name}]`);

    elements.forEach(function(element) {
        autofill(element, value);
    });
}

function autofill(element, value) {
    let event = document.createEvent("HTMLEvents");
    event.initEvent('change', true, false);
    element.focus();
    element.value = value;
    element.dispatchEvent(event);
    element.blur();
}

/* stripe */

function fillField(name, value) {
    let element = document.getElementsByName(name)[0];
    if (element) {
        element.focus();
        element.value = value;
        element.dispatchEvent(new Event('change'));
        element.blur();
    }
}