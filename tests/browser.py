from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager

url = "https://api-g.weedmaps.com/discovery/v1/listings/stores/jungle-vape-n-smoke"

driver = webdriver.Chrome(ChromeDriverManager().install())
driver.get(url)
# driver.close()
