import { h, Component } from 'preact';

import Heart from '../components/icons/Heart';

import fetch from '../utils/fetch';
import wishlist from "../utils/wishlist";

export default class Product extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            product: {},
            stock: {}
        };
    }

    /**
     * Function runs then component mounts
     */
    componentWillMount() {
        this.getProduct(this.props);
        this.getStock(this.props);
    }

    /**
     * Function runs before component updates
     *
     * @param nextProps
     */
    componentWillUpdate(nextProps) {
        if(nextProps !== this.props) {
            this.getProduct(nextProps);
            this.getStock(nextProps);
        }
    }

    /**
     * Get all products from the API
     *
     * @param props
     * @return {Promise<void>}
     */
    async getProduct(props) {
        const product = await fetch(`${window.expressConfig.productApi}/${props.slug}`);

        if(product && product.status.success) {
            this.setState({
                product: product.data
            });
        }
    }

    /**
     * Get all stock from the API
     *
     * @param props
     * @return {Promise<void>}
     */
    async getStock(props) {
        const stock = await fetch(`${window.expressConfig.stockApi}/${props.slug}`);

        if(stock && stock.status.success) {
            this.setState({
                stock: stock.data
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
        const {product, stock} = this.state;

        // @todo add 404 alternative page
        if(!product.name) {
            return null;
        }

        return (
            <main>
                <div className="max-w-screen-lg p-8 mx-auto text-gray-100">
                    <div className="grid md:grid-cols-2 gap-y-8 gap-x-16">
                        <div className="relative w-full overflow-hidden rounded-xl">
                            <img src={product.image} className="object-cover w-full h-full overflow-hidden bg-gray-900 rounded-xl" alt={`${product.name} Image`}/>
                            {modules.wishlist &&
                                <button className="absolute top-0 right-0 z-10 p-4 bg-gray-1000 hover:bg-gray-800" onClick={() => this.updateWishlist(product.id, wishlist.includes(product.id) ? 'remove' : 'add')}>
                                    <Heart fill={wishlist.includes(product.id)}/>
                                </button>
                            }
                        </div>
                        <div>
                            <div className="grid gap-y-4">
                                <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                                    {product.name}
                                </h1>
                                <div className="mb-4 tracking-tight text-1xl md:text-2xl">€{product.price && product.price.value}</div>
                                {product.options.map((option, key) => (
                                    <div key={key}>
                                        <h3 className="mb-2 text-sm font-semibold uppercase">{option.name}</h3>
                                        <div className="inline-grid grid-flow-col gap-x-4">
                                            {option.values.map((value, key) => {
                                                if(value.color) {
                                                    return (
                                                        <button key={key} style={{ backgroundColor: value.color }} className="flex items-center justify-center w-12 h-12 border border-gray-200 rounded-full"/>
                                                    )
                                                } else {
                                                    return (
                                                        <button key={key} className="flex items-center justify-center w-12 h-12 border border-gray-200 rounded-full hover:bg-white hover:text-black">
                                                            {value.label}
                                                        </button>
                                                    )
                                                }
                                            })}
                                        </div>
                                    </div>
                                ))}
                                <p dangerouslySetInnerHTML={{__html: product.description}}/>
                                {stock.stock &&
                                    <p className="italic">{stock.stock} in stock</p>
                                }
                                {modules.cart &&
                                    <button className="px-4 py-2 mt-4 text-base font-semibold leading-6 text-black transition-colors duration-200 bg-gray-200 rounded-lg outline-none hover:bg-white md:px-6 md:text-lg disabled:bg-gray-900 disabled:text-white disabled:cursor-not-allowed disabled:hover:bg-gray-900" disabled={stock.stock < 1}>
                                        {stock.stock > 0 ? 'Add to cart' : 'Out of stock'}
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}
