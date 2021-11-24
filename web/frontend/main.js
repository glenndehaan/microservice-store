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
import mitt from 'mitt';

import Menu from './components/Menu';
import Footer from './components/Footer';

import Home from './pages/Home';
import Product from './pages/Product';
import Page from './pages/Page';

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
            wishlist: [],
            products: []
        };

        window.site = {};
        window.site.production = process.env.NODE_ENV === 'production';
        window.emitter = mitt();
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

        this.getProducts(this.props);
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
     * Get all products from the API
     */
    async getProducts() {
        const products = await fetch(`${window.expressConfig.productApi}`);

        if(products && products.status.success) {
            this.setState({
                products: products.data
            });
        }
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {modules, cart, wishlist, products} = this.state;

        return (
            <div id="root">
                <Menu modules={modules} cart={cart} wishlist={wishlist} products={products} updateWishlist={() => this.getWishlist(Cookies.get('user'))} updateCart={() => this.getCart(Cookies.get('user'))}/>
                <div>
                    <Router>
                        <Home path="/" modules={modules} products={products} wishlist={wishlist} updateWishlist={() => this.getWishlist(Cookies.get('user'))}/>
                        <Product path="/product/:slug" modules={modules} products={products} cart={cart} wishlist={wishlist} updateWishlist={() => this.getWishlist(Cookies.get('user'))} updateCart={() => this.getCart(Cookies.get('user'))}/>
                        <Page path="/:slug"/>
                    </Router>
                </div>
                <Footer/>
            </div>
        );
    }
}

render(<App/>, document.body);
