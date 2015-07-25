var Panel     = require('react-bootstrap').Panel;
var Glyphicon = require('react-bootstrap').Glyphicon;
var OverlayTrigger    = require('react-bootstrap').OverlayTrigger;
var Button    = require('react-bootstrap').Button;
var Popover    = require('react-bootstrap').Popover;

var GradeItem = React.createClass({
  render: function() {
    var preFont = '';
    var listStyle = {marginTop: '10px'};
    var grades = this.props.data.concat(); // propsの変更は全体に影響するのでconcatでコピーする
    grades.sort(function(x,y) {
      if (x.point < y.point) return -1;
      if (x.point > y.point) return 1;
      return 0;
    });
    return ( 
      <div>
        {grades.map(function(grade, i) {
          var caption = '';
          var title = <h3>{grade.title} ({grade.point}%) </h3>;
          if (grade.point <= 50) {
            var detailFont = 'danger';
            var detailIcon = <Glyphicon glyph='fire' />;
          } else if (grade.point <= 69){
            var detailFont = 'danger';
            var detailIcon = '';
          } else if (grade.point <= 99){
            var detailFont = 'warning';
            var detailIcon = '';
          } else if (grade.point == 100){
            var detailFont = 'default';
            var detailIcon = '';
          }
          if (detailFont == 'danger' && preFont != 'danger') {
            var iconStyle = { color: '#b94a48' };
            var icon = <Glyphicon glyph='exclamation-sign' />;
            var caption =  <h4><span style={iconStyle}>{icon}</span> 修正が必要：</h4> ;
            preFont = detailFont;
          }
          if (detailFont == 'warning' && preFont != 'warning') {
            var iconStyle = { color: '#f89406' };
            var icon = <Glyphicon glyph='exclamation-sign' />;
            var caption =  <h4><span style={iconStyle}>{icon}</span> 修正を考慮：</h4> ;
            preFont = detailFont;
          }
          if (detailFont == 'default' && preFont != 'default') {
            var iconStyle = { color: '#468847' };
            var icon = <Glyphicon glyph='ok-sign' />;
            var caption =  <h4><span style={iconStyle}>{icon}</span> 問題は見つかりませんでした：</h4> ;
            preFont = detailFont;
          }
          return ( grade.point == '100' ?
            <div>
             {caption}
            <Panel header={title} eventKey={i} bsStyle={detailFont} key={'grade_'+i}>
              <p>{grade.advice.message}
              <OverlayTrigger trigger='click' placement='right' overlay={<Popover >
                {grade.advice.detail}
              </Popover>}>
              <a>詳細</a>
              </OverlayTrigger>
              </p>
            </Panel>
            </div>
              :
            <div>
             {caption}
            <Panel header={title} eventKey={i} bsStyle={detailFont} key={'grade_'+i}>
              <p>{grade.advice.message}
              <OverlayTrigger trigger='click' placement='right' overlay={<Popover >
                {grade.advice.detail}
              </Popover>}>
              <a>詳細</a>
              </OverlayTrigger>
              </p>
              <a href={"#collapseIsseus"+i} data-toggle="collapse" aria-expanded="false" aria-controls={"collapseIsseus"+i}>改善が必要なチケット（{grade.advice.issues.length}件）</a>
              <div className="collapse" id={"collapseIsseus"+i}>
                <ul style={listStyle}>
                  {grade.advice.issues.map(function(issues, i) {
                    return <li key={'issue_'+i}> <a href={issues.issue_url} target="_blank"> {issues.issue_summary}({issues.issue_key}) </a> </li>;
                  })}
                </ul>
              </div>
            </Panel>
            </div>
          );
        })}
      </div>
    );
  }
});


module.exports = GradeItem;
