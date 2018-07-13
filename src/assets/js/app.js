'use strict';
function validateEmail(Email) {
    var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    // return $.trim(Email).match(pattern) ? true : false;
    return pattern.test($.trim(email));
}

function isNumber(evt) {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    if ($.trim($($(evt.currentTarget)).val()) == '') {
        if (charCode == 48) {
            evt.preventDefault();
        }
    }
    return true;
}

function isNumberWithDots(evt) {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
        return false;
    }
    if ($.trim($($(evt.currentTarget)).val()) == '') {
        if (charCode == 48) {
            evt.preventDefault();
        }
    }
    return true;
} 