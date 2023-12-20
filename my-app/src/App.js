import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure to create an App.css file for styles
import Navbar from './Components/Navbar/Navbar'
import Card from './Components/Card/Card'


const blogAuthors = {
  "lennysnewsletter.com": "Lenny's Newsletter",
  "dpereira.substack.com": "David Pereria",
  "producttalk.org": "Product Talk"
};


function App() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = React.useState(true);


  const getAuthorName = (url) => {
    for (const domain in blogAuthors) {
      if (url.includes(domain)) {
        return blogAuthors[domain];
      }
    }
    return "Unknown Author"; // Default case for unmatched URLs
  };
  

  // Helper function to parse and format date
  const parseAndFormatDate = (dateStr) => {
    let parsedDate;
    if (dateStr.includes(',')) {
      // Format: "December 13, 2023"
      parsedDate = new Date(dateStr);
    } else {
      // Format: "Dec 13"
      const currentYear = new Date().getFullYear();
      parsedDate = new Date(`${dateStr} ${currentYear}`);
    }
    // Format date to 'MMM DD' format (e.g., 'Dec 13')
    return parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/scrape`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Ensure all dates are in a consistent Date object format
        const processedData = data.map(article => ({
          ...article,
          dateObject: new Date(parseAndFormatDate(article.published_date))
        }));
  
        // Sort the articles by the date objects
        const sortedData = processedData.sort((a, b) => b.dateObject - a.dateObject);
  
        // Now that the data is sorted, format the dates for display
        const finalData = sortedData.map(article => ({
          ...article,
          formatted_date: article.dateObject.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }));
  
        setArticles(finalData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);
  
  return (
    <>
      <Navbar />
      <div className="cards-container">
        {isLoading ? (
          <div>Loading...</div> // Show loading message when data is being fetched
        ) : (
          articles.map(article => (
            <Card
              key={article.url}
              title={article.title}
              imageUrl={article.image}
              date={article.formatted_date}
              url={article.url}
              author={getAuthorName(article.url)}
            />
          ))
        )}
      </div>
    </>
  );
}

export default App;