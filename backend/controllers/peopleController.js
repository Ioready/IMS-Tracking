import bcrypt from 'bcrypt'
import customerModel from '../models/peoples/customerModel.js';
import quotationModel from '../models/peoples/quotationModel.js';
import salesModel from '../models/peoples/salesModel.js';
import salesReturnModel from '../models/peoples/salesReturnModel.js';
import storeModel from '../models/peoples/storeModel.js';
import supplierModel from '../models/peoples/supplierModel.js';
import userModel from '../models/peoples/userModel.js';
import transferModel from '../models/peoples/transferModel.js';
import invoiceModel from '../models/peoples/invoiceModel.js';

export const getCustomers = async (req, res) => {
    try {
        const customers = await customerModel.find()
        res.status(200).send(customers);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in Customers", success: false, error })
    }
}

export const addCustomer = async (req, res) => {
    try {
        const { customerDatas, image } = req.body
        const { customerName, email, phone, country, code, state, city, zipCode, address, descr } = customerDatas
        const existEmail = await customerModel.findOne({email})
        const existPhone = await customerModel.findOne({phone})
        if (existEmail) {
            return res.status(200).send({ emailExist: true })
        }
        if (existPhone) {
            return res.status(200).send({ phoneExist: true })
        }
        const customerData = new customerModel({
            customerName, email, phone, country, code, state, city, zipCode, address, descr, image
        })
        customerData.save()
        res.status(200).send({ success: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in products", success: false, error })
    }
}

export const editDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const customer = await customerModel.findById(id)

        if (!customer) {
            return res.status(404).send({ message: "No customer in db", success: false });
        }
        res.status(200).send(customer);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching cutomer details", success: false, error });
    }
}

export const editCustomer = async (req, res) => {
    try {
        const id = req.params.id
        const { customerName, email, phone, country, code, state, city, zipCode, address, descr } = req.body
        await customerModel.findByIdAndUpdate(id, {
            $set: {
                customerName, email, phone, country, code, state, city, zipCode, address, descr
            }
        })
        res.status(200).send({ success: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in edit customer", success: false, error })
    }
}

export const deleteCustomer = async (req, res) => {
    try {
        const id = req.params.id
        await customerModel.deleteOne({ _id: id })
        res.status(200).send({ delete: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in delete customer", success: false, error })
    }
}

export const getSuppliers = async (req, res) => {
    try {
        const suppliers = await supplierModel.find()
        res.status(200).send(suppliers);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in suppliers", success: false, error })
    }
}

export const addSupplier = async (req, res) => {
    try {
        const { supplierDatas, image } = req.body
        const { supplierName, email, phone, country, code, state, city, zipCode, address, descr } = supplierDatas
        const existEmail = await supplierModel.findOne({email})
        const existPhone = await supplierModel.findOne({phone})
        if (existEmail) {
            return res.status(200).send({ emailExist: true })
        }
        if (existPhone) {
            return res.status(200).send({ phoneExist: true })
        }
        const supplierData = new supplierModel({
            supplierName, email, phone, country, code, state, city, zipCode, address, descr, image
        })
        supplierData.save()
        res.status(200).send({ success: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in products", success: false, error })
    }
}

export const editSupplierDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const supplier = await supplierModel.findById(id)

        if (!supplier) {
            return res.status(404).send({ message: "No supplier in db", success: false });
        }
        res.status(200).send(supplier);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching supplier details", success: false, error });
    }
}


export const editSupplier = async (req, res) => {
    try {
        const id = req.params.id
        const { supplierDatas, image } = req.body
        const { supplierName, email, phone, country, code, state, city, zipCode, address, descr } = supplierDatas
        await supplierModel.findByIdAndUpdate(id, {
            $set: {
                supplierName, email, phone, country, code, state, city, zipCode, address, descr, image
            }
        })
        res.status(200).send({ success: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in edit supplier", success: false, error })
    }
}

export const deleteSupplier = async (req, res) => {
    try {
        const id = req.params.id
        await supplierModel.deleteOne({ _id: id })
        res.status(200).send({ delete: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in delete supplier", success: false, error })
    }
}

export const getSalesList = async (req, res) => {
    try {
        const saleList = await salesModel.find()
            .populate({
                path: 'customerName',
                select: 'customerName -_id' // Include _id from the populated field
            })
            .populate({
                path: 'supplierName',
                select: 'supplierName -_id' // Include _id from the populated field
            })


        const salesList = saleList.map(sales => {
            // Convert the date format
            const formatDate = (dateString) => {
                const databaseDate = new Date(dateString);
                const day = databaseDate.getDate().toString().padStart(2, "0");
                const month = (databaseDate.getMonth() + 1).toString().padStart(2, "0");
                const year = databaseDate.getFullYear();
                return `${day}-${month}-${year}`;
            };

            // Map other properties
            return {
                ...sales._doc,
                startDate: formatDate(sales.startDate),
                paymentDate: formatDate(sales.paymentDate),
                customerName: sales.customerName ? sales.customerName.customerName : null,
                supplierName: sales.supplierName ? sales.supplierName.supplierName : null
            };
        });
        console.log('salesList: ', salesList);
        res.status(200).send(salesList);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching cutomer details", success: false, error });
    }
}

export const addSale = async (req, res) => {
    try {
        let { userId, customerName, startDate, supplierName, orderTax, totalDiscount, shipping, grandTotalNumber, status, data } = req.body
        if (status === '') {
            status = 'Pending'
        }
        const user = await userModel.findById(userId)
        const userName = user.userName
        console.log(userName);
        const salesData = new salesModel({
            customerName, startDate, supplierName, orderTax, totalDiscount, shipping, grandTotalNumber, status,
            biller: userName, selectedProducts: data
        })
        salesData.save()
        res.status(200).send({ success: true, message: "Sales added success" })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in add sales", success: false, error })
    }
}

export const getSaleDetail = async (req, res) => {
    try {
        const id = req.params.id;
        let saleDetail = await salesModel.findById(id)
            .populate('customerName')
            .populate('supplierName')
        res.status(200).send(saleDetail);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching cutomer details", success: false, error });
    }
}

export const editSale = async (req, res) => {
    const id = req.params.id
    console.log(req.body);
    try {
        let { customerName, startDate, supplierName, orderTax, totalDiscount, shipping, grandTotalNumber, status, selectedProducts } = req.body
        if (status === '') {
            status = 'Pending'
        }
        await salesModel.findByIdAndUpdate(id, {
            $set: {
                customerName, startDate, supplierName, orderTax, totalDiscount, shipping, grandTotalNumber, status, selectedProducts
            }
        })
        res.status(200).send({ success: true, message: "Sales updated success" })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in edit supplier", success: false, error })
    }
}

export const createPayment = async (req, res) => {
    try {
        const id = req.params.id;
        let payment_status;
        let invoice_status;
        let dueAmount = 0
        let { paymentDate, reference, receivedAmount, payingAmount, paymentType, note } = req.body;
        const dueDate = new Date(paymentDate);
        dueDate.setDate(dueDate.getDate() + 7);

        // Fetch sale details by ID
        const saleDetail = await salesModel.findById(id);
        if (saleDetail.dueAmount === 0) {
            const amount = saleDetail.grandTotalNumber - payingAmount
            dueAmount = parseFloat(amount).toFixed(2);
        } else {
            const amount = saleDetail.dueAmount - payingAmount
            dueAmount = parseFloat(amount).toFixed(2);
            const totalPayingAmount = saleDetail.payingAmount + parseFloat(payingAmount)
            payingAmount = parseFloat(totalPayingAmount).toFixed(2);
        }

        // Determine payment and invoice statuses
        if (dueAmount > 0) {
            payment_status = 'Due';
            invoice_status = 'Overdue';
        }
        const invoice = true
        await salesModel.findByIdAndUpdate(id, {
            $set: {
                paymentDate, reference, receivedAmount, dueAmount, payingAmount, paymentType, note, payment_status, invoice_status, dueDate, invoice
            }
        });
        res.status(200).send({ success: true });
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in add sales", success: false, error })
    }
}

export const deleteSale = async (req, res) => {
    try {
        const id = req.params.id
        await salesModel.deleteOne({ _id: id })
        res.status(200).send({ delete: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in delete supplier", success: false, error })
    }
}

export const deletePayment = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await salesModel.updateOne(
            { _id: id },
            {
                $unset: {
                    paymentDate: "",
                    reference: "",
                    receivedAmount: "",
                    dueAmount: "",
                    payingAmount: "",
                    paymentType: "",
                    note: ""
                }
            }
        );
        if (result.modifiedCount === 1) {
            res.status(200).send({ delete: true });
        } else {
            res.status(404).send({ message: "Document not found", success: false });
        }
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in delete payment", success: false, error });
    }
};

export const invoiceReport = async (req, res) => {
    try {
        const saleList = await invoiceModel.find()
        .populate('customerName')

        const salesList = saleList.map((sales, index) => {

            const formatDate = (dateString) => {
                const databaseDate = new Date(dateString);
                const day = databaseDate.getDate().toString().padStart(2, "0");
                const month = (databaseDate.getMonth() + 1).toString().padStart(2, "0");
                const year = databaseDate.getFullYear();
                return `${day}-${month}-${year}`;
            };

            const currentDate = new Date(); // Current date and time
            const dueDate = new Date(sales.dueDate); // Your due date

            // Calculate the difference in milliseconds between the current date and due date
            const differenceMs = dueDate - currentDate;

            const invoiceNumber = sales.invoice_number ? sales.invoice_number + (index + 1) : 'INV00' + (index + 1);

            return {
                ...sales._doc,
                dueDate: formatDate(sales.dueDate),
                invoice_number: sales.invoice_number ? sales.invoice_number : invoiceNumber,
                customerName: sales.customerName ? sales.customerName.customerName : null,
                invoice_status: sales.invoice_status ?  sales.invoice_status : sales.dueAmount === 0 ? 'Paid' : differenceMs < 0 ? 'Unpaid' : 'Overdue',
            };

        });
        res.status(200).send(salesList);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching cutomer details", success: false, error });
    }
}

export const getInvoiceDetail = async (req, res) => {
    try {
        const id = req.params.id;
        let saleDetail = await invoiceModel.findById(id)
            .populate('customerName')
        res.status(200).send(saleDetail);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching sale return details", success: false, error });
    }
}

export const addInvoice = async (req, res) => {
    try {
        const { customerName, startDate, reference, status, description } = req.body
        const saleById = await salesModel.findOne({ reference })
        console.log('sales: ', saleById);
        if (!saleById) {
            console.log('no salebyid');
            res.status(401).send({ noReference: true, message: "Please check the reference" })
        }
        const salesData = new invoiceModel({
            customerName,
            dueDate: startDate,
            invoice_number: reference,
            grandTotalNumber: saleById.grandTotalNumber,
            paid: saleById.payingAmount,
            dueAmount: saleById.dueAmount,
            invoice_status: status,
            description
        })
        salesData.save()
        res.status(200).send({ success: true, message: "Invoice added success" })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in add sales", success: false, error })
    }
}

export const editInvoice = async (req, res) => {
    const id = req.params.id
    console.log(req.body);
    try {
        const { customerName, startDate, reference, status, description } = req.body
        const saleById = await salesModel.findOne({ reference })
        console.log('sales: ', saleById);
        if (!saleById) {
            console.log('no salebyid');
            res.status(401).send({ noReference: true, message: "Please check the reference" })
        }
        await invoiceModel.findByIdAndUpdate(id, {
            $set: {
                customerName, dueDate: startDate, invoice_number: reference, invoice_status: status, description
            }
        })
        res.status(200).send({ success: true, message: "Invoice updated success" })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in edit supplier", success: false, error })
    }
}

export const deleteInvoice = async (req, res) => {
    try {
        const id = req.params.id
        await invoiceModel.deleteOne({ _id: id })
        res.status(200).send({ delete: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in delete supplier", success: false, error })
    }
}

export const getSalesReturnList = async (req, res) => {
    try {
        const saleList = await salesReturnModel.find()
            .populate({
                path: 'customerName',
                select: 'customerName -_id' // Include _id from the populated field
            })

        const salesList = saleList.map(sales => {
            // Convert the date format
            const formatDate = (dateString) => {
                const databaseDate = new Date(dateString);
                const day = databaseDate.getDate().toString().padStart(2, "0");
                const month = (databaseDate.getMonth() + 1).toString().padStart(2, "0");
                const year = databaseDate.getFullYear();
                return `${day}-${month}-${year}`;
            };

            // Map other properties
            return {
                ...sales._doc,
                startDate: formatDate(sales.startDate),
                paymentDate: formatDate(sales.paymentDate),
                customerName: sales.customerName ? sales.customerName.customerName : null
            };
        });
        console.log('salesList: ', salesList);
        res.status(200).send(salesList);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching cutomer details", success: false, error });
    }
}


export const addSalesReturn = async (req, res) => {
    try {
        let { customerName, reference, startDate, orderTax, totalDiscount, shipping, description, grandTotalNumber, status, data } = req.body
        if (status === '') {
            status = 'Pending'
        }
        const saleData = await salesModel.findOne({ reference: reference })
        const salesData = new salesReturnModel({
            customerName, reference, startDate, orderTax, totalDiscount, shipping, description, grandTotalNumber, status,
            paid: saleData.receivedAmount,
            dueAmount: saleData.dueAmount,
            payment_status: saleData.payment_status,
            selectedProducts: data
        })
        salesData.save()
        res.status(200).send({ success: true, message: "Sales Return added success" })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in add sales", success: false, error })
    }
}

export const getReturnSaleDetail = async (req, res) => {
    try {
        const id = req.params.id;
        let saleDetail = await salesReturnModel.findById(id)
            .populate('customerName')
        res.status(200).send(saleDetail);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching sale return details", success: false, error });
    }
}

export const editSaleReturn = async (req, res) => {
    const id = req.params.id
    console.log(req.body);
    try {
        let { customerName, reference, paymentStatus, startDate, orderTax, totalDiscount, shipping, description, grandTotalNumber, status, selectedProducts } = req.body
        if (status === '') {
            status = 'Pending'
        }
        await salesReturnModel.findByIdAndUpdate(id, {
            $set: {
                customerName, reference, payment_status: paymentStatus, startDate, orderTax, totalDiscount, shipping, description, grandTotalNumber, status, selectedProducts
            }
        })
        res.status(200).send({ success: true, message: "Sales Return updated success" })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in edit sale return", success: false, error })
    }
}

export const deleteReturnSale = async (req, res) => {
    try {
        const id = req.params.id
        await salesReturnModel.deleteOne({ _id: id })
        res.status(200).send({ delete: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in delete supplier", success: false, error })
    }
}

export const getQuotationList = async (req, res) => {
    try {
        const saleList = await quotationModel.find()
            .populate({
                path: 'customerName',
                select: 'customerName -_id' // Include _id from the populated field
            })

        const quotaionList = saleList.map(sales => {
            // Map other properties
            return {
                ...sales._doc,
                customerName: sales.customerName ? sales.customerName.customerName : null
            };
        });
        console.log('qua: ', quotaionList);
        res.status(200).send(quotaionList);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching quotation details", success: false, error });
    }
}

export const addQuotation = async (req, res) => {
    try {
        let { customerName, reference, startDate, orderTax, totalDiscount, shipping, description, grandTotalNumber, status, data } = req.body
        if (status === '') {
            status = 'Pending'
        }
        const salesData = new quotationModel({
            customerName, reference, startDate, orderTax, totalDiscount, shipping, description, grandTotalNumber, status,
            selectedProducts: data
        })
        salesData.save()
        res.status(200).send({ success: true, message: "Quotation added success" })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in add sales", success: false, error })
    }
}

export const getQuotationDetail = async (req, res) => {
    try {
        const id = req.params.id;
        let saleDetail = await quotationModel.findById(id)
            .populate('customerName')
        res.status(200).send(saleDetail);
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching sale return details", success: false, error });
    }
}

export const editQuotation = async (req, res) => {
    const id = req.params.id
    console.log(req.body);
    try {
        let { customerName, reference, startDate, orderTax, totalDiscount, shipping, description, grandTotalNumber, status, selectedProducts } = req.body
        if (status === '') {
            status = 'Pending'
        }
        await quotationModel.findByIdAndUpdate(id, {
            $set: {
                customerName, reference, startDate, orderTax, totalDiscount, shipping, description, grandTotalNumber, status, selectedProducts
            }
        })
        res.status(200).send({ success: true, message: "Quotation updated success" })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in edit quotaion", success: false, error })
    }
}

export const deleteQuotation = async (req, res) => {
    try {
        const id = req.params.id
        await quotationModel.deleteOne({ _id: id })
        res.status(200).send({ delete: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in delete supplier", success: false, error })
    }
}

export const getTransferList = async (req, res) => {
    try {
        const transferList = await transferModel.find()
            .populate({
                path: 'from',
                select: 'storeName -_id' // Include _id from the populated field
            })
            .populate({
                path: 'to',
                select: 'storeName -_id' // Include _id from the populated field
            })


        const transfersList = transferList.map((transfer, index) => {
            // Convert the date format
            const formatDate = (dateString) => {
                const databaseDate = new Date(dateString);
                const day = databaseDate.getDate().toString().padStart(2, "0");
                const month = (databaseDate.getMonth() + 1).toString().padStart(2, "0");
                const year = databaseDate.getFullYear();
                return `${day}-${month}-${year}`;
            };

            const reference = transfer.reference ? transfer.reference + (index + 1) : 'TR010' + (index + 1);

            // Map other properties
            return {
                ...transfer._doc,
                startDate: formatDate(transfer.startDate),
                from: transfer.from ? transfer.from.storeName : null,
                to: transfer.to ? transfer.to.storeName : null,
                reference: reference
            };
        });
        console.log('transfersList: ', transfersList);
        res.status(200).send(transfersList);
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in users", success: false, error })
    }
}


export const addTransfer = async (req, res) => {
    console.log('req: ', req.body);
    try {
        let { from, to, startDate, orderTax, totalDiscount, shipping, description, grandTotalNumber, status, count, data } = req.body
        if (status === '') {
            status = 'Pending'
        }
        const transferData = new transferModel({
            from, to, startDate, orderTax, totalDiscount, shipping, description, grandTotalNumber, status, items: count,
            selectedData: data
        })
        transferData.save()
        res.status(200).send({ success: true, message: "Transfer added successfull" })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in add sales", success: false, error })
    }
}

export const getTransferDetail = async (req, res) => {
    try {
        const id = req.params.id;
        const transferDetail = await transferModel.findById(id)
            .populate('from')
            .populate('to')
        res.status(200).send(transferDetail);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching cutomer details", success: false, error });
    }
}

export const editTransfer = async (req, res) => {
    const id = req.params.id
    console.log(req.body);
    try {
        let { from, to, startDate, orderTax, totalDiscount, shipping, grandTotalNumber, status, description, count, selectedProducts } = req.body
        if (status === '') {
            status = 'Pending'
        }
        await transferModel.findByIdAndUpdate(id, {
            $set: {
                from, to, startDate, orderTax, totalDiscount, shipping, grandTotalNumber, status, description, items: count, selectedData: selectedProducts
            }
        })
        res.status(200).send({ success: true, message: "Sales updated success" })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in edit supplier", success: false, error })
    }
}

export const deleteTransfer = async (req, res) => {
    try {
        const id = req.params.id
        await transferModel.deleteOne({ _id: id })
        res.status(200).send({ delete: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in delete supplier", success: false, error })
    }
}

export const addImportTransfer = async (req, res) => {
    try {
        let { from, to, shipping, description, status, productFile } = req.body;
        if (status === "") {
            status = "Pending";
        }
        const transferData = new transferModel({
            startDate: new Date(), from, to, shipping, description, status, selectedData: productFile
        });
        transferData.save();
        res.status(200).send({ success: true });
    } catch (error) {
        console.log("error: ", error);
        res
            .status(500)
            .send({ message: "Error in add sales", success: false, error });
    }
}



export const addUser = async (req, res) => {
    try {
        const { userData, image } = req.body
        let { firstName, lastName, email, userName, password, phone, role } = userData
        const existEmail = await userModel.findOne({email})
        const existPhone = await userModel.findOne({phone})
        if (existEmail) {
            return res.status(200).send({ emailExist: true })
        }
        if (existPhone) {
            return res.status(200).send({ phoneExist: true })
        }
        const salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password, salt)
        const data = await userModel.findOne({ email: email })
        if (data) {
            await userModel.findOneAndUpdate({ email: email }, {
                $set: {
                    firstName, lastName, email, userName, password, phone, role, image
                }
            })
        } else {
            const userDatas = new userModel({
                firstName, lastName, email, userName, password, phone, role, image
            })
            userDatas.save()
        }
        res.status(200).send({ success: true, message: "User added success" })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in add sales", success: false, error })
    }
}

export const getUserList = async (req, res) => {
    try {
        const users = await userModel.find()
        res.status(200).send(users);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in users", success: false, error })
    }
}

export const getUserDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).send({ message: "No user in db", success: false });
        }
        res.status(200).send(user);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching cutomer details", success: false, error });
    }
}

export const editUser = async (req, res) => {
    try {
        const id = req.params.id
        const { userDatas, image } = req.body
        let { firstName, lastName, email, userName, phone, role } = userDatas
        await userModel.findByIdAndUpdate(id, {
            $set: {
                firstName, lastName, email, userName, phone, role, image
            }
        })
        res.status(200).send({ success: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in edit user", success: false, error })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id
        await userModel.deleteOne({ _id: id })
        res.status(200).send({ delete: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in delete supplier", success: false, error })
    }
}

export const getStoreList = async (req, res) => {
    try {
        const users = await storeModel.find()
        res.status(200).send(users);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in users", success: false, error })
    }
}

export const addStore = async (req, res) => {
    try {
        const { storeData, image } = req.body
        const { storeName, email, userName, password, phone } = storeData
        const existEmail = await storeModel.findOne({email})
        const existPhone = await storeModel.findOne({phone})
        if (existEmail) {
            return res.status(200).send({ emailExist: true })
        }
        if (existPhone) {
            return res.status(200).send({ phoneExist: true })
        }
        const storeDatas = new storeModel({
            storeName, email, userName, password, phone, image
        })
        storeDatas.save()
        res.status(200).send({ success: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in add sales", success: false, error })
    }
}

export const getStoreDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const store = await storeModel.findById(id)
        if (!store) {
            return res.status(404).send({ message: "No store in db", success: false });
        }
        res.status(200).send(store);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching store details", success: false, error });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const id = req.params.id
        const { status } = req.body
        await storeModel.findByIdAndUpdate(id, {
            $set: {
                status
            }
        })
        res.status(200).send({ success: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in edit user", success: false, error })
    }
}

export const editStore = async (req, res) => {
    const id = req.params.id
    try {
        const { storeDatas, image } = req.body
        const { storeName, email, userName, password, phone } = storeDatas
        await storeModel.findByIdAndUpdate(id, {
            $set: {
                storeName, email, userName, password, phone, image
            }
        })
        res.status(200).send({ success: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in edit user", success: false, error })
    }
}

export const deleteStore = async (req, res) => {
    try {
        const id = req.params.id
        await storeModel.deleteOne({ _id: id })
        res.status(200).send({ delete: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in delete supplier", success: false, error })
    }
}

export const salesReport = async (req, res) => {
    try {
        // const allSales = await salesModel.find()
        // console.log('all: ', allSales);
        const sales = await salesModel.aggregate([

            {
                $unwind: "$selectedProducts"
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "selectedProducts.category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $lookup: {
                    from: "brands",
                    localField: "selectedProducts.brand",
                    foreignField: "_id",
                    as: "brand"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $unwind: "$brand"
            },
            {
                $group: {
                    _id: "$_id",
                    parentData: { $first: "$$ROOT" },
                    selectedProducts: { $push: "$selectedProducts" },
                    category: { $first: "$category.categoryName" },
                    brand: { $first: "$brand.brandName" },
                    soldQty: { $sum: "$selectedProducts.quantity" },
                    qty: { $sum: "$selectedProducts.qty" },
                    skuList: { $push: "$selectedProducts.sku" },
                    productNames: { $push: "$selectedProducts.productName" }
                }
            },
            {
                $project: {
                    _id: "$parentData._id",
                    customerName: "$parentData.customerName",
                    startDate: "$parentData.startDate",
                    supplierName: "$parentData.supplierName",
                    orderTax: "$parentData.orderTax",
                    productName: "$parentData.productName",
                    sku: "$parentData.sku",
                    soldAmount: "$parentData.grandTotalNumber",
                    soldQty: 1,
                    qty: 1,
                    skuList: 1,
                    productNames: 1,
                    // Include other fields from the parent table as needed
                    selectedProducts: 1,
                    category: 1,
                    brand: 1
                }
            }

        ]);


        console.log("sales: ", sales);
        res.status(200).send(sales);
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching cutomer details", success: false, error });
    }
}