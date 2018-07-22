import React from 'react'

export const modal = (body, idName, title) => {
  return(
    <div className="modal fade" id={idName} role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
          <button className="list-search-form__autocomplete-close sprite hover-active-opacity" type="button" data-dismiss="modal"></button>
          <h3 className="list-search-form__autocomplete-title fs20">{title}</h3>
          </div>
          <div className="modal-body">
            {body}
          </div>
          <div className="modal-footer">
            <button type="button" className="font-bold fs18 btn gray-btn ver-top-box fb hover-active-opacity" data-dismiss="modal">Cancel</button>
            <button type="submit" className="font-bold fs18 btn blue-btn ver-top-box fb hover-active-opacity">Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}