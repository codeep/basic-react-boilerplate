import { Http } from './requests'


export const consts = {  
    PHONE_EMAIL_TYPES: 'PHONE_EMAIL_TYPES'
}

export default function typesAction() {
    return dispatch => {
        const url = `https://prod.mcontrol.com/general/mappings`
        Http.get(url)
        .then((response) => {
            dispatch({
                type: 'PHONE_EMAIL_TYPES',
                payload: response.data
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
}