from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)



# ✅ Define the model path
model_path = r"C:\Users\saiak\Downloads\course_fee_predictor.pkl"

# ✅ Ensure the model file exists
if not os.path.exists(model_path):
    raise FileNotFoundError(f"❌ Model file not found at: {model_path}")

def load_model():
    try:
        model_data = joblib.load(model_path)

        if isinstance(model_data, tuple) and len(model_data) == 3:
            knn_reg, df, label_encoders = model_data
        else:
            print("⚠️ Model format different than expected, attempting to load anyway.")
            knn_reg = model_data
            df, label_encoders = None, {}

        print("✅ Model loaded successfully!")
        return knn_reg, df, label_encoders
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        raise

# ✅ Load the trained model
try:
    knn_reg, df, label_encoders = load_model()
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    knn_reg, df, label_encoders = None, None, {}

@app.route("/predict_fee", methods=["POST"])
def predict_fee():
    """Predicts course fee based on user input."""
    if knn_reg is None:
        return jsonify({"error": "Model not loaded properly"}), 500

    data = request.json
    country = data.get("country")
    course_type = data.get("course_type")
    specialization = data.get("specialization")

    if not country or not course_type or not specialization:
        return jsonify({"error": "Missing input values"}), 400

    try:
        country_id = label_encoders["COUNTRY"].transform([country])[0]
        course_type_id = label_encoders["COURSE TYPE"].transform([course_type])[0]
        specialization_id = label_encoders["COURSE (SPECIALIZATION)"].transform([specialization])[0]
    except KeyError as e:
        return jsonify({"error": f"Missing label encoder for {str(e)}"}), 400
    except ValueError:
        return jsonify({"error": "Invalid input values. Make sure your inputs match the training data."}), 400

    user_input = np.array([[country_id, course_type_id, specialization_id]])

    try:
        predicted_fee = knn_reg.predict(user_input)[0]
        return jsonify({"predicted_fee": round(predicted_fee, 2)})
    except Exception as e:
        return jsonify({"error": f"Prediction error: {str(e)}"}), 500

@app.route("/get_options", methods=["GET"])
def get_options():
    """Returns available country, course, and specialization options."""
    if df is None or label_encoders is None:
        return jsonify({"error": "Model data not available"}), 500
        
    try:
        options = {
            "countries": label_encoders["COUNTRY"].classes_.tolist(),
            "course_types": label_encoders["COURSE TYPE"].classes_.tolist(),
            "specializations": label_encoders["COURSE (SPECIALIZATION)"].classes_.tolist()
        }
        return jsonify(options)
    except Exception as e:
        return jsonify({"error": f"Error retrieving options: {str(e)}"}), 500

@app.route('/scrape', methods=['GET'])
def scrape_news():
    """Scrapes news from multiple international education websites with focus on Indian students."""
    all_news = []
    
    # Enhanced news sources targeting Indian students studying abroad
    NEWS_SOURCES = [
        # Indian-specific education news sources
        {"url": "https://www.timesnownews.com/", "title_selector": ".news-title a", "summary_selector": ".news-content p"},
       
    ]

    for source in NEWS_SOURCES:
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            response = requests.get(source["url"], headers=headers, timeout=15)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')

            articles = soup.select(source["title_selector"])
            summaries = soup.select(source["summary_selector"])

            for i in range(min(len(articles), 5)):  # Limit to 5 articles per source
                try:
                    title = articles[i].get_text(strip=True)
                    
                    # Handle relative URLs
                    link = articles[i].get('href', '')
                    if link and not link.startswith(('http://', 'https://')):
                        # Convert relative URL to absolute
                        base_url = source["url"]
                        if not base_url.endswith('/'):
                            base_url = '/'.join(base_url.split('/')[:-1]) + '/'
                        link = base_url + link.lstrip('/')
                    
                    # Get summary if available
                    summary = ""
                    if i < len(summaries):
                        summary = summaries[i].get_text(strip=True)[:200]  # Limit summary length
                        if len(summaries[i].get_text(strip=True)) > 200:
                            summary += "..."
                    
                    # Check if the article is relevant to Indian students
                    keywords = ["india", "indian", "student", "visa", "scholarship", "abroad", "international"]
                    content_text = (title + " " + summary).lower()
                    
                    # Add article if it contains relevant keywords or if we have few articles
                    if any(keyword in content_text for keyword in keywords) or len(all_news) < 10:
                        source_name = source["url"].split("//")[1].split("/")[0].replace("www.", "")
                        all_news.append({
                            "title": title,
                            "link": link,
                            "summary": summary,
                            "source": source_name,
                            "date_scraped": datetime.now().strftime("%Y-%m-%d")
                        })
                except Exception as article_error:
                    print(f"❌ Error processing article from {source['url']}: {str(article_error)}")
                    continue

        except requests.RequestException as e:
            print(f"❌ Error scraping {source['url']}: {str(e)}")
        except Exception as general_error:
            print(f"❌ Unexpected error with {source['url']}: {str(general_error)}")

    # Sort news by relevance (containing "india" or "indian")
    all_news.sort(key=lambda x: ("india" in (x["title"] + x["summary"]).lower(), "scholarship" in (x["title"] + x["summary"]).lower()), reverse=True)
    
    return jsonify({
        "status": "success",
        "count": len(all_news),
        "news": all_news
    })


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
