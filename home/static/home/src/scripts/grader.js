/** @jsx React.DOM */
'use strict';

var project_id = 0;

var Alert      = require('react-bootstrap').Alert;
var UserMenu   = require('./components/user_menu.js');
var MenuButton = require('./components/menu_button.js');
var Loading    = require('./components/loading.js');

var GradeChart = require('./components/grade_chart.js');
var GradeTotal = require('./components/grade_total.js');
var GradeItem  = require('./components/grade_item.js');


var Grader = React.createClass({

  getInitialState: function() {
    return {
      isLoading: false,
      isFailed: false,
      failedMsg: '',
      grade: {detail: [], summary:{}}
    };
  },

  loadGrade: function(i) {
    // Activate project
    this.props.data.map(function(project, i){ project.active = false; });
    this.props.data[i].active = true;
    this.setState({isLoading: true, isFailed: false, grade: []});

    project_id = this.props.data[i].id;

    $.ajax({
      url: '/api/grade/' + project_id,
      dataType: 'json',
      cache: false,
      success: function(data) {
        if (data.summary.project_id != project_id) { return; } // Don't render if not current project_id
        if (typeof(data.error) != 'undefined') {
          this.setState({isLoading: false, isFailed: true, failedMsg: data.error.message});
        } else if (data.detail.length > 0) {
          this.setState({isLoading: false, isFailed: false, grade: data});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        if (! this.state.isLoading) { return; } // Don't render if loading is finished by the other project
        this.setState({isLoading: false, isFailed: true, failedMsg: "エラー！接続がタイムアウトしました。"});
      }.bind(this)
    });
  },

  componentDidMount: function() {
    if (! this.state.isLoading) {
      this.loadGrade(0);// Automatically load the first project
    }
  },

  render: function() {
    var page;
    if (this.state.isLoading) {
      page = <Loading />;
    } else if (this.state.isFailed) {
      page = <Alert bsStyle='danger'>{this.state.failedMsg}</Alert>;
    } else {
      page = <div>
        <GradeTotal data={this.state.grade.summary} />
        <GradeChart data={this.state.grade.detail} />
        <GradeItem data={this.state.grade.detail} />
      </div>;
    }
    return (
      <div>
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <MenuButton />
              <a className="navbar-brand" href="#">PAG</a>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
              <UserMenu />
            </div>
          </div>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-3 col-md-2 sidebar">
              <ul className="nav nav-sidebar">
                {this.props.data.map(function(project, i) {
                  return (
                    <li className={project.active ? 'active' : ''} key={i}>
                      <a href={'#/grade/'+project.id} key={i} onClick={this.loadGrade.bind(this, i)}>
                        {project.name}
                      </a>
                    </li>
                  );
                }.bind(this))}
              </ul>
            </div>
            <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
              {page}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Grader;
