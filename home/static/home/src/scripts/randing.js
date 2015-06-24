/** @jsx React.DOM */
'use strict';

var ButtonInput = require('react-bootstrap').ButtonInput;

var Randing = React.createClass({
  render: function() {
    return (
      <div className="site-wrapper-inner">
        <div className="cover-container">
          <div className="masthead clearfix">
            <div className="inner">
              <h3 className="masthead-brand">PAG</h3>
            </div>
          </div>
          <div className="inner cover">
            <h1 className="cover-heading">Project Auto Grader</h1>
            <p className="lead">Backlogのスペース名を入力してください。認証後、プロジェクトの採点が始まります。</p>
            <p className="lead">
              <form action="/auth/" method="post" className="form-inline">
                <div className="form-group">
                  <div className="input-group">
                    <div className="input-group-addon">http://</div>
                    <input type="text" name="space" className="form-control input-lg" id="exampleInputAmount" placeholder="Space name"/>
                    <div className="input-group-addon">.backlog.jp</div>
                  </div>
                </div>
                <ButtonInput type="submit" value="Grade Your Project" bsSize="large" />
              </form>
            </p>
          </div>
          <div className="mastfoot">
            <div className="inner">
              <p>2015 Koyama PBL / AIIT</p>
            </div>
          </div>
        </div>
       </div>
    );
  }
});

module.exports = Randing;
