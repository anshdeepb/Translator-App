import { useState, useEffect } from 'react';
import './App.css';
import { FaArrowRight, FaPaperPlane } from 'react-icons/fa';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [fromLanguage, setFromLanguage] = useState('en');
  const [toLanguage, setToLanguage] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [displayText, setDisplayText] = useState('');

  const phrases = ["Translate", "Traducir", "Traduire", "Übersetzen", "翻訳する", "번역하다", "अनुवाद", "翻译"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  // Array of colors for the phrases
  const colors = ["#FF6347", "#fcba03", "#025403", "#FFD700", "#8A2BE2", "#f2c77c", "#9ffcfb", "#cb9ffc"];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    languageType: string
  ) => {
    if (languageType === 'from') {
      setFromLanguage(event.target.value);
    } else {
      setToLanguage(event.target.value);
    }
  };

  const handleSubmit = async () => {
    if (inputValue.trim() === '') return;

    // Sending the request to your Flask backend
    try {
      const response = await fetch("http://127.0.0.1:5000/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputValue,
          src_lang: fromLanguage,
          dest_lang: toLanguage,
        }),
      });

      const data = await response.json();

      // Set the translated text from the response
      if (data.translated_text) {
        setTranslatedText(data.translated_text);
      } else {
        setTranslatedText('Error: Could not fetch translation');
      }
    } catch (error) {
      setTranslatedText('Error occurred during translation');
      console.error("Translation error:", error);
    }

    setInputValue('');
  };

  useEffect(() => {

    if (isTyping) {
      const typingInterval = setInterval(() => {
        if (charIndex < phrases[currentIndex].length) {
          setDisplayText((prev) => prev + phrases[currentIndex][charIndex]);
          setCharIndex((prev) => prev + 1);
        } else {
          setIsTyping(false);
        }
      }, 100);
      return () => clearInterval(typingInterval);
    }
  }, [charIndex, isTyping, currentIndex]);

  useEffect(() => {

    if (!isTyping) {
      const nextIndex = (currentIndex + 1) % phrases.length;
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        setCharIndex(0);
        setDisplayText('');
        setIsTyping(true);
      }, 1000);
    }
  }, [isTyping, currentIndex]);

  return (
    <div className="flexbox p-10">
      {/* Animated Header Text with dynamic color */}
      <h1
        className="text-3xl font-semibold text-center h-[60px] mb-6 overflow-hidden"
        style={{ color: colors[currentIndex] }} // Applying color change here
      >
        {displayText}
      </h1>

      <div className="h-screen w-full flex flex-col items-center justify-center p-4">

        {/* Language Selection */}
        <div className="flex mb-4 space-x-4 items-center">
          <div className="w-35">
            <select
              id="fromLanguage"
              value={fromLanguage}
              onChange={(e) => handleLanguageChange(e, 'from')}
              className="w-full py-2 px-4 text-lg rounded-lg bg-gray-800 text-white border-none text-center"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option> 
              <option value="ko">Korean</option> 
              <option value="hi">Hindi</option>
              <option value="zh-CN">Chinese</option> 
            </select>
          </div>

          <FaArrowRight className="text-white py-1" style={{ fontSize: '24px' }} />

          <div className="w-35">
            <select
              id="toLanguage"
              value={toLanguage}
              onChange={(e) => handleLanguageChange(e, 'to')}
              className="w-full py-2 px-4 text-lg rounded-lg bg-gray-800 text-white border-none text-center"
            >
              <option value="es">Spanish</option>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option> 
              <option value="ko">Korean</option> 
              <option value="hi">Hindi</option>
              <option value="zh-CN">Chinese</option> 
            </select>
          </div>
        </div>

        {/* Chatbox with input and submit button inside */}
        <div className="container">
          {/* Input Field */}
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            className="flex-grow bg-transparent text-white text-lg px-3 py-3 outline-none"
            placeholder="Type something..."
          />

          {/* Submit Button inside Input Box */}
          <button
            onClick={handleSubmit}
            className="p-2 flex rounded-full bg-blue-500 hover:bg-black-300 transition align-left items-center"
          >
            <FaPaperPlane className="text-black text-s" />
          </button>
        </div>
        {/* Response Box */}
        <div className="response-box mt-4">
          <p className="text-white">{translatedText || "Translated text will appear here."}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
