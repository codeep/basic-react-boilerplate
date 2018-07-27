import {Http} from './requests'

export const consts = {  
    EDIT_CONTACT: 'EDIT_CONTACT',
}

export default function editContact(data) {
    return dispatch => {
        const url = 'https://prod.mcontrol.com/contacts/edit'
        Http.post(url, data)
        .then((response) => {
            dispatch({
                type: 'EDIT_CONTACT',
                payload: response.data
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
}