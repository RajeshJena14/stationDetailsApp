import React, { useEffect, useState, useRef } from 'react';
import testImage from "../assets/testImage.png";
import './View.css';

const View = () => {
  const [dots, setDots] = useState([]);
  const [division, setDivision] = useState('');
  const imageRef = useRef(null);

  useEffect(() => {
    fetch('/dots.csv')
      .then(response => response.text())
      .then(csvText => {
        let rows = csvText.trim().split('\n').map(row => row.split(','));
        rows.shift(); // remove header

        const cleanedRows = rows.map(([id, x, y]) => ({
          id,
          x: parseInt(x, 10),
          y: parseInt(y.replace(/\r/g, ''), 10)
        }));
        setDots(cleanedRows);
      });
  }, []);

  const handleDivisionChange = (e) => {
    setDivision(e.target.value);
  };

  return (
    <div className="view-container">
      {/* Show dropdown only before division is selected */}
      {!division && (
        <>
          <h3>Choose your Division</h3>
          <select value={division} onChange={handleDivisionChange}>
            <option value="">-- Select Division --</option>
            <option value="Khordha">Khordha</option>
            <option value="Waltair">Waltair</option>
            <option value="Sambalpur">Sambalpur</option>
          </select>
        </>
      )}

      {/* Show image and dots after selection */}
      {division && (
        <>
          <h3>{division} Division Map</h3>
          <div
            className="image-dot-container"
            style={{ position: 'relative', display: 'inline-block', marginTop: '20px' }}
          >
            <img
              ref={imageRef}
              src={testImage}
              alt="Mapped"
              style={{ border: '1px solid black', maxWidth: '100%', height: 'auto' }}
            />
            {dots.map(dot => (
              <a
                key={dot.id}
                href="https://www.google.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: 'absolute',
                  top: dot.y,
                  left: dot.x,
                  width: 10,
                  height: 10,
                  backgroundColor: 'red',
                  borderRadius: '50%',
                  opacity: 0.7,
                  transform: 'translate(-50%, -50%)',
                  display: 'block',
                }}
                title={`Point ${dot.id}`}
              ></a>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default View;
