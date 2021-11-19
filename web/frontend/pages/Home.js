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
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {products} = this.state;

        // @todo add 404 alternative page
        if(products.length < 1) {
            return null;
        }

        return (
            <main>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-screen-lg p-8 mx-auto md:px-8">
                    {products.map((product, key) => (
                        <a href={`/product/${product.slug}`} key={key}>
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
