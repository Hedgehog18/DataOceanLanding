// import * as THREE from 'three';
// import DOTS from 'vanta/dist/vanta.dots.min';
import './scss/main.scss';
import $ from 'jquery';
import 'jquery-validation';
import {t, changeLang, onChangeLang} from './localization'
import SubscriptionsTable from './subscriptions-table'
import 'jquery.cookie';
import cookie from './cookie';
import { refreshLang, generateHtml } from "./localization";

onChangeLang(() => {
    $('#firstName')[0].placeholder = t('placeholderFirstName');
    $('#lastName')[0].placeholder = t('placeholderLastName');
    $('#question')[0].placeholder = t('placeholderQuestion');
    $('#firstNamePay')[0].placeholder = t('placeholderFirstName');
    $('#lastNamePay')[0].placeholder = t('placeholderLastName');
    $('#questionPay')[0].placeholder = t('placeholderPayNote');
    $('#passwordLogin')[0].placeholder = t('password');
})

$(document).ajaxError(function (e, jqXHR, ajaxSettings, thrownError) {
    if (Math.trunc(jqXHR.status/100) === 5 || jqXHR.status === 0) {
        location.replace('./500.html');
    }
})

$.validator.methods.text = function(value, element) {
    return this.optional(element) || /^\s*[a-zA-Zа-яА-ЯёЁЇїІіЄєҐґ'`.-\s]+\s*$/.test(value);
}

$.validator.methods.tel = function(value, element) {
    return this.optional(element) || /^[0-9-()+ ]+$/.test(value);
}

$(window).on('load', () => {
    $('#preloader').fadeOut('slow');
})

$(() => {
    setInterval(() => {
        setTimeout(() => {
            $('#explore').addClass('transparency')
            setTimeout(() => {
                $('#explore').removeClass('transparency')
            }, 1500)
        }, 1000);

        setTimeout(() => {
            $('#build').addClass('transparency')
            setTimeout(() => {
                $('#build').removeClass('transparency')
            }, 1500)
        }, 2500);

        setTimeout(() => {
            $('#develop').addClass('transparency')
            setTimeout(() => {
                $('#develop').removeClass('transparency')
            }, 1500)
        }, 4000);
    }, 5500);
});

$(() => {
    const firstName = cookie.get('firstname');
    const lastName = cookie.get('lastname');
    if ( !firstName && !lastName ) {
        return
    } else {
        $('#login').replaceWith(/*html*/`
        <span class="user_profile">
            <ion-icon class="profile_icon" name="person-circle-outline"></ion-icon>
            <a class="link link_start">
                ${firstName} ${lastName[0]}.
            </a>
            <ion-icon class="arrow_icon" name="chevron-down-outline"></ion-icon>
        </span>
        <ul class="submenu">
            <li id="user-profile" class="submenu_item">
                <a class="link link_start">
                    ${generateHtml('Мій кабінет', 'My profile')}
                </a>
            </li>
            <hr>
            <li id="logout" class="submenu_item">
                <a class="link link_start ">
                    ${generateHtml('Вийти', 'Log out')}
                </a>
            </li>
        </ul>
        `);
        refreshLang();
        $('#signup').hide();
    }

    $('#user-profile').on('click', function () {
        document.location = process.env.DO_FRONTEND_HOST + '/system/profile/projects/';
    });

    $('#logout').on('click', function() {
        cookie.remove('token');
        cookie.remove('firstname');
        cookie.remove('lastname');
        cookie.remove('email');
        cookie.remove('lang');
        document.location.reload();
    })
});

$('#login').on('click', function () {
    $('.login-modal').toggle();
});
$(document).on('click', '.login-modal', function (e) {
    if ($(e.target).is('.login-modal')) {
        $('.login-modal').hide();
    }
});

const getLoginSchema = () => {
    return {
        errorClass: "input_error",
        rules: {
            emailLogin: {
                required: true,
                email: true,
            },
            passwordLogin: {
                minlength: 8,
                maxlength: 128,
                required: true,
            },
        },
        messages: {
            emailLogin: {
                required: t('emailRequired'),
                email: t('emailCorrect'),
            },
            passwordLogin: {
                minlength: t('minSymbols'),
                maxlength: t('maxSymbols'),
                required: t('passwordRequired'),
            }
        }
    }
};

$('#loginform').on('submit', function(event){
    event.preventDefault();
    let loginForm = $(this);
    loginForm.validate(getLoginSchema());
    if (!loginForm.valid()) {
        return
    }
    $('#error_login').html('');

    $.ajax({
        url: process.env.DO_BACKEND_HOST + '/api/rest-auth/login/',
        type: 'POST',
        data: {
            email: this.emailLogin.value,
            password: this.passwordLogin.value,
        },
        headers: {
            ['Accept-Language']: localStorage.getItem('lang'),
        },
        success: function(data, status, xhr) {
            if (xhr.status !== 200) {
                return
            }
            cookie.set('token', data.key);
            cookie.set('firstname', data.user.first_name);
            cookie.set('lastname', data.user.last_name);
            cookie.set('email', data.user.email);
            cookie.set('lang', data.user.language)
            document.location = process.env.DO_FRONTEND_HOST + '/system/home/';
        },
        error: function (jqXHR, textStatus, errorMessage) {
            const key = Object.keys(jqXHR.responseJSON)[0];
            const keyMessage = Object.values(jqXHR.responseJSON)[0][0];
            key === 'non_field_errors' ? $('#error_login').html(keyMessage) : $('#error_login').html(`${key}: ${keyMessage}`);
        }
    })
})

$('#forgot_password').on('click', function () {
    document.location = process.env.DO_FRONTEND_HOST + '/auth/restore-pass/?lang=' + localStorage.getItem('lang');
});

$(document).ready(() => {
  // const _sendMailBtn = document.querySelector(".sendmail-btn");
  // _sendMailBtn.onclick = (e) => {
  //   e.preventDefault();
  //   const _form = document.forms.sendmail;
  //   console.log("Do sendmail");
  //   return false;
  // };
});


$(document).ready(() => {
  // const _subscribeForms = document.querySelectorAll(".do-subscribe");
  // _subscribeForms.forEach((form) => {
  //   const _subscribeBtn = form.querySelector(".subscribe-btn");
  //   _subscribeBtn.onclick = (e) => {
  //     e.preventDefault();
  //     console.log("Do Subscribe");
  //   };
  // });
});

const getSchema = () => {
    return {
        errorClass: "input_error",
        rules: {
            firstName: {
                required: true,
                minlength: 2,
                maxlength: 50,
                text: true,
            },
            lastName: {
                required: true,
                minlength: 2,
                maxlength: 50,
                text: true,
            },
            email: {
                required: true,
                email: true,
            },
            phone: {
                tel: true,
                minlength: 10,
                maxlength: 20,
            },
            question: {
                required: true,
                maxlength: 500,
            },
        },
        messages: {
            firstName: {
                required: t('firstNameRequired'),
                minlength: t('minSymbols'),
                maxlength: t('maxSymbols'),
                text: t('dataNoCorrect'),
            },
            lastName: {
                required: t('lastNameRequired'),
                minlength: t('minSymbols'),
                maxlength: t('maxSymbols'),
                text: t('dataNoCorrect'),
            },
            email: {
                required: t('emailRequired'),
                email: t('dataNoCorrect'),
            },
            phone: {
                tel: t('dataNoCorrect'),
                minlength: t('minSymbols'),
                maxlength: t('maxSymbols'),
            },
            question: {
                required: t('questionAsk'),
                maxlength: t('maxSymbols'),
            },
        },
    }
};

$('#contact-form').on('submit', function(event){
    event.preventDefault();
    let form = $(this);
    form.validate(getSchema())
    if (!form.valid()) {
        return
    }

    let phoneNumber = '';
    if (this.phone.value) {
        phoneNumber = ' Мій контактний номер: '  + this.phone.value;
    }

    let data = {
        name: this.firstName.value + ' ' + this.lastName.value,
        email: this.email.value,
        subject: this.firstName.value + ' ' + this.lastName.value,
        message: this.question.value + phoneNumber,
    }

    $.ajax({
        url: process.env.DO_BACKEND_HOST + '/api/landing_mail/',
        type: "POST",
        dataType: "json",
        data: data,
        success: function(data, status, xhr) {
            if (xhr.status !== 200) {
                return
            }
            alert(t('messageSuccess'));
            form[0].reset();
        },
        error: function (jqXhr, textStatus, errorMessage) {
            if (jqXhr.status === 400 || jqXhr.status === 503) {
                alert(t('messageError'));
            }
            else {
                alert(t('messageErrorUnknown') + errorMessage);
            }
        }
    })
});

$('#change-lang').on('click', function(event) {
    event.preventDefault();
    let langUser = 'uk';
    if (localStorage.getItem('lang') === 'uk') {
        langUser = 'en';
    }
    changeLang(langUser);
});

$('.js-link-platform').on('click', function () {
    window.open(`${process.env.DO_FRONTEND_HOST}/system/home/?lang=${localStorage.getItem('lang')}`);
});

$('#signup').on('click', function () {
    window.open(`${process.env.DO_FRONTEND_HOST}/auth/sign-up/?lang=${localStorage.getItem('lang')}`);
});

$('.link-cpk').on('click', function () {
    window.open(`https://pep.org.ua/${localStorage.getItem('lang')}`);
});

$('#api-docs').on('click', function () {
    window.open(`${process.env.DO_BACKEND_HOST}/schema/redoc/`);
});

const getPaySchema = () => {
    return {
        errorClass: "input_error",
        rules: {
            firstNamePay: {
                required: true,
                minlength: 2,
                maxlength: 30,
                text: true,
            },
            lastNamePay: {
                required: true,
                minlength: 2,
                maxlength: 150,
                text: true,
            },
            emailPay: {
                required: true,
                email: true,
            },
            phonePay: {
                tel: true,
                minlength: 10,
                maxlength: 20,
            },
            questionPay: {
                maxlength: 500,
            }
        },
        messages: {
            firstNamePay: {
                required: t('firstNameRequired'),
                minlength: t('minSymbols'),
                maxlength: t('maxSymbols'),
                text: t('dataNoCorrect'),
            },
            lastNamePay: {
                required: t('lastNameRequired'),
                minlength: t('minSymbols'),
                maxlength: t('maxSymbols'),
                text: t('dataNoCorrect'),
            },
            emailPay: {
                required: t('emailRequired'),
                email: t('dataNoCorrect'),
            },
            phonePay: {
                tel: t('dataNoCorrect'),
                minlength: t('minSymbols'),
                maxlength: t('maxSymbols'),
            },
            questionPay: {
                maxlength: t('maxSymbols'),
            }
        }
    }
};

$('#pay-form').on('submit', function(event){
    event.preventDefault();
    let payForm = $(this);
    payForm.validate(getPaySchema())
    if (!payForm.valid()) {
        return
    }
    let payData = {
        name: this.firstNamePay.value + ' ' + this.lastNamePay.value,
        email: this.emailPay.value,
        subject: this.firstNamePay.value + ' ' + this.phonePay.value,
        message: this.questionPay.value ?  t('note') + ': ' + this.questionPay.value : t('nomark'),
    }
    $('.open-payform').fadeOut();
    $.ajax({
        url: process.env.DO_BACKEND_HOST + '/api/landing_mail/',
        type: "POST",
        dataType: "json",
        data: payData,
        success: function(data, status, xhr) {
            if (xhr.status !== 200) {
                return
            }
            alert(t('messageSuccess'));
            payForm[0].reset();
        },
        error: function (jqXhr, textStatus, errorMessage) {
            if (jqXhr.status === 400 || jqXhr.status === 503) {
                alert(t('messageError'));
            }
            else {
                alert(t('messageErrorUnknown') + errorMessage);
            }
        }
    })
});

$('#payform-close').on('click', function () {
    $('.open-payform').toggle();
});

$('#terms_and_conditions').on('click', function () {
    location.assign(`${process.env.DO_FRONTEND_HOST}/docs/${localStorage.getItem('lang')}/TermsAndConditions.html`);
});

$('#privacy_policy').on('click', function () {
    location.assign(`${process.env.DO_FRONTEND_HOST}/docs/${localStorage.getItem('lang')}/PrivacyPolicy.html`);
});

new SubscriptionsTable('#subs-table').init()

// $('#signup').on('click', function () {
//     $('.signup-modal').toggle();
//     $(document).on('click', function (e) {
//         if ($(e.target).is('.signup-modal')) {
//             $('.signup-modal').hide();
//         }
//     });
// });


