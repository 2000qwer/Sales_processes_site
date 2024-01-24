const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  item_id: { type: Number, required: false },
  status: { type: String, required: false },
  created_at: { type: Date, required: false },
  sku: { type: String, required: false },
  price: { type: Number, required: false },
  qty_ordered: { type: Number, required: false },
  grand_total: { type: Number, required: false },
  increment_id: { type: String, required: false },
  categoryName: { type: String, required: false },
  discount_amount: { type: Number, required: false },
  payment_method: { type: String, required: false },
  working_date: { type: Date, required: false },
  BI_Status: { type: String, required: false },
  merchant_value: { type: String, required: false },
  year: { type: Number, required: false },
  month: { type: Number, required: false },
  customer_since: { type: Date, required: false },
  m_y: { type: String, required: false },
  fy: { type: String, required: false },
  customer_id: { type: String, required: false },
  email : { type: String, required: false }
});

module.exports = mongoose.model('Sales', orderSchema);