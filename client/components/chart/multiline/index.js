import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);





export default function MultiLineChart({value}) {
    console.log(value)
    const labels = value.time
    const data = {
        labels,
        datasets: [
          {
            label: 'PM2.5',
            data: value.pm2_5,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            yAxisID: 'y',
          },
        //   {
        //     label: 'Dataset 2',
        //     data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
        //     borderColor: 'rgb(53, 162, 235)',
        //     backgroundColor: 'rgba(53, 162, 235, 0.5)',
        //     yAxisID: 'y1',
        //   },
        ],
      };
    const options = {
        responsive: true,
        interaction: {
          mode: 'index' ,
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: false,
          },
        },
        scales: {
          y: {
            type: 'linear' ,
            display: true,
            position: 'left' ,
          },
          y1: {
            type: 'linear' ,
            display: true,
            position: 'right' ,
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      };
  return <Line options={options} data={data} />;
}
