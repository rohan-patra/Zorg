const express = require('express')
const app = express()
const fileUpload = require('express-fileupload');
const cors = require('cors');
const axios = require('axios');

app.use(cors());

app.use(fileUpload());

import { create } from '@web3-storage/w3up-client'
var port = 5002
const client = await create()
const space = await client.createSpace('zorg')
const myAccount = await client.login('adyrai05@gmail.com')


// did:key:z6MkhR1HpBEqWH8zgqDUSnY5WkGuvSijZSgbweuVUCtCxpC7
// Y6Jlcm9vdHOC2CpYJQABcRIgkl8SEEALWFKgOkYGeBUIKJx4roc3jjnuRY3NdzFPZCfYKlglAAFxEiDh4ZGaveTfPEzwQe0qR-f6bZf-8xqCsi1qL4hHqQwO72d2ZXJzaW9uAaoCAXESIIQo0tYyYoGnMujwFJLAMRudJkj76naTkcsA3E2AYpBYqGFzWETtoQNAy1zfgBcFgb9_Xa261doEkxVuZcwwzx7J5RVRmqETvqqUXHXMfRd8Gx1mI4BeOSWEh98rw2DVGOCV2hdbyoJ8AWF2ZTAuOS4xY2F0dIGiY2NhbmEqZHdpdGh4OGRpZDprZXk6ejZNa3RITG40aUtMaVlUeHhHaHlDOUI1UVI4WHJFa0Vqd2NnRUV6UWJLcTJXMnpzY2F1ZFgbnRptYWlsdG86Z21haWwuY29tOmFkeXJhaTA1Y2V4cPZjZmN0gaFlc3BhY2WhZG5hbWVkWm9yZ2Npc3NYIu0BzXko4sHKWjS7pRbg3cAMttXflsp3egus1PhB2lJ0TlhjcHJmgL4CAXESIJJfEhBAC1hSoDpGBngVCCiceK6HN4457kWNzXcxT2QnqGFzRICgAwBhdmUwLjkuMWNhdHSBomNjYW5hKmR3aXRoZnVjYW46KmNhdWRYIu0BK_83RAQqE8T8U_o35piD0f-SF8h1jX8PTH5Jnqr-MYhjZXhw9mNmY3SBom5hY2Nlc3MvY29uZmlybdgqWCUAAXESIOoOKoGgIJUIDVjVpoAg720QkKylwtZRDLt88QQrY8qCbmFjY2Vzcy9yZXF1ZXN02CpYJQABcRIgOEkvGacsDeiAxOt6SyHKilphfZs1RJxCFK_kpvODw79jaXNzWBudGm1haWx0bzpnbWFpbC5jb206YWR5cmFpMDVjcHJmgdgqWCUAAXESIIQo0tYyYoGnMujwFJLAMRudJkj76naTkcsA3E2AYpBYlwMBcRIg4eGRmr3k3zxM8EHtKkfn-m2X_vMagrItai-IR6kMDu-oYXNYRO2hA0C99fv1bNkNdk9RmsRPgqToZQ8z1ZK8vXGBmgxuwPpB7TVZdy0TVObYN4ymOf9VYHbef4zZIRkel3oSnfy4T54EYXZlMC45LjFjYXR0gaNibmKhZXByb29m2CpYJQABcRIgkl8SEEALWFKgOkYGeBUIKJx4roc3jjnuRY3NdzFPZCdjY2Fua3VjYW4vYXR0ZXN0ZHdpdGh0ZGlkOndlYjp3ZWIzLnN0b3JhZ2VjYXVkWCLtASv_N0QEKhPE_FP6N-aYg9H_khfIdY1_D0x-SZ6q_jGIY2V4cPZjZmN0gaJuYWNjZXNzL2NvbmZpcm3YKlglAAFxEiDqDiqBoCCVCA1Y1aaAIO9tEJCspcLWUQy7fPEEK2PKgm5hY2Nlc3MvcmVxdWVzdNgqWCUAAXESIDhJLxmnLA3ogMTrekshyopaYX2bNUScQhSv5Kbzg8O_Y2lzc1KdGndlYjp3ZWIzLnN0b3JhZ2VjcHJmgA

await myAccount.provision(space.did())
await space.save()

app.post('/storeToIPFS', async function (req, res) {
    // res.send('Hello World')
    // console.log(req);
    if (!req.files) {
        console.log("issue");
        return res.status(500).send({ msg: "file is not found" })
    }
    let returnJson = {};
    const files = [];
    for(const [key, value] of Object.entries(req.files)) {
        // console.log(key, value);
        console.log(value.data);
        console.log(value.name);
        files.push(new File([value.data], value.name))
        // let data = value.data.toString();
        // let file = makeFile(data);
        // let cid = await storeFiles(file);

        // if(key[0] === "/") {
        //     returnJson[key] = cid;
        // } else {
        //     returnJson[`/${key}`] = cid;
        // }
    }
    const directoryCid = await client.uploadDirectory(files);
    returnJson["cid"] = directoryCid;
    console.log(returnJson);


    // return res.send({cid: JSON.stringify(returnJson)});
    return res.send(returnJson);
})

app.get("/getFromIPFS", async function (req, res) {
    var cid = req.query.cid;
    var fileName = req.query.fileName;
    const url = `https://${cid}.ipfs.w3s.link/${fileName}`;

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        res.writeHead(200, {
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Type': response.headers['content-type'],
        });
        res.end(Buffer.from(response.data, 'binary'));
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).send('Failed to fetch file');
    }
});



// const files = [
//     new File(['some-file-content'], 'readme.md'),
//     new File(['import foo'], 'src/main.py'),
// ]
// const directoryCid = await client.uploadDirectory(files)
// console.log(directoryCid)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})