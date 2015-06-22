/** @jsx React.DOM */
'use strict';

var React = require('react');

var ButtonInput   = require('react-bootstrap').ButtonInput;
var Panel         = require('react-bootstrap').Panel;
var PanelGroup    = require('react-bootstrap').PanelGroup;
var ListGroup     = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var Jumbotron     = require('react-bootstrap').Jumbotron;
var Alert         = require('react-bootstrap').Alert;
var Glyphicon     = require('react-bootstrap').Glyphicon;
var Accordion     = require('react-bootstrap').Accordion;
var Row           = require('react-bootstrap').Row;
var Col           = require('react-bootstrap').Col;

var project_id = 0;

// {{{ Randing page
var RandingPage = React.createClass({
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
// }}}

// {{{ Grader
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
      page = <Failed data={this.state.failedMsg} />;
    } else {
      page = <GradeList data={this.state.grade} />;
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

var MenuButton = React.createClass({
  render: function () {
    return (
      <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
        <span className="sr-only">Toggle navigation</span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
      </button>
    );
  }
});

var UserMenu = React.createClass({

  loadSelfInfo: function() {
    $.ajax({
      url: '/api/users/myself',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({myself: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {
      myself: []
    };
  },

  render: function() {
    return this.state.myself.length === [] ?
      <ul></ul> :
      <ul className="nav navbar-nav navbar-right">
        <li className="dropdown">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown">
            {this.state.myself.name} <span className="caret"></span>
          </a>
          <ul className="dropdown-menu" role="menu">
            <li><a href="/signout/">サインアウト</a></li>
          </ul>
        </li>
      </ul>
  },

  componentDidMount: function() {
    this.loadSelfInfo();
  }

});

var Loading = React.createClass({
  render: function () {
    return <p><img src="/static/home/img/loading-bubbles.svg" /></p>;
  }
});

var Failed = React.createClass({
  render: function () {
    return <Alert bsStyle='danger' >{this.props.data}</Alert>;
  }
});
// }}}

// {{{ Grade

var GradeList = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },
  getDefaultProps: function() {
    return {
      data: [{'grade': []}]
    }
  },
  render: function() {
    return (
      <div>
        <GradeTotal data={this.props.data.summary} />
        <GradeChart data={this.props.data.detail} />
        <GradeItemWrapper data={this.props.data.detail} />
      </div>
    );
  }
});

var GradeTotal = React.createClass({
  render: function() {
    var total = this.props.data;
    if (total.point <= 50) {
      var summaryFont = 'danger';
      var summaryIcon = <Glyphicon glyph='fire' />;
    } else if (total.point <= 70){
      var summaryFont = 'danger';
      var summaryIcon = '';
    } else if (total.point <= 85){
      var summaryFont = 'warning';
      var summaryIcon = '';
    } else if (total.point <= 100){
      var summaryFont = 'sucess';
      var summaryIcon = '';
    }
    return (
      <Alert bsStyle={summaryFont} >
        {summaryIcon}
        <big><strong> スコア：{total.point}/100</strong></big>
      </Alert>
    );
  }
});

var GradeChart = React.createClass({
  getChartData: function() {
    var labels = [], points = [];
    this.props.data.forEach(function(grade) {
      if (grade.title != 'Total Point') {
        labels.push(grade.title);
        points.push(grade.point);
      };
    });
    return {
      labels : labels,
      datasets : [
        {
          fillColor : "rgba(151,187,205,0.5)",
          strokeColor : "rgba(151,187,205,1)",
          pointColor : "rgba(151,187,205,1)",
          pointStrokeColor : "#fff",
          data : points,
        }
      ]
    };
  },
  chartOptions: {
    responsive: true,
  },
  render: function() {
    return (
      <Row>
        <Col xs={12} md={12} lg={10} lgOffset={1}>
          <canvas id="chart"></canvas>
        </Col>
      </Row>
    );
  },
  componentDidMount: function() {
    var context = document.getElementById("chart").getContext("2d");
    new Chart(context).Radar(this.getChartData(), this.chartOptions);
  }
});

var GradeItemWrapper = React.createClass({
  render: function() {
    var listStyle = {marginTop: '10px'};
    return ( 
        <div>
          {this.props.data.map(function(grade, i) {
            var title = <h3>{grade.title}</h3>;
            if (grade.point <= 5) {
              var detailFont = 'danger';
              var detailIcon = <Glyphicon glyph='fire' />;
            } else if (grade.point <= 7){
              var detailFont = 'danger';
              var detailIcon = '';
            } else if (grade.point <= 8){
              var detailFont = 'warning';
              var detailIcon = '';
            } else if (grade.point <= 10){
              var detailFont = 'default';
              var detailIcon = '';
            }
            return ( grade.title == 'Total Point' ?
              <div key={'grade_'+i}></div> 
                :
              <Panel header={title} eventKey={i} bsStyle={detailFont} key={'grade_'+i}>
                <p>{grade.advice.message}</p>
                <a href={"#collapseIsseus"+i} data-toggle="collapse" aria-expanded="false" aria-controls={"collapseIsseus"+i}>改善が必要なチケット（{grade.advice.issues.length}件）</a>
                <div className="collapse" id={"collapseIsseus"+i}>
                  <ul style={listStyle}>
                    {grade.advice.issues.map(function(issues, i) {
                      return <li key={'issue_'+i}> <a href={issues.issue_url}> {issues.issue_summary}({issues.issue_key}) </a> </li>;
                    })}
                  </ul>
                </div>
              </Panel>
            );
          })}
        </div>
    );
  }
});
// }}}

// {{{ App
var App = React.createClass({

  loadProjects: function() {
    $.ajax({
      url: '/api/projects',
      dataType: 'json',
      cache: false,
      success: function(data) {
        if (data.length > 0) {
          this.setState({page: 'grader', projects: data});
        } else {
          this.setState({page: 'randing'});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {
      page: 'loading',
      projects: [],
    };
  },

  render: function() {
    if (this.state.page === 'loading') {
      return <div></div>;

    } else if (this.state.page === 'randing') {
      $('body').attr('id', 'randing');
      return <RandingPage />;

    } else if (this.state.page === 'grader') {
      $('body').attr('id', 'grader');
      return <Grader data={this.state.projects}/>;
    }
  },

  componentDidMount: function() {
    this.loadProjects();
  }

});
// }}}

React.render(
  <App />,
  document.getElementById('app-conteiner')
);
