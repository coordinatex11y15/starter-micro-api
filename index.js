const http = require('http');
const url = require('url');
const fetch = require('node-fetch');

http.createServer(async function (req, res) {
    const UserAgents = [
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0',
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0',
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
    ];
    const p = url.parse(req.url, true).query;
    console.log("query");
    console.log(p);
    const getFile = async (v, x, y, z, s) => {
    let radom = Math.floor(Math.random() * 4);
    let url =
      //'https://cfwgmtile2.tk/?v=' +
      'https://khm' +
      radom +
      '.google.com/kh/v=' +
      v +
      '&hl=en&x=' +
      x +
      '&y=' +
      y +
      '&z=' +
      z +
      '&s=' +
      s;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'Get',
        headers: {
          'User-Agent': UserAgents[radom],
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language':
            'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
          'Upgrade-Insecure-Requests': '1',
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache',
        },
      }).then((res) => {
        const chunks = [];
        res.body.on('data', (chunk) => chunks.push(chunk));
        res.body.on('end', () => {
          //at this point data is an array of Buffers
          //so Buffer.concat() can make us a new Buffer
          //of all of them together
          let buffer = Buffer.concat(chunks);
          resolve(buffer.toString('hex'));
        });
      });
    });
    };
    let xys = p.xys.split('.');
    let l = xys.length;
    let promises = [];
    for (let i = 0; i < l; i = i + 2) {
        promises.push(getFile(p.v, xys[i], xys[i + 1], p.z, p.s));
    }
    let result = await Promise.all(promises);
    res.write(JSON.stringify({result}));
    res.end();
}).listen(process.env.PORT || 3000);
