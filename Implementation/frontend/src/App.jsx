import React, { useState } from "react";
import axios from "axios";
//@ts-ignore
import Secure from "../public/secure.png";
//@ts-ignore
import Danger from "../public/danger.png";
import { tailspin } from "ldrs";

tailspin.register();

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await axios.post("http://localhost:3000/predict", {
        url: url,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ label: "Error", confidence: 0 });
    }
    setIsLoading(false);
  };


  return (
    <div className="p-1 rounded-lg">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
      <div className="mx-auto border-b border-white text-slate-200">
        <h1 className="text-2xl text-center font-semibold tracking-tight font-mono mt-2 mb-1">
          Phishing URL Detection
        </h1>
      </div>
      <div className="flex flex-1 mx-auto gap-3 items-end pb-3 px-2 mt-2">
        <div className="w-3/4 flex-1">
          <h2 className="text-xl tracking-tight font-semibold text-slate-200 my-1">
            Enter URL :
          </h2>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-[10px] focus:outline-blue-500 rounded-md text-[15px]"
          />
        </div>
        <div className="inline-flex justify-end items-end">
          <button
            className="outline-none bg-orange-500 text-white px-6 text-base font-serif py-2 rounded-md"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center w-full mt-12">
          <l-tailspin size="25" stroke="5" speed="0.9" color="#ffffff" />
        </div>
      )}

      {!isLoading && result && (
        <div className="flex text-white text-center mt-4 justify-center items-center w-full gap-4">
          <div>
            {result.label === "Safe Website" ? (
              <img src={Secure} alt="Secure" width={64} height={64} />
            ) : (
              <img src={Danger} alt="Danger" width={64} height={64} />
            )}
          </div>
          <div>
            <p className="text-lg">
              Prediction: <strong>{result.label}</strong>
            </p>
            <p className="text-sm">
              Confidence: {result.confidence.toFixed(2)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
