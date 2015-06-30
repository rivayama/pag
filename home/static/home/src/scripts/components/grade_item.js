var Panel     = require('react-bootstrap').Panel;
var Glyphicon = require('react-bootstrap').Glyphicon;

var GradeItem = React.createClass({
  render: function() {
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
                    return <li key={'issue_'+i}> <a href={issues.issue_url} target="_blank"> {issues.issue_summary}({issues.issue_key}) </a> </li>;
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


module.exports = GradeItem;
