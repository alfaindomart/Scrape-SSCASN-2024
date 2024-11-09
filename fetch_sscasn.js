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
            return null
        }

}

async function storeData() {
    console.log('StoreData invoked')

    let allData = []
    let params = 0
    let data

    let attempt = 0
    const maxRetries = 5
    const firstDelay = 1000

    do {
        try {
            data = await fetchData(params)
            console.log(`fetch finished, params: ${params}`)
            if (data) {
                allData = allData.concat(data)
                params += 10
                attempt = 0 //reset attempt if fetch successful

                console.log('data fetched and stored, making a new request in a second')
                await new Promise(resolve => setTimeout(resolve, 500))
            } else {
                throw new Error('no data returned')
            }
        } catch (error) {
            console.error(`error fetching, retrying.... Retries: ${attempt}`)

            if (attempt > maxRetries) {
                console.log('Maximum retry attempts reached. Stopping fetch...')
                break;
            }
            attempt++
            const delay = firstDelay * Math.pow(2, attempt)
            console.log(`Waiting ${delay} ms before retrying`)
            await new Promise(resolve => setTimeout(resolve, delay))
        }
    } while (data)

    console.log('no more data')

    const worksheet = sheet.utils.json_to_sheet(allData)
    const workbook = sheet.utils.book_new()
    
    sheet.utils.book_append_sheet(workbook, worksheet, /*kasih nama worksheet*/ "CPNS_HI")
    sheet.writeFile(workbook, /*kasih nama file*/ "Cpns HI 2024.xlsx", { compression: true });
}

storeData()