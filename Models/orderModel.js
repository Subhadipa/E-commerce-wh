const mongoose = require('mongoose');
// Validator function for credit card payments
const isRequiredForCreditCard = function (value) {
  return this.paymentMethod === 'Card' ? !!value : true;
};
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      productTotal:{
        type: Number,
        default: 0,
      }
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
  },
  paymentMethod: {
    type:String,
    enum:["UPI","COD","Card"],
    required:true
  },
  cardDetails: {
    cardHolderName: {
      type: String,
      validate: {
        validator: isRequiredForCreditCard,
        message: 'Card holder name is required for card payments.',
      },
      required: function () {
        return this.paymentMethod === 'Card';
      },
    },
    
    cardNumber: {
      type: String,
      validate: {
        validator: isRequiredForCreditCard,
        message: 'Card number is required for card payments.',
      },
      required: function () {
        return this.paymentMethod === 'Card';
      },
    },
    expirationDate: {
      type: String,
      validate: {
        validator: isRequiredForCreditCard,
        message: 'Expiration Date is required for card payments.',
      },
      required: function () {
        return this.paymentMethod === 'Card';
      },
    },

  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
  updatedOn: {
    type: Date,
  },
});

module.exports = mongoose.model('Order', orderSchema);

