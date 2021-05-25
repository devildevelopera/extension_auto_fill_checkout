$(document).ready(function() {
    verifyKey()
    profilesToSelect('profslect')

    $(document).ready(function() {
        $("#delays").hide()
        $('#switch-button').on('click', function(e) {
            if (e.target.checked === true) {
                $('body').addClass('dark');
                $('.extension-menu').addClass('dark');
            } else if (e.target.checked === false) {
                $('body').removeClass('dark');
                $('.extension-menu').removeClass('dark');
            }
        })

        $('.menu-shop').on('click', function() {
            $('.menu-setting').removeClass('active');
            $('.menu-shop').addClass('active');
            $('#profslect').hide()
            $('.btn-dashboard').hide()
            $('.container-menu-1').hide();
            $('.container-menu-2').show();

            chrome.storage.local.get(function(items) {
                if (items.dsgACO) {
                    document.getElementById('dsg').checked = true
                } else {
                    document.getElementById('dsg').checked = false
                }


                if (items.BBACO) {
                    document.getElementById('bestbuy').checked = true
                } else {
                    document.getElementById('bestbuy').checked = false
                }
                if (items.pokeACO) {
                    document.getElementById('pokecent').checked = true
                } else {
                    document.getElementById('pokecent').checked = false
                }

                if (items.supremeAco) {
                    document.getElementById('supreme').checked = true
                    $('#delays').show()
                } else {
                    document.getElementById('supreme').checked = false
                }
                if (items.walmartACO) {
                    document.getElementById('wallmart').checked = true
                } else {
                    document.getElementById('wallmart').checked = false
                }
                if (items.fnlACO) {
                    document.getElementById('finishline').checked = true
                } else {
                    document.getElementById('finishline').checked = false

                }
                if (items.ATCCHO) {
                    document.getElementById('shopifytocheckout').checked = true
                } else {

                }
                if (items.sTOC) {
                    document.getElementById('sTOC').checked = true
                } else {

                }
                if (items.sCop) {
                    document.getElementById('sCop').checked = true
                } else {

                }

                if (items.supremeATC) {
                    document.getElementById('supremeAutoCart').checked = true
                } else {}
                if (!(items.supremeDelay == undefined)) {
                    document.getElementById('delay').value = items.supremeDelay;
                } else {

                }
                if (items.SQAutoCheckout) {
                    document.getElementById('sqACO').checked = true;
                } else {
                    document.getElementById('sqACO').checked = false;
                }
            })


            setTimeout(() => {
                if (document.getElementById('supreme').checked) {
                    console.log("SUPREME CHECKED")
                    document.body.style.height = "599px"
                    document.body.style.width = "520px"
                    document.styleSheets[1].addRule("html", "width: 520px; height: 150px")
                    document.getElementById('extm').style.height = "800px"
                } else {
                    console.log("SUPREME NOT CHECKED")

                    document.body.style.height = "556px"
                    document.body.style.width = "520px"
                    document.styleSheets[1].addRule("html", "width: 520px; height: 150px")
                    document.getElementById('extm').style.height = "742px"

                }
            }, 20);

        })


        $('.menu-setting').on('click', function() {
            $('.menu-shop').removeClass('active');
            $('.menu-setting').addClass('active');
            $('#profslect').show()
            $('.btn-dashboard').show()
            $('.container-menu-2').hide();
            $('.container-menu-1').show();
            document.body.style.height = "556px"
            document.body.style.width = "333px"
            document.styleSheets[1].addRule("html", "width: 333px; height: 560px")

        })
    });

    $(".btn-dashboard").on('click', function(e) {
        chrome.runtime.openOptionsPage();
    })

    chrome.storage.local.get(function(items) {
        document.getElementById('profslect').value = items.activeProfile;
        if (items.darkMode) {
            $('#switch-button').on()
        }

        if (items.fillEnabled) {
            document.getElementById('autofill').checked = true

        } else {
            document.getElementById('dsg').disabled = true;
            document.getElementById('pokecent').disabled = true;
            document.getElementById('bestbuy').disabled = true;
            document.getElementById('finishline').disabled = true;
            document.getElementById('shopify').disabled = true;
            document.getElementById('wallmart').disabled = true;
            document.getElementById('sqACO').disabled = true;
        }
        if (items.autosubmit) {
            document.getElementById('autosubmit').checked = true
        }
        if (items.capClick) {
            document.getElementById('capcha').checked = true
        }
        // if (items.autojig) {
        //     document.getElementById('auto-jig').checked = true
        // }

        if (items.ACOEnabled) {
            document.getElementById('shopify').checked = true
        } else {
            document.getElementById('shopify').checked = false

        }





    })
});


function profilesToSelect(id) {
    // get reference to select element
    var sel = document.getElementById(id);

    console.log('sel: ', sel);
    chrome.storage.local.get(function(items) {
        console.log('items: ', items);
        if (items.profiles) {
            console.log("Selector");
            profiles = dctNames(items.profiles);
            var i = 0
            for (i = 0; i < profiles.length; i++) {
                console.log(profiles[i])
                    // create new option element
                var opt = document.createElement('option');

                // create text node to add to option element (opt)
                opt.innerText = profiles[i];

                // set value property of opt
                opt.value = profiles[i];

                // add opt to end of select box (sel)
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
    if (document.getElementById('shopify').checked || document.getElementById('dsg').checked || document.getElementById('sqACO').checked || document.getElementById('finishline').checked || document.getElementById('wallmart').checked || document.getElementById('supreme').checked || document.getElementById('bestbuy').checked || document.getElementById('pokecent').checked) {
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


document.getElementById('autofill').addEventListener("click", function() {
    setStorage("fillEnabled", document.getElementById('autofill').checked);
    if (!(document.getElementById('autofill').checked)) {
        chrome.storage.local.set({
            ACOEnabled: false,
            dsgACO: false,
            fnlACO: false,
            walmartACO: false,
            SQAutoCheckout: false,
            BBACO: false,
            pokeACO: false
        })
        document.getElementById('dsg').disabled = true;
        document.getElementById('finishline').disabled = true;
        document.getElementById('shopify').disabled = true;
        document.getElementById('wallmart').disabled = true;
        document.getElementById('sqACO').disabled = true;
        document.getElementById('bestbuy').disabled = true;
        document.getElementById('pokecent').disabled = true;


        document.getElementById('dsg').checked = false;
        document.getElementById('finishline').checked = false;
        document.getElementById('shopify').checked = false;
        document.getElementById('wallmart').checked = false;
        document.getElementById('sqACO').checked = false;
        document.getElementById('bestbuy').checked = false;
        document.getElementById('pokecent').checked = false;

    } else {
        document.getElementById('dsg').disabled = false;
        document.getElementById('finishline').disabled = false;
        document.getElementById('shopify').disabled = false;
        document.getElementById('wallmart').disabled = false;
        document.getElementById('sqACO').disabled = false;
        document.getElementById('bestbuy').disabled = false;
        document.getElementById('pokecent').disabled = false;
    }
    acoBadge()

})

document.getElementById('autosubmit').addEventListener("click", function() {
    setStorage("autosubmit", document.getElementById('autosubmit').checked)

});

// document.getElementById('auto-jig').addEventListener("click", function() {
//     setStorage("autojig", document.getElementById('auto-jig').checked)

// });

document.getElementById('capcha').addEventListener("click", function() {
    setStorage("capClick", document.getElementById('capcha').checked)

});


document.getElementById('power-button').addEventListener("click", turnAllOff)

document.getElementById('shopify').addEventListener("click", function() {
    setStorage("ACOEnabled", document.getElementById('shopify').checked)
    acoBadge()
});

document.getElementById('dsg').addEventListener("click", function() {
    setStorage("dsgACO", document.getElementById('dsg').checked)
    acoBadge()
});

document.getElementById('bestbuy').addEventListener("click", function() {
    setStorage("BBACO", document.getElementById('bestbuy').checked)
    acoBadge()
});
document.getElementById('pokecent').addEventListener("click", function() {
    setStorage("pokeACO", document.getElementById('pokecent').checked)
    acoBadge()
});


document.getElementById('finishline').addEventListener("click", function() {
    setStorage("fnlACO", document.getElementById('finishline').checked)
    acoBadge()
});
document.getElementById('supremeAutoCart').addEventListener("click", function() {
    setStorage("supremeATC", document.getElementById('supremeAutoCart').checked)

});
document.getElementById('wallmart').addEventListener("click", function() {
    setStorage("walmartACO", document.getElementById('wallmart').checked)
    acoBadge()
});
document.getElementById('sqACO').addEventListener("click", function() {
    setStorage("SQAutoCheckout", document.getElementById('sqACO').checked)
    acoBadge()
});

document.getElementById('shopifytocheckout').addEventListener("click", function() {
    setStorage("ATCCHO", document.getElementById('shopifytocheckout').checked)

});
document.getElementById('sTOC').addEventListener("click", function() {
    setStorage("sTOC", document.getElementById('sTOC').checked)

});

document.getElementById('sCop').addEventListener("click", function() {
    setStorage("sCop", document.getElementById('sCop').checked)

});


document.getElementById('supreme').addEventListener("click", function() {
    setStorage("supremeAco", document.getElementById('supreme').checked)
    if (document.getElementById('supreme').checked) {
        $('#delays').show()
        document.body.style.height = "599px"
        document.body.style.width = "520px"
        document.styleSheets[1].addRule("html", "width: 520px; height: 150px")
        document.getElementById('extm').style.height = "800px"

    } else {
        document.body.style.height = "542px"
        document.body.style.width = "520px"
        document.styleSheets[1].addRule("html", "width: 520px; height: 150px")
        document.getElementById('extm').style.height = "722px"

        $('#delays').hide()
    }
    acoBadge()
});

document.getElementById('delay').addEventListener("change", function() {
    setStorage("supremeDelay", document.getElementById('delay').value)

});

document.getElementById('profslect').addEventListener("change", function() {

    setProfileActive(document.getElementById('profslect').value)

})

function setAutoReload() {

    var delay = prompt("Please enter autorefresh delay (ms)", "5000");
    setStorage("autoReload", parseInt(delay))
}

document.getElementById('autoreload-button').addEventListener("click", setAutoReload)