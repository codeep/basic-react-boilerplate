import {Http} from './requests'

export const constsss = {  
    ADD_CONTACT: 'ADD_CONTACT',
}

export default function addContact(phoneData) {
    return dispatch => {
        const url = 'https://prod.mcontrol.com/contacts/create'
        Http.post(url, phoneData)
        .then((response) => {
            dispatch({
                type: 'ADD_CONTACT',
                payload: response.data,
                status: response.status
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
}