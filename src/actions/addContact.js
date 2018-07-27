import {Http} from './requests'

export const consts = {  
    ADD_CONTACT: 'ADD_CONTACT',
}

export default function addContact(phoneData) {
    return dispatch => {
        const url = 'https://prod.mcontrol.com/contacts/create'
        Http.post(url, phoneData)
        .then((response) => {
            dispatch({
                type: 'ADD_CONTACT',
                payload: response.data
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
}