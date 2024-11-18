// import https from 'https';
import zlib from 'zlib';
import express from 'express';
import bodyParser from 'body-parser';

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Authorization, Content-Type, x-origin',
    );
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');

    // Send `No Content` to preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
    } else {
        next();
    }
});

const port = process.env.PORT || 3000;
app.get('/', function (req, res) {
    res.send('Hello World')
})

app.post('/decompress', function (req, res) {
    const { encodedData } = req.body;
    // Assuming your data is Base64-encoded, replace this with your Base64 string
    // const encodedData = "H4sIAAAAAAAA/zWPTWvbQBQA/8ryTi2xVvvefmpvbqI6h7YErFtkgmytbRHJK7RrlxLy30tSeh4YZt5gCil1p9D8mQN4eFg365ef9Xa73tSwgvj7EhbwYKRVJI2SyjhYwRhPmyVeZ/Awx/RazEvsi3jNfIynf3ibl9BN4GEohOr1vsLe7sk6bRXCCtJ1nw7LMOchXr4PYw5LAv8M3Ti+jPGUYPcpqW/hkj/AGww9eJDOkCQrhUYtpTPWqIokKlM5rCRVVghShkihE85pLR1ZLemjOA9TSLmbZvBoJVZklSGn3er/P3i4Pw9jz56WeAgpsS8p9/Gav3pWMO+Px+PRoyUukUuOzrCCFewZXfkr3koSpDwKr62Xjt0JIcSOtbCpG1bekAsuym4e2GPTPJXIsQVGQjDkJIlNiRFroWiBtVD/+FY8hm7M5/tzOLyGpSQu2gu8797/Am+vuKuqAQAA";

    // Decode from Base64
    const compressedData = Buffer.from(encodedData, 'base64');

    // Decompress the Gzip data
    zlib.gunzip(compressedData, (err, decompressedData) => {
        if (err) {
            console.error('An error occurred during decompression:', err);
            res.send({ message: 'An error occurred during decompression' });
        } else {
            console.log('Decompressed data:', decompressedData.toString('utf-8'));
            res.json({ data: decompressedData.toString('utf-8') });
        }
    });
    // res.send.json({ message: 'Decompression completed' });

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
