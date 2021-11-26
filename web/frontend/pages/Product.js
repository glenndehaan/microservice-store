import { h, Component } from 'preact';

import Cart from '../components/icons/Cart';
import Heart from '../components/icons/Heart';

import fetch from '../utils/fetch';
import cart from '../utils/cart';
import wishlist from '../utils/wishlist';

export default class Product extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            fetch: {
                product: false,
                stock: false
            },
            product: {},
            stock: {},
            options: {}
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
                fetch: {
                    ...this.state.fetch,
                    product: true
                },
                product: product.data
            });

            this.setInitialOptions(product.data);
        } else {
            this.setState({
                fetch: {
                    ...this.state.fetch,
                    product: true
                }
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
                fetch: {
                    ...this.state.fetch,
                    stock: true
                },
                stock: stock.data
            });
        } else {
            this.setState({
                fetch: {
                    ...this.state.fetch,
                    stock: true
                }
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
     * Add an item to the cart
     *
     * @param id
     * @return {Promise<void>}
     */
    async addCart(id) {
        const options = [];

        const optionKeys = Object.keys(this.state.options);
        for(let item = 0; item < optionKeys.length; item++) {
            const option = optionKeys[item];
            options.push({
                option: option,
                ...this.state.options[option]
            })
        }

        await cart.add(id, options);
        this.props.updateCart();
        window.emitter.emit('menu:cart:open');
    }

    /**
     * Sets the initial options
     *
     * @param product
     */
    setInitialOptions(product) {
        const options = {};

        for(let item = 0; item < product.options.length; item++) {
            const option = product.options[item];
            options[option.name] = option.values[0];
        }

        this.setState({
            options
        });
    }

    /**
     * Updates an option
     *
     * @param option
     * @param value
     */
    updateOption(option, value) {
        const options = this.state.options;
        options[option] = value;

        this.setState({
            options
        });
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {modules, wishlist, cart} = this.props;
        const {fetch, product, stock, options} = this.state;

        const inCart = cart.filter((item) => {
            return item.id === product.id;
        });

        if(!fetch.product || !fetch.stock) {
            return null;
        }

        if(!product.name) {
            return (
                <div className="flex-1 px-12 py-24 flex flex-col justify-center items-center text-gray-100">
                    <span className="border border-dashed border-secondary flex items-center justify-center w-24 h-24 bg-primary rounded-lg text-primary">
                        <Cart/>
                    </span>
                    <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">Product Not Found</h2>
                    <p className="text-accent-6 px-10 text-center pt-2">Seems this product has fallen of the shelf<br/><a href="/" className="hover:underline">Want to go back to the home page?</a></p>
                </div>
            );
        }

        return (
            <main>
                <div className="max-w-screen-lg p-8 mx-auto text-gray-100">
                    <div className="grid md:grid-cols-2 gap-y-8 gap-x-16">
                        <div className="relative w-full overflow-hidden rounded-xl">
                            <img src={product.image} className="object-cover w-full h-full overflow-hidden bg-gray-900 rounded-xl" alt={`${product.name} Image`}/>
                            {modules.wishlist &&
                                <button name="Add to Wishlist" ariaLabel="Add to Wishlist" className="absolute top-0 right-0 z-10 p-4 bg-gray-1000 hover:bg-gray-800" onClick={() => this.updateWishlist(product.id, wishlist.includes(product.id) ? 'remove' : 'add')}>
                                    <Heart fill={wishlist.includes(product.id)}/>
                                </button>
                            }
                        </div>
                        <div>
                            <div className="grid gap-y-4">
                                <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                                    {product.name}
                                </h1>
                                <div className="mb-4 tracking-tight text-1xl md:text-2xl">€{product.price && product.price.value.toFixed(2)}</div>
                                {product.options.map((option, key) => (
                                    <div key={key}>
                                        <h3 className="mb-2 text-sm font-semibold uppercase">{option.name}</h3>
                                        <div className="inline-grid grid-flow-col gap-x-4">
                                            {option.values.map((value, key) => {
                                                if(value.color) {
                                                    return (
                                                        <button key={key} name={`${option.name}: ${value.label}`} ariaLabel={`${option.name}: ${value.label}`} style={{ backgroundColor: value.color }} className="flex items-center justify-center w-12 h-12 border-2 border-gray-200 rounded-full disabled:border-orange-400 disabled:cursor-not-allowed" disabled={options[option.name].label === value.label} onClick={() => this.updateOption(option.name, value)}/>
                                                    )
                                                } else {
                                                    return (
                                                        <button key={key} name={`${option.name}: ${value.label}`} ariaLabel={`${option.name}: ${value.label}`}  className="flex items-center justify-center w-12 h-12 border-2 border-gray-200 rounded-full hover:bg-white hover:text-black disabled:border-orange-400 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white" disabled={options[option.name].label === value.label} onClick={() => this.updateOption(option.name, value)}>
                                                            {value.label}
                                                        </button>
                                                    )
                                                }
                                            })}
                                        </div>
                                    </div>
                                ))}
                                <p dangerouslySetInnerHTML={{__html: product.description}}/>
                                {typeof stock.stock !== "undefined" &&
                                    <p className="italic">{stock.stock} in stock</p>
                                }
                                {modules.cart &&
                                    <button name="Add to Cart" ariaLabel="Add to Cart" className="px-4 py-2 mt-4 text-base font-semibold leading-6 text-black transition-colors duration-200 bg-gray-200 rounded-lg outline-none hover:bg-white md:px-6 md:text-lg disabled:bg-gray-900 disabled:text-white disabled:cursor-not-allowed disabled:hover:bg-gray-900" disabled={typeof stock.stock === "undefined" || stock.stock < 1 || typeof inCart[0] !== "undefined"} onClick={() => this.addCart(product.id)}>
                                        {stock.stock > 0 ? typeof inCart[0] === "undefined" ? 'Add to cart' : 'Already in cart' : 'Out of stock'}
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
