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

        console.log('product', product);
        console.log('stock', stock);

        return (
            <main>
                Product {this.props.slug}
                <pre className="code"><label>JSON</label><code>Product:<br/>{JSON.stringify(product, undefined, 2)}</code></pre>
                <pre className="code"><label>JSON</label><code>Stock:<br/>{JSON.stringify(stock, undefined, 2)}</code></pre>
            </main>
        );
    }
}
