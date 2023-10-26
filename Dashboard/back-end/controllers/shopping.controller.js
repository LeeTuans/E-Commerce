import Shopping from "../mongodb/models/shoppingSession.js";

const getShoppings = async (req, res) => {
  try {
    const Shoppings = await Shopping.find().lean();

    const newShopping = await Shopping.create({
      ShoppingName: "Le Tuan",
      password: "password",
      firstName: "first",
    });

    return res.status(200).json("All Shoppings");
  } catch (err) {
    console.log(err)
  }
};

const createShopping = async (req, res) => {
  try {
    const Shoppings = await Shopping.find().lean();

    const newShopping = await Shopping.create({
      ShoppingName: "Le Tuan",
      password: "password",
      firstName: "first",
    });

    return res.status(200).json("All Shoppings");
  } catch (err) {
    console.log(err)
  }
};

const updateShopping = async (req, res) => {
  try {
    const Shoppings = await Shopping.find().lean();

    const newShopping = await Shopping.create({
      ShoppingName: "Le Tuan",
      password: "password",
      firstName: "first",
    });

    return res.status(200).json("All Shoppings");
  } catch (err) {
    console.log(err)
  }
};

const deleteShopping = async (req, res) => {
  try {
    const Shoppings = await Shopping.find().lean();

    const newShopping = await Shopping.create({
      ShoppingName: "Le Tuan",
      password: "password",
      firstName: "first",
    });

    return res.status(200).json("All Shoppings");
  } catch (err) {
    console.log(err)
  }
};

export { getShoppings, createShopping, updateShopping, deleteShopping };
