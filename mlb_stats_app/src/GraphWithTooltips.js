import React from 'react';
import { Line, Scatter } from 'react-chartjs-2';
import 'chart.js/auto';

const plugins = [
  {
    afterDraw: chart => {
      let xAxis = chart.scales.x;
      let yAxis = chart.scales.y;
      let ctx = chart.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(xAxis.left, yAxis.getPixelForValue(1500));
      ctx.lineTo(xAxis.right, yAxis.getPixelForValue(1500));
      ctx.setLineDash([2, 2]); // set a dash pattern
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'black'; // set the line color to black
      ctx.stroke();
      ctx.restore();
      if (chart.tooltip?._active?.length) {
        let x = chart.tooltip._active[0].element.x;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, yAxis.top);
        ctx.lineTo(x, yAxis.bottom);
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]); // set a dash pattern
        ctx.strokeStyle = 'black'; // set the line color to black
        ctx.stroke();
        ctx.restore();
      }
    }
  }
];

function addDaysToDate(dateString, days, full=false) {
  const dateObject = new Date(dateString);
  const currentTimeStamp = dateObject.getTime();
  const targetTimeStamp = currentTimeStamp + days * 24 * 60 * 60 * 1000;
  const targetDate = new Date(targetTimeStamp);
  const year = targetDate.getUTCFullYear();
  const month = targetDate.getUTCMonth() + 1; // Months are 0-indexed, so we add 1
  const day = targetDate.getUTCDate();
  let formattedDate;
  if (full) {
    formattedDate = `${year.toString()}-${month.toString()}-${day.toString()}`;
  } else {
    formattedDate = `${month.toString()}-${day.toString()}`;
  }
  return formattedDate;
}

const GraphWithTooltips = ({ data }) => {
  // Extracting dates and elo values from the data
  const dates = data.map(item => item.date);
  const timestamps = data.map(item => item.timestamp);
  const eloValues = data.map(item => item.elo);

  const leagueAverageData = [
    { x: data[0].date, y: 1500 },
    { x: data[data.length - 1].date, y: 1500 },
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        enabled: true,
        callbacks: {
          title: function(tooltipItem) {
            return addDaysToDate(dates[0], tooltipItem[0].label, true);
          },
          label: function(tooltipItem) {
            return "ELO: " + tooltipItem.raw;
          },
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
        ticks: {
          maxRotation: 0,
          // For a category axis, the val is the index so the lookup via getLabelForValue is needed
          callback: function(val, index) {
            // Hide every 2nd tick label
            return addDaysToDate(dates[0], this.getLabelForValue(val));
          },
        }
      },
      y: {
        title: {
          display: true,
          text: 'ELO',
        },
        ticks: {
          callback: function(val, index) {
            if (val === 1500) {
              return "League average";
            }
            return this.getLabelForValue(val);
          },
        }
      },
    },
  };

  const chartData = {
    labels: timestamps,
    datasets: [
      {
        label: 'ELO',
        data: eloValues,
        showLine: true,
        borderColor: 'rgba(0, 0, 255, 1)',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
      },
      {
        label: 'League Average',
        data: leagueAverageData,
        borderColor: 'rgba(255, 0, 0, 1)', // Red color for the line
        borderWidth: 1,
        borderDash: [5, 5], // Dashed line style
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  return <Scatter data={chartData} options={chartOptions} plugins={plugins} />;
};

export default GraphWithTooltips;

