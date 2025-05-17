import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import { useState } from "react";
import ReactMarkdowm from "react-markdown";
import Spinner from "../../components/Spinner";

const MechAI = () => {
  const [responseTitle,setTitle] = useState('')
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading,setLoading] = useState(false);

  const API_KEY = "AIzaSyCGkxtSpE51HWCZUGHHTJf3uSlu0AKxkX0"; 

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const result = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
          API_KEY,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      setResponse(result.data.candidates[0].content.parts[0].text);
      setTitle(prompt);
      setPrompt('');
    } catch (err) {
      console.error(err);
      setResponse("Error generating response");
    }
  };
  return (
    <>
    {loading && <Spinner/>}
      <Header />
      <div style={{ padding: 20 }}>
        <h2>Mech AI</h2>
        <textarea
          rows="4"
          className="form-control"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask something..."
        />
        <br />
        <div className="d-flex justify-content-center">
          <button onClick={handleGenerate} className="btn btn-sm btn-primary">
            Generate
          </button>
        </div>
        <div className="card mt-3">
          <div className="card-body">
            <h3 className="font-underline">{responseTitle}</h3>
            <h5 className="card-title">Response: </h5>
            <ReactMarkdowm>{response}</ReactMarkdowm>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MechAI;
