import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import homeEN from '../../../shared/languages/en.json';
import homeFR from '../../../shared/languages/fr.json';

const resources = {
    English: {
        home: homeEN,
    },
    Francais: {
        home: homeFR,
    }
}

i18next
    .use(initReactI18next)
    .init({
        resources,
        lng: 'English',
        debug: false,
        fallbackLng: 'English',
        saveMissing: true
    });

export default i18next;