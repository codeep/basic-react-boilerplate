import {Http} from './requests'

export const constsEdit = {  
    EDIT_CONTACT: 'EDIT_CONTACT',
}

export default function editContact(data) {
    return dispatch => {
        const url = 'https://prod.mcontrol.com/contacts/edit'
        Http.post(url, data)
        .then((response) => {
            dispatch({
                type: 'EDIT_CONTACT',
                payload: response.data,
                status: response.status
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
}