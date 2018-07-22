import {Http} from './requests'

export const consts = {  
    ADD_CONTACT: 'ADD_CONTACT',
}

export default function addContact(phoneData) {
    console.log('ACTIONS')
    return dispatch => {
        const url = 'https://prod.mcontrol.com/contact/create'
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