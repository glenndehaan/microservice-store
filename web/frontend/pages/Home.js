import { h, Component } from 'preact';

import Cart from '../components/icons/Cart';
import Heart from '../components/icons/Heart';

import fetch from '../utils/fetch';
import wishlist from '../utils/wishlist';

export default class Home extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            search: false,
            searchResults: []
        };
    }

    /**
     * Function runs then component mounts
     */
    componentWillMount() {
        this.getSearchResults(this.props);
    }

    /**
     * Function runs before component updates
     *
     * @param nextProps
     */
    componentWillUpdate(nextProps) {
        if(nextProps !== this.props) {
            this.getSearchResults(nextProps);
        }
    }

    /**
     * Get all products from the search API
     */
    async getSearchResults(props) {
        const search = typeof props.search !== "undefined" ? props.search : false;

        if(search) {
            const products = await fetch(`${window.expressConfig.searchApi}?term=${search}`);

            if (products && products.status.success) {
                this.setState({
                    search: true,
                    searchResults: products.data
                });
            }
        } else {
            this.setState({
                search: false,
                searchResults: []
            });
        }
    }

    /**
     * Add/remove an item to/from the wishlist
     *
     * @param id
     * @param action
     * @return {Promise<void>}
     */
    async updateWishlist(id, action) {
        if(action === "add") {
            await wishlist.add(id);
            this.props.updateWishlist();
        } else {
            await wishlist.remove(id);
            this.props.updateWishlist();
        }
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {modules, wishlist} = this.props;
        const {search, searchResults} = this.state;
        const products = search ? searchResults.length > 0 ? searchResults : [] : this.props.products;

        if(!search && products.length < 1) {
            return (
                <div className="flex-1 px-12 py-24 flex flex-col justify-center items-center text-gray-100">
                    <span className="border border-dashed border-secondary flex items-center justify-center w-24 h-24 bg-primary rounded-lg text-primary">
                        <Cart/>
                    </span>
                    <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">Oh snap!</h2>
                    <p className="text-accent-6 px-10 text-center pt-2">We are currently re-stocking our products.<br/>Please try again later</p>
                </div>
            );
        }

        if(search && products.length < 1) {
            return (
                <div className="flex-1 px-12 py-24 flex flex-col justify-center items-center text-gray-100">
                    <span className="border border-dashed border-secondary flex items-center justify-center w-24 h-24 bg-primary rounded-lg text-primary">
                        <Cart/>
                    </span>
                    <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">Oh snap!</h2>
                    <p className="text-accent-6 px-10 text-center pt-2">It seems we are not getting any results for: <span className="italic font-bold">{this.props.search}</span><br/><a href="/" className="hover:underline">Want to go back to the home page?</a></p>
                </div>
            );
        }

        return (
            <main>
                <div className="grid max-w-screen-lg grid-cols-1 gap-6 p-4 mx-auto sm:grid-cols-2 lg:grid-cols-3 md:px-8">
                    {products.map((product, key) => (
                        <div className="group rounded-xl line-height-0 overflow-hidden relative w-100 pb-[100%] text-gray-100">
                            <a href={`/product/${product.slug}`} key={key} className="grid gap-y-2">
                                <div className="absolute z-10 w-full max-w-[80%]">
                                    <div>
                                        <div className="transition-colors bg-gray-1000 px-4 py-2 text-lg font-semibold lg:text-xl max-w-[80%] group-hover:bg-orange-400">
                                            {product.name}
                                        </div>
                                    </div>
                                    <div className="transition-colors inline-block px-4 py-2 text-xs font-semibold bg-gray-1000 group-hover:bg-orange-400">
                                        €{product.price.value.toFixed(2)}
                                    </div>
                                </div>

                                <img src={product.image} alt={`${product.name} Image`} className="absolute object-cover w-full h-full bg-gray-900"/>
                            </a>
                            {modules.wishlist &&
                                <button name="Add to Wishlist" ariaLabel="Add to Wishlist" className="absolute right-0 z-10 p-3 bg-gray-1000 hover:bg-gray-800" onClick={() => this.updateWishlist(product.id, wishlist.includes(product.id) ? 'remove' : 'add')}>
                                    <Heart fill={wishlist.includes(product.id)}/>
                                </button>
                            }
                        </div>
                    ))}
                </div>
            </main>
        );
    }
}
