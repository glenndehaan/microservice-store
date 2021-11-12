// Must be the first import
if (process.env.NODE_ENV === 'development') {
    // Must use require here as import statements are only allowed
    // to exist at the top of a file.
    require("preact/debug");
}

import "core-js/stable";
import "regenerator-runtime/runtime";

import { h, Component, render } from 'preact';
import Router from 'preact-router';
import Cookies from 'js-cookie';

import Menu from './components/Menu';

import Home from './pages/Home';
import Product from './pages/Product';

import fetch from './utils/fetch';

class App extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            cart: [],
            wishlist: []
        };

        window.site = {};
        window.site.production = process.env.NODE_ENV === 'production';
    }

    /**
     * Runs then component mounts
     */
    async componentWillMount() {
        const user = Cookies.get('user');

        if(typeof user === 'undefined') {
            const user = await fetch(`${window.expressConfig.userApi}`, {});

            if(user && user.status.success) {
                this.getCart(Cookies.get('user'));
                this.getWishlist(Cookies.get('user'));
            }
        } else {
            this.getCart(user);
            this.getWishlist(user);
        }
    }

    /**
     * Get all cart information from the API
     *
     * @param user
     */
    async getCart(user) {
        const cart = await fetch(`${window.expressConfig.cartApi}/${user}`);

        if(cart && cart.status.success) {
            this.setState({
                cart: cart.data
            });
        }
    }

    /**
     * Get all wishlist information from the API
     *
     * @param user
     */
    async getWishlist(user) {
        const wishlist = await fetch(`${window.expressConfig.wishlistApi}/${user}`);

        if(wishlist && wishlist.status.success) {
            this.setState({
                wishlist: wishlist.data
            });
        }
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div id="root">
                <Menu/>
                <div>
                    <Router>
                        <Home path="/"/>
                        <Product path="/product/:slug"/>
                    </Router>
                </div>
            </div>
        );
    }
}

render(<App/>, document.body);
