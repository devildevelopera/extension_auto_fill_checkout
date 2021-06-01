$(document).ready(function() {

    $('.container-detail').hide();
    $('.container-profiles').hide();

    verifyKey();
    profilesToSelect();

    $('.top-menu-detail').on('click', function() {

        $('.container-main').hide();
        $('.container-detail').show();
        $('.container-profiles').hide();

        chrome.storage.local.get(function(items) {

            if (items.supremeACO) {
                document.getElementById('supreme').checked = true
            } else {
                document.getElementById('supreme').checked = false
            }

            if (items.walmartACO) {
                document.getElementById('stripe').checked = true
            } else {
                document.getElementById('stripe').checked = false
            }

            if (items.sCop) {
                document.getElementById('sCop').checked = true
            } else {

            }

            if (items.supremeATC) {
                document.getElementById('supremeAutoCart').checked = true
            } else {

            }

        })
    })


    $('.top-menu-main').on('click', function() {
        $('.container-detail').hide();
        $('.container-main').show();
    })

    $(".top-menu-settings").on('click', function(e) {
        chrome.runtime.openOptionsPage();
    })

    chrome.storage.local.get(function(items) {
        document.getElementById('profilesSelect').value = items.activeProfile;

        if (items.autofill) {
            document.getElementById('autofill').checked = true
        } else {
            document.getElementById('shopify').disabled = true;
            document.getElementById('stripe').disabled = true;
        }

        if (items.autoauth) {
            document.getElementById('autoauth').checked = true
        }

        if (items.autosubmit) {
            document.getElementById('autosubmit').checked = true
        }


    })
});


function profilesToSelect() {

    var sel = document.getElementById('profilesSelect');

    chrome.storage.local.get(function(items) {
        if (items.profiles) {
            profiles = dctNames(items.profiles);
            var i = 0
            for (i = 0; i < profiles.length; i++) {
                console.log(profiles[i])
                var opt = document.createElement('option');
                opt.innerText = profiles[i];
                opt.value = profiles[i];
                sel.appendChild(opt);
            }
        }
    })
}


function dctNames(dct) {

    return Object.keys(dct)

}

function setProfileActive(profile) {
    console.log("Activating")

    chrome.storage.local.get(function(items) {

        var profiledct = items.profiles[profile]

        setStorage("fName", profiledct.fName)
        setStorage("lName", profiledct.lName)
        setStorage("email", profiledct.email)
        setStorage("address", profiledct.address)
        setStorage("address2", profiledct.address2)
        setStorage("city", profiledct.city)
        setStorage("state", profiledct.state)
        setStorage("zip", profiledct.zip)
        setStorage("phone", profiledct.phone)
        setStorage("CC", profiledct.CC)
        setStorage("nameOnCard", profiledct.nameOnCard)
        setStorage("expiry", profiledct.expiry)
        setStorage("cvv", profiledct.cvv)
        setStorage("bfName", profiledct.bfName)
        setStorage("blName", profiledct.blName)
        setStorage("bemail", profiledct.bemail)
        setStorage("baddress", profiledct.baddress)
        setStorage("baddress2", profiledct.baddress2)
        setStorage("bcity", profiledct.bcity)
        setStorage("bstate", profiledct.bstate)
        setStorage("bzip", profiledct.bzip)
        setStorage("bphone", profiledct.bphone)
        setStorage("country", profiledct.country)
        setStorage("bcountry", profiledct.bcountry)
        setStorage("splitBilling", profiledct.splitBilling)
        setStorage("activeProfile", profile)

    })

}



function verifyKey() {

    chrome.storage.local.get(function(items) {
        if (!(items.key === undefined)) {
            chrome.instanceID.getID(function(info) {
                // var hwid = JSON.parse((JSON.stringify(info)));
                var hwid = info;
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", "Bearer pk_OiSBDetXFlJyR6eajdnFe4aALE1BYpuG");

                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    body: JSON.stringify({
                        metadata: { hwid }
                    })
                };


                fetch(`https://api.hyper.co/v4/licenses/${items.key}`, requestOptions)
                    .then(response => response.text())
                    .then(result => {

                            var resultDTC = JSON.parse(result)
                            console.log(resultDTC)
                            if (resultDTC) {
                                console.log("Verified")
                            } else {
                                chrome.storage.local.remove(['key', 'activation_token']);
                                chrome.storage.local.set({
                                    activated: false
                                })

                                chrome.runtime.openOptionsPage();

                            }
                        }

                    )
                    .catch(error => console.log('error', error));
            });
        } else {

            chrome.storage.local.remove(['key', 'activation_token']);
            chrome.storage.local.set({
                activated: false
            })
            chrome.runtime.openOptionsPage();
        }
    })
}


function setStorage(varibl, value) {

    chrome.storage.local.set({
        [varibl]: value
    })

}

function turnAllOff() {
    var checked = document.querySelectorAll("input:checked")
    console.log(checked)
    if (checked.length > 0) {
        var i;
        for (i = 0; i < checked.length; i++) {
            if (checked[i].id != "switch-button") {
                checked[i].click()
            }
        }
    }
}

function acoBadge() {
    if (document.getElementById('shopify').checked || document.getElementById('stripe').checked || document.getElementById('supreme').checked) {
        chrome.browserAction.setBadgeBackgroundColor({
            color: [255, 0, 0, 230]
        });
        chrome.browserAction.setBadgeText({
            text: "ACO"
        });
    } else {
        chrome.browserAction.setBadgeText({
            text: ""
        });
    }

}


document.getElementById('autofill-btn').addEventListener("click", function() {
    setStorage("autofill", document.getElementById('autofill').checked);
    if (!(document.getElementById('autofill').checked)) {
        chrome.storage.local.set({
            ACOEnabled: false,
            fnlACO: false,
            walmartACO: false,
            SQAutoCheckout: false,
            BBACO: false,
            pokeACO: false
        })
        document.getElementById('shopify').disabled = true;
        document.getElementById('stripe').disabled = true;


        document.getElementById('shopify').checked = false;
        document.getElementById('stripe').checked = false;

    } else {
        document.getElementById('shopify').disabled = false;
        document.getElementById('stripe').disabled = false;
    }
    acoBadge()

})

document.getElementById('autosubmit-btn').addEventListener("click", function() {
    setStorage("autosubmit", document.getElementById('autosubmit').checked)

});

document.getElementById('autoauth-btn').addEventListener("click", function() {
    setStorage("autoauth", document.getElementById('autoauth').checked)
});


document.getElementById('power-button').addEventListener("click", turnAllOff)

document.getElementById('shopify').addEventListener("click", function() {
    setStorage("ACOEnabled", document.getElementById('shopify').checked)
    acoBadge()
});
document.getElementById('supremeAutoCart').addEventListener("click", function() {
    setStorage("supremeATC", document.getElementById('supremeAutoCart').checked)

});
document.getElementById('stripe').addEventListener("click", function() {
    setStorage("walmartACO", document.getElementById('stripe').checked)
    acoBadge()
});
document.getElementById('shopifytocheckout').addEventListener("click", function() {
    setStorage("ATCCHO", document.getElementById('shopifytocheckout').checked)

});
document.getElementById('sCop').addEventListener("click", function() {
    setStorage("sCop", document.getElementById('sCop').checked)

});


document.getElementById('supreme').addEventListener("click", function() {
    setStorage("supremeACO", document.getElementById('supreme').checked)
    if (document.getElementById('supreme').checked) {
        $('#delays').show()
    } else {
        $('#delays').hide()
    }
    acoBadge()
});

document.getElementById('profilesSelect').addEventListener("change", function() {

    setProfileActive(document.getElementById('profilesSelect').value)

})

function setAutoReload() {
    var delay = prompt("Please enter autorefresh delay (ms)", "5000");
    setStorage("autoReload", parseInt(delay));
}

document.getElementById('autoreload-button').addEventListener("click", setAutoReload)