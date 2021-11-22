import Cookies from 'js-cookie';

import fetch from './fetch';

export default {
    /**
     * Adds an item to the wishlist
     *
     * @param id
     * @return {Promise<void>}
     */
    add: async (id) => {
        const user = Cookies.get('user');

        return fetch(`${window.expressConfig.wishlistApi}/${user}/add`, {
            id
        });
    },

    /**
     * Removes an item from the wishlist
     *
     * @param id
     * @return {Promise<void>}
     */
    remove: async (id) => {
        const user = Cookies.get('user');

        return fetch(`${window.expressConfig.wishlistApi}/${user}/remove`, {
            id
        });
    }
};
