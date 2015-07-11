var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;

var GradeChart = React.createClass({

  getChartData: function() {
    var labels = [], points = [];
    this.props.data.forEach(function(grade) {
      labels.push(grade.title);
      if (grade.point == 0){
        points.push(1);
      }else{
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
    scaleOverride: true,
    scaleSteps: 10,
    scaleStepWidth: 1,
    scaleStartValue: 0,
    scaleFontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
    pointLabelFontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  },

  render: function() {
    return (
      <div>
      <h3> プロジェクトの評価 </h3>
      <Row>
        <Col xs={12} md={12} lg={10} lgOffset={1}>
          <canvas id="chart"></canvas>
        </Col>
      </Row>
      </div>
    );
  },

  componentDidMount: function() {
    var context = document.getElementById("chart").getContext("2d");
    new Chart(context).Radar(this.getChartData(), this.chartOptions);
  }

});

module.exports = GradeChart;
