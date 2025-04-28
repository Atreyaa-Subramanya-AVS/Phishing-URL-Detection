from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pickle
import uvicorn
from feature import FeatureExtraction
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or restrict to your extension domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UrlRequest(BaseModel):
    url: str

@app.post("/predict")
def predict(req: UrlRequest):
    url = req.url
    gbc = pickle.load(open("./gbc_model.pkl","rb"))
    obj = FeatureExtraction(url)
    x = np.array(obj.getFeaturesList()).reshape(1, 30)


    # Get prediction probabilities
    y_pro_phishing = gbc.predict_proba(x)[0, 0]
    y_pro_non_phishing = gbc.predict_proba(x)[0, 1]

    y_pred = gbc.predict(x)[0]


    confidence = max(y_pro_phishing, y_pro_non_phishing) * 100
    label = "Safe Website" if y_pred == 1 else "Phishing Website"

    return {"label": label, "confidence": confidence}


if __name__ == "__main__":
    uvicorn.run("main:app",host="0.0.0.0",port=3000,reload=True)