import { h, Component } from 'preact';

import fetch from '../utils/fetch';

export default class Home extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            products: [],
            stock: []
        };
    }

    /**
     * Function runs then component mounts
     */
    componentWillMount() {
        this.getProducts();
        this.getStock();
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
     * Get all stock from the API
     */
    async getStock() {
        const stock = await fetch(`${window.expressConfig.stockApi}`);

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
        const {products, stock} = this.state;

        console.log('products', products);
        console.log('stock', stock);

        return (
            <main>
                Home
                <pre className="code"><label>JSON</label><code>Products:<br/>{JSON.stringify(products, undefined, 2)}</code></pre>
                <pre className="code"><label>JSON</label><code>Stock:<br/>{JSON.stringify(stock, undefined, 2)}</code></pre>
            </main>
        );
    }
}
