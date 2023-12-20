import '../../../src/App.css'

function Card({ title, imageUrl, date, url, author }) {
    return (
      <div className="card">
        <div className="card-image">
          <img src={imageUrl} alt={title} />
        </div>
        <div className="card-content">
          <h2 className="card-title">{title}</h2>
          <p className="card-author">By {author}</p>
          <p className="card-date">{date}</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="card-link">Read More</a>
        </div>
      </div>
    );
  }
export default Card