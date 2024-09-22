from flask import Flask, request, jsonify
import json
import os

app= Flask(__name__)
json_file_path=os.path.join(os.path.dirname(__file__))

@app.route('/update-news', methods=['POST'])
def update_news():
    try:
        articles_data = request.json

        with open(json_file_path, 'w', encoding='utf-8') as json_file:
            json.dump(articles_data,json_file,ensure_ascii=False, indent=4)
        return jsonify({"message": "Το αρχείο ενημερώθηκε επιτυχώς!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True)