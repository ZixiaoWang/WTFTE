import './custom-componnets/card';
import Axios, { AxiosResponse } from 'axios';

const URL: string = `https://www.openrice.com/api/v1/pois`;
const params: any = { uiLang: "zh", uiCity: "hongkong", where: "白石角香港科學園" }

/**
 * Only Gods know what I was thinking.
 * Even By this moment...
 * This code is miracle...
 * @param response {AxiosResponse}
 */
async function getResultsFromResponse(response: AxiosResponse) {
    let data: any = response.data;
    let totalPages: number =  data.searchResult.paginationResult.totalReturnCount;
    let currentPage: number = data.mobilePagination.currentPage;
    let results: any[] = data.searchResult.paginationResult.results;
    let pageArr = new Array( Math.ceil(totalPages/15) ).fill(0).map((value, index)=>{ return {page: index+1 } });
    let fullResultsList: any[] = [];

    await pageArr.reduce(async (accumulator: any, value: any, index: number) => {
        if(value.page === 1) {
            return Promise.resolve(results);
        } else {
            let list: any[] = await accumulator;
            let response = await Axios.get(URL, { params: { ...params, page: value.page } });
            let resultSet: any[] = response.data.searchResult.paginationResult.results;
            fullResultsList = list.concat(resultSet);
            return Promise.resolve(fullResultsList);
        }
    }, Promise.resolve([]));

    return fullResultsList;
}

window.addEventListener(
    'load',
    async (event: Event) => {

        let response = await Axios.get(URL, { params: params });
        let restaurants = await getResultsFromResponse(response);
        restaurants = restaurants.map((item: any) => {
            return {
                name: item.name,
                address: item.name,
                image: item.doorPhoto.urls ? (item.doorPhoto.urls.icon || item.doorPhoto.url) : item.doorPhoto.url
            }
        });

        let box: HTMLElement = document.getElementById('cardbox') as HTMLElement;
        restaurants.forEach(restaurant => {
            let card = document.createElement('x-card');
            card.setAttribute('src', restaurant.image);
            box.appendChild(card);
        })
        
    }
)