import React from 'react';

class EmailMain extends React.Component {
  render() {
    return(
      <div className="row" style={{margin: 200}}>
        <div className="col-md-4">
          <h3>Mailbox sidebar</h3>
        </div>
        <div className="col-md-8">
          <h3>Emails</h3>
        </div>
      </div>
    )
  }
}

export { EmailMain };
