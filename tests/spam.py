import requests
from concurrent.futures import ThreadPoolExecutor as PoolExecutor

url = "https://api-g.weedmaps.com/discovery/v1/listings/stores/jungle-vape-n-smoke"
amount = 10


def fetch(i):
    r = requests.get(url)
    return (i, r.status_code)


with PoolExecutor(max_workers=20) as executor:
    for (i, status, text) in executor.map(fetch, range(1, amount)):
        print(i, status)
