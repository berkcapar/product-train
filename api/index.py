from http.server import BaseHTTPRequestHandler
import requests
from bs4 import BeautifulSoup
import json

def scrape_website(site):
    url = site['url']
    title_selector = site['title_selector']
    image_selector = site['image_selector']
    date_selector = site['date_selector']

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    titles = soup.select(title_selector)
    images = soup.select(image_selector)
    dates = soup.select(date_selector)

    results = []
    for title, image, date in zip(titles, images, dates):
        title_text = title.get_text().strip()
        url_href = title.get('href', '')  # Ensure default empty string if href is missing
        image_url = image.get('src', '') if image else None  # Default to None if image is missing
        date_text = date.get_text().strip() if date else 'Not provided'

        results.append({
            'title': title_text,
            'url': url_href,
            'image': image_url,
            'published_date': date_text
        })

    return results


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Set CORS headers
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        sites_to_scrape = [
            {
                'url': 'https://www.lennysnewsletter.com/t/product',
                'title_selector': '.pencraft.pc-reset.frontend-pencraft-Text-module__line-height-28--NgO1Q.frontend-pencraft-Text-module__font-pub-headings--lbOZ2.frontend-pencraft-Text-module__size-18--zqngu.frontend-pencraft-Text-module__weight-semibold--LJBj3.frontend-pencraft-Text-module__clamp--a1dYM.frontend-pencraft-Text-module__clamp-3--R6uR3.frontend-pencraft-Text-module__reset--dW0zZ',
                'image_selector': '.frontend-components-responsive_img-module__img--Pgjj2.frontend-main-home-PostPreview-PostPreviewCoverImage-module__image--rPbBU.pencraft.pc-reset',
                'date_selector': '.frontend-main-home-PostPreview-PostPreviewAuthors-module__date--MMeK8'
            },
            {
                'url': 'https://www.producttalk.org/blog/',
                'title_selector': 'a.entry-title-link',
                'image_selector': 'img.alignleft.post-image.entry-image',
                'date_selector': 'time.entry-time'
            },
            {
                'url': 'https://dpereira.substack.com/archive?sort=new',
                'title_selector': '.frontend-pencraft-Text-module__line-height-28--NgO1Q.frontend-pencraft-Text-module__font-pub-headings--lbOZ2.frontend-pencraft-Text-module__size-18--zqngu',
                'image_selector': '.frontend-components-responsive_img-module__img--Pgjj2.frontend-main-home-PostPreview-PostPreviewCoverImage-module__image--rPbBU',
                'date_selector': '.frontend-main-home-PostPreview-PostPreviewAuthors-module__date--MMeK8'
            }
            # Additional sites and their selectors can be added here
        ]

        all_sites_data = []
        for site in sites_to_scrape:
            all_sites_data.extend(scrape_website(site))

        self.wfile.write(json.dumps(all_sites_data).encode())

if __name__ == "__main__":
    from http.server import HTTPServer
    server = HTTPServer(('localhost', 8000), handler)
    print("Starting server, use <Ctrl-C> to stop")
    server.serve_forever()