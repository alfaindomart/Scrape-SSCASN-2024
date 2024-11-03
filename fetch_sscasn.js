const axios = require('axios')
const sheet = require('xlsx')

async function fetchData(params) {
        try {
            //ganti nomer pada kode_ref_pend='nomer' sesuai dengan network request setelah mencari formasi
            const response = await axios.get(`https://api-sscasn.bkn.go.id/2024/portal/spf?kode_ref_pend=5190229&pengadaan_kd=2&offset=${params}`, {
                headers: {
                    "accept": 'application/json, text/plain, */*', 
                    "Accept-Encoding": 'gzip, deflate, br, zstd',
                    "accept-language": 'en-US,en;q=0.9,ja;q=0.8,id;q=0.7',
                    "connection": 'keep-alive',
                    "Dnt": '1',
                    "Host": 'api-sscasn.bkn.go.id',
                    "origin": 'https://sscasn.bkn.go.id',
                    "referer": 'https://sscasn.bkn.go.id',
                    "Sec-Ch-Ua": '"Chromium";v="130", "Microsoft Edge";v="130", "Not?A_Brand";v="99"',
                    "Sec-Ch-Ua-Mobile": '?0',
                    "Sec-Ch-Ua-Platform": 'Windows',
                    "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0'       
                     }
                 }
              )
            return response.data.data.data
        } catch (error) {
            console.error('Error fetching data', error)
        }

}

async function storeData() {
    console.log('StoreData invoked')

    let allData = []
    let params = 0
    let data = await fetchData(params)

    console.log('fetch finished')

    while (data) {
    console.log('while loop started')

    allData = allData.concat(data)
    console.log('data stored')
    params += 10
    console.log(params)
    data = await fetchData(params)
    if (data) console.log('Data is found, repeat loop')
    }

    console.log('no more data')

    const worksheet = sheet.utils.json_to_sheet(allData)
    const workbook = sheet.utils.book_new()
    //kasih nama worksheet
    sheet.utils.book_append_sheet(workbook, worksheet, "CPNS_HI")
    //kasih nama file
    sheet.writeFile(workbook, "Cpns arsitektur 2024.xlsx", { compression: true });
}

storeData()