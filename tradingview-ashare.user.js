// ==UserScript==
// @name         Tradingview A股助手
// @namespace    https://xpc.im/
// @updateURL    https://raw.githubusercontent.com/xiaopc/tradingview-ashare/main/tradingview-ashare.user.js
// @downloadURL  https://raw.githubusercontent.com/xiaopc/tradingview-ashare/main/tradingview-ashare.user.js
// @version      0.1
// @description  try to take over the world!
// @author       xiaopc
// @match        https://*.tradingview.com/chart/*
// @icon         https://static.tradingview.com/static/images/favicon.ico
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      t.10jqka.com.cn
// @connect      www.iwencai.com
// @connect      qt.gtimg.cn
// @require      https://unpkg.com/preact@10.11.0/dist/preact.min.umd.js
// @require      https://unpkg.com/preact@10.11.0/hooks/dist/hooks.umd.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/htm/3.1.0/htm.umd.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/lodash.js/4.17.21/lodash.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/lscache/1.3.0/lscache.min.js
// ==/UserScript==

// config
// * 显示智能分组
const SHOW_WENCAI_PLATE = false;

const tvhelperCss = `
  /* @import "https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/bulma/0.9.3/css/bulma-rtl.min.css"; */

  .card {
    background-color: #fff;
    border-radius   : .25rem;
    box-shadow      : 0 .5em 1em -.125em rgba(10, 10, 10, .1), 0 0 0 1px rgba(10, 10, 10, .02);
    color           : #4a4a4a;
    max-width       : 100%;
    position        : relative
  }

  .card-content:first-child,
  .card-footer:first-child,
  .card-header:first-child {
    border-top-left-radius : .25rem;
    border-top-right-radius: .25rem
  }

  .card-content:last-child,
  .card-footer:last-child,
  .card-header:last-child {
    border-bottom-left-radius : .25rem;
    border-bottom-right-radius: .25rem
  }

  .card-header {
    background-color: transparent;
    align-items     : stretch;
    box-shadow      : 0 .125em .25em rgba(10, 10, 10, .1);
    display         : flex
  }

  .card-header-title {
    align-items: center;
    color      : #363636;
    display    : flex;
    flex-grow  : 1;
    font-weight: 700;
    padding    : .75rem 1rem
  }

  .card-header-title.is-centered {
    justify-content: center
  }

  .card-header-icon {
    margin         : 0;
    padding        : 0;
    align-items    : center;
    display        : flex;
    justify-content: center;
    padding        : .5rem 1rem
  }

  .card-content {
    background-color: transparent;
    padding         : 1rem
  }

  .card-footer {
    background-color: transparent;
    border-top      : 1px solid #ededed;
    align-items     : stretch;
    display         : flex
  }

  .card-footer-item {
    align-items    : center;
    display        : flex;
    flex-basis     : 0;
    flex-grow      : 1;
    flex-shrink    : 0;
    justify-content: center;
    padding        : .75rem
  }

  .card-footer-item:not(:last-child) {
    border-left: 1px solid #ededed
  }

  .card .media:not(:last-child) {
    margin-bottom: 1.5rem
  }

  .notification {
    background-color: #f5f5f5;
    border-radius   : .375em;
    position        : relative;
    padding         : 1.25rem 2.5rem 1.25rem 1.5rem
  }

  .notification.is-warning {
    background-color: #ffe08a;
    color           : rgba(0,0,0,.7)
  }

  .menu {
    font-size: 1rem
  }

  .menu-list {
    line-height: 1.25;
    list-style : none;
    margin     : -.5rem -.75rem 0 -.75rem
  }

  .menu-list a {
    border-radius  : 2px;
    color          : #4a4a4a;
    display        : block;
    padding        : .3em .75em;
    line-height    : 1;
    align-items    : center;
    justify-content: space-between;
    display        : flex;
  }

  .menu-list a:hover {
    background-color: #f5f5f5;
    color           : #363636
  }

  .menu-list a.is-active {
    background-color: #485fc7;
    color           : #fff
  }

  .menu-list li ul {
    border-right : 1px solid #dbdbdb;
    margin       : .75em;
    padding-right: .75em
  }

  .menu-label {
    color          : #7a7a7a;
    font-size      : .75em;
    letter-spacing : .1em;
    text-transform : uppercase;
    display        : flex;
    justify-content: space-between;
  }

  .menu-label:not(:first-child) {
    margin-top: 1em
  }

  .menu-label:not(:last-child) {
    margin-bottom: 1em
  }

  .tag:not(body) {
    align-items     : center;
    background-color: #f5f5f5;
    border-radius   : 4px;
    color           : #4a4a4a;
    display         : inline-flex;
    font-size       : .75rem;
    height          : 2em;
    justify-content : center;
    line-height     : 1.5;
    padding-left    : .75em;
    padding-right   : .75em;
    white-space     : nowrap
  }

  .tag:not(body) .delete {
    margin-right: .25rem;
    margin-left : -.375rem
  }

  .tag:not(body).is-white {
    background-color: #fff;
    color           : #0a0a0a
  }

  .tag:not(body).is-black {
    background-color: #0a0a0a;
    color           : #fff
  }

  .tag:not(body).is-light {
    background-color: #f5f5f5;
    color           : rgba(0, 0, 0, .7)
  }

  .tag:not(body).is-dark {
    background-color: #363636;
    color           : #fff
  }

  .tag:not(body).is-primary {
    background-color: #00d1b2;
    color           : #fff
  }

  .tag:not(body).is-primary.is-light {
    background-color: #ebfffc;
    color           : #00947e
  }

  .tag:not(body).is-link {
    background-color: #485fc7;
    color           : #fff
  }

  .tag:not(body).is-link.is-light {
    background-color: #eff1fa;
    color           : #3850b7
  }

  .tag:not(body).is-info {
    background-color: #3e8ed0;
    color           : #fff
  }

  .tag:not(body).is-info.is-light {
    background-color: #eff5fb;
    color           : #296fa8
  }

  .tag:not(body).is-success {
    background-color: #48c78e;
    color           : #fff
  }

  .tag:not(body).is-success.is-light {
    background-color: #effaf5;
    color           : #257953
  }

  .tag:not(body).is-warning {
    background-color: #ffe08a;
    color           : rgba(0, 0, 0, .7)
  }

  .tag:not(body).is-warning.is-light {
    background-color: #fffaeb;
    color           : #946c00
  }

  .tag:not(body).is-danger {
    background-color: #f14668;
    color           : #fff
  }

  .tag:not(body).is-danger.is-light {
    background-color: #feecf0;
    color           : #cc0f35
  }

  .b-icon {
    align-items    : center;
    display        : inline-flex;
    justify-content: center;
    height         : 1rem;
    width          : 1rem;
    fill           : #7a7a7a;
    border-radius  : 4px;
  }

  .b-icon:hover {
    background-color: #eff5fb
  }

  .b-icon.is-medium {
    height : 1.2rem;
    width  : 1.2rem;
    padding: .3rem;
  }

  #tvhelper {
    position  : absolute;
    display   : block;
    width     : 13rem;
    height    : 18rem;
    min-height: 3rem;
    max-height: 95vh;
    right     : 3rem;
    bottom    : 0.5rem;
    margin    : 0;
    padding   : 0;
    overflow  : auto;
    resize    : vertical;
  }

  #tvhelper>.card .card-header {
    position  : sticky;
    top       : 0;
    background: inherit;
  }

  #tvhelper>.card::-webkit-scrollbar {
    width           : 6px;
    height          : 6px;
    background-color: transparent;
    z-index         : 999;
  }

  #tvhelper>.card::-webkit-scrollbar-track,
  #tvhelper>.card::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  #tvhelper>.card::-webkit-scrollbar-thumb {
    border-radius   : 3px;
    background-color: #f0f3fa;
  }

  #tvhelper>.card {
    height    : 100%;
    overflow-y: auto;
    overflow-y: overlay;
    overflow-x: hidden;
    margin    : 0;
    padding   : 0;
  }

  #tvhelper>.card .card-content aside {
    display: block;
  }

  #tvhelper>.card .card-content ul.menu-list span.symbol-name,
  #tvhelper>.card .card-content p.menu-label span.plate-name{
    display      : inline-block;
    max-width    : 7rem;
    white-space  : nowrap;
    overflow     : hidden;
    text-overflow: ellipsis;
    display      : flex;
    flex-grow    : 1;
  }

  .disabled {
    opacity: 0.6;
  }`;

const svgSprite = `<svg width="0" height="0" class="hidden"><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="eye-off-outline"><title>Eye Off</title><path d="M432 448a15.92 15.92 0 01-11.31-4.69l-352-352a16 16 0 0122.62-22.62l352 352A16 16 0 01432 448zM255.66 384c-41.49 0-81.5-12.28-118.92-36.5-34.07-22-64.74-53.51-88.7-91v-.08c19.94-28.57 41.78-52.73 65.24-72.21a2 2 0 00.14-2.94L93.5 161.38a2 2 0 00-2.71-.12c-24.92 21-48.05 46.76-69.08 76.92a31.92 31.92 0 00-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416a239.13 239.13 0 0075.8-12.58 2 2 0 00.77-3.31l-21.58-21.58a4 4 0 00-3.83-1 204.8 204.8 0 01-51.16 6.47zM490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96a227.34 227.34 0 00-74.89 12.83 2 2 0 00-.75 3.31l21.55 21.55a4 4 0 003.88 1 192.82 192.82 0 0150.21-6.69c40.69 0 80.58 12.43 118.55 37 34.71 22.4 65.74 53.88 89.76 91a.13.13 0 010 .16 310.72 310.72 0 01-64.12 72.73 2 2 0 00-.15 2.95l19.9 19.89a2 2 0 002.7.13 343.49 343.49 0 0068.64-78.48 32.2 32.2 0 00-.1-34.78z"></path><path d="M256 160a95.88 95.88 0 00-21.37 2.4 2 2 0 00-1 3.38l112.59 112.56a2 2 0 003.38-1A96 96 0 00256 160zM165.78 233.66a2 2 0 00-3.38 1 96 96 0 00115 115 2 2 0 001-3.38z"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="caret-up-outline"><title>Caret Up</title><path d="M414 321.94L274.22 158.82a24 24 0 00-36.44 0L98 321.94c-13.34 15.57-2.28 39.62 18.22 39.62h279.6c20.5 0 31.56-24.05 18.18-39.62z"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="refresh-outline"><title>Refresh</title><path d="M320 146s24.36-12-64-12a160 160 0 10160 160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 58l80 80-80 80"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="search-outline"><title>Search</title><path d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M338.29 338.29L448 448"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="eye-outline"><title>Eye</title><path d="M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 00-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 000-17.47C428.89 172.28 347.8 112 255.66 112z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><circle cx="256" cy="256" r="80" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"></circle></symbol></svg>`;

(function(window) {
    'use strict';
    // utils
    const zip = (keys, values) => Object.assign(...keys.map((k, i) => ({ [k]: values[i] })));
    const cEl = function (tag) { return document.createElement(tag) };
    const gID = function (id) { return document.getElementById(id) };

    // gtimg
    const fetcher = async (ids) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://qt.gtimg.cn/q=' + ids.join(','),
                onload: function (response) {
                    resolve(_.fromPairs(response.responseText.split('\n').filter(l => l.length > 2).map(l => {
                        let [key, val] = l.split('=');
                        return [key.slice(2), val.slice(1, -2)];
                    })));
                },
                onerror: function (err) {
                    reject(err);
                }
            });
        });
    }
    const fetchDataToDict = function (data, keys) {
        return _.zipObject(Object.keys(data), Object.values(data).map(i => _.zipObject(keys, i.split('~'))));
    }
    const getRealtimeBasic = async (...args) => {
        const keys = ['_', 'name', 'code', 'last', 'prev_close', 'open', 'volume', 's', 'b',
                      'buy1', 'buy1_amount', 'buy2', 'buy2_amount', 'buy3', 'buy3_amount', 'buy4', 'buy4_amount', 'buy5', 'buy5_amount',
                      'sell1', 'sell1_amount', 'sell2', 'sell2_amount', 'sell3', 'sell3_amount', 'sell4', 'sell4_amount', 'sell5', 'sell5_amount',
                      'latest_deal', 'time', 'change', 'change_rate', 'high', 'low'];
        const data = await fetcher([...args]);
        return fetchDataToDict(data, keys);
    }

    // tonghuashun
    const getThsSelfRaw = async () => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://t.10jqka.com.cn/newcircle/group/getSelfStockWithMarket",
                responseType: 'json',
                onload: function (response) {
                    resolve(response.response);
                },
                onerror: function (err) {
                    reject(err);
                }
            });
        });
    };
    const getWencaiPlateRaw = async () => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://www.iwencai.com/unifiedwap/self-stock/plate/list",
                data: 'stocks=0&ths=0',
                responseType: 'json',
                onload: function (response) {
                    resolve(response.response);
                },
                onerror: function (err) {
                    reject(err);
                }
            });
        });
    };
    const parseMarketCode = (obj, mark = 'mark', stock = 'stock') => {
        if (obj[mark] == '17' || obj[mark] == '20') return 'sh' + obj[stock];
        if (obj[mark] == '33' || obj[mark] == '36' || obj[mark] == '32') return 'sz' + obj[stock];
        if (obj[mark] == '16') return 'sh' + obj[stock].replace(/^1B/, '00');
        if (obj[mark] == '120' && obj[stock].startsWith('00')) return 'sh' + obj[stock];
        return null;
    }
    const getThsSelf = async () => {
        const obj = await getThsSelfRaw();
        if (obj.errorCode != 0) return obj.errorMsg;
        return obj.result.map(obj => parseMarketCode(obj, 'marketid', 'code')).filter(c => !!c);
    }
    const getWencaiPlate = async () => {
        const obj = await getWencaiPlateRaw();
        if (!obj.success) return []; // TODO: show error
        return obj.data.map(g => {
            const stocks = g.list.map(obj => parseMarketCode(obj)).filter(c => !!c);
            return {
                id: g.sn,
                name: g.ln,
                items: stocks
            };
        });
    }

    // render app
    const {h, render} = preact;
    const {useState, useEffect, useMemo} = preactHooks;
    const html = htm.bind(h);

    function App (props) {
        const [plateData, setPlateData] = useState([]);
        const [marketData, setMarketData] = useState({});
        const [onRefresh, setOnRefresh] = useState(false);
        const [isLogin, setIsLogin] = useState(true);

        const cachePlateData = (data) => { lscache.set('plateData', data, 1e15); };
        const updatePlateData = async () => {
            if (onRefresh) return;
            setOnRefresh(true);
            // start update
            const selfData = await getThsSelf();
            if (typeof selfData == 'string') {
                setIsLogin(false);
                setOnRefresh(false);
                return;
            }
            setIsLogin(true);
            const newPlateData = await getWencaiPlate();
            const filteredPlateData = SHOW_WENCAI_PLATE ? newPlateData : newPlateData.filter(g => Number(g.id) > 0);
            const newData = [{id: 0, name: '自选股', items: selfData, open: true}, ...filteredPlateData];
            let saveData = [], insertedIds = [];
            plateData.forEach(g => {
                const ol = newData.filter(o => o.id == g.id);
                if (ol.length == 0) return;
                const d = g;
                [d.name, d.items] = [ol[0].name, ol[0].items];
                saveData.push(d);
                insertedIds.push(d.id);
            });
            saveData = _.concat(saveData, newData.filter(o => !insertedIds.includes(o.id)));
            setPlateData(saveData);
            cachePlateData(saveData);
            // end update
            setOnRefresh(false);
        };
        useEffect(() =>{
            const cache = lscache.get('plateData');
            if (cache) {
                setPlateData(cache);
                return;
            }
            updatePlateData();
        }, []);

        let interval;
        const updateMarketData = async () => {
            const stocks = _.uniq(_.flatten(plateData.filter((_, i) => getPlateOpen(i)).map(g => g.items)));
            const pass = _.slice(_.difference(stocks, Object.keys(marketData)), 0, 20);
            if (pass.length == 0) {
                clearInterval(interval);
                return;
            }
            const passData = await getRealtimeBasic(...pass);
            setMarketData({...marketData, ...passData});
            // console.log(passData, marketData);
        };
        useEffect(() => {
            if (plateData.length == 0) return;
            interval = setInterval(updateMarketData, 5000);
            return () => { clearInterval(interval) };
        }, [plateData, marketData]);

        function updateTvSymbol(id) {
            if (!Object.keys(window).includes('_exposed_chartWidgetCollection') || typeof window._exposed_chartWidgetCollection.setSymbol != 'function') return;
            const market = {sz: 'SZSE', sh: 'SSE'};
            const tvSymbol = market[id.slice(0, 2)] + ':' + id.slice(2);
            window._exposed_chartWidgetCollection.setSymbol(tvSymbol);
        }
        function Item (props) {
            const marketItem = marketData ? marketData[props.id] : null;
            const name = marketItem ? marketItem.name : props.id;
            const percent = marketItem ? marketData[props.id].change_rate : '-';
            let spanClass = '';
            if (percent > 0) spanClass = 'is-success';
            else if (percent < 0) spanClass = 'is-danger';
            return html`
            <li>
              <a onclick=${updateTvSymbol.bind(null, props.id)}>
                <span class="symbol-name">${name}</span>
                <span class="tag is-info is-light ${spanClass}">${percent}%</span>
              </a>
            </li>`
        }
        function raisePlate (index) {
            if (index < 1) return;
            let newPlate = [...plateData];
            [newPlate[index - 1], newPlate[index]] = [newPlate[index], newPlate[index - 1]];
            setPlateData(newPlate);
            cachePlateData(newPlate);
        }
        function getPlateOpen (index) {
            const plate = plateData[index];
            return Object.keys(plate).includes('open') && plate.open;
        }
        function flipPlate (index) {
            let newPlate = [...plateData];
            newPlate[index].open = !getPlateOpen(index);
            setPlateData(newPlate);
            cachePlateData(newPlate);
        }
        function Plate (props) {
            const {group, groupid} = props;
            const visible = getPlateOpen(groupid);
            return html`
            <p class="menu-label">
              <span class="plate-name">${group.name}</span>
              <span>
                <svg class="b-icon" onclick=${flipPlate.bind(null, groupid)}>
                  <use xlink:href="#eye${visible ? '' : '-off'}-outline"/>
                </svg>
                <svg class="b-icon" onclick=${raisePlate.bind(null, groupid)}><use xlink:href="#caret-up-outline"/></svg>
              </span>
            </p>
            <ul class="menu-list" style="display: ${visible ? 'block' : 'none'};">
              ${group.items.map(i => html`<${Item} id="${i}" />`)}
            </ul>`
        }

        return html`
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">同花顺小窗</p>
            <span class="card-header-icon">
              <svg class="b-icon is-medium ${onRefresh ? 'disabled' : ''}"
                   onclick=${updatePlateData}>
                <use xlink:href="#refresh-outline"/>
              </svg>
            </span>
          </header>
          <div class="card-content">
            <div class="notification is-warning" style="display: ${!isLogin ? 'block' : 'none'};">
              未登录，<a href="https://www.10jqka.com.cn/" rel="noopener noreferrer">到同花顺官网登录</a>
            </div>
            <aside class="menu">
              ${plateData.map((g, gi) => html`<${Plate} group=${g} groupid=${gi} /`)}
            </aside>
          </div>
        </div>`
    }

    const container = cEl('div'), svgElement = cEl('div');
    container.id = 'tvhelper';
    container.className = 'card';
    svgElement.innerHTML = svgSprite;
    document.body.appendChild(svgElement);
    document.body.appendChild(container);
    render(html`<${App} />`, container);

    GM_addStyle(tvhelperCss);

})(unsafeWindow ?? window);