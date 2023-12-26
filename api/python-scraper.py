import requests
from bs4 import BeautifulSoup
import json

# Function to scrape a website for titles, images, and publication dates based on given CSS selectors
def scrape_website(url, title_selector, image_selector, date_selector):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to retrieve the webpage, status code: {response.status_code}")
        return []
    
    soup = BeautifulSoup(response.text, 'html.parser')
    titles = soup.select(title_selector)
    images = soup.select(image_selector)
    dates = soup.select(date_selector)

    results = []
    for title, image, date in zip(titles, images, dates):
        title_text = title.get_text().strip()
        url_href = title['href']
        image_url = image['src'] if image.has_attr('src') else None
        date_text = date.get_text().strip() if date else 'Not provided'

        results.append({
            'title': title_text,
            'url': url_href,
            'image': image_url,
            'published_date': date_text
        })
    
    return results

# List of sites with their respective selectors to scrape
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
        'image_selector':'.frontend-components-responsive_img-module__img--Pgjj2.frontend-main-home-PostPreview-PostPreviewCoverImage-module__image--rPbBU',
      'date_selector': '.frontend-main-home-PostPreview-PostPreviewAuthors-module__date--MMeK8'

    },
    # Additional site configurations can be added here
]

# Main execution block
def main():
    all_sites_data = []
    for site in sites_to_scrape:
        site_data = scrape_website(
            site['url'],
            site['title_selector'],
            site['image_selector'],
            site['date_selector']
        )
        all_sites_data.extend(site_data)

    # Convert the aggregated data to JSON and print it
    print(json.dumps(all_sites_data))

if __name__ == "__main__":
    main()
