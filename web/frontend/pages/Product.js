import { h, Component } from 'preact';

import fetch from '../utils/fetch';

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
        this.getProduct();
        this.getStock();
    }

    /**
     * Get all products from the API
     */
    async getProduct() {
        const product = await fetch(`${window.expressConfig.productApi}/${this.props.slug}`);

        if(product && product.status.success) {
            this.setState({
                product: product.data
            });
        }
    }

    /**
     * Get all stock from the API
     */
    async getStock() {
        const stock = await fetch(`${window.expressConfig.stockApi}/${this.props.slug}`);

        if(stock && stock.status.success) {
            this.setState({
                stock: stock.data
            });
        }
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {product, stock} = this.state;

        if(!product.name) {
            return null;
        }

        return (
            <main>
                <div className="max-w-screen-lg p-8 mx-auto text-gray-100">
                    <div className="grid md:grid-cols-2 gap-y-8 gap-x-16">
                        <div className="w-full">
                            <img src={product.image} className="object-cover w-full h-full overflow-hidden bg-gray-900 rounded-xl"/>
                        </div>
                        <div>
                            <div className="grid gap-y-4">
                                <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                                    {product.name}
                                </h1>
                                <div className="mb-4 tracking-tight text-1xl md:text-2xl">€{product.price && product.price.value}</div>
                                {product.colors && (
                                    <div>
                                        <h3 className="mb-2 text-sm font-semibold uppercase">Colors</h3>
                                        <div className="inline-grid grid-flow-col gap-x-4">
                                            {product.colors.map(({ color }) => (
                                                <button key={color} style={{ backgroundColor: color }} className="flex items-center justify-center w-12 h-12 border border-gray-200 rounded-full"/>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {product.sizes && (
                                    <div>
                                        <h3 className="mb-2 text-sm font-semibold uppercase">Sizes</h3>
                                        <div className="inline-grid grid-flow-col gap-x-4">
                                            {product.sizes.map(({ size }) => (
                                                <button key={size} className="flex items-center justify-center w-12 h-12 border border-gray-200 rounded-full hover:bg-white hover:text-black">
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <p dangerouslySetInnerHTML={{__html: product.description}}/>
                                <p className="italic">{stock.stock} in stock</p>
                                <button className="px-4 py-2 mt-4 text-base font-semibold leading-6 text-black transition-colors duration-200 bg-gray-200 rounded-lg outline-none hover:bg-white md:px-6 md:text-lg">
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}
