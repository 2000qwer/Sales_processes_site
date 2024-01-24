
import 'chartjs-adapter-date-fns';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './Charts.css';
import { format , isValid } from 'date-fns'; 




const Charts = () => {
  const [salesData, setSalesData] = useState([]);

  const [showTotalGrandTotal, setShowTotalGrandTotal] = useState(false); // Added state
  const [salesDataDate, setSalesDataDate] = useState([]);
  const [salesDataPayment, setSalesPayment] = useState([]);
  const [salesDataBiStatus, setSalesDataBiStatus] = useState([]);



  const [selectedChart, setSelectedChart] = useState(null);
  const chartRef = useRef(null);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate(); // Add useNavigate hook
  const [redirectImmediately, setRedirectImmediately] = useState(false); // Add flag for immediate redirection
  const [showTotalPrice, setShowTotalPrice] = useState(false); // Flag to toggle between quantity and price

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/user', {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      console.log('User Details Response:', response.data);

      if (!response.data.user || !response.data.user.name) {
        console.log('User not logged in. Redirecting to login...');
        navigate('/'); // Redirect to login on user not found
      } else {
        setUserData(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user details:', error.message);

      // Check for a 500 status code in the response
      if (error.response && error.response.status === 500) {
        console.log('Internal server error. Redirecting to login immediately...');
        setRedirectImmediately(true); // Set the flag for immediate redirection
      }
    }
  };
   


 
  useEffect(() => {
    const fetchSalesDataDate = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/sales');
        const salesData = response.data.sales;
    
        const groupedSalesDataDate = salesData.reduce((dataByDate, sale) => {
          const date = sale.created_at ? new Date(sale.created_at).toISOString().slice(0, 7) : null;
    
          if (!dataByDate[date]) {
            dataByDate[date] = {
              date: date,
              totalQuantity: 0,
            };
          }
    
          dataByDate[date].totalQuantity += sale.qty_ordered;
          return dataByDate;
        }, {});
  
        const groupedSalesDataDateArray = Object.values(groupedSalesDataDate);

        // Set the state with the grouped data
        setSalesDataDate(groupedSalesDataDateArray);
      } catch (error) {
        console.error('Error fetching sales data for line chart:', error.message);
      }
    };


    const fetchSalesDataPayment = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/sales');
        const salesData = response.data.sales;
    
        const groupedSalesDataPayment = salesData.reduce((dataByPayment_Method, sale) => {
          const payment_method = sale.payment_method;
    
          if (!dataByPayment_Method[payment_method]) {
            dataByPayment_Method[payment_method] = {
              payment_method: payment_method,
              totalQuantity: 0,
            };
          }
    
          dataByPayment_Method[payment_method].totalQuantity += 1;
          return dataByPayment_Method;
        }, {});
    
        const groupedSalesDataPaymentArray = Object.values(groupedSalesDataPayment);
    
        // Log the grouped payment data to the console
        console.log('Grouped Payment Data:', groupedSalesDataPaymentArray);
    
        // Set the state with the grouped data
        setSalesPayment(groupedSalesDataPaymentArray);
      } catch (error) {
        console.error('Error fetching sales data for line chart:', error.message);
      }
    };
  
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/sales');
        const salesData = response.data.sales;
  
        // Group by categoryName and created_at for bar charts
        const groupedData = salesData.reduce((acc, sale) => {
          const category = sale.categoryName;
  
          if (!acc[category]) {
            acc[category] = {
              categoryName: category,
              totalQuantity: 0,
              totalGrandTotal: 0,
            };
          }
  
          acc[category].totalQuantity += sale.qty_ordered;
          acc[category].totalGrandTotal += sale.grand_total;
  
          return acc;
        }, {});
  
        const groupedSalesData = Object.values(groupedData);
  
        setSalesData(groupedSalesData);
      } catch (error) {
        console.error('Error fetching sales data for bar charts:', error.message);
      }
    };

    const fetchSalesDataBiStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/sales');
        const salesData = response.data.sales;
    
        const groupedSalesDataBiStatus = salesData.reduce((dataByBiStatus, sale) => {
          const biStatus = sale.BI_Status;
    
          if (!dataByBiStatus[biStatus]) {
            dataByBiStatus[biStatus] = {
              biStatus: biStatus,
              totalGrandTotal: 0,
            };
          }
          
          dataByBiStatus[biStatus].totalGrandTotal += 1; // Change this to the appropriate count logic
          return dataByBiStatus;
        }, {});
    
        const groupedSalesDataBiStatusArray = Object.values(groupedSalesDataBiStatus)
      .filter((data) => data.biStatus !== undefined )

        // Log the grouped data to the console
        console.log(groupedSalesDataBiStatusArray);
    
        // Set the state with the grouped data
        setSalesDataBiStatus(groupedSalesDataBiStatusArray);
      } catch (error) {
        console.error('Error fetching sales data for pie chart:', error.message);
      }
    };
    fetchSalesDataBiStatus();
    fetchUserDetails();
    fetchSalesData();
    fetchSalesDataDate();
    fetchSalesDataPayment();
  }, [navigate]);
    
  
  const generateChart = (type, data, labels, datasetLabel, yLabel, xLabel) => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

  const ctx = document.getElementById('salesChart');
  const colors = generateFixedColors(data.length); // Function to generate colors

  chartRef.current = new Chart(ctx, {
        type: type,
        data: {
          labels: labels,
          datasets: [
            {
              label: datasetLabel,
              data: data,
              backgroundColor: colors,
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          aspectRatio: 2.2, // Maintain aspect ratio
          plugins: {
            legend: {
              position: 'right',
            },
          },
          elements: {
            arc: {
              borderWidth: 0, // Remove border around the pie chart slices
            },
          },
        },
      });
    };
    
  
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
  
    const ctx = document.getElementById('salesChart');
  if (selectedChart !== null) {
    if (selectedChart === 0) {
      // Logic for chart type 0
      generateChart(
        'bar',
        salesData.map((sale) => sale.totalQuantity),
        salesData.map((sale) => sale.categoryName),
        'Quantity Ordered by Category',
        'Total Quantity Ordered',
        'Category Name'
      );
    } else if (selectedChart === 1) {
      // Logic for chart type 1
      generateChart(
        'bar',
        salesData.map((sale) => sale.totalGrandTotal),
        salesData.map((sale) => sale.categoryName),
        'Total Grand Total by Category',
        'Total Grand Total',
        'Category Name'
      );
    } else if (selectedChart === 2) {
      // Logic for chart type 2 (Line Chart)
      if (salesDataDate && salesDataDate.length > 0) {
        generateChart(
          'line',
          salesDataDate.map((data) => data.totalQuantity),
          salesDataDate.map((data) => data.date),
          'Total Quantity by Date',
          'Total Quantity',
          'Date'
        );
      } else {
        console.warn('Sales data is empty or invalid for line chart.');
      }
    } else if (selectedChart === 3) {
      console.log('Sales Data Payment:', salesDataPayment);
      console.log('Length of Sales Data Payment:', salesDataPayment.length);
      
      
      if (salesDataPayment && salesDataPayment.length > 0) {
        generateChart(
          'bar',
          salesDataPayment.map((data) => data.totalQuantity),
          salesDataPayment.map((data) => data.payment_method),
          'Quantity by Payment Method',
          'Total Quantity',
          'Payment Method'
        );
      }
    }
    if (selectedChart === 4) {
      if (salesDataBiStatus && salesDataBiStatus.length > 0) {
        generateChart(
          'pie',
          salesDataBiStatus.map((data) => data.totalGrandTotal),
          salesDataBiStatus.map((data) => data.biStatus),
          'Quantity by BiStatus',
          'Total Quantity',
          'BiStatus'
        );
      } else {
        console.warn('Sales data is empty or invalid for pie chart.');
      }
    }
    
  }
}, [selectedChart, salesData, salesDataDate, salesDataPayment, salesDataBiStatus]);


const generateFixedColors = (count) => {
  const fixedColors = [
    'rgba(75,192,192,0.6)',
    'rgba(255,99,132,0.6)',
    'rgba(255,205,86,0.6)',
    'rgba(54,162,235,0.6)',
    'rgba(255,159,64,0.6)',
    // Add more colors as needed
  ];

  // If count is greater than the number of fixed colors, cycle through them
  const colors = Array.from({ length: count }, (_, index) => fixedColors[index % fixedColors.length]);

  return colors;
};
  const chartNames = [
    'Quantity Ordered by Category',
    'Total Grand Total by Category',
    'Line Chart by Date',
    'Payment Chart',
    'Pie Chart by BiStatus', // Add this entry
  ];

  return (
    <div className="charts-container">
      <Link to="/dashboard" className="dashboard-link">
        <h1>Sales Data Visualization</h1>
      </Link>

      <div className="chart-list">
        {chartNames.map((chartName, index) => (
          <div
            key={index}
            className={`chart-name ${selectedChart === index ? 'selected' : ''}`}
            onClick={() => setSelectedChart(index)}
          >
            {chartName}
          </div>
        ))}
      </div>

      <div className="chart-wrapper">
    
        <canvas id="salesChart" width="400" height="200"></canvas>
      </div>

      
    </div>
  );
};
export default Charts;