import {Http} from './requests'

export const constsStars = {  
    PHONE_START: 'PHONE_START',
}

export default function mainPhoneStar(data) {
    return dispatch => {
        const url = 'https://prod.mcontrol.com/contacts/edit_main_number'
        Http.post(url, data)
        .then((response) => {
            dispatch({
                type: 'PHONE_START',
                payload: response.data
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
}