import { model, Schema } from "mongoose";

const productschema = new Schema(
  {
    /*companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },*/
    userId : {
      type: Schema.Types.ObjectId,
      ref :"Users",
      required: true,
    },
    label: {
      type: String,
      required: [true, "product label is required."],
      trim: true,
      match: [/^[a-zA-Z0-9 ]+$/, "Please entre a valid product label."],
      minlength: [2, "Product label must be at least 2 characters long."],
      maxlength: [50, "Product label cannot exceed 50 characters."],
    },
    price: {
      type: Number,
      required: [true, "product price is required."],
      min: [0, "Product price must be at least 1."],
    },
    photos: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

productschema.pre("save", async function (next) {
  this.price = parseFloat(this.price).toFixed(3);
  next();
});
productschema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
  const update = this.getUpdate();

  if (update.price) {
    this.price = parseFloat(this.price).toFixed(3);
  }

  next();
});

const Products = model("Products", productschema);

export default Products;
