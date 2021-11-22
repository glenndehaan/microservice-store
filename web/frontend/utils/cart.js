import Cookies from 'js-cookie';

import fetch from './fetch';

export default {
    /**
     * Adds an item to the cart
     *
     * @param id
     * @return {Promise<void>}
     */
    add: async (id) => {
        const user = Cookies.get('user');

        return fetch(`${window.expressConfig.cartApi}/${user}/add`, {
            id,
            options: {
                quantity: 1
            }
        });
    },

    /**
     * Updates an item from the cart
     *
     * @param id
     * @param options
     * @return {Promise<void>}
     */
    update: async (id, options) => {
        const user = Cookies.get('user');

        return fetch(`${window.expressConfig.cartApi}/${user}/update`, {
            id,
            options
        });
    },

    /**
     * Removes an item from the cart
     *
     * @param id
     * @return {Promise<void>}
     */
    remove: async (id) => {
        const user = Cookies.get('user');

        return fetch(`${window.expressConfig.cartApi}/${user}/remove`, {
            id
        });
    }
};
