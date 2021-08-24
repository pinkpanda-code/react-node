const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express(),
    bodyParser = require("body-parser");
port = 3080;

app.use(cors());
app.use(bodyParser.json());

app.post('/getTaxi',  async(req, res, next) => {

    let error = validateGetTaxiReq(req.body);

    if(error){
        res.status(400).json({errorMessage: error})
    }else{
        let getString = 'latitude=' + req.body.lat;
        getString += '&longitude=' + req.body.lng;

        if(req.body.taxiCount){
            getString += '&count=' + req.body.taxiCount;
        }

        //using axios to call external api
        axios.get('https://qa-interview-test.splytech.dev/api/drivers?'+getString)
            .then(function (response) {
                // handle success
                res.json(response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                res.status(500).json({errorMessage: error})
            })
    }
});

//validation for request params lat and lng
validateGetTaxiReq = (reqBody) => {
    if(!reqBody.lat || isNaN(reqBody.lat) || Math.abs(reqBody.lat) > 90 ){
        return "Missing / Invalid Latitude"
    }

    if(!reqBody.lng || isNaN(reqBody.lng) || Math.abs(reqBody.lng) > 180 ){
        return "Missing / Invalid Longitude"
    }
}

app.get('/', (req,res) => {
    res.send('Called bankend!');
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
