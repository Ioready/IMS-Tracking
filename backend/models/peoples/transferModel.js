import mongoose from "mongoose";
const Objectid = mongoose.Types.ObjectId;

const transferSchema = new mongoose.Schema({
    startDate: {
        type: Date,
    },
    from: {
        type: Objectid,
        ref: "stores",
    },
    to: {
        type: Objectid,
        ref: "stores",
    },
    orderTax: {
        type: String,
        // required: true,
    },
    totalDiscount: {
        type: String,
        default: 0,
        // required: true,
    },
    shipping: {
        type: Number,
        default: 0,
        // required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Received"],
        default: "Pending",
        // required: true
    },
    description: {
        type: String,
        // required: true
    },
    grandTotalNumber: {
        type: Number,
        default: 0,
    },
    reference: {
        type: String
    },
    items: {
        type: Number,
        default: 1
    },
    selectedData: {
        type: Array,
    },
});

const transferModel = mongoose.model("transfers", transferSchema);
export default transferModel;
