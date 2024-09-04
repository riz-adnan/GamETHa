from flask import Flask, request, jsonify, send_file
import json
import os
import requests
import time
from PIL import Image
import io
import google.generativeai as genai
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# Define the API key
STABILITY_KEY = 'sk-ywbzALB8JcmFc6DoBTzfjQjodV6Pr1sALdWzYT0loPHqbpmv'
api = "AIzaSyCQf5hWGMyjjnp32er0OJy31fXv6XHPi_w"


genai.configure(api_key="AIzaSyCQf5hWGMyjjnp32er0OJy31fXv6XHPi_w")

scores= ""


@app.route('/commentary', methods=['POST'])
def commentary():
    data=request.json
    updated_score = data.get("score", "")
    model = genai.GenerativeModel('gemini-pro')
    chat = model.start_chat()
    msg= " Previous Score: " + scores + " Updated Score: " + updated_score + ". Now, you have to give a commentary on the match. I am calling this from backend, so give me only string. no introductory response or anything."
    response = chat.send(msg)
    return jsonify({"commentary": response.text})


    




def send_generation_request(host, params):
    headers = {
        "Accept": "image/*",
        "Authorization": f"Bearer {STABILITY_KEY}"
    }

    files = {}
    image = params.pop("image", None)
    mask = params.pop("mask", None)
    if image is not None and image != '':
        files["image"] = open(image, 'rb')
    if mask is not None and mask != '':
        files["mask"] = open(mask, 'rb')
    if len(files) == 0:
        files["none"] = ''

    response = requests.post(
        host,
        headers=headers,
        files=files,
        data=params
    )
    if not response.ok:
        raise Exception(f"HTTP {response.status_code}: {response.text}")

    return response

@app.route('/image-gen', methods=['POST'])
def image_gen():
    data = request.json

# Access the 'body' key first
    body = data.get("body", {})

    # Now access keys within the 'body' dictionary
    prompt = body.get("prompt", "dark high contrast render of a psychedelic tree of life illuminating dust in a mystical cave.")
    negative_prompt = body.get("negative_prompt", "")
    aspect_ratio = body.get("aspect_ratio", "3:2")
    seed = body.get("seed", 0)
    output_format = body.get("output_format", "png")

    # Print statements to verify the values
    print(f"Prompt: {prompt}")
    print(f"Negative Prompt: {negative_prompt}")
    print(f"Aspect Ratio: {aspect_ratio}")
    print(f"Seed: {seed}")
    print(f"Output Format: {output_format}")


    host = f"https://api.stability.ai/v2beta/stable-image/generate/ultra"
    params = {
        "prompt": prompt,
        "negative_prompt": negative_prompt,
        "aspect_ratio": aspect_ratio,
        "seed": seed,
        "output_format": output_format
    }

    try:
        response = send_generation_request(host, params)
        output_image = response.content
        finish_reason = response.headers.get("finish-reason")
        seed = response.headers.get("seed")

        if finish_reason == 'CONTENT_FILTERED':
            return jsonify({"error": "Generation failed NSFW classifier"}), 400

        image = Image.open(io.BytesIO(output_image))
        image_io = io.BytesIO()
        image.save(image_io, format=output_format.upper())
        image_io.seek(0)

        return send_file(image_io, mimetype=f'image/{output_format}')
    except Exception as e:
        return jsonify({"error": str(e)}), 500




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
