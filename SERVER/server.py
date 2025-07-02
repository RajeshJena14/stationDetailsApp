from flask import Flask, request, jsonify
import cv2
from PIL import Image
import google.generativeai as genai
import os
from thefuzz import fuzz
import csv
import uuid

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 🔐 Replace with your actual API key (hide it in production)
genai.configure(api_key="AIzaSyDjtw9P04RapooniWeM6Xj2cDA5QgsRsGw")  # ⚠️ Use environment variable in production

@app.route('/process_stations', methods=['POST'])
def process_stations():
    if 'image' not in request.files:
        return jsonify({"error": "Image file not found in request"}), 400

    file = request.files['image']
    img_path = f"temp_{uuid.uuid4().hex}.png"
    file.save(img_path)

    try:
        # Step 1: Enhance image
        img = cv2.imread(img_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)
        enhanced_bgr = cv2.cvtColor(enhanced, cv2.COLOR_GRAY2BGR)
        enhanced_path = f"enhanced_{uuid.uuid4().hex}.png"
        cv2.imwrite(enhanced_path, enhanced_bgr)

        # Step 2: Prompt Gemini
        prompt = (
            "From the image provided, extract only the names of all railway stations. "
            "Each name should appear on a new line. "
            "Ignore all other information such as distances, kilometer markings, codes in brackets, IBH values, or numbers. "
            "Include all station names regardless of text size, font style, or color. "
            "Only return clean station names."
        )

        with Image.open(enhanced_path) as image:
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content([prompt, image])


        raw_text = response.text.strip()
        station_lines = [line.strip() for line in raw_text.split('\n') if line.strip()]

        # Step 3: Remove duplicates
        unique_stations = []
        seen = set()
        for station in station_lines:
            if station not in seen:
                unique_stations.append(station)
                seen.add(station)

        final_stations = []
        for station in unique_stations:
            if all(fuzz.ratio(station.lower(), existing.lower()) < 90 for existing in final_stations):
                final_stations.append(station)

        # Save results (optional)
        with open("cleaned_stations.csv", "w", newline='', encoding="utf-8") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(["No.", "Station Name"])
            for i, station in enumerate(final_stations, start=1):
                writer.writerow([i, station])

        # Cleanup
        os.remove(img_path)
        os.remove(enhanced_path)

        return jsonify({
            "station_count": len(final_stations),
            "stations": final_stations
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    if not os.path.exists('static'):
        os.makedirs('static')
    app.run(debug=True)
