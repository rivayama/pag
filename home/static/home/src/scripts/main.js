/** @jsx React.DOM */
'use strict';

var React = require('react');
var ButtonInput = require('react-bootstrap').ButtonInput;
var Panel = require('react-bootstrap').Panel;
var PanelGroup = require('react-bootstrap').PanelGroup;
var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var Jumbotron = require('react-bootstrap').Jumbotron;

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
      grade: []
    };
  },

  loadGrade: function(i) {
    // Activate project
    this.props.data.map(function(project, i){
      project.active = false;
    });
    this.props.data[i].active = true;
    this.setState({isLoading: true, grade: []});

    $.ajax({
      url: '/api/grade/' + this.props.data[i].id,
      dataType: 'json',
      cache: false,
      success: function(data) {
        if (data.length > 0) {
          this.setState({isLoading: false, grade: data});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function() {
    if (! this.state.isLoading) {
      this.loadGrade(0);// Automatically load the first project
    }
  },

  render: function() {
    var grader = this.state.isLoading ?
      <Loading /> : 
      <GradeList data={this.state.grade} />

    return (
      <div>

        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <MenuButton />
              <a className="navbar-brand" href="#">PAG</a>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav navbar-right">
                <li><a href="/signout/">サインアウト</a></li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-3 col-md-2 sidebar">
              <ul className="nav nav-sidebar">
                {this.props.data.map(function(project, i) {
                  return (
                    <li className={project.active ? 'active' : ''}>
                      <a href={'#/grade/'+project.id} key={i} onClick={this.loadGrade.bind(this, i)}>
                        {project.name}
                      </a>
                    </li>
                  );
                }.bind(this))}
              </ul>
            </div>
            <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
              {grader}
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

var Loading = React.createClass({
  render: function () {
    return <img src="/static/home/img/loading.gif" />;
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
    console.log(this.props.data[0]);

    return (
      <div>
        {this.props.data.map(function(grade, i) {
          return <GradeItemWrapper key={i} data={grade}/>;
        })}
      </div>
    );
  }
});

var GradeItemWrapper = React.createClass({
  render: function() {
      var title = <h3>{this.props.data.point}/10 {this.props.data.title}</h3>;
    return this.props.data.title === 'Total Point' ?
      <GradeSummaryItemWrapper data={this.props.data}/> :
      <GradeDetailItemWrapper data={this.props.data}/>
  }
});

var GradeDetailItemWrapper = React.createClass({
  render: function() {
      var title = <h3>{this.props.data.title} : {this.props.data.point}/10</h3>;
    return (
      <Panel header={title} bsStyle='primary' >
        <ListGroup detail>
          <ListGroupItem>
            分析したチケットまたはコメントの数：{this.props.data.all_count}<br/>
            評価基準をクリアしたチケットまたはコメントの数：{this.props.data.count}
          </ListGroupItem>
          
          <ListGroupItem>
            アドバイス：{this.props.data.advice.message}<br/>
            改善が必要なチケット<br/>
            {this.props.data.advice.issues}
          </ListGroupItem>
        </ListGroup>
      </Panel>
    );
  }
});

var GradeSummaryItemWrapper = React.createClass({
  render: function() {
    return (
      <Jumbotron>
      <h1>
        {this.props.data.title} : {this.props.data.point}/100
      </h1>
      </Jumbotron>
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
          this.setState({page: 'project', projects: data});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {
      page: 'unauthorized',
      projects: [],
    };
  },

  componentWillMount: function() {},

  render: function() {
    if (this.state.page === 'unauthorized') {
      $('body').attr('id', 'randing');
    } else {
      $('body').attr('id', 'grader');
    }

    return this.state.page === 'unauthorized' ?
      <RandingPage /> :
      <Grader data={this.state.projects}/>
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
