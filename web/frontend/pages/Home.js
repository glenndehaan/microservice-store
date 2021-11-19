import { h, Component } from 'preact';

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
            products: []
        };
    }

    /**
     * Function runs then component mounts
     */
    componentWillMount() {
        this.getProducts(this.props);
    }

    /**
     * Function runs before component updates
     *
     * @param nextProps
     */
    componentWillUpdate(nextProps) {
        if(nextProps !== this.props) {
            this.getProducts(nextProps);
        }
    }

    /**
     * Get all products from the API
     */
    async getProducts(props) {
        const search = typeof props.search !== "undefined" ? props.search : false;
        const products = await fetch(!search ? `${window.expressConfig.productApi}` : `${window.expressConfig.searchApi}?term=${search}`);

        if(products && products.status.success) {
            this.setState({
                products: products.data
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
        const {products} = this.state;

        // @todo add 404 alternative page
        if(products.length < 1) {
            return null;
        }

        return (
            <main>
                <div className="grid max-w-screen-lg grid-cols-1 gap-6 p-4 mx-auto sm:grid-cols-2 lg:grid-cols-3 md:px-8">
                    {products.map((product, key) => (
                        <div className="rounded-xl line-height-0 overflow-hidden relative w-100 pb-[100%] text-gray-100">
                            <a href={`/product/${product.slug}`} key={key} className="grid gap-y-2">
                                <div className="absolute z-10 w-full max-w-[80%]">
                                    <div>
                                        <div className="bg-gray-1000 px-4 py-2 text-lg font-semibold lg:text-xl max-w-[80%]">
                                            {product.name}
                                        </div>
                                    </div>
                                    <div className="inline-block px-4 py-2 text-xs font-semibold bg-gray-1000">
                                        €{product.price.value}
                                    </div>
                                </div>

                                <img src={product.image} alt={`${product.name} Image`} className="absolute object-cover w-full h-full bg-gray-900"/>
                            </a>
                            {modules.wishlist &&
                                <button className="absolute right-0 z-10 p-2 bg-gray-1000 hover:bg-gray-800" onClick={() => this.updateWishlist(product.id, wishlist.includes(product.id) ? 'remove' : 'add')}>
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
