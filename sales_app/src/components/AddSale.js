import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddSale.css';
import { Link, useNavigate } from 'react-router-dom'; 



const AddSale = () => {
  const [statusList, setStatusList] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const [biStatusList, setBiStatusList] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate(); 
  
  


  const [formData, setFormData] = useState({
    email: userEmail,
    item_id: '',
    status: '',
    created_at: new Date().toISOString(),
    sku: '',
    price: '',
    qty_ordered: '',
    grand_total: '',
    increment_id: '',
    categoryName: '',
    discount_amount: '',
    payment_method: '',
    Working_Date: new Date().toISOString(),
    BI_Status: '',
    Customer_ID: '',

  });

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      console.log('No user found. Redirecting to login...');
      navigate('/');
      return;
  }
  },);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch distinct status values
        const responseStatusList = await axios.get('http://localhost:5001/api/sales/status-list');
        setStatusList(responseStatusList.data.statusList);

        // Fetch distinct payment methods
        const responsePaymentMethods = await axios.get('http://localhost:5001/api/sales/payment-methods');
        setPaymentMethods(responsePaymentMethods.data.paymentMethods);

        // Fetch distinct category names
        const responseCategoryNames = await axios.get('http://localhost:5001/api/sales/category-names');
        setCategoryNames(responseCategoryNames.data.categoryNames);

         // Fetch distinct bi status values
        const responseBiStatusList = await axios.get('http://localhost:5001/api/sales/bi-status-list');
        setBiStatusList(responseBiStatusList.data.biStatusList);
        
        const responseUser = await axios.get('http://localhost:5001/api/user', {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        setUserEmail(responseUser.data.user.email);
      } catch (error) {
        console.error('Error fetching data:', error.message);

        // Check for a 500 status code in the response
        if (error.response && error.response.status === 500) {
          console.log('Internal server error. Redirecting to login...');
          navigate('/');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    try {
      if (!localStorage.getItem('token')) {
        console.log('No user found. Redirecting to login...');
        navigate('/');
        return;
      }
      
      
      // Calculate total grand amount before sending the request
      const totalGrand = formData.qty_ordered * formData.price;
      setFormData((prevFormData) => ({ ...prevFormData, grand_total: totalGrand , email: userEmail}));
      formData.email = userEmail;
      
      // Send a POST request to save the new sale
      const response = await axios.post(
        'http://localhost:5001/api/sales',
        formData,
        
        {
          headers: {
            'Content-Type': 'application/json',
            email : userEmail
          },
        }
      );

      // Clear the form after successful submission
      setFormData({
        item_id: '',
        status: '',
        created_at: new Date().toISOString(),
        sku: '',
        price: '',
        qty_ordered: '',
        grand_total: '',
        increment_id: '',
        categoryName: '',
        discount_amount: '',
        payment_method: '',
        Working_Date: new Date().toISOString(),
        BI_status: '',
        Customer_ID: '',
        emial : ''
        
      });

      alert('Sale added successfully!');
    } catch (error) {
      console.error('Error adding sale:', error.message);
      alert('Failed to add sale. Please try again.');
    }
  };

  return (
    <div className="add-sale-container">
       <Link to="/dashboard" className="add-sale-header-link"> {/* Use Link here */}
        <h1 className="add-sale-header">Add your sale</h1>
      </Link>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="categoryName">Category Name:   </label>
          <select
            id="categoryName"
            name="categoryName"
            onChange={handleInputChange}
            value={formData.categoryName}
          >
            <option value="" label="Select a category name" />
            {categoryNames.map((categoryName) => (
              <option key={categoryName} value={categoryName} label={categoryName} />
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="sku">SKU:  </label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price: </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required // Add the required attribute
          />
        </div>

        <div className="form-group">
          <label htmlFor="discount_amount">Discount amount:  </label>
          <input
            type="number"
            id="discount_amount"
            name="discount_amount"
            value={formData.discount_amount}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="qty_ordered">Quantity Ordered:  </label>
          <input
            type="number"
            id="qty_ordered"
            name="qty_ordered"
            value={formData.qty_ordered}
            onChange={handleInputChange}
          />
        </div>




        <div className="form-group">
          <label htmlFor="status">Status:   </label>
          <select
            id="status"
            name="status"
            onChange={handleInputChange}
            value={formData.status}
          >
            <option value="" label="Select a status" />
            {statusList.map((status) => (
              <option key={status} value={status} label={status} />
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="payment_method">Payment Method:   </label>
          <select
            id="payment_method"
            name="payment_method"
            onChange={handleInputChange}
            value={formData.payment_method}
          >
            <option value="" label="Select a payment method" />
            {paymentMethods.map((method) => (
              <option key={method} value={method} label={method} />
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="BI_Status">BI Status: </label>
          <select
            id="BI_Status"
            name="BI_Status"
            onChange={handleInputChange}
            value={formData.BI_Status}
          >
            <option value="" label="Select a BI status" />
            {biStatusList.map((biStatus) => (
              <option key={biStatus} value={biStatus} label={biStatus} />
            ))}
          </select>
        </div>
        <button type="submit" className="submit-button">Add Sale</button>
        <p>User Email: {userEmail}</p>
      </form>
    </div>
  );
};

export default AddSale;