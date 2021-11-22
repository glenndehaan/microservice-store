import {h, Component} from 'preact';
import { route } from 'preact-router';

import Cart from './icons/Cart';
import Heart from './icons/Heart';

import Panel from './Panel';

export default class Menu extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            cartOpen: false,
            wishlistOpen: false
        };

        this.searchBar = null;
    }

    /**
     * Function runs after component mounts
     */
    componentDidMount() {
        const params = (new URL(document.location)).searchParams;
        const search = params.get('search');
        this.searchBar.value = typeof search !== "undefined" ? search : '';
    }

    /**
     * Handle search
     *
     * @param e
     */
    handleSearch(e) {
        e.preventDefault();
        route(`/?search=${this.searchBar.value}`);
    }

    /**
     * Opens a panel
     *
     * @param item
     */
    openPanel(item) {
        if(item === "cart") {
            this.setState({
                cartOpen: true
            });
        }

        if(item === "wishlist") {
            this.setState({
                wishlistOpen: true
            });
        }
    }

    /**
     * Closes a panel
     *
     * @param item
     */
    closePanel(item) {
        if(item === "cart") {
            this.setState({
                cartOpen: false
            });
        }

        if(item === "wishlist") {
            this.setState({
                wishlistOpen: false
            });
        }
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {modules, cart, wishlist, products, updateWishlist, updateCart} = this.props;
        const {cartOpen, wishlistOpen} = this.state;

        const cartProducts = cart.filter((item) => {
            const product = products.filter((product) => {
                return product.id === item.id;
            });

            return typeof product[0] !== "undefined";
        }).map((item) => {
            const product = products.filter((product) => {
                return product.id === item.id;
            });

            return {
                ...product[0],
                cart: item.options
            };
        });
        const wishlistProducts = products.filter((item) => {
            return wishlist.includes(item.id);
        });

        return (
            <header className="flex items-center justify-between max-w-screen-xl p-4 mx-auto text-gray-100 md:px-8">
                {cartOpen &&
                    <Panel type="cart" products={cartProducts} close={() => this.closePanel('cart')} updateWishlist={updateWishlist} updateCart={updateCart}/>
                }
                {wishlistOpen &&
                    <Panel type="wishlist" products={wishlistProducts} close={() => this.closePanel('wishlist')} updateWishlist={updateWishlist} updateCart={updateCart}/>
                }
                <div className="w-32">
                    <a href="/">
                        <img src="/images/logo.png" alt="ACME Logo" className="h-14"/>
                    </a>
                </div>
                <div className="flex-grow w-full max-w-2xl">
                    <form onSubmit={(e) => this.handleSearch(e)}>
                        <label htmlFor="search" style={{ position: 'absolute', top: '-1000px', left: '-1000px' }}>Search for products</label>
                        <input id="search" name="search" placeholder="Search for products..." className="w-full h-10 px-4 text-sm bg-gray-900 border border-gray-800 rounded appearance-none text-default bg-input focus:border-accent focus:outline-none border-darker" ref={c => this.searchBar = c}/>
                    </form>
                </div>
                <div className="flex justify-end w-32">
                    {modules.cart &&
                        <button name="Cart" ariaLabel="Cart" className="flex items-center justify-center w-12 h-12 text-white cursor-pointer rounded-xl hover:bg-white hover:bg-opacity-5" onClick={() => this.openPanel('cart')}>
                            <Cart/>
                        </button>
                    }
                    {modules.wishlist &&
                        <button name="Wishlist" ariaLabel="Wishlist" className="flex items-center justify-center w-12 h-12 text-white cursor-pointer rounded-xl hover:bg-white hover:bg-opacity-5" onClick={() => this.openPanel('wishlist')}>
                            <Heart/>
                        </button>
                    }
                </div>
            </header>
        );
    }
}
