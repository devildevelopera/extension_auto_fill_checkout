// Settings
// Unbinding SAO - 10 minutes
// Disabled Sites SAO - 10 minutes
// DHook SAO - 10m
// DName SAO - 10m
// Twitter SAO ^








// Setup for colors and shit
$(document).ready(function() {




    $(window).scrollTop(0);


    chrome.storage.local.get(function(items) {
        if (items.key == undefined) {
            $('#main').hide();
            $('#header').hide();
            $('#noKey').show();
            $('.header-auth').show();

        } else {
            $('#noKey').hide();
            $('.header-auth').hide();
            $('#main').show();
            $('.header').css('display', 'flex');
            document.getElementById("key").value = items.key;
            $('#key').prop("disabled", true);
        }

        if (Object.keys(items.profiles).length === 0) {
            $('#profilelist').hide()
            $('#profilecreation').hide()
            $('#pcp2').hide()
            $('#cret').hide()
        } else {
            $('#profilecreation').hide()
            $('#noprofile').hide()
            $('#pcp2').hide()

            var i;
            var profiles = dctNames(items.profiles);
            var profiledct = items.profiles;
            for (i = 0; i < profiles.length; i++) {
                if (i == 0) {
                    document.getElementsByClassName('list-item')[0].querySelector('.detail-name').innerText = profiles[i]
                    document.getElementsByClassName('list-item')[0].querySelector('#name').innerText = profiledct[profiles[i]]['fName'] + " " + profiledct[profiles[i]]['lName']
                    document.getElementsByClassName('list-item')[0].querySelector('.detail-email').innerText = profiledct[profiles[i]]['email'];
                    document.getElementsByClassName('list-item')[0].querySelector('.detail-left').innerText = profiledct[profiles[i]]['address'] + ", " + profiledct[profiles[i]]['address2'] + ", " + profiledct[profiles[i]]['city'] + ", " + profiledct[profiles[i]]['state'] + ", " + profiledct[profiles[i]]['country'] + ", " + profiledct[profiles[i]]['phone']
                    document.getElementsByClassName('list-item')[0].querySelector('.number').innerText = profiledct[profiles[i]]['CC'].slice(profiledct[profiles[i]]['CC'].length - 4)

                    document.getElementsByClassName('list-item')[0].querySelector('.btn-edit').setAttribute("data-profile", profiles[i])

                    document.getElementsByClassName('list-item')[0].querySelector('.btn-edit').addEventListener("click", function() {
                        loadEditor()
                        loadProfile(document.getElementsByClassName('list-item')[0].querySelector('.btn-edit').getAttribute("data-profile"))
                    });

                    document.getElementsByClassName('list-item')[0].querySelector('.btn-delete').setAttribute("data-profile", profiles[i])
                    document.getElementsByClassName('list-item')[0].querySelector('.btn-delete').addEventListener("click", function() {
                        deleteProfile(document.getElementsByClassName('list-item')[0].querySelector('.btn-delete').getAttribute("data-profile"))
                        document.getElementsByClassName('list-item')[0].parentNode.removeChild(document.getElementsByClassName('list-item')[0])
                    });




                } else {
                    let elem = document.querySelector('#profilelist').appendChild(document.getElementsByClassName('list-item')[0].cloneNode(true));
                    elem.querySelector('.detail-name').innerText = profiles[i]
                    elem.querySelector('#name').innerText = profiledct[profiles[i]]['fName'] + " " + profiledct[profiles[i]]['lName']
                    elem.querySelector('.detail-email').innerText = profiledct[profiles[i]]['email'];
                    elem.querySelector('.detail-left').innerText = profiledct[profiles[i]]['address'] + ", " + profiledct[profiles[i]]['address2'] + ", " + profiledct[profiles[i]]['city'] + ", " + profiledct[profiles[i]]['state'] + ", " + profiledct[profiles[i]]['country'] + ", " + profiledct[profiles[i]]['phone']
                    elem.querySelector('.number').innerText = profiledct[profiles[i]]['CC'].slice(profiledct[profiles[i]]['CC'].length - 4)
                    console.log(profiles[i])
                    elem.querySelector('.btn-edit').setAttribute("data-profile", profiles[i])

                    elem.querySelector('.btn-edit').addEventListener("click", function() {
                        loadEditor()
                        loadProfile(elem.querySelector('.btn-edit').getAttribute("data-profile"))
                    });

                    elem.querySelector('.btn-delete').setAttribute("data-profile", profiles[i])
                    elem.querySelector('.btn-delete').addEventListener("click", function() {
                        deleteProfile(elem.querySelector('.btn-delete').getAttribute("data-profile"))
                        elem.parentNode.removeChild(elem)
                    });

                }
            }

        }

        document.getElementById('dsbi').value = undefHand(items.disabledSites)
        document.getElementById('dhook').value = undefHand(items.webhook)
        document.getElementById('dname').value = undefHand(items.discord)
        document.getElementById('tname').value = undefHand(items.twitter)
        if (items.darkMode) {
            setTimeout(function() {
                document.getElementById('switch-dark').click();
            }, 1);
        }


    })
    verifyKey()
    $('#switch-dark').on('click', function() {
        $('#switch-dark').hide();
        $('#switch-light').show();
        $('body').addClass('dark');
        $('.header').addClass('dark');
        $('.menu-mobile').addClass('dark');
        $('.main-left').addClass('dark');
        $('.main-right').addClass('dark');
        // document.styleSheets[1].addRule("::-webkit-scrollbar-track", "background: #3A3F54;");
        // document.styleSheets[1].addRule("::-webkit-scrollbar", "background: #091828");
        // document.styleSheets[1].addRule("::-webkit-scrollbar-thumb", "background: #091828;");


        chrome.storage.local.set({
            darkMode: true,
        })

    })

    $('#switch-light').on('click', function() {
        $('#switch-dark').show();
        $('#switch-light').hide();
        $('.dark').removeClass('dark');
        // document.styleSheets[1].addRule("::-webkit-scrollbar-track", "background-color: rgba(235, 235, 235, 1.0);");
        // document.styleSheets[1].addRule("::-webkit-scrollbar", "background-color: rgba(180, 180, 180, 1.0);");
        // document.styleSheets[1].addRule("::-webkit-scrollbar-thumb", "background: rgba(180, 180, 180, 1.0);");


        chrome.storage.local.set({
            darkMode: false,
        })
    })

    $('#show-menu').on('click', function() {
        $('.menu-mobile').css('display', 'flex')
        $('#show-menu').hide();
        $('#hide-menu').show();
    })

    $('#hide-menu').on('click', function() {
        $('.menu-mobile').css('display', 'none')
        $('#hide-menu').hide();
        $('#show-menu').show();
    })

    $('#checkbox-billing').on('click', function(e) {
        if (e.target.checked) {
            $('#billing').removeClass('opacity-low');
            $('#billing').find('input').removeAttr('disabled');
            $('#billing').find('select').removeAttr('disabled');
        } else {
            $('#billing').addClass('opacity-low');
            $('#billing').find('input').attr('disabled');
            $('#billing').find('select').attr('disabled');
        }
    })
});



function elementInViewport(elem) {

    let bounding = elem.getBoundingClientRect();

    if (bounding.top >= 0 && bounding.left >= 0 && bounding.right <= (window.innerWidth || document.documentElement.clientWidth) && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {

        return true
    } else {

        return false
    }
}
// Profiles



// Saving


function loadEditor() {
    $('#profilelist').hide()
    $('#profilecreation').show()
    $('#pcp2').show()
    $('#noprofile').hide()
    $('#cprof').hide()
    console.log("Clearing")
    $('#profiles').find('option').not(':first').remove();

    profilesToSelect("profiles");

}



function undefHand(strng) {
    if (strng === undefined) {
        return ""
    } else {
        return strng
    }
}

function exportToJsonFile(jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    let exportFileDefaultName = 'spiria.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}


function returnToList() {

    chrome.storage.local.get(function(items) {
        if (!(items.profiles == undefined)) {
            $('#profilelist').show()
            $('#profilecreation').hide()
            $('#pcp2').hide()
            $('#cprof').show()
            $('#cret').show()

            var elemList = document.getElementsByClassName('list-item')
            for (i = elemList.length - 1; i > 0; i--) {
                elemList[i].remove()
                console.log("Clearing")
            }
            var i;
            var profiles = dctNames(items.profiles);
            var profiledct = items.profiles;
            for (i = 0; i < profiles.length; i++) {
                if (i == 0) {
                    document.getElementsByClassName('list-item')[0].querySelector('.detail-name').innerText = profiles[i]
                    document.getElementsByClassName('list-item')[0].querySelector('#name').innerText = profiledct[profiles[i]]['fName'] + " " + profiledct[profiles[i]]['lName']
                    document.getElementsByClassName('list-item')[0].querySelector('.detail-email').innerText = profiledct[profiles[i]]['email'];
                    document.getElementsByClassName('list-item')[0].querySelector('.detail-left').innerText = profiledct[profiles[i]]['address'] + ", " + profiledct[profiles[i]]['address2'] + ", " + profiledct[profiles[i]]['city'] + ", " + profiledct[profiles[i]]['state'] + ", " + profiledct[profiles[i]]['country'] + ", " + profiledct[profiles[i]]['phone']
                    document.getElementsByClassName('list-item')[0].querySelector('.number').innerText = profiledct[profiles[i]]['CC'].slice(profiledct[profiles[i]]['CC'].length - 4)
                    document.getElementsByClassName('list-item')[0].querySelector('.btn-edit').setAttribute("data-profile", profiles[i])
                    document.getElementsByClassName('list-item')[0].querySelector('.btn-delete').setAttribute("data-profile", profiles[i])
                    document.getElementsByClassName('list-item')[0].querySelector('.btn-delete').addEventListener("click", function() {
                        deleteProfile(document.getElementsByClassName('list-item')[0].querySelector('.btn-delete').getAttribute("data-profile"))
                        document.getElementsByClassName('list-item')[0].parentNode.removeChild(document.getElementsByClassName('list-item')[0])
                    });




                } else {
                    let elem = document.querySelector('#profilelist').appendChild(document.getElementsByClassName('list-item')[0].cloneNode(true));
                    elem.querySelector('.detail-name').innerText = profiles[i];
                    elem.querySelector('.detail-email').innerText = profiledct[profiles[i]]['email'];
                    elem.querySelector('.detail-left').innerText = profiledct[profiles[i]]['address'] + ", " + profiledct[profiles[i]]['address2'] + ", " + profiledct[profiles[i]]['city'] + ", " + profiledct[profiles[i]]['state'] + ", " + profiledct[profiles[i]]['country'] + ", " + profiledct[profiles[i]]['phone']
                    elem.querySelector('.number').innerText = profiledct[profiles[i]]['CC'].slice(profiledct[profiles[i]]['CC'].length - 4)
                    console.log(profiles[i])
                    elem.querySelector('.btn-edit').setAttribute("data-profile", profiles[i])

                    elem.querySelector('.btn-edit').addEventListener("click", function() {
                        loadEditor()
                        loadProfile(elem.querySelector('.btn-edit').getAttribute("data-profile"))
                    });

                    elem.querySelector('.btn-delete').setAttribute("data-profile", profiles[i])
                    elem.querySelector('.btn-delete').addEventListener("click", function() {
                        deleteProfile(elem.querySelector('.btn-delete').getAttribute("data-profile"))
                        elem.parentNode.removeChild(elem)
                    });
                    console.log("Creating")

                }
            }
        } else {
            $('#profilecreation').hide()
            $('#noprofile').show()
            $('#pcp2').hide()
            $('#profilelist').hide()

        }

    })
}

function saveProfile() {
    console.log("saving");
    var profileName = document.getElementById('profileName').value;
    var fName = document.getElementById('fname').value;
    var lName = document.getElementById('lname').value;
    var email = document.getElementById('email').value;
    var address = document.getElementById('address').value;
    var address2 = document.getElementById('address2').value;
    var city = document.getElementById('city').value;
    var country = document.getElementById('country').value;
    var state = document.getElementById('stat').value;
    var zip = document.getElementById('zip').value;
    var phone = document.getElementById('phone').value;
    var CC = document.getElementById('CC').value.replace(/\s/g, '');
    var nameOnCard = document.getElementById('CCName').value;
    var expiry = document.getElementById('CCY').value + "-" + document.getElementById('CCM').value;
    var cvv = document.getElementById('CVV').value;
    if (document.getElementById('checkbox-billing').checked) {
        var splitBilling = true
        var bfName = document.getElementById('bfname').value;
        var blName = document.getElementById('blname').value;
        var bemail = document.getElementById('bemail').value;
        var baddress = document.getElementById('baddress').value;
        var baddress2 = document.getElementById('baddress2').value;
        var bcity = document.getElementById('bcity').value;
        var bcountry = document.getElementById('bcountry').value;
        var bstate = document.getElementById('bstat').value;
        var bzip = document.getElementById('bzip').value;
        var bphone = document.getElementById('bphone').value;


        var dct = {
            fName: fName,
            lName: lName,
            email: email,
            address: address,
            address2: address2,
            city: city,
            country: country,
            state: state,
            zip: zip,
            phone: phone,
            CC: CC,
            nameOnCard: nameOnCard,
            expiry: expiry,
            cvv: cvv,
            splitBilling: splitBilling,
            bfName: bfName,
            blName: blName,
            bemail: bemail,
            baddress: baddress,
            baddress2: baddress2,
            bcity: bcity,
            bcountry: bcountry,
            bstate: bstate,
            bzip: bzip,
            bphone: bphone
        };
        console.log(dct)
    } else {
        var splitBilling = false
        var dct = {
            fName: fName,
            lName: lName,
            email: email,
            address: address,
            address2: address2,
            city: city,
            country: country,
            state: state,
            zip: zip,
            phone: phone,
            CC: CC,
            nameOnCard: nameOnCard,
            expiry: expiry,
            cvv: cvv,
            splitBilling: splitBilling

        }
        console.log(dct)
    };
    chrome.storage.local.get(function(items) {

        var profiles = items.profiles;
        if (profiles == undefined) {
            var profiles = {}
        }

        profiles[profileName] = dct
        console.log(profiles)
        chrome.storage.local.set({
            profiles: profiles,
            activeProfile: profileName
        })

    })
    setTimeout(function() {
        setProfileActive(profileName)
    }, 1000);

    var myToast = Toastify({
        text: "Profile Saved",
        duration: 5000,
        backgroundColor: "linear-gradient(#ea16f5, #ea16f5, #ea16f5)",
        offset: {
            x: 0,
            y: 100
        }

    })
    myToast.showToast()




}

// Add profiles to select dropdown
function profilesToSelect(id) {
    // get reference to select element
    var sel = document.getElementById(id);

    chrome.storage.local.get(function(items) {
        if (!(items.profile == "undefined")) {
            profiles = dctNames(items.profiles)
            var i = 0
            for (i = 0; i < profiles.length; i++) {
                var opt = document.createElement('option');
                opt.innerText = profiles[i];
                opt.value = profiles[i];
                sel.appendChild(opt);
            }
        }


    })
}

function setReactValue(element, value) {
    const last = element.value;

    element.value = value;
    let event = new Event("input", {
        target: element,
        bubbles: true
    });
    event.simulated = true;

    let tracker = element._valueTracker;
    if (tracker) {
        tracker.setValue(last)
    }
    element.dispatchEvent(event)
}


function dctNames(dct) {

    return Object.keys(dct)

}


// Load profile into editing screen
function loadProfile(profile) {
    console.log("loading" + profile)

    document.getElementById("profiles").value = profile;
    chrome.storage.local.get(function(items) {

        var profiledct = items.profiles[profile]
        document.getElementById('profileName').value = profile;
        document.getElementById('fname').value = profiledct.fName;
        document.getElementById('lname').value = profiledct.lName;
        document.getElementById('email').value = profiledct.email;
        document.getElementById('address').value = profiledct.address;
        document.getElementById('address2').value = profiledct.address2;
        document.getElementById('city').value = profiledct.city;
        setReactChangeValue(document.getElementById('country'), profiledct.country)
        document.getElementById('stat').value = profiledct.state;
        document.getElementById('zip').value = profiledct.zip;
        document.getElementById('phone').value = profiledct.phone;
        setReactValue(document.getElementById('CC'), profiledct.CC);
        document.getElementById('CCName').value = profiledct.nameOnCard;
        document.getElementById('CCY').value = profiledct.expiry.split("-")[0];
        document.getElementById('CCM').value = profiledct.expiry.split("-")[1];
        document.getElementById('CVV').value = profiledct.cvv;
        document.getElementById('profiles').value = profile;

        if (profiledct.splitBilling) {

            if (!(document.getElementById("checkbox-billing").checked)) {
                document.querySelector('#checkbox-billing').click()
            }

            document.getElementById('bfname').value = profiledct.bfName;
            document.getElementById('blname').value = profiledct.blName;
            document.getElementById('bemail').value = profiledct.bemail;
            document.getElementById('baddress').value = profiledct.baddress;
            document.getElementById('baddress2').value = profiledct.baddress2;
            document.getElementById('bcity').value = profiledct.bcity;
            setReactChangeValue(document.getElementById('bcountry'), profiledct.bcountry);
            document.getElementById('bstat').value = profiledct.bstate;
            document.getElementById('bzip').value = profiledct.bzip;
            document.getElementById('bphone').value = profiledct.bphone;


        }

        $('#profileName').focus()
    })

}


// Set varius data as active
// Also set ActiveProfile var, for popup eg

function setProfileActive(profile) {

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

function settingSavedToast() {
    var myToast = Toastify({
        text: "Setting Saved",
        duration: 5000,
        backgroundColor: "linear-gradient(#ea16f5, #ea16f5, #ea16f5)",
        offset: {
            x: 0,
            y: 100
        }

    })
    myToast.showToast()
}


// Deletes profile - Sets first profile as active if deleted is current
function deleteProfile(profile) {

    chrome.storage.local.get(function(items) {

        var pDCT = items.profiles
        delete pDCT[profile]
        pDCT = JSON.parse(JSON.stringify(pDCT));
        chrome.storage.local.set({
            profiles: pDCT
        })
        console.log("LENGTH")
        setTimeout(function() {
            console.log(items.profiles)
            console.log(Object.keys(items.profiles)[0] == "")
            if (Object.keys(items.profiles).length == 0) {
                chrome.storage.local.remove(['profiles'])
                console.log("deleteing profile var")
                $('#noprofile').show()
                $('#profilelist').hide()
                $('#profilecreation').hide()
                $('#pcp2').hide()
                $('#cret').hide()
            } else if (items.activeProfile == profile) {
                setProfileActive(items.profiles[Object.keys(items.profiles)[0]])
            }


        }, 10);


    })
}

function setReactChangeValue(element, value) {
    const last = element.value;

    element.value = value;
    let event = new Event("change", {
        target: element,
        bubbles: true
    });
    event.simulated = true;

    let tracker = element._valueTracker;
    if (tracker) {
        tracker.setValue(last)
    }
    element.dispatchEvent(event)
}

function setStorage(varibl, value) {

    chrome.storage.local.set({
        [varibl]: value
    })

}

function keyAuth() {

    // chrome.system.memory.getInfo(function (info) {
    chrome.instanceID.getID(function(info) {
        // var hwid = JSON.parse((JSON.stringify(info)));
        var hwid = info;
        // console.log(memdata['capacity'])

        key = document.getElementById('keyput').value;
        // userToken = getRandomToken();
        //TODO: IP


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer pk_OiSBDetXFlJyR6eajdnFe4aALE1BYpuG");

        var raw = JSON.stringify({
            "key": key,
            "activation": {
                "hwid": hwid,
                "device_name": chrome.extension.getURL('').split("//")[1].substr(0, 20).toUpperCase()
            }
        });

        var requestOptions = {
            headers: myHeaders,
        };

        fetch("https://api.hyper.co/v4/licenses/" + key, requestOptions)
            .then(response => response.text())
            .then(
                result => {
                    var resultDTC = (JSON.parse(result))
                    console.log(resultDTC)
                    if (resultDTC) {
                        chrome.storage.local.set({
                            activated: true,
                            key: key,
                            activation_token: resultDTC['user']['access_token']
                        });
                        document.getElementById("key").value = key;
                        $('#key').prop("disabled", true);
                        $('#noKey').fadeOut(1000);
                        $('.header-auth').fadeOut(1000);
                        $('#main').fadeIn(1000);
                        $('.header').css('display', 'flex');
                    } else {
                        document.getElementsByClassName("nokey-label")[0].style.color = 'red'
                        document.getElementsByClassName("nokey-label")[0].innerText = resultDTC['message'];
                    }
                }
            )

        .catch(error => {
            console.log('error', error)
            document.getElementsByClassName("nokey-label")[0].style.color = 'red'
            document.getElementsByClassName("nokey-label")[0].innerText = error;
        });



    })
}


function importProfle() {
    var files = document.getElementById('import').files;
    console.log(files);

    var fr = new FileReader();

    fr.onload = function(e) {
        console.log(e);
        var result = JSON.parse(e.target.result);
        console.log(result)
        var keys = Object.keys(result)
        console.log(keys)

        var i;
        for (i = 0; i < keys.length; i++) {
            if (!(keys[i] == "activation_token" || keys[i] == "key")) {
                console.log(keys[i] + " " + result[keys[i]])
                setStorage(keys[i], result[keys[i]])
            }

        }



    }
    fr.readAsText(files.item(0));
    location.reload();


}


function unbind() {


    chrome.storage.local.get(function(items) {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer pk_OiSBDetXFlJyR6eajdnFe4aALE1BYpuG");

        var requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: JSON.stringify({
                metadata: { hwid: null }
            })
        };

        fetch(`https://api.hyper.co/v4/licenses/${items.key}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                resultDTC = JSON.parse(result)

                if (resultDTC) {
                    chrome.storage.local.remove(['key', 'activation_token']);
                    chrome.storage.local.set({
                        activated: false
                    });
                    setTimeout(function() {
                        location.reload();
                    }, 25);
                } else {}

            })
            .catch(error => console.log('error', error));
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
                                setTimeout(function() {
                                    location.reload();
                                }, 25);
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
            $('#main').hide();
            $('.header').hide();
            $('#noKey').show();
            $('.header-auth').show();
        }
    })
}






document.querySelector('#profiles').addEventListener("change", function() {
    loadProfile(document.querySelector('#profiles').value);
    setProfileActive(document.querySelector('#profiles').value)
});


document.querySelector('.btn-export').addEventListener("click", function() {

    chrome.storage.local.get(function(items) {
        exportToJsonFile(items)
    })
})


document.querySelector('.top').addEventListener("click", returnToList)

document.getElementById('cret').addEventListener("click", loadEditor)

document.querySelector('.btn-create-profile').addEventListener("click", loadEditor)

document.querySelectorAll('.btn-save')[1].addEventListener("click", function() {
    saveProfile();
    setTimeout(function() {
        returnToList();
    }, 100);


});

document.querySelector("#pdel").addEventListener("click", function() {
    deleteProfile(document.querySelector("#profiles").value)
    setTimeout(function() {
        returnToList();
    }, 100);


});

document.getElementById('dsb').addEventListener("click", function() {
    setStorage("disabledSites", document.getElementById('dsbi').value)
    settingSavedToast()
});

document.getElementById('dwb').addEventListener("click", function() {
    setStorage("webhook", document.getElementById('dhook').value)
    sendSuccess("Webhook Test", "Spiria.tools", 'https://media.discordapp.net/attachments/808909848045027328/827934625892401202/827747821913505823.png?width=102&height=102', "test", document.getElementById('dhook').value)
    settingSavedToast()
});

document.getElementById('dnb').addEventListener("click", function() {
    setStorage("discord", document.getElementById('dname').value)
    settingSavedToast()
});

document.getElementById('tnb').addEventListener("click", function() {
    setStorage("twitter", document.getElementById('tname').value)
    settingSavedToast()
});


document.getElementById('import-btn').addEventListener("click", function() {
    document.getElementById('import').click()
})

document.getElementById('import').addEventListener('change', importProfle);




document.getElementById('bind').addEventListener("click", keyAuth)

document.querySelector('.btn-unbind').addEventListener("click", unbind)


document.getElementById('stat').addEventListener("change", function() {

    setTimeout(() => {
        if (document.getElementById('stat').value == "CSTM") {

            console.log(document.getElementById('stat').value)

            var code = window.prompt("Enter Custom State Code", "");


            var x = document.getElementById("stat");
            var option = document.createElement("option");
            option.text = code;
            option.value = code
            x.add(option);

            document.getElementById('stat').value = code

        }

    }, 10);

})


function _getcaret(input) {
    if ('selectionStart' in input) {
        // Standard-compliant browsers
        return input.selectionStart;
    } else if (document.selection) {
        input.focus();
        var sel = document.selection.createRange();
        var selLen = document.selection.createRange().text.length;
        sel.moveStart('character', -input.value.length);
        return sel.text.length - selLen;
    }
}

function _setcaret(input, pos) {
    if (input.setSelectionRange) {
        input.focus()
        input.setSelectionRange(pos, pos)
    } else if (input.createTextRange) {
        var range = input.createTextRange();
        range.move('character', pos);
        range.select();
    }
}

function _format_464(cc) {
    return [cc.substring(0, 4), cc.substring(4, 10), cc.substring(10, 14)].join(' ').trim()
}

function _format_465(cc) {
    return [cc.substring(0, 4), cc.substring(4, 10), cc.substring(10, 15)].join(' ').trim()
}

function _format_4444(cc) {
    return cc ? cc.match(/[0-9]{1,4}/g).join(' ') : ''
}
_CARD_TYPES = [{
        'type': 'visa',
        'pattern': /^4/,
        'format': _format_4444,
        'maxlength': 19
    },
    {
        'type': 'master',
        'pattern': /^(5[12345])|(2[2-7])/,
        'format': _format_4444,
        'maxlength': 16
    },
    {
        'type': 'amex',
        'pattern': /^3[47]/,
        'format': _format_465,
        'maxlength': 15
    },
    {
        'type': 'jcb',
        'pattern': /^35[2-8]/,
        'format': _format_465,
        'maxlength': 19
    },
    {
        'type': 'maestro',
        'pattern': /^(5018|5020|5038|5893|6304|6759|676[123])/,
        'format': _format_4444,
        'maxlength': 19
    },
    {
        'type': 'discover',
        'pattern': /^6[024]/,
        'format': _format_4444,
        'maxlength': 19
    },
    {
        'type': 'instapayment',
        'pattern': /^63[789]/,
        'format': _format_4444,
        'maxlength': 16
    },
    {
        'type': 'diners_club_carte_blanche',
        'pattern': /^30[0-5]/,
        'format': _format_464,
        'maxlength': 14
    },
    {
        'type': 'diners_club_international',
        'pattern': /^30[0-5]/,
        'format': _format_464,
        'maxlength': 14
    },
    {
        'type': 'diners_club',
        'pattern': /^54/,
        'format': _format_4444,
        'maxlength': 16
    }
]

function _format_cardnumber(cc, maxlength) {
    cc = cc.replace(/[^0-9]+/g, '')

    for (var i in _CARD_TYPES) {
        const ct = _CARD_TYPES[i]
        if (cc.match(ct.pattern)) {
            cc = cc.substring(0, ct.maxlength)
            return ct.format(cc)
        }
    }

    return _format_4444(cc)
        /*
if(maxlength) {
cc = cc.substring(0,maxlength)
}
if(cc.match(/^3[47]/)) {
return [cc.substring(0,4),cc.substring(4,10),cc.substring(10,15)].join(' ').trim()
}
return cc?cc.match(/.{1,4}/g).join(' '):''
*/
}


function sendSuccess(product, site, thumbnail, key, customHook) {



    if (!(customHook === 'NA')) {
        var xmlhttp3 = new XMLHttpRequest(); // new HttpRequest instance
        var hook3 = customHook;
        xmlhttp3.open("POST", hook3);
        xmlhttp3.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp3.send(JSON.stringify({
            "embeds": [{
                "title": "Webhook Successful",
                "color": 15341301,
                "fields": [{
                        "name": "Product",
                        "value": product,
                        "inline": true
                    },
                    {
                        "name": "Site",
                        "value": site,
                        "inline": true
                    }
                ],
                "footer": {
                    "icon_url": "https://media.discordapp.net/attachments/808909848045027328/827934625892401202/827747821913505823.png?width=102&height=102",
                    "text": "Spiria Autofill"
                },
                "thumbnail": {
                    "url": thumbnail
                },
            }],
            "username": "Spiria Autofill",
            "avatar_url": "https://media.discordapp.net/attachments/808909848045027328/827934625892401202/827747821913505823.png?width=102&height=102"
        }));
    }

}

function _set_creditcard_number(event) {
    const input = event.target
    const maxlength = input.getAttribute('maxlength')

    var oldval = input.value
    var caret_position = _getcaret(input)
    var before_caret = oldval.substring(0, caret_position)
    before_caret = _format_cardnumber(before_caret)
    caret_position = before_caret.length

    var newvalue = _format_cardnumber(oldval, maxlength)

    if (oldval == newvalue) return

    input.value = newvalue
    _setcaret(input, caret_position)
}

function make_credit_card_input(input) {
    input.addEventListener('input', _set_creditcard_number)
    input.addEventListener('keyup', _set_creditcard_number)
    input.addEventListener('keydown', _set_creditcard_number)
    input.addEventListener('keypress', _set_creditcard_number)
    input.addEventListener('change', _set_creditcard_number)
}

make_credit_card_input(document.getElementById("CC"));