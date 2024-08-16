from flask import Flask, request
import webbrowser

app = Flask(__name__)

@app.route('/open-url', methods=['POST'])
def open_url():
    data = request.get_json()
    url = data.get('url')
    if url:
        webbrowser.open_new_tab(url)
        return "URL opened", 200
    return "No URL provided", 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
