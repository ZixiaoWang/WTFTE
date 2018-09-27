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
            let response = await Axios.get(URL, { params: { ...params, page: value.page } }).catch(err => { return Axios.get('results.json') });
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

        let response = await Axios.get(URL, { params: params }).catch(err => { return Axios.get('results.json') });
        let allRestaurants = await getResultsFromResponse(response);

        let restaurants = allRestaurants.map((item: any) => {
            return {
                name: item.name,
                address: item.address,
                image: item.doorPhoto.urls ? (item.doorPhoto.urls.icon || item.doorPhoto.url) : item.doorPhoto.url,
                url: item.shortenUrl
            }
        });

        let container: HTMLElement = document.querySelector('.home-page') as HTMLElement;
        let box: HTMLElement = document.getElementById('cardbox') as HTMLElement;

        let dpage: HTMLDivElement = document.getElementById('dpage') as HTMLDivElement;
        let dimg: HTMLDivElement = document.getElementById('dimg') as HTMLDivElement;
        let dname: HTMLDivElement = document.getElementById('dname') as HTMLDivElement;
        let daddress: HTMLDivElement = document.getElementById('daddress') as HTMLDivElement;
        let dlink: HTMLAnchorElement = document.getElementById('dlink') as HTMLAnchorElement;

        let startbutton: HTMLButtonElement = document.getElementById('startbutton') as HTMLButtonElement;
        let resetbutton: HTMLButtonElement = document.getElementById('resetbutton') as HTMLButtonElement;
        let dclose: HTMLButtonElement = document.getElementById('dclose') as HTMLButtonElement;

        let cards: HTMLElement[] = [];
        let theCard: HTMLElement | null = null;
        let isRunning: boolean = false;

        function checkDetail(card: any, container: HTMLElement) {
        
            dimg.style.backgroundImage = `url(${ card.image })`;
            dname.innerText = card.name;
            daddress.innerText = card.address;
            dlink.href = card.url;
        
            dpage.style.top = '100px';
            container.style.opacity = '0.5';
        }

        restaurants.forEach((restaurant, index: number) => {
            let card = document.createElement('x-card');
            card.setAttribute('src', restaurant.image);
            card.setAttribute('index', index.toString());
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

        box.addEventListener(
            'click',
            (event) => {
                if(theCard && theCard === event.target) {
                    let cardindex:number = parseInt( theCard.getAttribute('index') as string );
                    checkDetail(restaurants[cardindex], container);
                } else {
                    let element: HTMLElement = event.target as HTMLElement;
                    if(element.tagName === 'X-CARD') {
                        let cardindex:number = parseInt( element.getAttribute('index') as string );
                        checkDetail(restaurants[cardindex], container);
                    } else {
                        return void 0;
                    }
                }
            }
        );

        dclose.addEventListener(
            'click',
            (event) => {
                container.style.opacity = '1.0';
                dpage.style.top = '100vh';
            }
        )

    }
)