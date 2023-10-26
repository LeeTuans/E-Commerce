import Order from "../../mongodb/models/order/order.js";
import OrderItem from "../../mongodb/models/order/orderItem.js";
import OrderPayment from "../../mongodb/models/order/orderPayment.js";

// @route GET /orders
// @access Private
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .lean()
      .populate("payment")
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
        },
      });

    return res.status(200).json(orders);
  } catch (err) {
    console.log(err)
  }
};

// @route POST /orders
// @access Private
const createOrder = async (req, res) => {
  try {
    const { user, products, total, payment, status } = req.body;

    if (!user || !products || !payment)
      return res.status(400).json({ message: "Invalid fields" });

    // Create a new
    const newOrder = await Order.create({
      user,
      total,
      status,
    });

    if (!newOrder) return res.status(400).json({ message: "Invalid data" });

    products &&
      (await OrderItem.insertMany(
        products.map((product) => {
          return {
            order: newOrder._id,
            product: product.id,
            quantity: product.quantity,
          };
        })
      ));

    payment &&
      (await OrderPayment.create({
        order: newOrder._id,
        paymentType: payment.paymentType,
        accountNumber: payment.accountNumber,
        currency: payment.currency,
        status: payment.status,
      }));

    const order = await Order.findById(newOrder._id)
      .populate("orderItems payment")
      .lean();

    return res.status(201).json(order);
  } catch (err) {
    console.log(err)
  }
};

// @route PUT /orders
// @access Private
const updateOrder = async (req, res) => {
  try {
    const { id, user, products, total, payment, status } = req.body;

    if (!id || !user || !products || !payment)
      return res.status(400).json({ message: "Invalid fields" });

    // Create a new
    const updatedOrder = await Order.findByIdAndUpdate(id, {
      user,
      total,
      status,
    });

    products &&
      (await OrderItem.deleteMany({ order: id })) &&
      (await OrderItem.insertMany(
        products.map((product) => {
          return {
            order: id,
            product: product.id,
            quantity: product.quantity,
          };
        })
      ));

    payment &&
      (await OrderPayment.updateOne(
        { order: id },
        {
          paymentType: payment.paymentType,
          accountNumber: payment.accountNumber,
          currency: payment.currency,
          status: payment.status,
        }
      ));

    const order = await Order.findById(id).populate("orderItems payment").lean();

    return res.status(200).json(order);
  } catch (err) {
    console.log(err)
  }
};

// @route DELETE /orders
// @access Private
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedOrder = await Order.deleteOne({ _id: id });

    return res.status(200).json({ message: "Delete Order successfully" });
  } catch (err) {
    console.log(err)
  }
};

export { getOrders, createOrder, updateOrder, deleteOrder };
