import React, { useEffect, useState, useRef } from 'react';
import testImage from "../assets/testImage.png";
import { useNavigate } from 'react-router-dom';
fetch('/dots.csv')


const View = ({ division }) => {
  const [dots, setDots] = useState([]);
  const imageRef = useRef(null);

  useEffect(() => {
    fetch('/dots.csv')
      .then(response => response.text())
      .then(csvText => {
        let rows = csvText.trim().split('\n').map(row => row.split(','));
        rows.shift();

        const cleanedRows = rows.map(([id, x, y]) => ({
          id,
          x: parseInt(x, 10),
          y: parseInt(y.replace(/\r/g, ''), 10)
        }));
        setDots(cleanedRows);
      });
  }, []);

  return (
    <div className="image-dot-container" style={{ position: 'relative', display: 'inline-block' }}>
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
          title={`Point ${dot.id}`} // ✅ corrected here
        ></a>
      ))}
    </div>
  );
};

export default View;
