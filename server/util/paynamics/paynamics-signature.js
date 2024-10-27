const { last } = require("lodash");
const crypto = require("crypto");
const logger = require("../loggers/logger");
const { paynamics, servers } = require("~/config/config");

const { FEES } = require('~/util/constants/enums/fees');

/**
 * 
 * @param {billingDetails} = netAmount, taxAmount, firstName, lastName, middleName,
 * 							 address, email, mobile, items, clientIp
 * @returns signature
 */

const generateSignature = async (billingDetails) => {
    try {
        let { firstName, lastName, middleName = '', address, email, mobile, items, clientIp } = billingDetails
        // let convenienceFee = FEES.CONVENIENCE_FEE;
        let grossAmount = 0;

        // xml format
        let itemDetails = '';

        // distribute the convenience fee depending on item length
        // convenienceFee = convenienceFee/items.length;
		let convenienceFee = {
			item_name: 'Convenience Fee',
			item_quantity: 1,
			item_price: 100,
			item_tax: 0
		}

		items.push(convenienceFee);

        // create item list on paynamics xml format
        for (let item of items) {
            itemDetails += `<Items>`;
            const itemName = item.item_name;

            // parse values to float to get exact decimal data
            const itemQuantity = parseFloat(item.item_quantity);
            const itemPrice = parseFloat(item.item_price);
            const itemTax = parseFloat(item.item_tax);

            // get whole item total to distribute later for price per item
            let finalTotal = (itemPrice * itemQuantity) + itemTax;
            let itemTotal = (finalTotal / itemQuantity);
            grossAmount = grossAmount + finalTotal;

            itemDetails += `<itemname>${itemName}</itemname>`;
            itemDetails += `<quantity>${itemQuantity}</quantity>`;
            itemDetails += `<amount>${itemTotal}</amount>`;
            itemDetails += `</Items>`;
        }

        // format gross amount to nearest 2 decimal places
        grossAmount = grossAmount.toFixed(2);

        let mid = paynamics.MERCHANT_ID; //<-- your merchant id
        let requestid = crypto.randomBytes(20).toString('hex').substring(0, 13);
        let ipaddress = "127.0.0.1";
        let noturl = `${servers.API_SERVER_NAME}/api/payment-success`; // url where response is posted
        let resurl = `${servers.WEB_SERVER_NAME}/payment-success`; //url of merchant landing page
        let cancelurl = `${servers.WEB_SERVER_NAME}`; //url of merchant landing page
        // let fname = "Juan"; // kindly set this to first name of the cutomer
        // let mname = "";//"Enrile"; // kindly set this to middle name of the cutomer
        // let lname = "Dela Cruz"; // kindly set this to last name of the cutomer
        let addr1 =  address;// "1609 Cityland 10 HV Dela Costa St.Salecedo Village"; // kindly set this to address1 of the cutomer
        let addr2 = ""; // "longos malolos";// kindly set this to address2 of the cutomer
        let city = "";// "makati"; // kindly set this to city of the cutomer
        let state = "";//"MM"; // kindly set this to state of the cutomer
        let country = "PH"; // kindly set this to country of the cutomer
        let zip = "";//"1200"; // kindly set this to zip/postal of the cutomer
        let sec3d = paynamics.SEC3D; //
        //let email = "jules@fore-sight.tech"; // kindly set this to email of the cutomer
        let phone = ""; // kindly set this to phone number of the cutomer
        // let mobile = "09146789067"; // kindly set this to mobile number of the cutomer

        let clientip = clientIp;
        let currency = paynamics.CURRENCY; //PHP or USD

        const cert = paynamics.MERCHANT_KEY;//<-- your merchant key  
        const forSign = mid +
                requestid +
                ipaddress +
                noturl +
                resurl +
                firstName +
                lastName +
                middleName +
                addr1 +
                addr2 +
                city +
                state +
                country +
                zip +
                email +
                phone +
                clientip +
                grossAmount +
                currency +
                sec3d;

        let _sign = crypto.createHash('sha512').update(forSign + cert, 'utf-8').digest('hex');

        let strxml = `<?xml version="1.0" encoding="utf-8" ?><Request>`
            strxml += `<orders>`
            strxml += `<items>${itemDetails}</items>`
            strxml += `</orders>`
            strxml += `<mid>${mid}</mid>`
            strxml += `<request_id>${requestid}</request_id>`
            strxml += `<ip_address>${ipaddress}</ip_address>`
            strxml += `<notification_url>${noturl}</notification_url>`
            strxml += `<response_url>${resurl}</response_url>`
            strxml += `<cancel_url>${cancelurl}</cancel_url>`
            strxml += `<mtac_url></mtac_url>`
            strxml += `<descriptor_note></descriptor_note>`
            strxml += `<fname>${firstName}</fname>`
            strxml += `<lname>${lastName}</lname>`
            strxml += `<mname>${middleName}</mname>`
            strxml += `<address1>${addr1}</address1>`
            strxml += `<address2>${addr2}</address2>`
            strxml += `<city>${city}</city>`
            strxml += `<state>${state}</state>`
            strxml += `<country>${country}</country>`
            strxml += `<zip>${zip}</zip>`
            strxml += `<secure3d>${sec3d}</secure3d>`
            strxml += `<trxtype>sale</trxtype>`
            strxml += `<email>${email}</email>`
            strxml += `<phone>${phone}</phone>`
            strxml += `<mobile>${mobile}</mobile>`
            strxml += `<client_ip>${clientip}</client_ip>`
            strxml += `<amount>${grossAmount}</amount>`
            strxml += `<currency>${currency}</currency>`
            strxml += `<mlogo_url>https://fore-sight.tech/wp-content/uploads/2021/08/viber_image_2021-08-11_14-07-03-759__2__auto_x2-removebg-preview.png</mlogo_url>`
            strxml += `<pmethod></pmethod>`
            strxml += `<signature>${_sign}</signature>`
            strxml += `</Request>`

        return Buffer.from(strxml, 'binary').toString('base64');
    } catch (err) {
        logger.error(`ERROR: [Generate Paynamics Signature] util.paynamics.paynamics-signature. Error in generating paynamics signature. \n ${err.stack}`);
        throw err;
    }
}

module.exports = { generateSignature };