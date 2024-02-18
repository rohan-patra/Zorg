const express = require('express');
const axios = require('axios'); // Import axios
const app = express();
const port = 3000;

app.use(express.json());

app.post('/patient', async (req, res) => {
    const walletAddress = req.body.walletAddress;
    const url = `https://treehacks-devnet.explorer.caldera.xyz/api/v2/addresses/${walletAddress}/transactions`;

    try {
        const response = await axios.get(url);
        const transactions = response.data;
        const contractCallTxHashes = transactions.items
            .filter(item => item.tx_types && item.tx_types.includes("contract_call"))
            .map(item => item.hash);
        console.log(contractCallTxHashes);

        const values = [];

        for (const hash of contractCallTxHashes) {
            const txDetailsUrl = `https://treehacks-devnet.explorer.caldera.xyz/api/v2/transactions/${hash}`;
            try {
                const txDetailsResponse = await axios.get(txDetailsUrl);
                const txDetails = txDetailsResponse.data;
                
                // Check if decoded_input and parameters exist
                if (txDetails && txDetails["decoded_input"] && txDetails["decoded_input"]["parameters"].length >= 3) {
                    const parameters = txDetails["decoded_input"]["parameters"];
                    const record = {
                        key: parameters[0]["value"],
                        cid: parameters[1]["value"],
                        filePath: parameters[2]["value"]
                    };
                    values.push({ hash: hash, ...record });
                }
            } catch (error) {
                console.error(`Failed to fetch details for hash ${hash}: ${error}`);
            }
        }
        console.log(values);
        res.json(values);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
