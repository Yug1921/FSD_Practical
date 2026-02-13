const express = require("express");
const app = express();

app.use(express.json());

app.use("/products", require("./routes/products"));
app.use("/users", require("./routes/users"));
app.use("/cart", require("./routes/cart"));
app.use("/orders", require("./routes/orders"));

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
