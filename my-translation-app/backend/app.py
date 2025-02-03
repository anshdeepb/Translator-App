from flask import Flask, request, jsonify
from googletrans import Translator
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
translator = Translator()

@app.route('/translate', methods=['POST'])
def translate():
    data = request.get_json()

    text = data.get('text', '')
    src_lang = data.get('src_lang', 'auto')  # Auto-detect if not provided
    dest_lang = data.get('dest_lang', 'en')

    if not text:
        return jsonify({'error': 'Text must be provided'}), 400

    try:
        translated = translator.translate(text, src=src_lang, dest=dest_lang)
        return jsonify({'translated_text': translated.text}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
