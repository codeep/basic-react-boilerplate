import { Http } from './requests'


export const constss = {  
    SEARCH_CONTACT: 'SEARCH_CONTACT'
}

export default function searchContact(data) {
    return dispatch => {
        const url = `https://prod.mcontrol.com/contacts?search=${data}`
        Http.get(url)
        .then((response) => {
            dispatch({
                type: 'SEARCH_CONTACT',
                payload: response.data
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
}