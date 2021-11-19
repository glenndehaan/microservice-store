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
import Footer from './components/Footer';

import Home from './pages/Home';
import Product from './pages/Product';

import fetch from './utils/fetch';

import 'tailwindcss/tailwind.css';

class App extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            modules: {
                cart: true,
                wishlist: true
            },
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
        } else {
            this.setState({
                modules: {
                    ...this.state.modules,
                    cart: false
                }
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
        } else {
            this.setState({
                modules: {
                    ...this.state.modules,
                    wishlist: false
                }
            });
        }
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {modules, cart, wishlist} = this.state;

        return (
            <div id="root">
                <Menu modules={modules} cart={cart} wishlist={wishlist}/>
                <div>
                    <Router>
                        <Home path="/" wishlist={wishlist}/>
                        <Product path="/product/:slug" modules={modules} cart={cart} wishlist={wishlist}/>
                    </Router>
                </div>
                <Footer/>
            </div>
        );
    }
}

render(<App/>, document.body);
