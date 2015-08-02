var Input = require('react-bootstrap').Input;
var Loading = require('./loading.js');

var RequestForm = React.createClass({

  getInitialState: function() {
    return {page: 'default'};
  },

  sendRequest: function() {
    this.setState({page: 'loading'});
    $.ajax({
      url: '/api/request/',
      type: 'POST',
      dataType: 'json',
      data: {request: $('#requestText').val()},
      cache: false,
      success: function() {
        this.setState({page: 'success'});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({page: 'error'});
      }.bind(this)
    });
  },

  render: function() {
    var disabled = (this.state.page == 'default') ? false : true;
    var close_disabled = (this.state.page == 'loading') ? true : false;
    var page;
    if (this.state.page == 'default') {
      page = <Input type='textarea' id="requestText" rows={5} placeholder='PAGへのご意見やリクエストをお聞かせください' disabled={disabled}/>;
    } else if (this.state.page == 'loading') {
      page = <Loading/>;
    } else if (this.state.page == 'success') {
      page = <p>ご意見・リクエストを送信しました。ありがとうございました。</p>;
    } else if (this.state.page == 'error') {
      page = <p>エラーが発生しました。時間をおいてからもう一度お試しください。</p>;
    }

    return (
      <div className="modal fade" id="requestForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title" id="myModalLabel">ご意見・リクエスト</h4>
            </div>
            <div className="modal-body">
              {page}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal" disabled={close_disabled}>閉じる</button>
              <button type="button" className="btn btn-primary" onClick={this.sendRequest} disabled={disabled}>送信する</button>
            </div>
          </div>
        </div>
      </div>
    );
  },

});

module.exports = RequestForm;
