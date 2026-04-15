# backend/app/tools/scraper.py
import asyncio
import aiohttp
from bs4 import BeautifulSoup
from typing import Optional
import cloudscraper
import re

class RealProductScraper:
    """Scrape REAL product images from official websites"""
    
    def __init__(self):
        self.scraper = cloudscraper.create_scraper()
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
        }
    
    async def get_product_image(self, url: str, store: str) -> Optional[str]:
        """Fetch real product image from product URL"""
        
        try:
            if store.lower() == 'amazon':
                return await self._get_amazon_image(url)
            elif store.lower() == 'flipkart':
                return await self._get_flipkart_image(url)
            elif store.lower() == 'myntra':
                return await self._get_myntra_image(url)
            elif store.lower() == 'meesho':
                return await self._get_meesho_image(url)
        except Exception as e:
            print(f"Error fetching image from {store}: {e}")
        
        return None
    
    async def _get_amazon_image(self, url: str) -> Optional[str]:
        """Extract product image from Amazon"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=self.headers, timeout=10) as response:
                    html = await response.text()
                    soup = BeautifulSoup(html, 'lxml')
                    
                    # Find main product image
                    img_elem = soup.select_one('#landingImage, #imgTagWrapperId img, .a-dynamic-image')
                    if img_elem:
                        img_url = img_elem.get('src') or img_elem.get('data-old-hires')
                        if img_url:
                            # Get high quality image
                            img_url = img_url.replace('_SX466_', '_SL1500_').replace('_UX522_', '_UX1500_')
                            return img_url
        except Exception as e:
            print(f"Amazon image error: {e}")
        return None
    
    async def _get_flipkart_image(self, url: str) -> Optional[str]:
        """Extract product image from Flipkart"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=self.headers, timeout=10) as response:
                    html = await response.text()
                    soup = BeautifulSoup(html, 'lxml')
                    
                    # Find product image
                    img_elem = soup.select_one('._396cs4, ._2r_T1I img, ._1B5uS1 img, ._1Nyybr img')
                    if img_elem:
                        img_url = img_elem.get('src')
                        if img_url:
                            # Get high quality image
                            img_url = img_url.replace('/128/', '/416/').replace('/96/', '/416/')
                            return img_url
        except Exception as e:
            print(f"Flipkart image error: {e}")
        return None
    
    async def _get_myntra_image(self, url: str) -> Optional[str]:
        """Extract product image from Myntra"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=self.headers, timeout=10) as response:
                    html = await response.text()
                    soup = BeautifulSoup(html, 'lxml')
                    
                    # Find product image
                    img_elem = soup.select_one('.image-grid-image, .img-responsive, .image-image, .product-image img')
                    if img_elem:
                        img_url = img_elem.get('src')
                        if img_url:
                            # Get high quality image
                            img_url = img_url.replace('100x150', '400x600').replace('128x170', '400x600')
                            return img_url
        except Exception as e:
            print(f"Myntra image error: {e}")
        return None
    
    async def _get_meesho_image(self, url: str) -> Optional[str]:
        """Extract product image from Meesho"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=self.headers, timeout=10) as response:
                    html = await response.text()
                    soup = BeautifulSoup(html, 'lxml')
                    
                    # Find product image
                    img_elem = soup.select_one('.product-image img, .Image__ImageComponent, .image-container img')
                    if img_elem:
                        img_url = img_elem.get('src')
                        if img_url:
                            return img_url
        except Exception as e:
            print(f"Meesho image error: {e}")
        return None