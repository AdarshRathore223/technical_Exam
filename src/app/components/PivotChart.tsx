import { useEffect, useRef, useState } from 'react';
import { useFetchData } from '../hooks/useFetchData'; // Adjust the path accordingly
import Chart from 'chart.js/auto';

interface CategoryData {
  Amount: number;
  Category: string;
}

const PieChart = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Use the custom hook to fetch data
  const { data, error, isLoading } = useFetchData<
    { Amount: number; Category: string }[] // Data is an array of CategoryData
  >('/api/user');

  useEffect(() => {
    if (data && data.length > 0) {
      // Calculate the total amount expended
      const total = data.reduce((sum: number, item: CategoryData) => sum + item.Amount, 0);
      setTotalAmount(total);

      // Prepare data for the pie chart
      const categories = data.map((item: { Category: any; }) => item.Category); // Extract categories
      const amounts = data.map((item: { Amount: any; }) => item.Amount); // Extract amounts

      if (canvasRef.current) {
        // Initialize the chart with the fetched data
        new Chart(canvasRef.current, {
          type: 'pie',
          data: {
            labels: categories, // Use categories as labels
            datasets: [
              {
                label: 'Expense Category Distribution',
                data: amounts, // Use amounts for data
                backgroundColor: [
                  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#FFB6C1', '#8E44AD', '#3498DB', '#2ECC71', '#F39C12',
                  '#E74C3C', '#9B59B6', '#1ABC9C', '#D35400', '#34495E', '#16A085', '#F1C40F', '#7F8C8D', '#9C27B0', '#00BCD4',
                  '#8BC34A', '#FFC107', '#009688', '#FF5722', '#673AB7', '#03A9F4'
                ],
                hoverBackgroundColor: [
                  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#FFB6C1', '#8E44AD', '#3498DB', '#2ECC71', '#F39C12',
                  '#E74C3C', '#9B59B6', '#1ABC9C', '#D35400', '#34495E', '#16A085', '#F1C40F', '#7F8C8D', '#9C27B0', '#00BCD4',
                  '#8BC34A', '#FFC107', '#009688', '#FF5722', '#673AB7', '#03A9F4'
                ],
                
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem: any) => `${tooltipItem.label}: ${tooltipItem.raw}`, // Customize tooltip
                },
              },
            },
          },
        });
      }
    }
  }, [data]);

  if (isLoading) {
    return <div className="text-center text-xl font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{`Error: ${error}`}</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-4">Expense Category Distribution</h2>
      <canvas ref={canvasRef}></canvas>
      <div className="mt-6 text-lg font-medium text-center">
        <strong>Total Amount Expended: Rs: {totalAmount}</strong>
      </div>
    </div>
  );
};

export default PieChart;
