import './scss/main.scss';
import { allowedLanguages, t, changeLang } from './localization';

$('.link-platform').on('click', function () {
    location.replace(`${process.env.DO_FRONTEND_HOST}/system/home/?lang=${localStorage.getItem('lang')}`);
});

$('.link-cpk').on('click', function () {
    location.replace(`https://pep.org.ua/${localStorage.getItem('lang')}`);
});

$('#change-lang').on('click', function(event) {
    event.preventDefault();
    let langUser = 'uk';
    if (localStorage.getItem('lang') === 'uk') {
        langUser = 'en';
    }
    changeLang(langUser);
});
