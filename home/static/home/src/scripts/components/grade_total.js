var Table     = require('react-bootstrap').Table;
var Glyphicon = require('react-bootstrap').Glyphicon;

var GradeTotal = React.createClass({
  render: function() {
    var total = this.props.data;
    if (total.point < 50) {
      var summaryFont = 'danger';
      var summaryIcon = <Glyphicon glyph='fire' />;
      var summaryGrade = 'E';
      var summaryGradeStyle = {
        color: '#CD5629',
      };
    } else if (total.point < 70){
      var summaryFont = 'danger';
      var summaryIcon = '';
      var summaryGrade = 'D';
      var summaryGradeStyle = {
        color: '#CD5629',
      };
    } else if (total.point < 85){
      var summaryFont = 'warning';
      var summaryIcon = '';
      var summaryGrade = 'C';
      var summaryGradeStyle = {
        color: '#FFCC00',
      };
    } else if (total.point < 95){
      var summaryFont = 'warning';
      var summaryIcon = '';
      var summaryGrade = 'B';
      var summaryGradeStyle = {
        color: '#00ff00',
      };
    } else if (total.point <= 100){
      var summaryFont = 'sucess';
      var summaryIcon = '';
      var summaryGrade = 'A';
      var summaryGradeStyle = {
        color: '#00ff00',
      };
    }
    return (
      <div>
        <h2> {total.project_name} </h2>
        <Table bordered condensed hover>
        <thead>
        <tr>
          <th>grade</th>
          <th>チケット数</th>
          <th>コメント数</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td>
          <div style={summaryGradeStyle} >
            <big><strong> {summaryIcon} {summaryGrade} ({total.point}%)</strong></big>
          </div>
        </td>
        <td>
          <big>{total.issue_count}</big>
        </td>
        <td>
          <big>{total.comment_count}</big>
        </td>
        </tr>
        </tbody>
        </Table>
      </div>
    );
  }
});

module.exports = GradeTotal;
