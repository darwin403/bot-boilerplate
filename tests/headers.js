const fetch = require("node-fetch");
const Promise = require("bluebird");
var HttpsProxyAgent = require("https-proxy-agent");

const repeat = (a, n) => Array(n).fill(a).flat(1);
const concurrency = 20;

Promise.map(
  repeat([...Array(200).keys()], 20),
  function (i, index) {
    return (
      fetch(
        `https://api-g.weedmaps.com/discovery/v1/listings?sort_by=position_distance&filter%5Bbounding_radius%5D=75mi&filter%5Bbounding_latlng%5D=34.04871368408203%2C-118.2420196533203&latlng=34.04871368408203%2C-118.2420196533203&page_size=10&page=${
          i + 1
        }`,
        {
          agent: new HttpsProxyAgent(
            "http://lum-customer-hl_58ssdwer5-zone-static:gksgc5xqf20t@zproxy.lum-superproxy.io:22225"
          ),
          credentials: "omit",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:76.0) Gecko/20100101 Firefox/76.0",
            Accept: "*/*",
            "Accept-Language": "en",
            // "WM-Anonymous-User-Id": "206638d3-cf4c-4724-a9f6-c016e4e489ad",
            // "If-None-Match": 'W/"ac91c9cbd098107d3f518d6ef806141e"',
            "Cache-Control": "max-age=0",
          },
          referrer: "https://weedmaps.com/listings/in/united-states/california",
          method: "GET",
          mode: "cors",
        }
      )
        // .then((response) => response.json())
        .then(async (response) => {
          if (response.status !== 200) {
            const html = await response.text();
            console.log(
              `Request [${index}]:`,
              response.status,
              response.headers,
              html
            );
          } else {
            let value = await response.text();
            try {
              const json = JSON.parse(value);
              const listing = json["data"]["listings"][0] || null;
              value = listing ? listing["slug"] : null;
            } catch (err) {
              value = value.substring(0, 20);
            }

            console.log(`Request [${index}]:`, response.status, value);
          }
        })
        .catch(console.log)
    );
  },
  { concurrency }
);
