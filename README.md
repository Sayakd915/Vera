# Vera
Vera is a privacy-first, locally hosted AI watchdog engineered to bring absolute truth back to the job market.

Unlike simple prompt-engineering projects or thin wrappers around proprietary APIs, Vera leverages a highly optimized SLM+LLM hybrid pipeline to achieve real-time scam detection. By combining localized machine learning with distributed agentic fact-checking, Vera delivers a transparent, open-source shield against employment fraud.

## System Architecture 

Vera operates as a hierarchical multi-agent system, breaking down the complex task of fraud detection into specialized, asynchronous workflows:

### 1. The Extraction Agent
Operates directly on the client side to bypass centralized scraping blocks. It parses unstructured DOM elements from job boards and informal social media feeds, extracting the raw text and metadata of internship postings.

### 2. The Detective Pipeline (SLM + LLM Hybrid)
The core of Vera's anomaly detection runs locally, avoiding cloud latency and API costs:

* **Log/Pattern Clustering:** Utilizes Drain3 to parse and cluster highly repetitive, templated scam formats often spammed across social platforms.
* **Rapid Classification:** A lightweight DistilBERT + LSTM sequence classifier acts as the first line of defense, instantly flagging established linguistic anomalies, phishing patterns, and suspicious URLs.
* **Semantic Evaluation:** Complex or ambiguous postings that pass the initial filter are routed to a quantized local LLM (like LLaMA-7B). This model performs a deep evaluation of recruiter intent, institutional legitimacy, and contextual red flags.

### 3. The Analyst Agent
Aggregates the verified, safe job postings. It cross-references public domain registries and computes historical hiring trends, providing the user with actionable insights (e.g., “This company typically hires 5 interns, but is currently advertising 50 open roles—proceed with caution.”).

## Planned Tech Stack

* **Machine Learning & NLP:** DistilBERT, LSTM networks, Quantized LLaMA-7B, Drain3.
* **Frontend Ecosystem:** A responsive web dashboard utilizing React and Tailwind CSS, alongside a mobile-friendly client built with Flutter using an MVVM architecture to handle the asynchronous data streams from the backend agents.
* **Backend Integration:** Local, open-weight model deployment optimized for consumer hardware.

## License

Vera is built for the community and is entirely open-source. 

This project is licensed under the **GNU AGPLv3 License** - see the LICENSE file for details. We chose this strong copyleft license to ensure that Vera remains a free, protective tool for students, and to guarantee that any modified versions or network services built upon this architecture must also release their source code to the public.
