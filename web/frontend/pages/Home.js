import { h, Component } from 'preact';

import fetch from '../utils/fetch';

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
        this.getProducts();
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
        const {products} = this.state;

        return (
            <main>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-screen-lg p-8 mx-auto md:px-8">
                    {products.map((product) => (
                        <a href={`/product/${product.slug}`} key={product.slug}>
                            <a className="rounded-xl line-height-0 grid gap-y-2 overflow-hidden relative w-100 pb-[100%]">
                                <div className="absolute z-10 text-gray-100">
                                    <h1 className="bg-gray-1000 px-4 py-2 text-lg font-semibold lg:text-xl">
                                        {product.name}
                                    </h1>
                                    <h2 className="bg-gray-1000 px-4 py-2 inline-block text-xs font-semibold">
                                        €{product.price.value}
                                    </h2>
                                </div>

                                <img src={product.image} alt={`${product.name} Image`} className="absolute w-full h-full object-cover bg-gray-900"/>
                            </a>
                        </a>
                    ))}
                </div>
            </main>
        );
    }
}
