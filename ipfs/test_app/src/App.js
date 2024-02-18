import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState();
  const [cid, setCid] = useState('');
  const encryptionKey = "1234567890";
  const [fileName, setFileName] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleCidChange = (event) => {
    setCid(event.target.value);
  };

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  }

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  }

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('encryptionKey', encryptionKey);

    try {
      const response = await fetch('http://localhost:5001/storeToIPFS', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log(result);
      alert(result['cid']);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    }
  };

  const fetchContentFromIPFS = async () => {
    if (!cid || !fileName) {
      alert('Please enter both a CID and a file name!');
      return;
    }
    const formData = new FormData();
    formData.append('cid', cid);
    formData.append('fileName', fileName);
    formData.append('key', encryptionKey);
    try {
      const response = await fetch('http://localhost:5001/getFromIPFS', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob(); // Get the blob
      const downloadUrl = window.URL.createObjectURL(blob); // Create a URL for the blob
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileName); // Set the file name for download
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link); // Clean up
    } catch (error) {
      console.error('Error fetching content:', error);
      alert('Error fetching content. Please try again.');
    }
  };

  const search = async () => {
    if (!searchQuery) {
      alert('Please enter a search query!');
      return;
    }
    const formData = new FormData();
    formData.append('searchQuery', searchQuery);
    try {
      const response = await fetch('http://localhost:5001/findRelevant', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log(result);
      alert(JSON.stringify(result));
    } catch (error) {
      console.error('Error searching:', error);
      alert('Error searching. Please try again.');
    }
  }


  return (
    <div>
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <div>
        <input type="text" value={cid} onChange={handleCidChange} placeholder="Enter CID" />
        <input type="text" value={fileName} onChange={handleFileNameChange} placeholder="Enter File Name" />
        <button onClick={fetchContentFromIPFS}>Fetch Content</button>
      </div>
      <div>
        <input type="text" value={searchQuery} onChange={handleSearchQueryChange} placeholder="Enter Search Query" />
        <button onClick={search}>Search</button>
      </div>
      
      <div>
        <h2>Content:</h2>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default App;
