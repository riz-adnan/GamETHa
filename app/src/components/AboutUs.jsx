// import axios from 'axios';
// import React from 'react';
// // const FormData = require('form-data')
// // const fs = require('fs')
// const JWT = {JWT}

// export default function AboutUs() {
//     const [cid, setCid] = React.useState('');
//     const [data, setData] = React.useState(null);

//     const uploadHardcodedJsonToIPFS = async () => {
//         const jsonObject = {
//             name: "John Doe",
//             age: 30,
//             city: "New York"
//         };

//         const formData = new FormData();
//         const blob = new Blob([JSON.stringify(jsonObject)], { type: 'application/json' });

//         formData.append('file', blob, 'data.json');

//         const pinataMetadata = JSON.stringify({
//             name: 'JSON Data',
//         });
//         formData.append('pinataMetadata', pinataMetadata);

//         const pinataOptions = JSON.stringify({
//             cidVersion: 0,
//         });
//         formData.append('pinataOptions', pinataOptions);

//         try {
//             const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
//                 maxBodyLength: 'Infinity',
//                 headers: {
//                     'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
//                     'Authorization': `Bearer ${JWT}`,
//                 },
//             });
//             setCid(res.data.IpfsHash);
//             alert('Data uploaded successfully! CID: ' + res.data.IpfsHash);
//         } catch (error) {
//             console.error('Error uploading data: ', error);
//             alert('Error uploading data.');
//         }
//     }

//     const getData = async () => {
//         try {
//             const res = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`);
//             setData(JSON.parse(res.data));
//         } catch (error) {
//             console.error('Error getting data: ', error);
//             alert('Error getting data.');
//         }
//     }

//     return (
//         <div>
//             <button onClick={uploadHardcodedJsonToIPFS}>Pin File to IPFS</button>
//             <p>CID: {cid}</p>
//             <button onClick={getData}>Get Data</button>
//             <p>Data: {data}</p>
//         </div>
//     )
// }