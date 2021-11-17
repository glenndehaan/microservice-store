import {h, Component} from 'preact';

export default class Menu extends Component {
    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {modules, cart, wishlist} = this.props;
        console.log('modules', modules);
        console.log('cart', cart);
        console.log('wishlist', wishlist);

        return (
            <div>
                Menu
            </div>
        );
    }
}
