$(document).ready(function() {

    $('.container-detail').hide();
    $('.container-profiles').hide();

    verifyKey();
    profilesToSelect();

    chrome.storage.local.get(function(items) {

        $('#profilesSelect').value = items.activeProfile;

        if (items.autofill) {
            $('#autofill').checked = true
        } else {
            $('#shopify').disabled = true;
            $('#stripe').disabled = true;
        }

        if (items.autoauth) {
            $('#autoauth').checked = true
        }

        if (items.autosubmit) {
            $('#autosubmit').checked = true
        }
    });


    /* top menu events */

    $('.top-menu-main').on('click', function() {
        $('.container-main').show();
        $('.container-detail').hide();
        $('.container-profiles').hide();
    })

    $('.top-menu-detail').on('click', function() {

        $('.container-main').hide();
        $('.container-detail').show();
        $('.container-profiles').hide();

        chrome.storage.local.get(function(items) {

            if (items.shopifyACO) {
                $('#shopify').checked = true
            } else {
                $('#shopify').checked = false
            }

            if (items.stripeACO) {
                $('#stripe').checked = true
            } else {
                $('#stripe').checked = false
            }

            if (items.supremeACO) {
                $('#supreme').checked = true
            } else {
                $('#supreme').checked = false
            }

        })
    })

    $('.top-menu-profiles').on('click', function() {
        $('.container-main').hide();
        $('.container-detail').hide();
        $('.container-profiles').show();
    })


    $(".top-menu-settings").on('click', function(e) {
        chrome.runtime.openOptionsPage();
    })

    $('#power-button').on("click", turnAllOff);

    $('#autoreload-button').on("click", setAutoReload);


    /* container main events */

    $('#autofill-btn').on("click", function() {
        setStorage("autofill", $('#autofill').checked);

        if ($('#autofill').checked) {
            $('#shopify').disabled = false;
            $('#stripe').disabled = false;
            $('#supreme').disabled = false;

        } else {
            chrome.storage.local.set({
                shopifyACO: false,
                stripeACO: false,
                supremeACO: false,
            });

            $('#shopify').disabled = true;
            $('#stripe').disabled = true;
            $('#supreme').disabled = true;
        }
    })

    $('#autoauth-btn').on("click", function() {
        setStorage("autoauth", $('#autoauth').checked)
    });

    $('#autosubmit-btn').on("click", function() {
        setStorage("autosubmit", $('#autosubmit').checked)
    });


    /* container detail events */

    $('#shopify').on("click", function() {
        setStorage("shopifyACO", $('#shopify').checked)
    });

    $('#stripe').on("click", function() {
        setStorage("stripeACO", $('#stripe').checked)
    });

    $('#supreme').on("click", function() {
        setStorage("supremeACO", $('#supreme').checked);
    });


    /* container profiles events */

    $('#profilesSelect').on("change", function() {
        setProfileActive($('#profilesSelect').value);
    });

});

function verifyKey() {

    chrome.storage.local.get(function(items) {
        if (!(items.key === undefined)) {
            chrome.instanceID.getID(function(info) {
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
                        var resultDTC = JSON.parse(result);

                        if (resultDTC) {
                            console.log("Verified");
                        } else {
                            chrome.storage.local.remove(['key', 'activation_token']);
                            chrome.storage.local.set({
                                activated: false
                            })

                            chrome.runtime.openOptionsPage();
                        }
                    })
                    .catch(error => console.log('error', error));
            });

        } else {
            chrome.storage.local.remove(['key', 'activation_token']);
            chrome.storage.local.set({
                activated: false
            });

            chrome.runtime.openOptionsPage();
        }
    })
}

function profilesToSelect() {

    var select = $('#profilesSelect');

    chrome.storage.local.get(function(items) {
        if (items.profiles) {
            profiles = dctNames(items.profiles);
            for (var i = 0; i < profiles.length; i++) {
                var opt = document.createElement('option');
                opt.innerText = profiles[i];
                opt.value = profiles[i];
                select.appendChild(opt);
            }
        }
    })
}

function dctNames(dct) {

    return Object.keys(dct)

}

function setProfileActive(profile) {

    chrome.storage.local.get(function(items) {

        var profiledct = items.profiles[profile];

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

function setStorage(variable, value) {

    chrome.storage.local.set({
        [variable]: value
    });

}

function setAutoReload() {
    var delay = prompt("Please enter autorefresh delay (ms)", "5000");
    setStorage("autoReload", parseInt(delay));
}

function turnAllOff() {
    var checked = document.querySelectorAll("input:checked");

    if (checked.length > 0) {
        for (var i = 0; i < checked.length; i++) {
            checked[i].click();
        }
    }
}