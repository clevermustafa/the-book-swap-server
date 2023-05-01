require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
const sendMail = async (req, res) => {
    try {
        var data = req.body;
        var body = data.orderDetails;
        console.log(data);
        var subject = setSubject(data.orderDetails.order_status);
        let mailOptions = {
            from: 'thebookswap1@gmail.com',
            to: data.emailTo,
            subject: subject,
            html: `
            <p>Hi ${body.buyer_name},</p>
            <p>${subject}</p>
            <br>
            <h4>Order Details</h4>
            <p>${body.book_name}</p>
            <p>Price: ${body.price}</p>
            `
        };
        transporter.sendMail(mailOptions, (err) => {
            if (err != null) {
                res.status(401).json({
                    'message': "Error sending email"
                });
            } else {
                res.status(200).json({
                    'message': 'Email sent successfully'
                })
            }
        });

    } catch (err) {
        const errResponse = {
            'message': err
        }
        res.status(500).json(errResponse)
    }
}

app.get('/', (req, res) => {
    console.log("Hitted");
    res.send("Book Swap Server");
});

app.post("/sendmail", sendMail);

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
})

// ucvezmnmkrcaifhj


app.listen(PORT, () => {
    console.log(`server started in port no. ${PORT}`);
})


function setSubject(orderStatus) {
    let subject;
    switch (orderStatus) {
        case OrderStatus.ORDERED:
            subject = "Your order has been placed";
            break;
        case OrderStatus.COMPLETED:
            subject = "Your book has been delivered"
            break;
        case OrderStatus.INPROGRESS:
            subject = "Your order is on the way!"
            break;
        case OrderStatus.CANCELLED:
            subject = "Your order has been cancelled";
            break;

    }
    return subject;
}
const OrderStatus = {
    ORDERED: 'ORDERED',
    CONFIRMED: 'CONFIRMED',
    INPROGRESS: 'INPROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
}




