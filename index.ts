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
        let startbutton: HTMLButtonElement = document.getElementById('startbutton') as HTMLButtonElement;
        let resetbutton: HTMLButtonElement = document.getElementById('resetbutton') as HTMLButtonElement;

        let cards: HTMLElement[] = [];
        let theCard: HTMLElement | null = null;
        let isRunning: boolean = false;

        restaurants.forEach(restaurant => {
            let card = document.createElement('x-card');
            card.setAttribute('src', restaurant.image);
            box.appendChild(card);
            cards.push(card);
        });
        

        startbutton.addEventListener(
            'click',
            (event: Event) => {
                if(isRunning) { return ; }
                isRunning = true;

                cards.forEach(card => {
                    card.style.opacity = '0.1';
                })

                let restaurantIndex: number = Math.floor( cards.length * Math.random() );
                let count: number = 30;
                let interval: number = setInterval(() => {

                    if(count === 0) {
                        if(theCard) {
                            theCard.style.opacity = '0.1';
                        }
                        theCard = cards[restaurantIndex];
                        theCard.style.opacity = '1.0';

                        clearInterval(interval);
                        isRunning = false;
                    } else {
                        count --;
                        if(theCard) {
                            theCard.style.opacity = '0.1';
                        }
                        theCard = cards[Math.floor(cards.length * Math.random())];
                        theCard.style.opacity = '1.0';
                    }

                }, 75);
            }
        );

        resetbutton.addEventListener(
            'click',
            (event) => {
                cards.forEach(card => {
                    if(isRunning) { return void 0; }
                    card.style.opacity = '1.0';
                    theCard = null;
                })
            }
        );

    }
)