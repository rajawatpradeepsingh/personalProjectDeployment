import { useMemo, useEffect, useState } from "react";
import ChatBox from "./chatBox";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from 'react-chartjs-2';
import './barchart.scss';
ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const BarChart = ({ chartData, dataSets, ...props }) => {
  const labels = useMemo(() => [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ], []);
  const current = useMemo(() => new Date().getMonth() + 1, []);
  const [month, setMonth] = useState(current);

  useEffect(() => {
    if (props.year !== new Date().getFullYear()) {
      setMonth(12);
    } else {
      setMonth(current);
    }
  }, [props.year, current])

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: props.chartHeading,
      },
    },
    scales: {
      yAxis: { min: 0 }
    }
  };

  const data = {
    labels,
    datasets: dataSets.map((set) => ({
      label: set.label,
      data: set.data.slice(0, month),
      backgroundColor: set.color,
      borderColor: set.color,
    })),
  };

   return (
     <div className="barchart-container">
       <Line options={options} data={data} width={950} height={450} />
       <ChatBox/>
     </div>
   );
}

export default BarChart;