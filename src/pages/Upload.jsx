import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Upload.css';

function Upload() {
  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [showBrowse, setShowBrowse] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [stationFiles, setStationFiles] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
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
    if (image) {
      const imageURL = URL.createObjectURL(image);
      setPreviewURL(imageURL);
      setShowScan(true);
    }
  };

  const handleScan = () => {
    setShowTable(true);
  };

  const handleStationUpload = (e, station) => {
    const file = e.target.files[0];
    if (file) {
      setStationFiles(prev => ({ ...prev, [station]: file.name }));
    }
  };

  const stationList = ['Bhubaneswar', 'Cuttack', 'Khurda Road', 'Puri', 'Sambalpur'];

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
                <th>Upload</th>
                <th>Browse</th>
              </tr>
            </thead>
            <tbody>
              {stationList.map((station, index) => (
                <tr key={index}>
                  <td>{station}</td>
                  <td>
                    <label className="table-btn upload-label">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleStationUpload(e, station)}
                        hidden
                      />
                    </label>
                    {stationFiles[station] && (
                      <div className="file-name">{stationFiles[station]}</div>
                    )}
                  </td>
                  <td>
                    <button className="table-btn">Browse</button>
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