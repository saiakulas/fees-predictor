import { useState, useEffect } from "react";

function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [activeSource, setActiveSource] = useState("all");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/scrape");
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const data = await response.json();
        setNews(data.news || []); // Access the 'news' array from the response
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Extract unique sources for filtering
  const sources = news.length > 0 
    ? ["all", ...new Set(news.map(article => article.source))]
    : ["all"];

  // Filter news based on search and active source
  const filteredNews = news.filter(article => {
    const matchesSearch = filter === "" || 
      article.title.toLowerCase().includes(filter.toLowerCase()) ||
      article.summary.toLowerCase().includes(filter.toLowerCase());
    
    const matchesSource = activeSource === "all" || article.source === activeSource;
    
    return matchesSearch && matchesSource;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0E34] to-[#252E8A] p-6 text-[#F7F6F7]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
          International Education News for Indian Students
        </h1>
        
        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search news..."
            className="p-2 rounded-lg bg-[#1A1A4A] border border-[#3A3A7A] flex-grow"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          
          <select 
            className="p-2 rounded-lg bg-[#1A1A4A] border border-[#3A3A7A] min-w-32"
            value={activeSource}
            onChange={(e) => setActiveSource(e.target.value)}
          >
            {sources.map(source => (
              <option key={source} value={source}>
                {source === "all" ? "All Sources" : source}
              </option>
            ))}
          </select>
        </div>
        
        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9A4D87]"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900 text-white p-4 rounded-lg text-center mb-6">
            {error}
          </div>
        )}
        
        {/* News Grid */}
        {!loading && !error && (
          <>
            <p className="text-right mb-2 text-sm">
              Showing {filteredNews.length} of {news.length} articles
            </p>
            
            {filteredNews.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredNews.map((article, index) => (
                  <div 
                    key={index} 
                    className="bg-[#1A1A4A] border border-[#3A3A7A] p-5 rounded-lg shadow-md hover:shadow-lg transition flex flex-col"
                  >
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-semibold">{article.title}</h2>
                      </div>
                      <p className="text-sm text-gray-300 mb-1">
                        Source: {article.source}
                      </p>
                      {article.date_scraped && (
                        <p className="text-xs text-gray-400 mb-3">
                          {article.date_scraped}
                        </p>
                      )}
                      <p className="text-sm mb-4 text-gray-200">{article.summary}</p>
                    </div>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#5A7FC8] text-white px-4 py-2 rounded hover:bg-[#4A6FB8] transition text-center"
                    >
                      Read Full Article
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#1A1A4A] border border-[#3A3A7A] p-8 rounded-lg text-center">
                <p>No articles match your search criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default NewsFeed;