$(document).ready(function() {

    $('.container-detail').hide();
    $('.container-profiles').hide();

    verifyKey();
    profilesToSelect();

    chrome.storage.local.get(function(items) {

        $('#profilesSelect').val(items.activeProfile);

        if (items.autofill) {
            $('#autofill').prop('checked', true);
        } else {
            $('#shopify').prop('disabled', true);
            $('#stripe').prop('disabled', true);
        }

        if (items.autoauth) {
            $('#autoauth').prop('checked', true);
        }

        if (items.autosubmit) {
            $('#autosubmit').prop('checked', true);
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
                $('#shopify').prop('checked', true);
            } else {
                $('#shopify').prop('checked ', false);
            }

            if (items.stripeACO) {
                $('#stripe').prop('checked', true);
            } else {
                $('#stripe').prop('checked ', false);
            }

            if (items.supremeACO) {
                $('#supreme').prop('checked', true);
            } else {
                $('#supreme').prop('checked ', false);
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
        if ($('#autofill').is(":checked")) {
            $('#autofill').prop('checked', false);

            $('#shopify').prop('disabled ', false);
            $('#stripe').prop('disabled ', false);
            $('#supreme').prop('disabled ', false);

        } else {
            $('#autofill').prop('checked', true);

            chrome.storage.local.set({
                shopifyACO: false,
                stripeACO: false,
                supremeACO: false,
            });

            $('#shopify').prop('disabled', true);
            $('#stripe').prop('disabled', true);
            $('#supreme').prop('disabled', true);
        }

        setStorage("autofill", $('#autofill').is(":checked"));
    })

    $('#autoauth-btn').on("click", function() {
        if ($('#autoauth').is(":checked")) {
            $('#autoauth').prop('checked', false);
        } else {
            $('#autoauth').prop('checked', true);
        }
        setStorage("autoauth", $('#autoauth').is(":checked"))
    });

    $('#autosubmit-btn').on("click", function() {
        if ($('#autosubmit').is(":checked")) {
            $('#autosubmit').prop('checked', false);
        } else {
            $('#autosubmit').prop('checked', true);
        }
        setStorage("autosubmit", $('#autosubmit').is(":checked"))
    });


    /* container detail events */

    $('#shopify').on("click", function() {
        setStorage("shopifyACO", $('#shopify').is(":checked"))
    });

    $('#stripe').on("click", function() {
        setStorage("stripeACO", $('#stripe').is(":checked"))
    });

    $('#supreme').on("click", function() {
        setStorage("supremeACO", $('#supreme').is(":checked"));
    });

    /* container profiles events */

    $('#profilesSelect').on("change", function() {
        setProfileActive($('#profilesSelect').val());
    });

    $('.profiles-duplicate-btn').on('click', function() {
        chrome.storage.local.get(function(items) {
            console.log(items);
            let profiles = items.profiles;
            const activeProfile = profiles[`${items.activeProfile}`];
            const newProfileName = items.activeProfile + '_1';
            profiles[`${newProfileName}`] = activeProfile;
            setStorage('profiles', profiles);
            setStorage('activeProfile', newProfileName);
            profilesToSelect();
            setTimeout(function() {
                $('#profilesSelect').val(newProfileName);
            }, 100)
        });
    })

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
    select.children().remove();

    chrome.storage.local.get(function(items) {
        if (items.profiles) {
            profiles = dctNames(items.profiles);
            for (var i = 0; i < profiles.length; i++) {
                var opt = document.createElement('option');
                opt.innerText = profiles[i];
                opt.value = profiles[i];
                select.append(opt);
            }
        }
    })
}

function dctNames(dct) {
    if (dct) {
        return Object.keys(dct)
    }
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