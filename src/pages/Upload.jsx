import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Upload.css';

function Upload() {
  const [mapImage, setMapImage] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [showBrowse, setShowBrowse] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [stationList, setStationList] = useState([]);
  const [stationFiles, setStationFiles] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMapImage(file);
    if (file) {
      setShowBrowse(true);
      setPreviewURL('');
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('uploadedImage', reader.result); // save base64 image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrowse = () => {
    if (mapImage) {
      const imageURL = URL.createObjectURL(mapImage);
      setPreviewURL(imageURL);
      setShowScan(true);
    }
  };

  const handleScan = () => {
    const formData = new FormData();
    formData.append('image', mapImage);
    fetch('http://127.0.0.1:5000/process_stations', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (!data.stations || data.stations.length === 0) {
          setShowTable(false);
        }
        setStationList(data.stations);
        setShowTable(true);
      })
      .catch(err => {
        console.error(err);
        alert("Scan failed: " + err.message);
      });
  };

  const handleStationUpload = (e, station) => {
    const file = e.target.files[0];
    if (file) {
      setStationFiles(prev => ({ ...prev, [station]: file.name }));
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {showBrowse && (
          <button className="browse-btn" onClick={handleBrowse}>
            Browse
          </button>
        )}
      </div>

      {previewURL && (
        <div className="picture-box">
          <img src={previewURL} alt="Preview" className="image-preview" />
        </div>
      )}

      {showScan && (
        <div className="scan-button">
          <button className="scan-btn" onClick={handleScan}>Scan</button>
        </div>
      )}

      {showTable && (
        <div className="station-table">
          <table>
            <thead>
              <tr>
                <th>Station Name</th>
                <th>Browse</th>
                <th>Upload</th>
              </tr>
            </thead>
            <tbody>
              {stationList.map((station, index) => (
                <tr key={index}>
                  <td>{station}</td>
                  <td>
                    <label className="table-btn upload-label">
                      Browse
                      <input
                        type="file"
                        accept="application/pdf, image/*"
                        onChange={(e) => handleStationUpload(e, station)}
                        hidden
                      />
                    </label>
                    {stationFiles[station] && (
                      <div className="file-name">{stationFiles[station]}</div>
                    )}
                  </td>
                  <td>
                    <label className="table-btn upload-label">
                      Upload
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Upload;